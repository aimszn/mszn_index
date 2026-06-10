import io
import re

js_content = io.open('e:/AIworkspace/mszn_index/js/cases.js', encoding='utf-8', errors='replace').read()
match = re.search(r'const CASE_DETAILS_DATA = (\{.*?\});\n\nfunction', js_content, re.DOTALL)
if match:
    data = match.group(1)
    # Check if blueprint exists inside the data
    if "blueprint:" in data:
        print("YES, blueprint exists in CASE_DETAILS_DATA!")
        # Print a small snippet to see
        idx = data.find("blueprint:")
        print(data[idx:idx+200])
    else:
        print("NO blueprint found in CASE_DETAILS_DATA!")
else:
    print('Not found')
