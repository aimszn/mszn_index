from html.parser import HTMLParser
import os

class HTMLTagValidator(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.errors = []
        
    def handle_starttag(self, tag, attrs):
        # Self-closing HTML tags
        self_closing = ['img', 'input', 'br', 'hr', 'meta', 'link', 'path', 'circle', 'rect', 'area', 'base', 'col', 'embed', 'keygen', 'param', 'source', 'track', 'wbr']
        if tag not in self_closing:
            self.stack.append((tag, self.getpos()))
            
    def handle_endtag(self, tag):
        self_closing = ['img', 'input', 'br', 'hr', 'meta', 'link', 'path', 'circle', 'rect', 'area', 'base', 'col', 'embed', 'keygen', 'param', 'source', 'track', 'wbr']
        if tag in self_closing:
            return
            
        if not self.stack:
            self.errors.append(f"Unexpected closing tag </{tag}> at line {self.getpos()[0]}, col {self.getpos()[1]}")
            return
            
        open_tag, pos = self.stack.pop()
        if open_tag != tag:
            self.errors.append(f"Mismatched tag: opened <{open_tag}> at line {pos[0]}, col {pos[1]}, but closed with </{tag}> at line {self.getpos()[0]}, col {self.getpos()[1]}")
            # Put it back to avoid cascading errors
            self.stack.append((open_tag, pos))

    def validate(self, filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            html_content = f.read()
        self.feed(html_content)
        
        print(f"Validation results for {os.path.basename(filepath)}:")
        if self.errors:
            print("Errors found:")
            for err in self.errors:
                print("  -", err)
        else:
            print("No mismatched closing tags found.")
            
        if self.stack:
            print("Unclosed tags remaining in stack (from last opened to first):")
            for tag, pos in reversed(self.stack):
                print(f"  - <{tag}> opened at line {pos[0]}, col {pos[1]}")
        else:
            print("All opened tags were closed successfully.")

validator = HTMLTagValidator()
validator.validate(r"e:\AIworkspace\mszn_index\partials\footer.html")
