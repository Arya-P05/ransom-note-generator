import os
import sys
import shutil
import argparse
import subprocess
from PIL import Image

def compress_jpeg(src, dst, quality):
    img = Image.open(src)
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    img.save(dst,
             format="JPEG",
             quality=quality,
             optimize=True,
             progressive=True)

def compress_png(src, dst, q_min, q_max, pngquant_path):
    os.makedirs(os.path.dirname(dst), exist_ok=True)

    if pngquant_path:
        cmd = [
            pngquant_path,
            "--quality", f"{q_min}-{q_max}",
            "--speed", "1",
            "--force",
            "--output", dst,
            src
        ]
        try:
            subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            return
        except subprocess.CalledProcessError:
            print(f"⚠️  pngquant failed on {os.path.basename(src)}; falling back to Pillow optimize", file=sys.stderr)

    # fallback
    img = Image.open(src)
    img.save(dst, format="PNG", optimize=True)

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--input",        "-i", required=True, help="public/ folder")
    p.add_argument("--output",       "-o", required=True, help="where to mirror/compress")
    p.add_argument("--jpeg-quality", type=int, default=85, help="JPEG quality (1–100)")
    p.add_argument("--png-min",      type=int, default=60, help="PNG quant min quality (0–100)")
    p.add_argument("--png-max",      type=int, default=80, help="PNG quant max quality (0–100)")
    args = p.parse_args()

    pngquant_path = shutil.which("pngquant")
    if not pngquant_path:
        print("⚠️  pngquant not found—PNG compression will be weaker.", file=sys.stderr)

    for root, _, files in os.walk(args.input):
        rel = os.path.relpath(root, args.input)
        target_dir = os.path.join(args.output, rel)
        os.makedirs(target_dir, exist_ok=True)

        for fn in files:
            src = os.path.join(root, fn)
            dst = os.path.join(target_dir, fn)
            ext = os.path.splitext(fn)[1].lower()

            if ext in (".jpg", ".jpeg"):
                print(f"[JPEG] {fn}")
                compress_jpeg(src, dst, args.jpeg_quality)
            elif ext == ".png":
                print(f"[PNG] {fn}")
                compress_png(src, dst,
                             args.png_min, args.png_max,
                             pngquant_path)
            else:
                # copy other files unchanged
                shutil.copy2(src, dst)

if __name__ == "__main__":
    main()