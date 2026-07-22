import json
import os
import shutil

base = r'I:\AI\SillyTaven\角色卡\RealWorld\SillyTraven_Org'

# Read source files
with open(os.path.join(base, '02-initvar.yaml'), 'r', encoding='utf-8') as f:
    initvar_content = f.read().strip()
with open(os.path.join(base, '03a-output-format.txt'), 'r', encoding='utf-8') as f:
    output_fmt_content = f.read().strip()
with open(os.path.join(base, '05-read-vars.ejs'), 'r', encoding='utf-8') as f:
    readvars_content = f.read().strip()
with open(os.path.join(base, '03b-update-rules.txt'), 'r', encoding='utf-8') as f:
    update_rules_content = f.read().strip()

# Backup
wb_path = os.path.join(base, '08-worldbook.json')
bak_path = wb_path + '.bak'
shutil.copy2(wb_path, bak_path)
print(f'Backup: {bak_path}')

# Load worldbook
with open(wb_path, 'r', encoding='utf-8') as f:
    wb = json.load(f)

# Show current entries
print('Current entries:', sorted([int(k) for k in wb['entries'].keys()]))
for k in sorted(wb['entries'].keys(), key=lambda x: int(x)):
    e = wb['entries'][k]
    c = e.get('content', '')
    print(f"  uid {k}: comment='{e.get('comment','')}', len={len(c)}, enabled={e.get('enabled')}")

# Update entries
wb['entries']['1']['content'] = initvar_content
wb['entries']['2']['content'] = output_fmt_content
wb['entries']['11']['content'] = readvars_content
wb['entries']['15']['content'] = update_rules_content

# Write back
with open(wb_path, 'w', encoding='utf-8') as f:
    json.dump(wb, f, ensure_ascii=False, indent=4)

# Verify
with open(wb_path, 'r', encoding='utf-8') as f:
    wb2 = json.load(f)
for uid in ['1', '2', '11', '15']:
    c = wb2['entries'][uid]['content']
    print(f'uid {uid} OK: content length={len(c)}')
print('Done.')
