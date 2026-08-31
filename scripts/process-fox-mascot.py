import os
from PIL import Image, ImageOps

source_img_path = '/Users/thearnabsaha/.gemini/antigravity-ide/brain/9be77ce1-f405-425f-a7f6-b7fad787ad7f/moinmoin_fox_icon_1788157369176.jpg'
img = Image.open(source_img_path).convert('RGB')
W, H = img.size

# Sample the green background color near top-center
# Let's inspect pixel (W//2, 40) or (W//4, 100)
bg_color = img.getpixel((W // 2, 80))
print("Sampled background green color:", bg_color)

# Crop the central area (inside the rounded corner frame of the generated image)
# The frame border occupies ~6% on each side
crop_inset = int(W * 0.075)
cropped_fox = img.crop((crop_inset, crop_inset, W - crop_inset, H - crop_inset))

def generate_icon(target_size):
    # Create full-bleed canvas with exact sampled green
    canvas = Image.new('RGB', (target_size, target_size), bg_color)
    
    # Resize cropped fox to target size with Lanczos filter
    resized_fox = cropped_fox.resize((target_size, target_size), Image.Resampling.LANCZOS)
    
    # Paste onto canvas
    canvas.paste(resized_fox, (0, 0))
    return canvas

targets = {
    'public/apple-touch-icon.png': 180,
    'public/apple-touch-icon-180x180.png': 180,
    'public/apple-touch-icon-152x152.png': 152,
    'public/apple-touch-icon-120x120.png': 120,
    'public/apple-touch-icon-precomposed.png': 180,
    'public/icon-192.png': 192,
    'public/icon-512.png': 512,
    'public/icon-512-maskable.png': 512,
    'public/icons/icon-192.png': 192,
    'public/icons/icon-512.png': 512,
    'src/app/apple-icon.png': 180,
    'src/app/icon.png': 512,
    'public/favicon-32x32.png': 32,
    'public/favicon.png': 32,
    'public/fox-mascot.png': 512,
}

for path, size in targets.items():
    icon = generate_icon(size)
    icon.save(path, 'PNG', quality=100)
    print(f"Saved {path} ({size}x{size})")

# Generate favicon.ico with 16, 32, 48, 64 sizes
ico_sizes = [(16, 16), (32, 32), (48, 48), (64, 64)]
img_for_ico = generate_icon(64)
img_for_ico.save('public/favicon.ico', sizes=ico_sizes)
print("Saved public/favicon.ico")

print("All Fox Mascot icons generated successfully!")
