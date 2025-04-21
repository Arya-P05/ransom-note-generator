import os

# Adjust this path to wherever your Next.js public directory is
PUBLIC_DIR = "./public/compressed"

# Only scan folders named A-Z or 0-9
valid_chars = [chr(c) for c in range(ord("A"), ord("Z")+1)] + [str(i) for i in range(10)]

variation_counts = {}

for char in valid_chars:
    folder_path = os.path.join(PUBLIC_DIR, char)
    if not os.path.isdir(folder_path):
        continue

    png_files = [f for f in os.listdir(folder_path) if f.endswith(".png")]
    variation_counts[char] = len(png_files)

# Print the final dictionary
print("VARIATION_COUNTS = {")
for k in sorted(variation_counts):
    print(f'  "{k}": {variation_counts[k]},')
print("}")
