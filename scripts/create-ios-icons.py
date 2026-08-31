import os
import subprocess
from PIL import Image

# 1. Write the full-bleed square SVG (no corner rounding, full bleed for iOS/Android)
svg_content = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#58CC02"/>
      <stop offset="100%" stop-color="#46A302"/>
    </linearGradient>
    <linearGradient id="flag" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1A1A1A"/>
      <stop offset="33%" stop-color="#1A1A1A"/>
      <stop offset="33.1%" stop-color="#E11D48"/>
      <stop offset="66%" stop-color="#E11D48"/>
      <stop offset="66.1%" stop-color="#FACC15"/>
      <stop offset="100%" stop-color="#FACC15"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.25"/>
    </filter>
  </defs>
  
  <!-- Full-bleed Square Base (No rounded corners - iOS & Android apply their own mask) -->
  <rect width="512" height="512" fill="url(#bg)"/>
  
  <!-- Subtle 3D Depth -->
  <rect width="512" height="512" fill="#000000" opacity="0.04"/>

  <!-- Stylized German Mastery Crest (Centered in 512x512) -->
  <g transform="translate(106, 80)">
    <!-- White Shield Base -->
    <path d="M150 20 L270 70 L270 200 Q270 285 150 335 Q30 285 30 200 L30 70 Z" fill="#FFFFFF" filter="url(#shadow)"/>
    
    <!-- German Flag Inner Shield -->
    <path d="M150 34 L254 78 L254 194 Q254 265 150 312 Q46 265 46 194 L46 78 Z" fill="url(#flag)"/>
    
    <!-- Central Golden Spark / Star of German Fluency -->
    <path d="M150 92 L172 144 L228 148 L184 184 L198 238 L150 208 L102 238 L116 184 L72 148 L128 144 Z" fill="#FFFFFF"/>
    <path d="M150 106 L168 148 L214 152 L178 182 L190 226 L150 202 L110 226 L122 182 L86 152 L132 148 Z" fill="#58CC02"/>
  </g>
</svg>
'''

temp_svg = '/tmp/moinmoin_fullbleed.svg'
with open(temp_svg, 'w') as f:
    f.write(svg_content)

# Render high-res 1024x1024 thumbnail via macOS QuickLook CoreGraphics
subprocess.run(['qlmanage', '-t', '-s', '1024', '-o', '/tmp', temp_svg], check=True)
rendered_png = '/tmp/moinmoin_fullbleed.svg.png'

# Load rendered 1024x1024 PNG
base_img = Image.open(rendered_png).convert('RGB')

# Targets and sizes
targets = {
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
    'public/favicon-32x32.png': 32,
    'public/favicon.png': 32,
}

for path, size in targets.items():
    resized = base_img.resize((size, size), Image.Resampling.LANCZOS)
    resized.save(path, 'PNG', quality=100)
    print(f"Generated {path} ({size}x{size})")

print("Successfully generated all full-bleed square iOS & PWA icons!")
