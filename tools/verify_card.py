import json

card = json.load(open(r'I:\AI\SillyTaven\角色卡\RealWorld\SillyTraven_Org\RealWorld_v1.7.3.card.json', 'r', encoding='utf-8'))
d = card['data']
print('version:', d['character_version'])
entries = d['character_book']['entries']
print('worldbook entries:', len(entries))
for e in sorted(entries, key=lambda x: x['uid']):
    c = e['comment']
    cl = len(e['content'])
    print(f'  uid={e["uid"]:2d}  {c:30s}  len={cl}')
