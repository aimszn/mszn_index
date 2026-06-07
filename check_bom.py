path = r"e:\AIworkspace\mszn_index\partials\footer.html"
with open(path, 'rb') as f:
    content_bytes = f.read()

print("File size:", len(content_bytes))
print("First 20 bytes:", content_bytes[:20])
# Check for BOM
if content_bytes.startswith(b'\xef\xbb\xbf'):
    print("BOM detected: UTF-8 BOM")
else:
    print("No UTF-8 BOM detected")
