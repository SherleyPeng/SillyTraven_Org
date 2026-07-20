import json, os

path = r'I:\AI\SillyTaven\角色卡\RealWorld\SillyTraven_Org\灯火.card.json'
with open(path, 'r', encoding='utf-8') as f:
    card = json.load(f)

data = card.get('data', {})
print('=== CARD INFO ===')
print('Name:', data.get('name'))
print('Version:', data.get('character_version'))
print('First mes length:', len(data.get('first_mes', '')))

# Check extensions (TH scripts and regex)
ext = data.get('extensions', {})
scripts = ext.get('tavern_helper', {}).get('scripts', [])
regex_scripts = ext.get('regex_scripts', [])
print('\n=== SCRIPTS:', len(scripts), '===')
for s in scripts:
    print('  -', s.get('name'), '(enabled:', s.get('enabled'), ') len:', len(s.get('content', '')))

print('\n=== REGEX:', len(regex_scripts), '===')
for r in regex_scripts:
    print('  -', r.get('scriptName'))
    print('    promptOnly:', r.get('promptOnly'), ' markdownOnly:', r.get('markdownOnly'), ' placement:', r.get('placement'))
    rep = r.get('replaceString', '')
    find = r.get('findRegex', '')
    has_html = 'html' in rep.lower() or 'iframe' in rep.lower() or '```' in rep or '<style' in rep
    print('    findRegex:', find[:150])
    print('    replaceString has html/iframe/style/backticks:', has_html, 'len:', len(rep))
    if len(rep) > 0 and len(rep) < 200:
        print('    replaceString:', rep[:200])

# Check world book - look for status bar entries specifically
cb = data.get('character_book', {})
entries = cb.get('entries', [])
print('\n=== WORLD BOOK:', len(entries), 'entries ===')
for e in entries:
    comment = e.get('comment', '')
    enabled = e.get('enabled', False)
    constant = e.get('constant', False)
    content = e.get('content', '')
    uid = e.get('uid', '?')
    
    # Check for status bar related entries
    keywords = ['状态', 'STATUS', 'HUD', 'status', 'RENDER', '渲染', 'render', 'iframe', 'IFRAME', 'html', 'HTML', 'first_mes', 'first']
    is_sb = any(k in comment or (k in content[:50] and 'RENDER' in k) for k in keywords)
    
    if is_sb or uid <= 3:
        print(f'  UID{uid}: [{comment}] enabled={enabled} const={constant} len={len(content)}')
        if is_sb:
            print('    *** POSSIBLE SB ENTRY ***')
            preview = content[:300].replace('\n', '\\n')
            print('    content:', preview)

# Check first_mes for placeholders
fm = data.get('first_mes', '')
print('\n=== FIRST_MES (last 500 chars) ===')
print(fm[-500:].replace('\n', '\\n'))
