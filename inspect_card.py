import json

JP = r'I:\AI\SillyTaven\角色卡\RealWorld\SillyTraven_Org\RealWorld_v1.1.1.card.json'
with open(JP, 'r', encoding='utf-8') as f:
    card = json.load(f)

for e in card['data']['character_book']['entries']:
    if e['uid'] == 1:
        content = e['content']
        print(f'InitVar content length: {len(content)} chars')
        print('---')
        print(content[:2000])
        print('---')
        # Check for critical sections
        checks = ['time:', 'profile:', 'stats:', 'physical:', 'finance:', 'kotodama:', '_uid_counters:']
        for c in checks:
            found = c in content
            print(f'  Has "{c}": {found}')
