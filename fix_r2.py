import json, base64, struct, zlib, os

JP = r'I:\AI\SillyTaven\角色卡\RealWorld\SillyTraven_Org\RealWorld.card.json'
with open(JP,'r',encoding='utf-8') as f: card = json.load(f)
regexes = card['data']['extensions']['regex_scripts']

# Precise ordering
ordered = []

# 1. promptOnly: hide placeholders from AI
for r in regexes:
    if r.get('scriptName','') == '对AI隐藏变量展示文本':
        ordered.append(r); break
for r in regexes:
    if r.get('scriptName','') == '对AI隐藏状态栏占位符':
        ordered.append(r); break

# 2. markdownOnly: SHOW statusbar (must before hide because it transforms)
for r in regexes:
    if '状态栏显示' in r.get('scriptName','') and r.get('markdownOnly') == True:
        ordered.append(r); break

# 3. markdownOnly: hide UpdateVariable
for r in regexes:
    if '隐藏变量更新块(含Analysis)' in r.get('scriptName',''):
        ordered.append(r); break
for r in regexes:
    if '二次兜底' in r.get('scriptName',''):
        ordered.append(r); break

# 4. Remaining
for r in regexes:
    if r not in ordered:
        ordered.append(r)

card['data']['extensions']['regex_scripts'] = ordered

for i,r in enumerate(ordered):
    print(f'{i+1}. {r["scriptName"]} md={r.get("markdownOnly")} pm={r.get("promptOnly")}')

with open(JP,'w',encoding='utf-8') as f: json.dump(card, f, ensure_ascii=False)

with open(JP,'r',encoding='utf-8') as f: cj = f.read()
cb = base64.b64encode(cj.encode('utf-8')).decode('ascii')
ps = r'I:\AI\SillyTaven\角色卡\RealWorld\SillyTraven_Org\RealWorld.png'
with open(ps,'rb') as f: d = f.read()
p = 8; nc = [d[:8]]
while p < len(d):
    if p+8 > len(d): nc.append(d[p:]); break
    l = struct.unpack('>I', d[p:p+4])[0]
    ct = d[p+4:p+8].decode('ascii', errors='replace')
    if ct != 'tEXt': nc.append(d[p:p+12+l])
    if ct == 'IEND': break; p += 12 + l
s = b''.join(nc); ip = s.find(b'IEND')
k = b'chara\0'; td = k + cb.encode('ascii')
cd = b'tEXt' + td; cr = struct.pack('>I', zlib.crc32(cd) & 0xffffffff)
tc = struct.pack('>I', len(td)) + cd + cr
npng = s[:ip-4] + tc + s[ip-4:]
dp = r'I:\AI\SillyTaven\角色卡\RealWorld\RealWorld_v1.7.0.png'
with open(dp, 'wb') as f: f.write(npng)
print(f'PNG: {os.path.getsize(dp)}B')
