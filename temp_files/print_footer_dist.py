import os
import re

path = r"e:\AIworkspace\mszn_index\dist\index.html"
if os.path.exists(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Search for <footer class="bg-slate-950 ..."> to </footer>
    match = re.search(r'<footer class="bg-slate-950.*?</footer>', content, re.DOTALL)
    if match:
        print("Found footer in dist/index.html:")
        print(match.group(0))
    else:
        # Check if there is <footer id="partial-footer">
        print("Footer not found by regex.")
        match_pf = re.search(r'<footer id="partial-footer">.*?</footer>', content, re.DOTALL)
        if match_pf:
            print("Found partial-footer placeholder:")
            print(match_pf.group(0))
        else:
            print("No footer tags found at all!")
else:
    print("dist/index.html does not exist!")
