from PIL import Image, ImageDraw
import os

# Base source icon
base_img_path = 'public/icon-512.png'
base_img = Image.open(base_img_path).convert('RGBA')
width, height = base_img.size

# Sample the green background color from the icon (around 100, 100)
bg_color = (88, 204, 2, 255) # #58CC02

def generate_solid_icon(size):
    # 1. Create solid background
    canvas = Image.new('RGBA', (size, size), bg_color)
    
    # 2. Extract the center emblem from base_img (crop inside the rounded border)
    # The shield is centered in base_img (512x512)
    # Let's crop the central 360x360 region containing the shield
    shield_crop = base_img.crop((76, 76, 436, 436))
    
    # Resize the shield to fit comfortably within the safe area (around 70% of canvas)
    target_shield_size = int(size * 0.72)
    shield_resized = shield_crop.resize((target_shield_size, target_shield_size), Image.Resampling.LANCZOS)
    
    # Paste shield in center
    paste_x = (size - target_shield_size) // 2
    paste_y = (size - target_shield_size) // 2
    canvas.paste(shield_resized, (paste_x, paste_y), shield_resized)
    
    return canvas

# Generate sizes
sizes = {
    'public/apple-touch-icon.png': 180,
    'public/apple-touch-icon-precomposed.png': 180,
    'public/apple-touch-icon-180x180.png': 180,
    'public/apple-touch-icon-152x152.png': 152,
    'public/apple-touch-icon-120x120.png': 120,
    'public/icon-192.png': 192,
    'public/icon-512.png': 512,
    'public/icon-512-maskable.png': 512,
    'src/app/apple-icon.png': 180,
    'src/app/icon.png': 512,
}

for path, sz in sizes.items():
    icon = generate_solid_icon(sz)
    # Ensure RGB / full-bleed PNG without transparency so iOS Safari recognizes it natively
    icon_rgb = Image.new('RGB', (sz, sz), (88, 204, 2))
    icon_rgb.paste(icon, (0, 0), icon)
    icon_rgb.save(path, 'PNG', quality=95)
    print(f"Generated: {path} ({sz}x{sz}, RGB full bleed)")

print("All iOS & PWA icons generated successfully!")
