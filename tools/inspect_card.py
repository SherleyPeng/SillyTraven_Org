import json

JP = r'I:\AI\SillyTaven\角色卡\RealWorld\SillyTraven_Org\RealWorld.card.json'
with open(JP, 'r', encoding='utf-8') as f:
    card = json.load(f)

scripts = card['data']['extensions']['tavern_helper']['scripts']
s = scripts[1]
content = s['content']
for k, v in content.items():
    val_str = str(v)
    if len(val_str) > 200:
        val_str = val_str[:200] + '...'
    print(f'content.{k}: {val_str}')
