#!/usr/bin/env python3
"""
麻升智能工作室 - 构建脚本
将 partials 内联到 index.html，生成单文件 dist/index.html 用于生产部署。

用法：python build.py
输出：dist/index.html
"""

import os
import re
import shutil

ROOT = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(ROOT, 'dist')

def read_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def build():
    # 1. 读取 index.html 骨架
    html = read_file(os.path.join(ROOT, 'index.html'))

    # 2. 移除 partials-loader.js 的 script 标签（生产环境不需要）
    html = re.sub(
        r'\s*<script src="js/partials-loader\.js(?:\?[^"]*)?"></script>\s*\n?',
        '\n',
        html
    )

    # 3. 将每个 <div id="partial-xxx"></div> 替换为对应 partial 文件内容
    def replace_partial(match):
        div_full = match.group(0)
        partial_id = match.group(1)


        partial_map = {
            'nav':       'partials/nav.txt',
            'home':      'partials/home/home.txt',
            'masheng':   'partials/masheng/masheng.txt',
            'moying':    'partials/moying/moying.txt',
            'cases':     'partials/cases.txt',
            'solutions': 'partials/solutions.txt',
            'arsenal':   'partials/arsenal.txt',
            'blog':      'partials/blog.txt',
            'dashboard': 'partials/dashboard.txt',
            'trust':     'partials/trust.txt',
            'contact':   'partials/contact.txt',
            'footer':    'partials/footer.txt',
            'modals':    'partials/modals.txt',
        }

        name = partial_id.replace('partial-', '')
        rel_path = partial_map.get(name)
        if not rel_path:
            print(f'  [WARN] 未知 partial: {partial_id}')
            return div_full

        full_path = os.path.join(ROOT, rel_path)
        if not os.path.exists(full_path):
            print(f'  [WARN] 文件不存在: {rel_path}')
            return div_full

        content = read_file(full_path)

        print(f'  [OK] {rel_path} -> #{partial_id}')
        return content

    # 匹配所有 partial placeholder（支持 div/section/footer 等标签）
    html = re.sub(
        r'<(?:div|section|footer) id="(partial-[^"]+)"[^>]*>\s*</(?:div|section|footer)>',
        replace_partial,
        html
    )

    # 4. 合并 CSS 为内联（使用正则匹配，容忍 ?v=x 等版本参数）
    css_files = ['css/base.css', 'css/components.css', 'css/sections/cases.css']
    css_combined = '\n'.join(read_file(os.path.join(ROOT, f)) for f in css_files)
    css_pattern = r'\s*<link rel="stylesheet" href="css/base\.css(?:\?[^"]*)?">\s*\n?\s*<link rel="stylesheet" href="css/components\.css(?:\?[^"]*)?">\s*\n?\s*<link rel="stylesheet" href="css/sections/cases\.css(?:\?[^"]*)?">'
    html, count = re.subn(css_pattern, lambda m, c=css_combined: f'\n    <style>\n{c}\n    </style>\n', html)
    if count == 0:
        # Fallback if regular expression fails due to structure changes
        html = html.replace(
            '    <link rel="stylesheet" href="css/base.css">\n    <link rel="stylesheet" href="css/components.css">\n    <link rel="stylesheet" href="css/sections/cases.css">',
            f'    <style>\n{css_combined}\n    </style>'
        )

    # 5. 内联 JSON 数据为同步脚本（生产环境不需要 fetch）
    import json as _json
    json_files = {
        'data/config.json':       'MSZN_GLOBAL_CONFIG',
        'data/dashboard.json':    'DASHBOARD_DATA',
        'data/profile.json':      '_PROFILE',
        'data/policies.json':     '_POLICIES',
        'data/manifesto.json':    '_MANIFESTO',
        'data/metrics.json':      '_METRICS',
        'data/pain-points.json':  '_PAIN_POINTS',
        'data/guarantees.json':   '_GUARANTEES',
        'data/blueprints.json':   '_BLUEPRINTS',
        'data/c-blueprints.json': '_C_BLUEPRINTS',
        'data/resources.json':    '_RESOURCES',
        'data/daily-agents.json': '_DAILY_AGENTS',
        'data/digital-employees.json': '_DIGITAL_EMPLOYEES',
        'data/pricing.json':      '_PRICING',
        'data/faqs.json':         '_FAQS',
        'data/testimonials.json': '_TESTIMONIALS',
        'data/blogs.json':        '_BLOGS',
        'data/demands.json':      '_DEMANDS',
        'data/sandbox-mocks.json': '_SANDBOX_MOCKS',
        'data/gallery.json':      '_GALLERY',
    }
    json_scripts = []
    for path, var in json_files.items():
        data = _json.loads(read_file(os.path.join(ROOT, path)))
        json_scripts.append(f'    <script>window.{var} = {_json.dumps(data, ensure_ascii=False)};</script>')
    json_inline = '\n'.join(json_scripts)

    # 组装 LOCAL_CMS_DATA 的同步脚本
    local_cms_assembly = '''    <script>
    (function() {
        var c = window.MSZN_GLOBAL_CONFIG;
        var p = window._PROFILE;
        window.LOCAL_CMS_DATA = {
            base: c.base, founder: p.founder, security: p.security,
            media: c.media, api: c.api, agents: c.agents,
            policies: window._POLICIES,
            content: {
                manifesto: window._MANIFESTO, metrics: window._METRICS,
                painPoints: window._PAIN_POINTS, guarantees: window._GUARANTEES,
                blueprints: window._BLUEPRINTS, cBlueprints: window._C_BLUEPRINTS,
                resources: window._RESOURCES, dailyAgents: window._DAILY_AGENTS,
                digitalEmployees: window._DIGITAL_EMPLOYEES, pricing: window._PRICING,
                faqs: window._FAQS, testimonials: window._TESTIMONIALS,
            },
            blogs: window._BLOGS, demands: window._DEMANDS,
            sandboxMocks: window._SANDBOX_MOCKS, gallery: window._GALLERY,
        };
    })();
    </script>'''

    # 替换 config.js 和 data.js 的 script 标签为内联数据
    html = html.replace('    <script src="js/config.js"></script>', json_inline + '\n' + local_cms_assembly)
    html = html.replace('    <script src="js/data.js"></script>\n', '')

    # 6. 内联其余 JS 文件 (使用正则匹配，容忍 ?v=x 等版本参数)
    js_files = ['js/partials-loader.js', 'js/app.js', 'js/dify.js', 'js/workspace.js', 'js/cases.js']
    for f in js_files:
        full_path = os.path.join(ROOT, f)
        if not os.path.exists(full_path):
            continue
        content = read_file(full_path)
        
        escaped_f = re.escape(f)
        pattern = r'\s*<script src="' + escaped_f + r'(?:\?[^"]*)?"></script>\s*\n?'
        
        html, count = re.subn(pattern, lambda m, c=content: f'\n    <script>\n{c}\n    </script>\n', html, count=1)
        if count == 0:
            # Fallback if no query string was matched
            tag = f'    <script src="{f}"></script>'
            if tag in html:
                html = html.replace(tag, f'    <script>\n{content}\n    </script>', 1)

    # 6. 输出到 dist/
    os.makedirs(DIST, exist_ok=True)
    out_path = os.path.join(DIST, 'index.html')
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(html)

    # 复制静态资源
    assets_src = os.path.join(ROOT, 'assets')
    assets_dst = os.path.join(DIST, 'assets')
    if os.path.exists(assets_src):
        if os.path.exists(assets_dst):
            shutil.rmtree(assets_dst)
        shutil.copytree(assets_src, assets_dst)

    size_kb = os.path.getsize(out_path) / 1024
    print(f'\n构建完成: {out_path} ({size_kb:.0f} KB)')
    print('可直接用浏览器打开 dist/index.html 部署。')

if __name__ == '__main__':
    build()
