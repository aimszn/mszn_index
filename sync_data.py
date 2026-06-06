import io
import re

# 1. Read the correct CASE_DETAILS_DATA from js/cases.js
js_content = io.open('e:/AIworkspace/mszn_index/js/cases.js', encoding='utf-8', errors='replace').read()
match = re.search(r'const CASE_DETAILS_DATA = (\{.*?\});\n\nfunction', js_content, re.DOTALL)
if not match:
    print("Could not find CASE_DETAILS_DATA in cases.js")
    exit(1)

correct_data = match.group(1)

def update_html_file(filepath):
    html_content = io.open(filepath, encoding='utf-8', errors='replace').read()
    # Replace the inline CASE_DETAILS_DATA in html_content
    pattern = r'const CASE_DETAILS_DATA = \{.*?\};\n\s*function generateDynamicFallback'
    replacement = f'const CASE_DETAILS_DATA = {correct_data};\n\nfunction generateDynamicFallback'
    
    new_html, count = re.subn(pattern, replacement, html_content, flags=re.DOTALL)
    if count > 0:
        io.open(filepath, 'w', encoding='utf-8').write(new_html)
        print(f"Updated {filepath}")
    else:
        print(f"Failed to find CASE_DETAILS_DATA in {filepath}")

# Update both files
update_html_file('e:/AIworkspace/mszn_index/html/mszn_index.html')
update_html_file('E:/AIworkspace/AntigravityStudio/mszn-index/src/html/mszn_index.html')
