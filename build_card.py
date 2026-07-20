import json, base64, struct, zlib, os

BASE = r'I:\AI\SillyTaven\角色卡\RealWorld\SillyTraven_Org'

def read_src(filename):
    with open(os.path.join(BASE, filename), 'r', encoding='utf-8') as f:
        return f.read()

initvar_content     = read_src('02-initvar.yaml')
output_fmt_content  = read_src('03a-output-format.txt')
update_rules_content = read_src('03b-update-rules.txt')
word_spirit_content = read_src('08b-word-spirit.txt')
read_vars_content   = read_src('05-read-vars.ejs')
forcer_content      = read_src('08i-statusbar-forcer.txt')
schema_register_js  = read_src('09c-schema-register.js')

# ── Read card JSON ──
card_path = os.path.join(BASE, 'RealWorld.card.json')
with open(card_path, 'r', encoding='utf-8') as f:
    card = json.load(f)

data = card['data']

# ── 1. Update character_version ──
data['character_version'] = '1.3.0'
print('character_version -> 1.3.0')

# ── 2. Update world book entries ──
entries = data['character_book']['entries']

for e in entries:
    uid = e['uid']
    comment = e['comment']
    content = e['content']

    # UID1: [InitVar]
    if uid == 1:
        e['content'] = initvar_content
        print(f'Updated UID1: [InitVar]')

    # UID2: [mvu_update]变量输出格式
    if uid == 2:
        e['content'] = output_fmt_content
        print(f'Updated UID2: [mvu_update]变量输出格式')

    # UID15: [mvu_update]变量更新规则
    elif uid == 15:
        e['content'] = update_rules_content
        print(f'Updated UID15: [mvu_update]变量更新规则')

    # UID5: 世界设定 = 言灵能力规则 (content starts with 平行地球)
    elif uid == 5 or ('言灵' in content and '平行地球' in content):
        e['content'] = word_spirit_content
        print(f'Updated UID{uid}: 言灵能力规则/世界设定')

    # UID11: 读取变量
    elif uid == 11:
        e['content'] = read_vars_content
        print(f'Updated UID11: 读取变量')

    # UID14: 状态栏占位符forcer
    elif uid == 14 or 'StatusPlaceHolder' in content:
        e['content'] = forcer_content
        print(f'Updated UID{uid}: 状态栏占位符forcer')

# ── 2b. Ensure UID15 exists ──
uid15_exists = any(e.get('uid') == 15 for e in entries)
if not uid15_exists:
    uid15_entry = {
        'uid': 15,
        'comment': '[mvu_update]变量更新规则',
        'content': update_rules_content,
        'constant': True,
        'enabled': True,
        'order': 100,
        'position': 0,
        'depth': 4,
        'use_regex': False,
        'keys': [],
        'keysecondary': [],
        'display_index': 0,
        'recursion': {'delay_until': None, 'prevent_outgoing': True, 'prevent_incoming': True},
        'selectiveLogic': 0
    }
    entries.append(uid15_entry)
    print('Created UID15: [mvu_update]变量更新规则')

# ── 2c. Sync schema-register script ──
for s in data['extensions']['tavern_helper']['scripts']:
    if s.get('id') == 'schema-register-v1':
        if s['content'] != schema_register_js:
            s['content'] = schema_register_js
            print('Updated schema-register script from source')
        break

# ── 3. Update regex scripts ──
regexes = data['extensions']['regex_scripts']

# Fix: remove 'g' flag from show-statusbar regex (the markdownOnly one that has replacement)
for r in regexes:
    if r.get('markdownOnly') is True and r.get('replaceString', '') and len(r['replaceString']) > 0:
        r['findRegex'] = r['findRegex'].replace('/gm', '/m')
        print(f'Fixed regex: {r["scriptName"]}')

# Add new regex: hide plain-text variable dump lines on display side
hide_dump = {
    "scriptName": "隐藏纯文本变量dump行",
    "findRegex": "/^(?:当前时间:|用户档案\\s+姓名:|数值状态\\s+体力:|言灵记录\\s+\\(|人际关系\\s+\\(|男性NPC\\s+\\(|女性NPC\\s+\\(|微信消息:|微博热搜:|人脉图谱:|近期事件:|随身物品:|财务|最近收支\\s+\\()[^\\n]*$/gm",
    "replaceString": "",
    "placement": [2],
    "markdownOnly": True,
    "promptOnly": False,
    "disabled": True,
    "runOnEdit": True
}
existing_regex_names = {r.get('scriptName') for r in regexes}
if hide_dump['scriptName'] not in existing_regex_names:
    regexes.append(hide_dump)
    print(f'Added regex: {hide_dump["scriptName"]}')
else:
    print(f'Regex already exists: {hide_dump["scriptName"]}')

# ── 3b. Add kotodama dedup script (skip if already present) ──
dedup_js = read_src('09k-kotodama-dedup.js')
scripts = data['extensions']['tavern_helper']['scripts']
existing_ids = {s.get('id') for s in scripts}
if 'array-dedup-v1' not in existing_ids:
    dedup_script = {
        "info": "变量数组去重v1.1——模糊匹配近重复记录(1~2字差异)",
        "id": "array-dedup-v1",
        "type": "script",
        "data": {},
        "content": dedup_js,
        "button": {"buttons": [], "enabled": False},
        "name": "变量数组去重(kotodama+finance)",
        "export_with": {"button": True, "data": True},
        "enabled": True
    }
    scripts.append(dedup_script)
    print(f'Added script: {dedup_script["name"]}')
else:
    # Update existing dedup script content
    for s in scripts:
        if s.get('id') == 'array-dedup-v1':
            s['content'] = dedup_js
            print('Updated existing dedup script')
            break

# ── 4. Write updated card JSON ──
out_json_path = os.path.join(BASE, 'RealWorld_v1.3.0.card.json')
with open(out_json_path, 'w', encoding='utf-8') as f:
    json.dump(card, f, ensure_ascii=False)
print(f'Written: {out_json_path} ({os.path.getsize(out_json_path)} bytes)')

# ── 5. Generate PNG ──
print('\nBuilding PNG...')
with open(out_json_path, 'r', encoding='utf-8') as f:
    card_json_str = f.read()

card_base64 = base64.b64encode(card_json_str.encode('utf-8')).decode('ascii')

png_path = os.path.join(BASE, 'RealWorld.png')
with open(png_path, 'rb') as f:
    png_data = f.read()

# Strip existing tEXt chunks
pos = 8
new_chunks = [png_data[:8]]
while pos < len(png_data):
    if pos + 8 > len(png_data):
        new_chunks.append(png_data[pos:])
        break
    length = struct.unpack('>I', png_data[pos:pos+4])[0]
    chunk_type = png_data[pos+4:pos+8].decode('ascii', errors='replace')
    if chunk_type != 'tEXt':
        new_chunks.append(png_data[pos:pos+12+length])
    if chunk_type == 'IEND':
        break
    pos += 12 + length

stripped_png = b''.join(new_chunks)
iend_pos = stripped_png.find(b'IEND')

# Build new tEXt chunk
keyword = b'chara\0'
text_data = keyword + card_base64.encode('ascii')
chunk_body = b'tEXt' + text_data
crc = struct.pack('>I', zlib.crc32(chunk_body) & 0xffffffff)
tEXt_chunk = struct.pack('>I', len(text_data)) + chunk_body + crc

new_png = stripped_png[:iend_pos-4] + tEXt_chunk + stripped_png[iend_pos-4:]

out_png_path = os.path.join(BASE, '..', 'RealWorld_v1.3.0.png')
with open(out_png_path, 'wb') as f:
    f.write(new_png)

print(f'PNG written: {out_png_path} ({os.path.getsize(out_png_path)} bytes)')
print('Done!')
