"""Render iPhone 18 Pro chrome from the installed Apple Simulator PDFs.
Requires Pillow and Poppler's pdftocairo. Outputs are checked in; no Xcode in CI.
"""
from pathlib import Path
import argparse
import hashlib
import json
import plistlib
import subprocess
import tempfile
from PIL import Image, ImageChops

parser = argparse.ArgumentParser()
parser.add_argument('--pdftocairo', default='pdftocairo')
parser.add_argument('--device-root', type=Path, default=Path('/Library/Developer/CoreSimulator/Profiles/DeviceTypes/iPhone 18 Pro.simdevicetype/Contents/Resources'))
parser.add_argument('--chrome-root', type=Path, default=Path('/Library/Developer/DeviceKit/Chrome/phone11.devicechrome/Contents/Resources'))
args = parser.parse_args()
out = Path(__file__).resolve().parents[1] / 'public/frames'
out.mkdir(exist_ok=True)
profile = plistlib.loads((args.device_root / 'profile.plist').read_bytes())
caps = plistlib.loads((args.device_root / 'capabilities.plist').read_bytes())['capabilities']
chrome = json.loads((args.chrome_root / 'chrome.json').read_text())
assert profile['chromeIdentifier'] == chrome['identifier']
assert caps['ArtworkTraits']['ArtworkDeviceProductDescription'] == 'iPhone 18 Pro'
display = caps['displays'][0]
scale = int(display['scale'])
sw, sh = int(display['width']), int(display['height'])
sizing = chrome['images']['sizing']
padding = chrome['images']['devicePadding']
left, top = sizing['leftWidth'] * scale, sizing['topHeight'] * scale
bw = sw + left + sizing['rightWidth'] * scale
bh = sh + top + sizing['bottomHeight'] * scale
px = padding['left'] * scale
width = bw + px + padding['right'] * scale
frame = Image.new('RGBA', (width, bh))
used = {}

def raster(pdf, temp, factor=scale):
    used[str(pdf)] = hashlib.sha256(pdf.read_bytes()).hexdigest()
    dest = Path(temp) / pdf.stem
    subprocess.run([args.pdftocairo, '-png', '-transp', '-singlefile', '-r', str(72 * factor), str(pdf), str(dest)], check=True)
    return Image.open(dest.with_suffix('.png')).convert('RGBA')

with tempfile.TemporaryDirectory(prefix='ssc-iphone-frame-') as temp:
    # Side buttons sit behind the body, matching DeviceKit's onTop=false inputs.
    for button in chrome['inputs']:
        asset = raster(args.chrome_root / f"{button['image']}.pdf", temp)
        offset = button['offsets']['normal']['x'] * scale
        x = offset if button['anchor'] == 'left' else width + offset - asset.width
        frame.alpha_composite(asset, (x, button['offsets']['normal']['y'] * scale))
    # DeviceKit's nine slices preserve the exact corners at the target display size.
    corner = 110 * scale
    pieces = [
        ('topLeft', (px, 0), (corner, corner)),
        ('top', (px + corner, 0), (bw - 2 * corner, corner)),
        ('topRight', (px + bw - corner, 0), (corner, corner)),
        ('left', (px, corner), (corner, bh - 2 * corner)),
        ('right', (px + bw - corner, corner), (corner, bh - 2 * corner)),
        ('bottomLeft', (px, bh - corner), (corner, corner)),
        ('bottom', (px + corner, bh - corner), (bw - 2 * corner, corner)),
        ('bottomRight', (px + bw - corner, bh - corner), (corner, corner)),
    ]
    for key, position, size in pieces:
        asset = raster(args.chrome_root / f"{chrome['images'][key]}.pdf", temp)
        frame.alpha_composite(asset.resize(size, Image.Resampling.LANCZOS), position)
    mask = raster(args.device_root / f"{profile['framebufferMask']}.pdf", temp, 1).getchannel('A')
    assert mask.size == (sw, sh)
    cutout = Image.new('L', frame.size)
    cutout.paste(mask, (px + left, top))
    frame.putalpha(ImageChops.subtract(frame.getchannel('A'), cutout))
    frame.save(out / 'iphone-18-pro.png', optimize=True)
    mask.save(out / 'iphone-18-pro-screen-mask.png', optimize=True)
    metadata = {
        'device': 'iPhone 18 Pro', 'modelIdentifier': profile['modelIdentifier'],
        'chromeIdentifier': chrome['identifier'], 'width': width, 'height': bh,
        'screen': {'x': px + left, 'y': top, 'width': sw, 'height': sh},
        'source': 'Apple Simulator device profile and DeviceKit phone11 chrome',
        'sourceHashes': used,
    }
    (out / 'iphone-18-pro.json').write_text(json.dumps(metadata, indent=2) + '\n')
    print(f'Rendered {width}x{bh} iPhone 18 Pro frame; display {sw}x{sh}.')
