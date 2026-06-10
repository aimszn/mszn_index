import re
import io

generator_code = """
function generateDynamicFallback(title, fallbackDesc) {
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
        hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f43f5e', '#eab308', '#0ea5e9', '#ec4899', '#14b8a6'];
    const c1 = colors[Math.abs(hash) % colors.length];
    const c2 = colors[Math.abs(hash * 2) % colors.length];
    const c3 = colors[Math.abs(hash * 3) % colors.length];

    const keyword1 = title.substring(0, 4) || "Data";
    const keyword2 = "AI Core";
    const keyword3 = title.length > 8 ? title.substring(title.length - 4) : "Output";

    const svg = `<svg viewBox="0 0 400 200" class="w-full h-full max-w-[350px]">
        <defs>
            <filter id="glow_fb_${Math.abs(hash)}" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
        </defs>
        <path d="M 80 100 L 160 100" fill="none" stroke="#334155" stroke-width="2" stroke-dasharray="4 4" />
        <path d="M 240 100 L 320 100" fill="none" stroke="#334155" stroke-width="2" stroke-dasharray="4 4" />
        <path d="M 160 100 Q 200 40 240 100" fill="none" stroke="#334155" stroke-width="2" stroke-dasharray="4 4" />
        
        <circle r="3" fill="${c1}" filter="url(#glow_fb_${Math.abs(hash)})"><animateMotion dur="1.5s" repeatCount="indefinite" path="M 80 100 L 160 100" /></circle>
        <circle r="3" fill="${c2}" filter="url(#glow_fb_${Math.abs(hash)})"><animateMotion dur="1.5s" repeatCount="indefinite" path="M 240 100 L 320 100" /></circle>
        <circle r="3" fill="${c3}" filter="url(#glow_fb_${Math.abs(hash)})"><animateMotion dur="2s" repeatCount="indefinite" path="M 160 100 Q 200 40 240 100" /></circle>
        
        <rect x="20" y="80" width="60" height="40" rx="8" fill="#0f172a" stroke="${c1}" stroke-width="2" />
        <text x="50" y="105" fill="#94a3b8" font-size="10" text-anchor="middle">${keyword1}</text>
        
        <circle cx="200" cy="100" r="40" fill="#1e1b4b" stroke="${c3}" stroke-width="2" filter="url(#glow_fb_${Math.abs(hash)})" />
        <text x="200" y="104" fill="#c4b5fd" font-size="10" text-anchor="middle" font-weight="bold">${keyword2}</text>
        
        <rect x="320" y="80" width="60" height="40" rx="8" fill="#0f172a" stroke="${c2}" stroke-width="2" />
        <text x="350" y="105" fill="#94a3b8" font-size="10" text-anchor="middle">${keyword3}</text>
    </svg>`;

    const metricsStr = `{\n  "module": "${title}",\n  "status": "optimized",\n  "ai_confidence_score": 0.9${Math.abs(hash % 9) + 1},\n  "automation_level": "L4",\n  "active_nodes": ${Math.abs(hash % 20) + 5},\n  "error_rate": "< 0.01%"\n}`;

    return {
        before: "严重依赖人工在多个分散的系统中机械地搬运数据。\\n单节点出现阻滞即导致整个业务流停摆。\\n存在极大的人力内耗与数据孤岛风险。",
        after: fallbackDesc + "\\n通过专属 AI 架构重构了业务流闭环，极大地释放了员工精力。",
        codeTitle: `${title} Engine`,
        code: `// ${title} 自动化核心\\n${metricsStr}`,
        blueprint: svg
    };
}
"""

replacement = "const details = (typeof CASE_DETAILS_DATA !== 'undefined' && CASE_DETAILS_DATA[title]) ? CASE_DETAILS_DATA[title] : generateDynamicFallback(title, fallbackDesc);"

# Replace in js/cases.js
text1 = io.open('js/cases.js', encoding='utf-8').read()
pattern1 = r'const details = \(typeof CASE_DETAILS_DATA.*?\};'
if 'function generateDynamicFallback' not in text1:
    text1 = generator_code + '\n' + text1
text1 = re.sub(pattern1, replacement, text1, flags=re.DOTALL)
io.open('js/cases.js', 'w', encoding='utf-8').write(text1)

# Replace in html/mszn_index.html
text2 = io.open('html/mszn_index.html', encoding='utf-8').read()
pattern2 = r'const details = CASE_DETAILS_DATA\[title\] \|\| \{.*?\};'
if 'function generateDynamicFallback' not in text2:
    # Insert generator code before openCaseModal
    text2 = text2.replace('function openCaseModal(cardElement) {', generator_code + '\n        function openCaseModal(cardElement) {')
text2 = re.sub(pattern2, replacement.replace("typeof CASE_DETAILS_DATA !== 'undefined' && ", ""), text2, flags=re.DOTALL)
io.open('html/mszn_index.html', 'w', encoding='utf-8').write(text2)

print("Done")
