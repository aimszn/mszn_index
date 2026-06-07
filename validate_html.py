import re

path = r"e:\AIworkspace\mszn_index\partials\footer.html"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Let's count tags
tags = re.findall(r'<(/?[a-zA-Z0-9\-]+)(?:\s|>)', content)
stack = []
unmatched = []

for tag in tags:
    if tag.startswith('/'):
        tag_name = tag[1:]
        if stack and stack[-1] == tag_name:
            stack.pop()
        else:
            unmatched.append(f"Closing tag </{tag_name}> without open tag, current stack: {stack}")
    else:
        # Ignore self-closing tags in HTML like img, input, br, hr, meta, link
        if tag in ['img', 'input', 'br', 'hr', 'meta', 'link']:
            continue
        stack.append(tag)

print("HTML Tag Validation for partials/footer.html:")
print("Unmatched closing tags:", unmatched)
print("Remaining open tags in stack:", stack)
