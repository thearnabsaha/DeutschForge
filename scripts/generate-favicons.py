import os
from PIL import Image

source_img_path = '/Users/thearnabsaha/.gemini/antigravity-ide/brain/9be77ce1-f405-425f-a7f6-b7fad787ad7f/moinmoin_fox_icon_1788157369176.jpg'
img = Image.open(source_img_path).convert('RGB')
W, H = img.size

# Sample background color
bg_color = img.getpixel((W // 2, 80))

# Crop the central area (inside the frame)
crop_inset = int(W * 0.075)
cropped_fox = img.crop((crop_inset, crop_inset, W - crop_inset, H - crop_inset))

def generate_icon(size):
    canvas = Image.new('RGB', (size, size), bg_color)
    resized_fox = cropped_fox.resize((size, size), Image.Resampling.LANCZOS)
    canvas.paste(resized_fox, (0, 0))
    return canvas

# 1. Generate PNG favicons
fav_32 = generate_icon(32)
fav_32.save('public/favicon.png', 'PNG')
fav_32.save('public/favicon-32x32.png', 'PNG')
fav_32.save('src/app/favicon.png', 'PNG')

fav_48 = generate_icon(48)
fav_48.save('public/favicon-48x48.png', 'PNG')

fav_16 = generate_icon(16)
fav_64 = generate_icon(64)
fav_128 = generate_icon(128)
fav_256 = generate_icon(256)

# 2. Generate multi-resolution .ico (16, 32, 48, 64, 128, 256)
fav_256.save(
    'public/favicon.ico',
    format='ICO',
    sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
)
fav_256.save(
    'src/app/favicon.ico',
    format='ICO',
    sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
)

print("Generated multi-res favicon.ico and favicon.png for both public/ and src/app/!")
