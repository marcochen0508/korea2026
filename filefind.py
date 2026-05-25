import re
with open('index.html', encoding='utf-8') as f:
    content = f.read()
names = re.findall(r'class="attraction-name">(.*?)<', content)
for i, n in enumerate(names, 1):
    print(f"{i}. {n.strip()}")

print("\n--- Images referenced ---")
imgs = re.findall(r'src="景點照片/(.*?)"', content)
for img in sorted(set(imgs)):
    print(img)
