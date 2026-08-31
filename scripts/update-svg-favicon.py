import base64

with open('public/fox-mascot.png', 'rb') as f:
    b64_data = base64.b64encode(f.read()).decode('utf-8')

svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <image width="512" height="512" href="data:image/png;base64,{b64_data}"/>
</svg>'''

with open('public/favicon.svg', 'w') as f:
    f.write(svg_content)

print("Updated public/favicon.svg with Fox mascot!")
