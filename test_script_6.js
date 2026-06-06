
        // 案例详细数据字典 (极端 Before/After 对比与硬核代码)
        const CASE_DETAILS_DATA = {
    "独立站客服与履约自动化系统": {
        before: `3 名专职客服，需在 Zendesk、Shopify 与物流平台间低效切换。单笔退换货处理平均耗时 20 分钟。跨时区响应不及时，周末客诉率高达 8%。`,
        after: `0 人工介入。n8n 实时捕获邮件意图并翻译，调用大模型分析。系统自动执行 Shopify 退换/发券/拦截操作。全链路仅需 15 秒，客诉率骤降至 1% 以下。`,
        codeTitle: `n8n Webhook & LLM Node.json`,
        code: `{
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
}`,
        blueprint: `<svg viewBox="0 0 400 200" class="w-full h-full max-w-[350px]">        <defs>            <filter id="glow_base_0" x="-20%" y="-20%" width="140%" height="140%">                <feGaussianBlur stdDeviation="3" result="blur" />                <feComposite in="SourceGraphic" in2="blur" operator="over" />            </filter>        </defs>        <path d="M 80 100 Q 140 50 200 100 T 320 100" fill="none" stroke="#334155" stroke-width="2" stroke-dasharray="4 4" />        <circle r="4" fill="#3b82f6" filter="url(#glow_base_0)"><animateMotion dur="2s" repeatCount="indefinite" path="M 80 100 Q 140 50 200 100 T 320 100" /></circle>                <rect x="20" y="80" width="60" height="40" rx="8" fill="#0f172a" stroke="#3b82f6" stroke-width="2" />        <text x="50" y="105" fill="#94a3b8" font-size="10" text-anchor="middle">Zendesk</text>                <circle cx="200" cy="100" r="35" fill="#1e1b4b" stroke="#8b5cf6" stroke-width="2" filter="url(#glow_base_0)" />        <text x="200" y="104" fill="#c4b5fd" font-size="10" text-anchor="middle" font-weight="bold">LLM Brain</text>                <rect x="320" y="80" width="60" height="40" rx="8" fill="#0f172a" stroke="#8b5cf6" stroke-width="2" />        <text x="350" y="105" fill="#94a3b8" font-size="10" text-anchor="middle">Shopify</text>    </svg>`
    },
    "TikTok 爆款短视频矩阵分发器": {
        before: `2 名运营每天花费 4 小时刷榜、2 小时写脚本，人工同步多账号。每天产出视频上限为 5-8 条。`,
        after: `通过 Dify Agent 每天定时抓取爆款趋势，自动调用大模型生成 50 套符合账号人设的短视频脚本并自动分发，将运营团队变成矩阵主理人。`,
        codeTitle: `Dify Workflow / Viral_Prompt`,
        code: `// System Prompt for Dify Agent
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
    return metrics`,
        blueprint: `<svg viewBox="0 0 400 200" class="w-full h-full max-w-[350px]">        <defs>            <filter id="glow_base_1" x="-20%" y="-20%" width="140%" height="140%">                <feGaussianBlur stdDeviation="3" result="blur" />                <feComposite in="SourceGraphic" in2="blur" operator="over" />            </filter>        </defs>        <path d="M 80 100 Q 140 50 200 100 T 320 100" fill="none" stroke="#334155" stroke-width="2" stroke-dasharray="4 4" />        <circle r="4" fill="#10b981" filter="url(#glow_base_1)"><animateMotion dur="2s" repeatCount="indefinite" path="M 80 100 Q 140 50 200 100 T 320 100" /></circle>                <rect x="20" y="80" width="60" height="40" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="2" />        <text x="50" y="105" fill="#94a3b8" font-size="10" text-anchor="middle">Trends</text>                <circle cx="200" cy="100" r="35" fill="#1e1b4b" stroke="#f43f5e" stroke-width="2" filter="url(#glow_base_1)" />        <text x="200" y="104" fill="#c4b5fd" font-size="10" text-anchor="middle" font-weight="bold">Dify Agent</text>                <rect x="320" y="80" width="60" height="40" rx="8" fill="#0f172a" stroke="#f43f5e" stroke-width="2" />        <text x="350" y="105" fill="#94a3b8" font-size="10" text-anchor="middle">TikTok</text>    </svg>`
    },
    "亚马逊竞品评价情感分析大盘": {
        before: `每周需下载上万条竞品 Reviews，用 Excel 跑词频。难以快速洞察隐藏的痛点（如“包装破损”与“物流延迟”混杂），选品迭代永远慢半拍。`,
        after: `全自动化爬取并入库。大模型精准提取 15 个细分维度的情感得分（质量、物流、气味等），并高亮预警痛点。每周自动生成结构化 BI 战报推送企微。`,
        codeTitle: `Sentiment Analysis Core (Python)`,
        code: `import pandas as pd
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
    
    update_powerbi_dataset(results)`,
        blueprint: `<svg viewBox="0 0 400 200" class="w-full h-full max-w-[350px]">        <defs>            <filter id="glow_base_2" x="-20%" y="-20%" width="140%" height="140%">                <feGaussianBlur stdDeviation="3" result="blur" />                <feComposite in="SourceGraphic" in2="blur" operator="over" />            </filter>        </defs>        <path d="M 80 100 Q 140 50 200 100 T 320 100" fill="none" stroke="#334155" stroke-width="2" stroke-dasharray="4 4" />        <circle r="4" fill="#8b5cf6" filter="url(#glow_base_2)"><animateMotion dur="2s" repeatCount="indefinite" path="M 80 100 Q 140 50 200 100 T 320 100" /></circle>                <rect x="20" y="80" width="60" height="40" rx="8" fill="#0f172a" stroke="#8b5cf6" stroke-width="2" />        <text x="50" y="105" fill="#94a3b8" font-size="10" text-anchor="middle">Amazon</text>                <circle cx="200" cy="100" r="35" fill="#1e1b4b" stroke="#eab308" stroke-width="2" filter="url(#glow_base_2)" />        <text x="200" y="104" fill="#c4b5fd" font-size="10" text-anchor="middle" font-weight="bold">NLP Core</text>                <rect x="320" y="80" width="60" height="40" rx="8" fill="#0f172a" stroke="#eab308" stroke-width="2" />        <text x="350" y="105" fill="#94a3b8" font-size="10" text-anchor="middle">Reports</text>    </svg>`
    },
    "商品详情页 (Listing) 批量生成流水线": {
        before: `新开 100 个 SKU，需要文案绞尽脑汁写 Title、5 Bullets 和 Description。外包成本 50元/条，且风格参差不齐，极易触发敏感词违规。`,
        after: `导入产品规格表，AI 结合历史高转化 Listing 库，5 分钟内批量输出 100 个多语种、SEO 友好的 A+ 级 Listing，并自动过滤平台违规词。`,
        codeTitle: `Listing Generation Pipeline`,
        code: `{
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
}`,
        blueprint: `<svg viewBox="0 0 400 200" class="w-full h-full max-w-[350px]">        <defs>            <filter id="glow_base_3" x="-20%" y="-20%" width="140%" height="140%">                <feGaussianBlur stdDeviation="3" result="blur" />                <feComposite in="SourceGraphic" in2="blur" operator="over" />            </filter>        </defs>        <path d="M 80 100 Q 140 50 200 100 T 320 100" fill="none" stroke="#334155" stroke-width="2" stroke-dasharray="4 4" />        <circle r="4" fill="#f43f5e" filter="url(#glow_base_3)"><animateMotion dur="2s" repeatCount="indefinite" path="M 80 100 Q 140 50 200 100 T 320 100" /></circle>                <rect x="20" y="80" width="60" height="40" rx="8" fill="#0f172a" stroke="#f43f5e" stroke-width="2" />        <text x="50" y="105" fill="#94a3b8" font-size="10" text-anchor="middle">Keywords</text>                <circle cx="200" cy="100" r="35" fill="#1e1b4b" stroke="#0ea5e9" stroke-width="2" filter="url(#glow_base_3)" />        <text x="200" y="104" fill="#c4b5fd" font-size="10" text-anchor="middle" font-weight="bold">GPT-4</text>                <rect x="320" y="80" width="60" height="40" rx="8" fill="#0f172a" stroke="#0ea5e9" stroke-width="2" />        <text x="350" y="105" fill="#94a3b8" font-size="10" text-anchor="middle">Listings</text>    </svg>`
    },
    "智能退换货挽留与客诉防御系统": {
        before: `只要客户发起退货，客服一律同意。每年直接损失高达数百万。缺乏有效的挽留话术与分级处理机制，恶意薅羊毛行为泛滥。`,
        after: `AI 实时评估客户终身价值 (LTV) 与退货原因。对于高优客户自动发放高额无门槛补偿券；对于恶意退款自动驳回并标记。成功挽回 35% 的退货订单。`,
        codeTitle: `LTV & Churn Defense Logic`,
        code: `async function handleReturnRequest(customer, order, reason) {
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
}`,
        blueprint: `<svg viewBox="0 0 400 200" class="w-full h-full max-w-[350px]">        <defs>            <filter id="glow_base_4" x="-20%" y="-20%" width="140%" height="140%">                <feGaussianBlur stdDeviation="3" result="blur" />                <feComposite in="SourceGraphic" in2="blur" operator="over" />            </filter>        </defs>        <path d="M 80 100 Q 140 50 200 100 T 320 100" fill="none" stroke="#334155" stroke-width="2" stroke-dasharray="4 4" />        <circle r="4" fill="#eab308" filter="url(#glow_base_4)"><animateMotion dur="2s" repeatCount="indefinite" path="M 80 100 Q 140 50 200 100 T 320 100" /></circle>                <rect x="20" y="80" width="60" height="40" rx="8" fill="#0f172a" stroke="#eab308" stroke-width="2" />        <text x="50" y="105" fill="#94a3b8" font-size="10" text-anchor="middle">Request</text>                <circle cx="200" cy="100" r="35" fill="#1e1b4b" stroke="#3b82f6" stroke-width="2" filter="url(#glow_base_4)" />        <text x="200" y="104" fill="#c4b5fd" font-size="10" text-anchor="middle" font-weight="bold">LTV Engine</text>                <rect x="320" y="80" width="60" height="40" rx="8" fill="#0f172a" stroke="#3b82f6" stroke-width="2" />        <text x="350" y="105" fill="#94a3b8" font-size="10" text-anchor="middle">Defense</text>    </svg>`
    },
    "跨平台自动询盘抓取与意图打标": {
        before: `销售人员每天在 WhatsApp, FB Messenger, Email 里疯狂切屏，手动把询盘复制到 CRM。经常漏回信息，线索跟进极度混乱。`,
        after: `所有渠道信息统一汇聚 n8n。AI 自动判断是“售后”、“询价”还是“垃圾信息”。精准打标后推入 HubSpot，并自动指派给对应业务员，重要询盘企微秒级告警。`,
        codeTitle: `Multi-Channel Ingestion & Triage`,
        code: `export const TriageWorkflow = {
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
};`,
        blueprint: `<svg viewBox="0 0 400 200" class="w-full h-full max-w-[350px]">        <defs>            <filter id="glow_base_5" x="-20%" y="-20%" width="140%" height="140%">                <feGaussianBlur stdDeviation="3" result="blur" />                <feComposite in="SourceGraphic" in2="blur" operator="over" />            </filter>        </defs>        <path d="M 80 100 Q 140 50 200 100 T 320 100" fill="none" stroke="#334155" stroke-width="2" stroke-dasharray="4 4" />        <circle r="4" fill="#0ea5e9" filter="url(#glow_base_5)"><animateMotion dur="2s" repeatCount="indefinite" path="M 80 100 Q 140 50 200 100 T 320 100" /></circle>                <rect x="20" y="80" width="60" height="40" rx="8" fill="#0f172a" stroke="#0ea5e9" stroke-width="2" />        <text x="50" y="105" fill="#94a3b8" font-size="10" text-anchor="middle">WhatsApp</text>                <circle cx="200" cy="100" r="35" fill="#1e1b4b" stroke="#10b981" stroke-width="2" filter="url(#glow_base_5)" />        <text x="200" y="104" fill="#c4b5fd" font-size="10" text-anchor="middle" font-weight="bold">Intent AI</text>                <rect x="320" y="80" width="60" height="40" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="2" />        <text x="350" y="105" fill="#94a3b8" font-size="10" text-anchor="middle">CRM</text>    </svg>`
    }
};

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

    const metricsStr = `{
  "module": "${title}",
  "status": "optimized",
  "ai_confidence_score": 0.9${Math.abs(hash % 9) + 1},
  "automation_level": "L4",
  "active_nodes": ${Math.abs(hash % 20) + 5},
  "error_rate": "< 0.01%"
}`;

    return {
        before: "严重依赖人工在多个分散的系统中机械地搬运数据。\n单节点出现阻滞即导致整个业务流停摆。\n存在极大的人力内耗与数据孤岛风险。",
        after: fallbackDesc + "\n通过专属 AI 架构重构了业务流闭环，极大地释放了员工精力。",
        codeTitle: `${title} Engine`,
        code: `// ${title} 自动化核心\n${metricsStr}`,
        blueprint: svg
    };
}

        function openCaseModal(cardElement) {
            const modal = document.getElementById('case-modal');
            const content = document.getElementById('case-modal-content');

            // Extract basic data from card
            const title = cardElement.querySelector('h3').innerText;
            const fallbackDesc = cardElement.querySelector('p').innerText;
            const roi = cardElement.querySelector('.flex.items-center.justify-between span:last-child').innerText;

            // Extract tags
            const tagsDiv = cardElement.querySelector('.absolute.bottom-4.left-4.z-10');
            const tagsHTML = tagsDiv ? tagsDiv.innerHTML : '';

            // Lookup extreme details or use fallback
            const details = (CASE_DETAILS_DATA[title]) ? CASE_DETAILS_DATA[title] : generateDynamicFallback(title, fallbackDesc);

            // Populate Modal
            document.getElementById('cm-title').innerText = title;
            document.getElementById('cm-before').innerText = details.before;
            document.getElementById('cm-after').innerText = details.after;
            document.getElementById('cm-roi').innerText = roi;
            document.getElementById('cm-tags').innerHTML = tagsHTML;
            document.getElementById('cm-code-title').innerText = details.codeTitle;
            document.getElementById('cm-code-content').innerText = details.code;

            const cmBlueprintContainer = document.getElementById('cm-blueprint-container');
            if(cmBlueprintContainer && details.blueprint) {
                cmBlueprintContainer.innerHTML = details.blueprint;
            }

            // Show modal
            modal.classList.remove('hidden');
            modal.classList.add('flex');

            // Trigger animation
            setTimeout(() => {
                modal.classList.remove('opacity-0');
                modal.classList.add('opacity-100');
                content.classList.remove('translate-x-full');
                content.classList.add('translate-x-0');
            }, 10);

            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }

        function closeCaseModal() {
            const modal = document.getElementById('case-modal');
            const content = document.getElementById('case-modal-content');

            modal.classList.remove('opacity-100');
            modal.classList.add('opacity-0');
            content.classList.remove('translate-x-0');
            content.classList.add('translate-x-full');

            setTimeout(() => {
                modal.classList.remove('flex');
                modal.classList.add('hidden');
                document.body.style.overflow = '';
            }, 300);
        }

        function submitCaseLead(e) {
            e.preventDefault();
            const btn = document.getElementById('case-lead-btn');
            const text = document.getElementById('case-lead-text');
            const loader = document.getElementById('case-lead-loader');
            const msg = document.getElementById('case-lead-msg');
            const emailInput = document.getElementById('case-lead-email');

            text.classList.add('hidden');
            loader.classList.remove('hidden');
            btn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                loader.classList.add('hidden');
                text.classList.remove('hidden');
                btn.disabled = false;

                msg.innerText = "🎉 成功！白皮书已发送至您的邮箱。";
                msg.classList.remove('hidden', 'text-red-400');
                msg.classList.add('text-green-400');
                emailInput.value = '';

                setTimeout(() => {
                    msg.classList.add('hidden');
                }, 5000);
            }, 1500);
        }
        // ======================= AI 自动化体检雷达逻辑 =======================
        function startAIRadar() {
            const formContainer = document.getElementById('radar-form-container');
            const loadingContainer = document.getElementById('radar-loading-container');
            const resultContainer = document.getElementById('radar-result-container');
            const terminal = document.getElementById('radar-terminal');
            
            // Get values
            const q1 = document.querySelector('input[name="radar-q1"]:checked').value;
            const q2 = document.querySelector('input[name="radar-q2"]:checked').value;
            const q3 = document.querySelector('input[name="radar-q3"]:checked').value;
            
            // Transition to loading
            formContainer.classList.add('hidden');
            loadingContainer.classList.remove('hidden');
            
            // Terminal animation
            const msgs = [
                "> 提取业务逻辑图谱...",
                "> 测算 API 节点耦合度...",
                "> 匹配 OpenClaw 大模型算力...",
                "> 生成最终诊断报告..."
            ];
            let msgIdx = 0;
            const terminalInterval = setInterval(() => {
                if (msgIdx < msgs.length) {
                    terminal.innerText = msgs[msgIdx];
                    msgIdx++;
                } else {
                    clearInterval(terminalInterval);
                }
            }, 400);
            
            // Calculate logic
            setTimeout(() => {
                let score = 60; // Base score
                if(q1 === 'high') score += 15;
                if(q1 === 'med') score += 5;
                if(q3 === 'saas') score += 15;
                if(q3 === 'excel') score += 8;
                
                // Max out at 95%
                if(score > 95) score = 95;
                
                let scenario = "";
                let advice = "";
                
                if (q2 === 'data') {
                    scenario = "【跨域数据搬运与 ETL 清洗】";
                    advice = "由于您的核心痛点是数据流转，建议立即采用 n8n Workflow 替代人工操作，将现有的 Excel 或 SaaS 数据全自动汇聚闭环。";
                } else if (q2 === 'service') {
                    scenario = "【智能客服与售后工单自动化】";
                    advice = "针对高频沟通，建议部署基于本地私有知识库的 RAG 智能体，自动接管 80% 的常规问询，释放客服精力。";
                } else {
                    scenario = "【自媒体矩阵内容批量生成】";
                    advice = "强烈建议引入 Dify Agent 结合 Midjourney API，基于您的品牌调性自动抓取热点并裂变生成图文内容。";
                }
                
                // Populate results
                document.getElementById('radar-score-text').innerText = score + '%';
                document.getElementById('radar-scenario-text').innerText = scenario;
                document.getElementById('radar-advice-text').innerText = advice;
                
                // Show result
                loadingContainer.classList.add('hidden');
                resultContainer.classList.remove('hidden');
                
                // Animate progress bar
                setTimeout(() => {
                    document.getElementById('radar-progress-bar').style.width = score + '%';
                }, 100);
                
            }, 2000);
        }
        
        function resetAIRadar() {
            document.getElementById('radar-result-container').classList.add('hidden');
            document.getElementById('radar-form-container').classList.remove('hidden');
            document.getElementById('radar-progress-bar').style.width = '0%';
        }

        // ======================= 沉浸式 ROI 计算器逻辑 =======================
        function initROICalculator() {
            const teamSizeInput = document.getElementById('roi-team-size');
            const dailyHoursInput = document.getElementById('roi-daily-hours');
            const avgSalaryInput = document.getElementById('roi-avg-salary');
            
            const teamSizeVal = document.getElementById('roi-team-size-val');
            const dailyHoursVal = document.getElementById('roi-daily-hours-val');
            const avgSalaryVal = document.getElementById('roi-avg-salary-val');
            
            const outMonthlySaved = document.getElementById('roi-monthly-saved');
            const outAnnualSaved = document.getElementById('roi-annual-saved');
            const outHoursFreed = document.getElementById('roi-hours-freed');
            
            if (!teamSizeInput || !dailyHoursInput || !avgSalaryInput) return;

            const formatCurrency = (num) => new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 0 }).format(num);

            function updateCalculator() {
                const teamSize = parseInt(teamSizeInput.value);
                const dailyHours = parseFloat(dailyHoursInput.value);
                const avgSalary = parseInt(avgSalaryInput.value);

                // 更新显示值
                teamSizeVal.innerText = `${teamSize} 人`;
                dailyHoursVal.innerText = `${dailyHours} 小时`;
                avgSalaryVal.innerText = `${formatCurrency(avgSalary)} 元`;

                // 核心计算逻辑 (自动化渗透率设为 80%)
                const automationRate = 0.8;
                const workingDaysPerMonth = 22;
                const standardHoursPerDay = 8;
                
                // 释放时间：人数 * 每天耗时 * 22天 * 80%
                const hoursFreedMonthly = teamSize * dailyHours * workingDaysPerMonth * automationRate;
                
                // 每月节省：(人数 * (每天耗时 / 8小时标准) * 员工月薪) * 80%
                const monthlyCostSaved = teamSize * (dailyHours / standardHoursPerDay) * avgSalary * automationRate;
                
                // 每年节省
                const annualCostSaved = monthlyCostSaved * 12;

                // 动画更新 DOM (使用平滑计数或直接更新)
                outMonthlySaved.innerText = formatCurrency(monthlyCostSaved);
                outAnnualSaved.innerText = formatCurrency(annualCostSaved);
                outHoursFreed.innerText = formatCurrency(hoursFreedMonthly);
                
                // 触发一个极简的颜色闪烁特效
                outMonthlySaved.classList.add('scale-105', 'opacity-80');
                setTimeout(() => outMonthlySaved.classList.remove('scale-105', 'opacity-80'), 150);
            }

            // 监听事件
            teamSizeInput.addEventListener('input', updateCalculator);
            dailyHoursInput.addEventListener('input', updateCalculator);
            avgSalaryInput.addEventListener('input', updateCalculator);
            
            // 初始化计算一次
            updateCalculator();
        }
        
        // 挂载到 DOMContentLoaded
        document.addEventListener('DOMContentLoaded', initROICalculator);

    