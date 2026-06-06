import io
import re

cases_js_path = 'e:/AIworkspace/mszn_index/js/cases.js'
content = io.open(cases_js_path, encoding='utf-8', errors='replace').read()

test_js = io.open('test.js', encoding='utf-8').read()

# find where const CASE_DETAILS_DATA starts in cases.js
match = re.search(r'const CASE_DETAILS_DATA\s*=\s*\{', content)
if match:
    start_idx = match.start()
    new_content = content[:start_idx] + test_js
    io.open(cases_js_path, 'w', encoding='utf-8').write(new_content)
    print("Updated cases.js")
else:
    print("Failed to find CASE_DETAILS_DATA in cases.js")
