from PIL import Image, ImageDraw, ImageFont, ImageFilter

FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_MONO = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"
FONT_MONO_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf"

PURPLE = (124, 109, 250)
PURPLE_DEEP = (91, 63, 224)
BG_TOP = (15, 15, 20)
BG_BOT = (24, 23, 32)
WHITE = (240, 240, 245)
MUTED = (150, 150, 160)
GREEN = (62, 207, 142)

def lightning_path(cx, cy, scale):
    # classic bolt silhouette, centered roughly at (cx, cy)
    pts = [
        (0.62, -1.00), (-0.18, 0.06), (0.10, 0.06),
        (-0.62, 1.00), (0.18, -0.06), (-0.10, -0.06),
    ]
    return [(cx + x*scale, cy + y*scale) for x, y in pts]

def rounded_square(draw, box, radius, fill):
    draw.rounded_rectangle(box, radius=radius, fill=fill)

def make_icon(size, bg=PURPLE, bolt=WHITE, radius_ratio=0.22, bolt_scale_ratio=0.34):
    img = Image.new("RGBA", (size, size), (0,0,0,0))
    d = ImageDraw.Draw(img)
    rounded_square(d, (0,0,size-1,size-1), int(size*radius_ratio), bg)
    pts = lightning_path(size/2, size/2, size*bolt_scale_ratio)
    d.polygon(pts, fill=bolt)
    return img

# ── apple touch icon / favicon-style PNG ──
icon = make_icon(180)
icon.save("/home/claude/assets/apple-touch-icon.png")

icon512 = make_icon(512)
icon512.save("/home/claude/assets/icon-512.png")

# ── OG social image, 1200x630 ──
W, H = 1200, 630
og = Image.new("RGB", (W, H), BG_TOP)
# vertical gradient background
for y in range(H):
    t = y / H
    r = int(BG_TOP[0] + (BG_BOT[0]-BG_TOP[0])*t)
    g = int(BG_TOP[1] + (BG_BOT[1]-BG_TOP[1])*t)
    b = int(BG_TOP[2] + (BG_BOT[2]-BG_TOP[2])*t)
    ImageDraw.Draw(og).line([(0,y),(W,y)], fill=(r,g,b))

# soft purple glow behind the icon
glow = Image.new("RGBA", (W,H), (0,0,0,0))
gd = ImageDraw.Draw(glow)
gd.ellipse((40, 60, 560, 580), fill=(124,109,250,90))
glow = glow.filter(ImageFilter.GaussianBlur(90))
og = Image.alpha_composite(og.convert("RGBA"), glow).convert("RGB")
draw = ImageDraw.Draw(og)

# icon mark, top-left
mark = make_icon(108)
og.paste(mark, (80, 90), mark)

f_title = ImageFont.truetype(FONT_BOLD, 64)
f_badge = ImageFont.truetype(FONT_MONO_BOLD, 22)
f_tagline = ImageFont.truetype(FONT_BOLD, 30)
f_stat_num = ImageFont.truetype(FONT_MONO_BOLD, 30)
f_stat_lbl = ImageFont.truetype(FONT_MONO, 20)

draw.text((212, 100), "TokenCrush", font=f_title, fill=WHITE)

# "FOR CLAUDE" badge
badge_text = "FOR CLAUDE"
bbox = draw.textbbox((0,0), badge_text, font=f_badge)
bw, bh = bbox[2]-bbox[0], bbox[3]-bbox[1]
bx, by = 212, 178
pad_x, pad_y = 12, 7
draw.rounded_rectangle((bx, by, bx+bw+pad_x*2, by+bh+pad_y*2+6), radius=6, outline=PURPLE, width=2, fill=(124,109,250,40))
draw.text((bx+pad_x, by+pad_y), badge_text, font=f_badge, fill=(195, 185, 255))

draw.text((80, 270), "Smart code compressor for Claude", font=f_tagline, fill=WHITE)
draw.text((80, 318), "Strip whitespace, comments & dead weight from your code", font=ImageFont.truetype(FONT_BOLD,24), fill=MUTED)
draw.text((80, 352), "so you can paste more files into one prompt.", font=ImageFont.truetype(FONT_BOLD,24), fill=MUTED)

# bottom stat strip — grounded in the real product mechanic.
# Rendered as a solid light "popped out" card against the dark hero —
# a small, deliberate echo of the light/dark toggle this update adds.
strip_box = (80, 460, 1120, 570)

# soft drop shadow first
shadow = Image.new("RGBA", (W, H), (0,0,0,0))
ImageDraw.Draw(shadow).rounded_rectangle(
    (strip_box[0], strip_box[1]+14, strip_box[2], strip_box[3]+14), radius=16, fill=(0,0,0,140)
)
shadow = shadow.filter(ImageFilter.GaussianBlur(18))
og = Image.alpha_composite(og.convert("RGBA"), shadow)

card = Image.new("RGBA", (W, H), (0,0,0,0))
ImageDraw.Draw(card).rounded_rectangle(strip_box, radius=16, fill=(255,255,255,255))
og = Image.alpha_composite(og, card).convert("RGB")
draw = ImageDraw.Draw(og)

INK = (20, 20, 26)
INK_MUTED = (110, 110, 120)
CARD_GREEN = (12, 138, 87)
CARD_AMBER = (156, 101, 0)
DIVIDER = (0, 0, 0, 28)

def stat(x, value, label, color):
    draw.text((x, strip_box[1]+20), value, font=f_stat_num, fill=color)
    draw.text((x, strip_box[1]+58), label, font=f_stat_lbl, fill=INK_MUTED)

stat(120, "48,302", "input tokens", INK)
draw.text((300, strip_box[1]+24), "→", font=f_stat_num, fill=INK_MUTED)
stat(350, "11,940", "output tokens", CARD_GREEN)
draw.line((560, strip_box[1]+20, 560, strip_box[1]+90), fill=(225,225,230), width=1)
stat(610, "-75%", "smaller", CARD_AMBER)
draw.line((780, strip_box[1]+20, 780, strip_box[1]+90), fill=(225,225,230), width=1)
stat(830, "4", "files bundled", INK)

og.save("/home/claude/assets/og-image.png", quality=92)
print("done", og.size)
