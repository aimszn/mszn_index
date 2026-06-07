import os

path = r"e:\AIworkspace\mszn_index\dist\index.html"
if os.path.exists(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    print("Length of dist/index.html:", len(content))
    print("Contains '引擎矩阵'?", '引擎矩阵' in content)
    print("Contains 'AimSzn'?", 'AimSzn' in content)
    print("Contains 'partial-footer'?", 'partial-footer' in content)
    
    # Let's find matches and print around them
    import re
    matches = [m.start() for m in re.finditer('麻升智能工作室', content)]
    print("Matches for '麻升智能工作室':", len(matches))
    for m in matches[:5]:
        print(f"Around match {m}: {content[max(0, m-50):min(len(content), m+150)]}\n")
else:
    print("dist/index.html does not exist!")
