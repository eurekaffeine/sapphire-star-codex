"""Shared iPhone 18 Pro screenshot compositor for web, store panels and video."""
from pathlib import Path
import json
from PIL import Image, ImageOps

FRAME_DIRECTORY = Path(__file__).resolve().parents[1] / 'public/frames'
CAPTURE_TOPICS = ('home', 'hitzones', 'weapon', 'builder', 'saved')


def frame_ios_capture(screenshot):
    metadata = json.loads((FRAME_DIRECTORY / 'iphone-18-pro.json').read_text())
    screen = metadata['screen']
    size = (screen['width'], screen['height'])
    # Preserve the whole native screenshot and its proportions. The shared bezel
    # is presentation chrome; it does not change the source platform or language.
    fitted = ImageOps.contain(screenshot.convert('RGB'), size, Image.Resampling.LANCZOS)
    display = Image.new('RGB', size, screenshot.convert('RGB').getpixel((0, 0)))
    display.paste(fitted, ((size[0] - fitted.width) // 2, (size[1] - fitted.height) // 2))
    canvas = Image.new('RGBA', (metadata['width'], metadata['height']))
    mask = Image.open(FRAME_DIRECTORY / 'iphone-18-pro-screen-mask.png').convert('L')
    canvas.paste(display, (screen['x'], screen['y']), mask)
    canvas.alpha_composite(Image.open(FRAME_DIRECTORY / 'iphone-18-pro.png').convert('RGBA'))
    return canvas
