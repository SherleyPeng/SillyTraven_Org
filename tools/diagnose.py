import json

JP = r'I:\AI\SillyTaven\角色卡\RealWorld\SillyTraven_Org\RealWorld_v1.1.0.card.json'
with open(JP, 'r', encoding='utf-8') as f:
    card = json.load(f)

# Check update rules entry
for e in card['data']['character_book']['entries']:
    if e['uid'] == 2:
        content = e['content']
        print(f'UID2 update rules length: {len(content)}')
        print(f'First 300 chars:')
        print(content[:300])
        print(f'...')
        print(f'Has §1 schema tree: {"§1" in content}')
        print(f'Has §13 言灵: {"言灵记录规则" in content}')
        print(f'Has §14 数值: {"数值状态更新规则" in content}')
        print(f'Last 200 chars:')
        print(content[-200:])
        print()

# Check regex state
for i, r in enumerate(card['data']['extensions']['regex_scripts']):
    find = r['findRegex']
    name = r['scriptName']
    has_g = '/gm' in find or '/gi' in find
    md = r.get('markdownOnly')
    pm = r.get('promptOnly')
    rep_len = len(r.get('replaceString', ''))
    print(f'Regex {i+1}: {name}')
    print(f'  find: {find[:100]}')
    print(f'  mdOnly={md} pmOnly={pm} repLen={rep_len} global={has_g}')
    print()
