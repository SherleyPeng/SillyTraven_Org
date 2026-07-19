import json
with open(r'I:\AI\SillyTaven\角色卡\RealWorld\SillyTraven_Org\RealWorld.card.json','r',encoding='utf-8') as f:
    card = json.load(f)
for r in card['data']['extensions']['regex_scripts']:
    if '状态栏显示' in r.get('scriptName',''):
        rs = r['replaceString']
        print('replaceString:')
        print(rs[:300])
        print()
        print('len:', len(rs))
        print('has ```html:', '```html' in rs)
        print('has .load:', ".load('https://" in rs)
        backtick3 = chr(96)*3
        print('ends with triple backtick:', rs.strip().endswith(backtick3))
        break
