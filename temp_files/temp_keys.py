import re

with open('E:/AIworkspace/AntigravityStudio/mszn-index/src/html/mszn_index.html', encoding='utf-8', errors='replace') as f:
    text = f.read()

match = re.search(r'const CASE_DETAILS_DATA = (\{.*?\});', text, re.DOTALL)
if match:
    data = match.group(1)
    keys = re.findall(r'\"([^\"]+)\":\s*\{', data)
    print("KEYS:", keys)
else:
    print('Not found')
