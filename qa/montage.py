# Combine screenshots into a labelled contact sheet: python3 qa/montage.py out.png cols thumbWidth file1 file2 ...
import sys
from PIL import Image, ImageDraw
out, cols, tw = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
files = sys.argv[4:]
ims = [Image.open(f).convert("RGB") for f in files]
th = max(int(im.height * tw / im.width) for im in ims)
rows = (len(ims) + cols - 1) // cols
sheet = Image.new("RGB", (cols * (tw + 10) + 10, rows * (th + 30) + 10), (200, 200, 200))
d = ImageDraw.Draw(sheet)
for i, (im, f) in enumerate(zip(ims, files)):
    r, c = divmod(i, cols)
    x, y = 10 + c * (tw + 10), 10 + r * (th + 30)
    sheet.paste(im.resize((tw, int(im.height * tw / im.width))), (x, y + 20))
    d.text((x, y + 4), f.split("/")[-1], fill=(0, 0, 0))
sheet.save(out)
print(out, sheet.size)
