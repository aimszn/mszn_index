import io
import re

def escape_js(text):
    return text.replace('\\', '\\\\').replace('`', '\\`').replace('$', '\\$')

# Define the 6 core cases
cases = [
    {
        "title": "独立站客服与履约自动化系统",
        "before": "3 名专职客服，需在 Zendesk、Shopify 与物流平台间低效切换。单笔退换货处理平均耗时 20 分钟。跨时区响应不及时，周末客诉率高达 8%。",
        "after": "0 人工介入。n8n 实时捕获邮件意图并翻译，调用大模型分析。系统自动执行 Shopify 退换/发券/拦截操作。全链路仅需 15 秒，客诉率骤降至 1% 以下。",
        "codeTitle": "n8n Webhook & LLM Node.json",
        "code": """{
  "name": "Zendesk Ticket Trigger",
  "type": "n8n-nodes-base.webhook",
  "parameters": {
    "path": "zendesk-refund",
    "options": {
      "responseMode": "lastNode"
    }
  }
}
...
// LLM Intent Classification:
if (intent === "refund" && sentiment_score < 0.3) {
  await executeShopifyRefund(orderId, {
    reason: summary,
    notifyCustomer: true
  });
}""",
        "blueprint_args": ["Zendesk", "LLM Brain", "Shopify", 0]
    },
    {
        "title": "TikTok 爆款短视频矩阵分发器",
        "before": "2 名运营每天花费 4 小时刷榜、2 小时写脚本，人工同步多账号。每天产出视频上限为 5-8 条。",
        "after": "通过 Dify Agent 每天定时抓取爆款趋势，自动调用大模型生成 50 套符合账号人设的短视频脚本并自动分发，将运营团队变成矩阵主理人。",
        "codeTitle": "Dify Workflow / Viral_Prompt",
        "code": """// System Prompt for Dify Agent
"Role: You are an elite TikTok strategist and scriptwriter.
Task: Analyze the provided viral trends and generate 5 hook-heavy scripts.
Constraints: 
- Max 15 seconds reading time.
- Start with a pattern interrupt.
- Include visual cues for the editor."

def generate_viral_matrix(trend_data):
    scripts = llm.generate_batch(trend_data, count=50)
    for script in scripts:
        video = heygen.render(script)
        tiktok.publish_to_matrix(video, tags=trend_data.tags)
    return metrics""",
        "blueprint_args": ["Trends", "Dify Agent", "TikTok", 1]
    },
    {
        "title": "亚马逊竞品评价情感分析大盘",
        "before": "每周需下载上万条竞品 Reviews，用 Excel 跑词频。难以快速洞察隐藏的痛点（如“包装破损”与“物流延迟”混杂），选品迭代永远慢半拍。",
        "after": "全自动化爬取并入库。大模型精准提取 15 个细分维度的情感得分（质量、物流、气味等），并高亮预警痛点。每周自动生成结构化 BI 战报推送企微。",
        "codeTitle": "Sentiment Analysis Core (Python)",
        "code": """import pandas as pd
from transformers import pipeline

classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
candidate_labels = ["packaging", "shipping", "quality", "price", "scent"]

def analyze_reviews(asin_reviews):
    results = []
    for review in asin_reviews:
        # LLM zero-shot topic clustering & sentiment
        res = classifier(review['text'], candidate_labels)
        sentiment = get_sentiment_score(review['text'])
        
        results.append({
            "review_id": review['id'],
            "topic": res['labels'][0],
            "confidence": res['scores'][0],
            "sentiment_score": sentiment
        })
    
    update_powerbi_dataset(results)""",
        "blueprint_args": ["Amazon", "NLP Core", "Reports", 2]
    },
    {
        "title": "商品详情页 (Listing) 批量生成流水线",
        "before": "新开 100 个 SKU，需要文案绞尽脑汁写 Title、5 Bullets 和 Description。外包成本 50元/条，且风格参差不齐，极易触发敏感词违规。",
        "after": "导入产品规格表，AI 结合历史高转化 Listing 库，5 分钟内批量输出 100 个多语种、SEO 友好的 A+ 级 Listing，并自动过滤平台违规词。",
        "codeTitle": "Listing Generation Pipeline",
        "code": """{
  "workflow": "Listing_Batch_Gen",
  "steps": [
    {
      "action": "Parse_PIM_Data",
      "input": "sku_specs.csv"
    },
    {
      "action": "Generate_Title",
      "model": "gpt-4-turbo",
      "prompt_template": "Create an Amazon title < 200 chars including keywords: {{keywords}}"
    },
    {
      "action": "Generate_Bullets",
      "model": "gpt-4-turbo",
      "rules": ["Highlight benefits, not just features", "Start with ALL CAPS"]
    },
    {
      "action": "Compliance_Check",
      "database": "amazon_restricted_keywords_db"
    }
  ]
}""",
        "blueprint_args": ["Keywords", "GPT-4", "Listings", 3]
    },
    {
        "title": "智能退换货挽留与客诉防御系统",
        "before": "只要客户发起退货，客服一律同意。每年直接损失高达数百万。缺乏有效的挽留话术与分级处理机制，恶意薅羊毛行为泛滥。",
        "after": "AI 实时评估客户终身价值 (LTV) 与退货原因。对于高优客户自动发放高额无门槛补偿券；对于恶意退款自动驳回并标记。成功挽回 35% 的退货订单。",
        "codeTitle": "LTV & Churn Defense Logic",
        "code": """async function handleReturnRequest(customer, order, reason) {
  // 1. Calculate Customer Lifetime Value & Risk
  const ltv = await getCustomerLTV(customer.id);
  const fraudScore = await checkFraudRisk(customer.id);
  
  if (fraudScore > 80) {
    return rejectReturn("Fraud risk detected.");
  }
  
  // 2. Dynamic Retention Strategy
  if (ltv > 1000 && reason === "defective") {
    // High value customer - immediate full refund + 20% discount code
    await processRefund(order.id, "FULL");
    await sendApologyEmailWithDiscount(customer.email, 0.20);
    return "Retained high-value customer";
  } else {
    // Standard customer - offer partial refund to keep item
    const offer = await generateLLMOffer(order.item, reason);
    return proposeAlternative(offer);
  }
}""",
        "blueprint_args": ["Request", "LTV Engine", "Defense", 4]
    },
    {
        "title": "跨平台自动询盘抓取与意图打标",
        "before": "销售人员每天在 WhatsApp, FB Messenger, Email 里疯狂切屏，手动把询盘复制到 CRM。经常漏回信息，线索跟进极度混乱。",
        "after": "所有渠道信息统一汇聚 n8n。AI 自动判断是“售后”、“询价”还是“垃圾信息”。精准打标后推入 HubSpot，并自动指派给对应业务员，重要询盘企微秒级告警。",
        "codeTitle": "Multi-Channel Ingestion & Triage",
        "code": """export const TriageWorkflow = {
  trigger: ["WhatsApp", "Messenger", "Email"],
  execute: async (message) => {
    // LLM Intent Classification
    const intent = await classifyIntent(message.content);
    
    // Entity Extraction (Budget, Company, Product)
    const entities = await extractEntities(message.content);
    
    // CRM Routing
    if (intent === "Pricing_Inquiry" && entities.budget > 5000) {
      await HubSpot.createDeal({
        amount: entities.budget,
        company: entities.company,
        stage: "Qualified"
      });
      await WeChatWork.sendAlert("🚨 High-Value Inquiry Detected!");
    } else if (intent === "Support") {
      await Zendesk.createTicket(message);
    }
  }
};""",
        "blueprint_args": ["WhatsApp", "Intent AI", "CRM", 5]
    }
]

def get_svg(n1, n2, n3, idx):
    colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f43f5e', '#eab308', '#0ea5e9']
    c1 = colors[idx % len(colors)]
    c2 = colors[(idx + 2) % len(colors)]
    
    svg = f"""<svg viewBox="0 0 400 200" class="w-full h-full max-w-[350px]">
        <defs>
            <filter id="glow_base_{idx}" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
        </defs>
        <path d="M 80 100 Q 140 50 200 100 T 320 100" fill="none" stroke="#334155" stroke-width="2" stroke-dasharray="4 4" />
        <circle r="4" fill="{c1}" filter="url(#glow_base_{idx})"><animateMotion dur="2s" repeatCount="indefinite" path="M 80 100 Q 140 50 200 100 T 320 100" /></circle>
        
        <rect x="20" y="80" width="60" height="40" rx="8" fill="#0f172a" stroke="{c1}" stroke-width="2" />
        <text x="50" y="105" fill="#94a3b8" font-size="10" text-anchor="middle">{n1}</text>
        
        <circle cx="200" cy="100" r="35" fill="#1e1b4b" stroke="{c2}" stroke-width="2" filter="url(#glow_base_{idx})" />
        <text x="200" y="104" fill="#c4b5fd" font-size="10" text-anchor="middle" font-weight="bold">{n2}</text>
        
        <rect x="320" y="80" width="60" height="40" rx="8" fill="#0f172a" stroke="{c2}" stroke-width="2" />
        <text x="350" y="105" fill="#94a3b8" font-size="10" text-anchor="middle">{n3}</text>
    </svg>"""
    return svg.replace('\n', '')

# Generate JS string
js_parts = []
for c in cases:
    title = c['title']
    before = escape_js(c['before'])
    after = escape_js(c['after'])
    codeTitle = escape_js(c['codeTitle'])
    code = escape_js(c['code'])
    blueprint = escape_js(get_svg(*c['blueprint_args']))
    
    # Use backticks for code to avoid multiline syntax errors!
    js_parts.append(f"""    "{title}": {{
        before: `{before}`,
        after: `{after}`,
        codeTitle: `{codeTitle}`,
        code: `{code}`,
        blueprint: `{blueprint}`
    }}""")

case_data_str = "{\n" + ",\n".join(js_parts) + "\n}"

def update_file(filepath):
    try:
        content = io.open(filepath, encoding='utf-8', errors='replace').read()
        
        # Replace the entire CASE_DETAILS_DATA block
        # We need to find `const CASE_DETAILS_DATA = { ... };` 
        # up to the next function declaration `function` or end of file
        pattern = r'const CASE_DETAILS_DATA\s*=\s*\{.*?\};\n\nfunction generateDynamicFallback'
        replacement = f'const CASE_DETAILS_DATA = {case_data_str};\n\nfunction generateDynamicFallback'
        
        new_content, count = re.subn(pattern, replacement, content, flags=re.DOTALL)
        if count > 0:
            io.open(filepath, 'w', encoding='utf-8').write(new_content)
            print(f"Updated {filepath}")
        else:
            print(f"Failed to find pattern in {filepath}")
    except Exception as e:
        print(f"Error on {filepath}: {e}")

update_file('e:/AIworkspace/mszn_index/js/cases.js')
update_file('e:/AIworkspace/mszn_index/html/mszn_index.html')
update_file('E:/AIworkspace/AntigravityStudio/mszn-index/src/html/mszn_index.html')
