from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont

out_dir = Path("/Users/jinsun/Documents/projects/resumeio2pdf/chrome-extension-single-page-pdf/icons")
out_dir.mkdir(parents=True, exist_ok=True)

base_size = 512
img = Image.new("RGBA", (base_size, base_size), (0, 0, 0, 0))
d = ImageDraw.Draw(img, "RGBA")

# Colorful layered glass background
layers = [
    (78, 201, 255, 255),
    (94, 127, 255, 230),
    (169, 107, 255, 200),
    (89, 223, 180, 170),
]
for i, color in enumerate(layers):
    inset = 16 + i * 18
    radius = 122 - i * 12
    d.rounded_rectangle(
        (inset, inset, base_size - inset, base_size - inset),
        radius=radius,
        fill=color,
    )

# Soft color blooms
blooms = [
    (145, 130, 120, (255, 255, 255, 125)),
    (370, 170, 150, (178, 255, 246, 95)),
    (250, 365, 160, (255, 175, 255, 88)),
]
for cx, cy, r, color in blooms:
    d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=color)

card = Image.new("RGBA", (base_size, base_size), (0, 0, 0, 0))
cd = ImageDraw.Draw(card, "RGBA")
cd.rounded_rectangle(
    (105, 95, 407, 417),
    radius=56,
    fill=(255, 255, 255, 105),
    outline=(255, 255, 255, 185),
    width=4,
)
cd.pieslice((75, 30, 445, 320), 200, 334, fill=(255, 255, 255, 95))

for y in (148, 176, 204):
    cd.rounded_rectangle((168, y, 334, y + 10), radius=5, fill=(255, 255, 255, 160))

cd.rounded_rectangle((165, 230, 347, 336), radius=24, fill=(36, 79, 240, 225))

try:
    font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 48)
except OSError:
    font = ImageFont.load_default()
cd.text((198, 258), "PDF", fill=(255, 255, 255, 235), font=font)

card = card.filter(ImageFilter.GaussianBlur(0.3))
img.alpha_composite(card)

d.rounded_rectangle(
    (14, 14, base_size - 14, base_size - 14),
    radius=126,
    outline=(255, 255, 255, 160),
    width=3,
)

for size in (16, 32, 48, 128):
    icon = img.resize((size, size), Image.Resampling.LANCZOS)
    icon.save(out_dir / f"icon{size}.png", format="PNG")

print("Generated icons: icon16.png, icon32.png, icon48.png, icon128.png")
