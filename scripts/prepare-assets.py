"""Build consistently framed website images from matching-language native captures.
Run with Python + Pillow and a populated screenshot checkout (--source-root).
"""
from pathlib import Path
import argparse
import json
from PIL import Image, ImageDraw, ImageFont
from iphone_frame import CAPTURE_TOPICS, frame_ios_capture

parser = argparse.ArgumentParser()
parser.add_argument('--source-root', type=Path, required=True, help='Populated MonsterHunterDex checkout containing raw captures')
parser.add_argument('--refresh-branding', action='store_true')
args = parser.parse_args()
root = args.source_root
out = Path(__file__).resolve().parents[1] / 'public'
sources = json.loads((out / 'screenshots/manifest.json').read_text())
assert sources['captureSettings'] == {'silhouetteMonsters': False, 'showGameLogos': True}
manifest = {'schemaVersion': 2, 'deviceFrame': 'iPhone 18 Pro', 'captureSettings': sources['captureSettings'], 'locales': {}}
for language in ['en', 'zh-Hans', 'zh-Hant', 'ja']:
    directory = out / 'screenshots' / language
    directory.mkdir(parents=True, exist_ok=True)
    manifest['locales'][language] = {}
    for topic in CAPTURE_TOPICS:
        source = sources['locales'][language][topic]
        assert source['language'] == language
        image = Image.open(root / source['source']).convert('RGB')
        framed = frame_ios_capture(image)
        framed = framed.resize((660, round(framed.height * 660 / framed.width)), Image.Resampling.LANCZOS)
        destination = directory / f'{topic}.webp'
        framed.save(destination, quality=90, method=6)
        manifest['locales'][language][topic] = {
            **source, 'asset': f'{language}/{topic}.webp',
            'deviceFrame': 'iPhone 18 Pro', 'width': framed.width, 'height': framed.height,
            'bytes': destination.stat().st_size,
        }
(out / 'screenshots/manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
# Retire the previous shared/mixed-language screenshot files after all inputs succeed.
for filename in [f'{topic}.webp' for topic in CAPTURE_TOPICS] + ['home-iphone-18-pro.webp', 'hitzones-iphone-18-pro.webp']:
    (out / 'screenshots' / filename).unlink(missing_ok=True)
if args.refresh_branding:
    icon = Image.open(root / 'apps/harmonyos/AppScope/resources/base/media/foreground.png').convert('RGB')
    icon.resize((256, 256), Image.Resampling.LANCZOS).save(out / 'icon.png', optimize=True)
    font_root = Path('/System/Library/Fonts/Supplemental')
    font = lambda size: ImageFont.truetype(str(font_root / 'Arial.ttf'), size)
    image = Image.new('RGB', (1200, 630), '#faf8f3')
    draw = ImageDraw.Draw(image)
    draw.text((80, 126), 'Sapphire Star Codex', font=font(40), fill='#332d26')
    draw.text((80, 218), 'Monster Hunter reference', font=font(32), fill='#332d26')
    draw.text((80, 264), 'and armor builds', font=font(32), fill='#332d26')
    draw.text((80, 380), 'Wilds, Rise with Sunbreak,', font=font(24), fill='#6c6258')
    draw.text((80, 420), 'and World with Iceborne.', font=font(24), fill='#6c6258')
    image.paste(icon.resize((220, 220), Image.Resampling.LANCZOS), (872, 190))
    image.save(out / 'social.jpg', quality=92, optimize=True)
print(f'Generated {sum(len(rows) for rows in manifest["locales"].values())} localized iPhone 18 Pro screenshots.')
