#!/usr/bin/env python3
"""Generate Play Store listing graphics and Android launcher PNG fallbacks."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path("/workspace")
STORE = ROOT / "store-assets"
SCREENSHOTS = STORE / "screenshots"
RES = ROOT / "android/app/src/main/res"
FONT_BOLD = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
FONT_REG = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"


def lerp(a: int, b: int, t: float) -> int:
    return int(a + (b - a) * t)


def gradient_fill(size: tuple[int, int], start: tuple[int, int, int], mid: tuple[int, int, int], end: tuple[int, int, int]) -> Image.Image:
    width, height = size
    img = Image.new("RGB", size)
    px = img.load()
    for y in range(height):
        ty = y / max(height - 1, 1)
        for x in range(width):
            t = (x / max(width - 1, 1) + ty) / 2
            if t < 0.5:
                u = t * 2
                color = (lerp(start[0], mid[0], u), lerp(start[1], mid[1], u), lerp(start[2], mid[2], u))
            else:
                u = (t - 0.5) * 2
                color = (lerp(mid[0], end[0], u), lerp(mid[1], end[1], u), lerp(mid[2], end[2], u))
            px[x, y] = color
    return img


def rounded_rect(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], radius: int, fill) -> None:
    draw.rounded_rectangle(box, radius=radius, fill=fill)


def make_icon(size: int = 1024) -> Image.Image:
    img = gradient_fill((size, size), (139, 92, 246), (6, 182, 212), (236, 72, 153))
    draw = ImageDraw.Draw(img)
    s = size / 1024
    rounded_rect(draw, (int(256 * s), int(456 * s), int(768 * s), int(816 * s)), int(40 * s), (255, 255, 255))
    draw.rectangle((int(296 * s), int(520 * s), int(728 * s), int(530 * s)), fill=(139, 92, 246))
    draw.rectangle((int(296 * s), int(560 * s), int(656 * s), int(570 * s)), fill=(6, 182, 212))
    draw.rectangle((int(296 * s), int(600 * s), int(696 * s), int(610 * s)), fill=(236, 72, 153))
    draw.rectangle((int(296 * s), int(640 * s), int(616 * s), int(650 * s)), fill=(139, 92, 246))
    cx, cy, r = int(512 * s), int(300 * s), int(90 * s)
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(255, 255, 255))
    draw.ellipse((int(462 * s), int(254 * s), int(494 * s), int(286 * s)), fill=(139, 92, 246))
    draw.ellipse((int(530 * s), int(254 * s), int(562 * s), int(286 * s)), fill=(6, 182, 212))
    draw.ellipse((int(500 * s), int(318 * s), int(524 * s), int(342 * s)), fill=(236, 72, 153))
    draw.rectangle((int(508 * s), int(390 * s), int(516 * s), int(456 * s)), fill=(255, 255, 255))
    return img


def make_feature_graphic() -> Image.Image:
    img = gradient_fill((1024, 500), (139, 92, 246), (6, 182, 212), (236, 72, 153))
    draw = ImageDraw.Draw(img)
    title = ImageFont.truetype(FONT_BOLD, 72)
    body = ImageFont.truetype(FONT_REG, 28)
    badge = ImageFont.truetype(FONT_BOLD, 18)
    draw.text((72, 140), "Vibe Tutor", font=title, fill=(255, 255, 255))
    draw.text((72, 240), "AI homework help and study tools for students 13+", font=body, fill=(255, 255, 255))
    draw.rounded_rectangle((72, 320, 390, 372), radius=24, fill=(15, 15, 35))
    draw.text((92, 334), "Education  ·  Free  ·  No ads", font=badge, fill=(255, 255, 255))
    return img


def make_screenshot(kind: str) -> Image.Image:
    img = Image.new("RGB", (1080, 1920), (15, 15, 35))
    draw = ImageDraw.Draw(img)
    brand = ImageFont.truetype(FONT_BOLD, 22)
    title_f = ImageFont.truetype(FONT_BOLD, 56)
    sub_f = ImageFont.truetype(FONT_REG, 26)
    card_title = ImageFont.truetype(FONT_BOLD, 30)
    card_body = ImageFont.truetype(FONT_REG, 24)
    nav_f = ImageFont.truetype(FONT_BOLD, 22)

    pages = {
        "dashboard": (
            "VIBE TUTOR",
            "Homework",
            "Today's plan for teen learners 13+",
            [
                ("Algebra review", "Due tonight · 25 min focus block"),
                ("History notes", "Chapter 4 summary · optional AI help"),
                ("Tokens", "Finish tasks to earn rewards. Parent PIN protects rules."),
            ],
            "Home",
        ),
        "tutor": (
            "AI TUTOR",
            "Ask anything",
            "Responses are AI-generated. Report anything that looks off.",
            [
                ("You", "Can you explain slope in a simple way?"),
                ("Vibe Tutor", "Slope is how steep a line is: rise over run. If you go up 2 and right 4, the slope is 1/2."),
                ("Safety", "In-app report is available on every AI reply."),
            ],
            "Tutor",
        ),
        "parent": (
            "PARENT AREA",
            "Controls",
            "PIN-protected rules for the student using this device",
            [
                ("First-Then", "Student completes routine steps before games unlock."),
                ("Screen time", "Optional daily caps and quiet hours."),
                ("Privacy", "Full policy is public. Age target: 13 and older."),
            ],
            "Settings",
        ),
    }
    brand_t, title, sub, cards, active = pages[kind]
    draw.text((56, 80), brand_t, font=brand, fill=(103, 232, 249))
    draw.text((56, 130), title, font=title_f, fill=(248, 250, 252))
    draw.text((56, 210), sub, font=sub_f, fill=(203, 213, 225))
    y = 300
    for heading, body in cards:
        draw.rounded_rectangle((56, y, 1024, y + 220), radius=28, fill=(32, 32, 58), outline=(255, 255, 255))
        draw.text((88, y + 36), heading, font=card_title, fill=(248, 250, 252))
        draw.text((88, y + 90), body, font=card_body, fill=(203, 213, 225))
        y += 248
    draw.rounded_rectangle((56, 1760, 1024, 1868), radius=28, fill=(20, 20, 42), outline=(148, 163, 184))
    labels = ["Home", "Tutor", "Games", "Settings"]
    for i, label in enumerate(labels):
        x = 120 + i * 230
        color = (103, 232, 249) if label == active else (148, 163, 184)
        draw.text((x, 1794), label, font=nav_f, fill=color)
    return img


def main() -> None:
    STORE.mkdir(exist_ok=True)
    SCREENSHOTS.mkdir(exist_ok=True)
    icon = make_icon(1024)
    icon.save(STORE / "icon-1024.png", "PNG")
    icon.resize((512, 512), Image.Resampling.LANCZOS).save(STORE / "icon-512.png", "PNG")
    make_feature_graphic().save(STORE / "feature-graphic.png", "PNG")
    mapping = {
        "01-homework-dashboard": "dashboard",
        "02-ai-tutor": "tutor",
        "03-parent-controls": "parent",
    }
    for filename, kind in mapping.items():
        make_screenshot(kind).save(SCREENSHOTS / f"{filename}.png", "PNG")

    densities = {"mdpi": 48, "hdpi": 72, "xhdpi": 96, "xxhdpi": 144, "xxxhdpi": 192}
    for density, size in densities.items():
        folder = RES / f"mipmap-{density}"
        folder.mkdir(parents=True, exist_ok=True)
        resized = icon.resize((size, size), Image.Resampling.LANCZOS)
        resized.save(folder / "ic_launcher.png", "PNG")
        resized.save(folder / "ic_launcher_round.png", "PNG")
        fg_size = int(size * 108 / 48)
        icon.resize((fg_size, fg_size), Image.Resampling.LANCZOS).save(folder / "ic_launcher_foreground.png", "PNG")

    print("generated")
    for path in sorted(STORE.rglob("*.png")):
        with Image.open(path) as im:
            print(f"{path.relative_to(ROOT)} {im.size}")
    for path in sorted(RES.glob("mipmap-*/ic_launcher*.png")):
        with Image.open(path) as im:
            print(f"{path.relative_to(ROOT)} {im.size}")


if __name__ == "__main__":
    main()
