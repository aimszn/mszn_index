import io
import re
import json

js_path = 'e:/AIworkspace/mszn_index/js/cases.js'
html_path = 'E:/AIworkspace/AntigravityStudio/mszn-index/src/html/mszn_index.html'
html2_path = 'e:/AIworkspace/mszn_index/html/mszn_index.html'

def get_svg_for_case(case_name):
    # Base template, will customize colors and labels based on the case name
    hash_val = sum(ord(c) for c in case_name)
    colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f43f5e', '#eab308', '#0ea5e9']
    c1 = colors[hash_val % len(colors)]
    c2 = colors[(hash_val * 2) % len(colors)]
    
    if "独立站" in case_name:
        n1 = "Zendesk"
        n2 = "LLM Brain"
        n3 = "Shopify"
    elif "TikTok" in case_name:
        n1 = "Trends"
        n2 = "Dify Agent"
        n3 = "TikTok"
    elif "分析大盘" in case_name:
        n1 = "Amazon"
        n2 = "NLP Core"
        n3 = "Reports"
    elif "意图打标" in case_name:
        n1 = "WhatsApp"
        n2 = "Intent AI"
        n3 = "CRM"
    elif "流水线" in case_name:
        n1 = "Keywords"
        n2 = "GPT-4"
        n3 = "Listings"
    else:
        n1 = "Input"
        n2 = "AI Core"
        n3 = "Output"

    svg = f"""<svg viewBox="0 0 400 200" class="w-full h-full max-w-[350px]">
        <defs>
            <filter id="glow_{hash_val}" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
        </defs>
        <path d="M 80 100 Q 140 50 200 100 T 320 100" fill="none" stroke="#334155" stroke-width="2" stroke-dasharray="4 4" />
        <circle r="4" fill="{c1}" filter="url(#glow_{hash_val})"><animateMotion dur="2s" repeatCount="indefinite" path="M 80 100 Q 140 50 200 100 T 320 100" /></circle>
        
        <rect x="20" y="80" width="60" height="40" rx="8" fill="#0f172a" stroke="{c1}" stroke-width="2" />
        <text x="50" y="105" fill="#94a3b8" font-size="10" text-anchor="middle">{n1}</text>
        
        <circle cx="200" cy="100" r="35" fill="#1e1b4b" stroke="{c2}" stroke-width="2" filter="url(#glow_{hash_val})" />
        <text x="200" y="104" fill="#c4b5fd" font-size="10" text-anchor="middle" font-weight="bold">{n2}</text>
        
        <rect x="320" y="80" width="60" height="40" rx="8" fill="#0f172a" stroke="{c2}" stroke-width="2" />
        <text x="350" y="105" fill="#94a3b8" font-size="10" text-anchor="middle">{n3}</text>
    </svg>"""
    return svg.replace('\n', '')

# Modify js/cases.js
content = io.open(js_path, encoding='utf-8', errors='replace').read()

# We will inject the blueprint string into the dict literals
new_content = content
for case_name in ["独立站客服与履约自动化系统", "TikTok 爆款短视频矩阵分发器", "亚马逊竞品评价情感分析大盘", "商品详情页 (Listing) 批量生成流水线", "智能退换货挽留与客诉防御系统", "跨平台自动询盘抓取与意图打标"]:
    if case_name in new_content:
        # Check if blueprint already exists for this case
        # we can just use regex to insert blueprint before the closing brace of this case
        # Find the block for this case
        block_pattern = f'("{case_name}": {{.*?)(?=\n\\s+"[^"]+": |\n\\s+}})'
        match = re.search(block_pattern, new_content, re.DOTALL)
        if match:
            block = match.group(1)
            if '"blueprint":' not in block:
                svg_str = get_svg_for_case(case_name).replace('"', '\\"')
                new_block = block + f',\n        "blueprint": "{svg_str}"'
                new_content = new_content.replace(block, new_block)

io.open(js_path, 'w', encoding='utf-8').write(new_content)

# Now extract the updated CASE_DETAILS_DATA and push to html files
match = re.search(r'const CASE_DETAILS_DATA = (\{.*?\});\n\nfunction', new_content, re.DOTALL)
correct_data = match.group(1)

def update_html_file(filepath):
    html_content = io.open(filepath, encoding='utf-8', errors='replace').read()
    pattern = r'const CASE_DETAILS_DATA = \{.*?\};\n\nfunction generateDynamicFallback'
    replacement = f'const CASE_DETAILS_DATA = {correct_data};\n\nfunction generateDynamicFallback'
    new_html, count = re.subn(pattern, replacement, html_content, flags=re.DOTALL)
    if count > 0:
        io.open(filepath, 'w', encoding='utf-8').write(new_html)
        print(f"Updated {filepath}")
    else:
        print(f"Failed to find pattern in {filepath}")

update_html_file(html_path)
update_html_file(html2_path)
