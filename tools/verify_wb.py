import json

base = r'I:\AI\SillyTaven\角色卡\RealWorld\SillyTraven_Org'
with open(base + r'\08-worldbook.json', 'r', encoding='utf-8') as f:
    wb = json.load(f)

# Check uid 1 (InitVar)
c1 = wb['entries']['1']['content']
checks = ['wechat:', 'finance:', 'cash:', 'accounts:', 'location:']
for chk in checks:
    print(f'uid 1 contains "{chk}": {chk in c1}')

# Check uid 2 (output format)
c2 = wb['entries']['2']['content']
print(f'uid 2 "<analysis>": {"<analysis>" in c2}')
print(f'uid 2 "情况A": {"情况A" in c2}')
print(f'uid 2 "情况B": {"情况B" in c2}')
print(f'uid 2 "wx_NNN": {"wx_NNN" in c2}')
print(f'uid 2 "禁止 Analysis": {"绝对禁止" in c2}')

# Check uid 11 (read vars)
c11 = wb['entries']['11']['content']
print(f'uid 11 "wechat": {"wechat" in c11}')
print(f'uid 11 "微信聊天": {"微信聊天" in c11}')
print(f'uid 11 "微博动态": {"微博动态" in c11}')
print(f'uid 11 "var wx =": {"var wx =" in c11}')

# Check uid 15 (update rules)
c15 = wb['entries']['15']['content']
print(f'uid 15 "wx_": {"wx_" in c15}')
print(f'uid 15 "wx_NNN": {"wx_NNN" in c15}')
print(f'uid 15 "wechat 特殊规则": {"wechat 特殊规则" in c15}')
print(f'uid 15 "wx_前缀": {"无需计数器" in c15}')
