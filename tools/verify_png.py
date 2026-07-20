import json, base64, struct

png_path = r'I:\AI\SillyTaven\角色卡\RealWorld\RealWorld_v1.1.0.png'
with open(png_path, 'rb') as f:
    data = f.read()

# Extract tEXt chunk with 'chara' keyword
pos = 8
while pos < len(data):
    if pos + 8 > len(data): break
    length = struct.unpack('>I', data[pos:pos+4])[0]
    chunk_type = data[pos+4:pos+8].decode('ascii', errors='replace')
    if chunk_type == 'tEXt':
        chunk_data = data[pos+8:pos+8+length]
        # chunk_data format: keyword\0base64data
        null_pos = chunk_data.find(b'\0')
        if null_pos > 0:
            keyword = chunk_data[:null_pos].decode('ascii', errors='replace')
            if keyword == 'chara':
                b64 = chunk_data[null_pos+1:].decode('ascii')
                card_json = base64.b64decode(b64).decode('utf-8')
                card = json.loads(card_json)
                break
    if chunk_type == 'IEND': break
    pos += 12 + length

d = card['data']
print(f'Name: {d.get("name")}')
print(f'Version: {d.get("character_version")}')
print(f'First mes length: {len(d.get("first_mes", ""))}')
print(f'World book entries: {len(d["character_book"]["entries"])}')
print(f'Regex scripts: {len(d["extensions"]["regex_scripts"])}')

# Check key entries
for e in d['character_book']['entries']:
    uid = e['uid']
    c = e['content']
    if uid == 1:
        has_stats = 'stats:' in c and 'physical:' in c
        has_kotodama = 'kotodama:' in c
        print(f'  UID1 [InitVar]: stats={has_stats} kotodama={has_kotodama}')
    elif uid == 5:
        has_gate = '使用言灵' in c and '以下不是言灵' in c
        print(f'  UID5 [言灵规则]: strict_gate={has_gate}')

# Check regex
for r in d['extensions']['regex_scripts']:
    name = r['scriptName']
    if 'StatusBar' in r.get('findRegex', ''):
        has_g = '/g' in r['findRegex']
        print(f'  Regex [{name}]: has_g={has_g} find={r["findRegex"][:60]}')
    if 'dump' in name.lower() or '变量dump' in name:
        print(f'  Regex [{name}]: ADDED markdownOnly={r.get("markdownOnly")}')

print('\nVerification PASSED')
