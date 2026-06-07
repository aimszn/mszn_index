
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

// ============================================
// 麻升智能工作室 - 案例与解决方案
// 案例过滤、方案切换、仪表盘图表、详情数据
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    if (window.loadPartials) {
        await window.loadPartials();
    }
    // 交付案例过滤逻辑
    const filterBtns = document.querySelectorAll('#case-filters .filter-btn');
    const caseCards = document.querySelectorAll('#case-grid .case-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 样式切换
            filterBtns.forEach(b => {
                b.classList.remove('border-purple-500/50', 'bg-purple-500/20', 'text-white');
                b.classList.add('border-slate-700', 'bg-slate-800', 'text-slate-400');
            });
            btn.classList.remove('border-slate-700', 'bg-slate-800', 'text-slate-400');
            btn.classList.add('border-purple-500/50', 'bg-purple-500/20', 'text-white');

            // 过滤卡片
            const filter = btn.getAttribute('data-filter');
            caseCards.forEach(card => {
                if(card.filterTimeout) clearTimeout(card.filterTimeout);
                if(filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    void card.offsetWidth; // Force reflow
                    card.style.opacity = '1';
                } else {
                    card.style.opacity = '0';
                    card.filterTimeout = setTimeout(() => card.style.display = 'none', 300);
                }
            });
        });
    });
    // 行业方案逻辑
    const generateNode = (text, color, icon = '') => `
        <div class="relative group z-10">
            <div class="absolute -inset-1 bg-${color}-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div class="bg-slate-900 border border-${color}-500/50 px-4 py-2 rounded-lg text-${color}-400 relative flex items-center gap-2 text-xs font-bold shadow-lg">
                ${icon} ${text}
            </div>
        </div>
    `;
    const vLine = `<div class="h-6 border-l-2 border-dashed border-slate-600 relative"><div class="absolute -top-1 -left-1 w-2 h-2 bg-slate-400 rounded-full animate-ping opacity-50"></div></div>`;

    const solutionsData = {
        'ecommerce': {
            title: '跨境电商全链路 AI 引擎',
            desc: '打破语言壁垒与时差限制，实现从获客、售后到履约的全自动化流转。',
            pains: ['多语种客服人力成本高，响应慢', '跨国物流状态追踪异常排查繁琐', '多平台商品上架文案撰写耗时'],
            solutions: ['部署多语种独立站客服智能体 (支持 50+ 语言)', 'n8n 接管 Shopify 订单流与物流预警', '结合 RAG 批量生成本土化营销文案'],
            roiMultiplier: 0.35,
            defaultEmp: 5,
            defaultSal: 8000,
            color: 'blue',
            diagram: `
                <div class="flex flex-col items-center justify-center w-full h-full gap-2">
                    ${generateNode('独立站访客 / Shopify', 'blue', '<span class="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>')}
                    ${vLine}
                    ${generateNode('智能意图路由 (Dify)', 'purple', '<svg class="w-3 h-3 animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10" stroke-width="2" stroke-dasharray="16 16"/></svg>')}
                    <div class="flex w-48 justify-between border-t-2 border-dashed border-slate-600 pt-6 mt-1 relative">
                        <div class="absolute -top-[2px] left-1/2 -translate-x-1/2 h-6 border-l-2 border-dashed border-slate-600"></div>
                        <div class="absolute top-0 left-0 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping opacity-60"></div>
                        <div class="absolute top-0 right-0 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping opacity-60" style="animation-delay: 0.5s"></div>
                        ${generateNode('RAG 知识库', 'pink')}
                        ${generateNode('n8n 物流引擎', 'cyan')}
                    </div>
                </div>
            `
        },
        'manufacturing': {
            title: '智能制造与供应链 AI 大脑',
            desc: '打通排产、质检与仓储环节，降低人为失误，提升设备利用率。',
            pains: ['纸质工单流转慢，易丢失或出错', '人工质检标准不一，漏检率高', '供应链上下游信息协同滞后'],
            solutions: ['工单自动 OCR 识别与 ERP 录入', '机器视觉结合大模型进行微小瑕疵判定', '自动汇总供应商邮件生成排产预警'],
            roiMultiplier: 0.45,
            defaultEmp: 12,
            defaultSal: 7000,
            color: 'emerald',
            diagram: `
                <div class="flex flex-col items-center justify-center w-full h-full gap-2">
                    ${generateNode('产线传感器 / 摄像头', 'emerald', '<span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>')}
                    ${vLine}
                    ${generateNode('视觉大模型瑕疵判定', 'amber', '👁️')}
                    ${vLine}
                    ${generateNode('ERP 自动录入 & 排产预警', 'blue', '⚙️')}
                </div>
            `
        },
        'enterprise': {
            title: '政企与金融级私有化 AI 专家',
            desc: '在确保数据不出域的前提下，赋能知识密集型岗位，打造全天候业务专家。',
            pains: ['内部规章制度多，新人培训成本极高', '政策文件解读耗时，且易出现偏差', '数据隐私要求高，无法使用公有云服务'],
            solutions: ['本地化部署企业私有大模型与知识库', '秒级检索并解读万字长文/财报/政策', '合规性自动审查与风险预警提示'],
            roiMultiplier: 0.25,
            defaultEmp: 8,
            defaultSal: 12000,
            color: 'amber',
            diagram: `
                <div class="flex flex-col items-center justify-center w-full h-full gap-2">
                    <div class="flex gap-4">
                        ${generateNode('内部规章', 'slate')}
                        ${generateNode('行业政策', 'slate')}
                    </div>
                    ${vLine}
                    ${generateNode('私有化向量库 (Vector DB)', 'amber', '🗄️')}
                    ${vLine}
                    ${generateNode('本地私有大模型 (Local LLM)', 'purple', '🧠')}
                    ${vLine}
                    ${generateNode('合规审查 / 专家问答', 'cyan', '🛡️')}
                </div>
            `
        },
        'media': {
            title: '自媒体与内容工厂爆款流水线',
            desc: '10 倍速放大创作者产能，从选题、文案、分发全自动一条龙。',
            pains: ['爆款选题极度依赖个人网感，不稳定', '多平台图文/短视频脚本产出效率低', '评论区互动少，难以形成私域转化'],
            solutions: ['24 小时监控对标账号，自动抓取热门选题', '一键生成符合多平台调性的脚本文案', '智能体接管评论区，根据人设自动回复'],
            roiMultiplier: 0.60,
            defaultEmp: 3,
            defaultSal: 9000,
            color: 'pink',
            diagram: `
                <div class="flex flex-col items-center justify-center w-full h-full gap-2">
                    ${generateNode('全网热点 / 竞品数据', 'pink', '🔥')}
                    ${vLine}
                    ${generateNode('AI 选题引擎 & 文案生成', 'purple', '✨')}
                    <div class="flex w-48 justify-between border-t-2 border-dashed border-slate-600 pt-6 mt-1 relative">
                        <div class="absolute -top-[2px] left-1/2 -translate-x-1/2 h-6 border-l-2 border-dashed border-slate-600"></div>
                        <div class="absolute top-0 left-0 w-1.5 h-1.5 bg-red-400 rounded-full animate-ping opacity-60"></div>
                        <div class="absolute top-0 right-0 w-1.5 h-1.5 bg-slate-400 rounded-full animate-ping opacity-60" style="animation-delay: 0.5s"></div>
                        ${generateNode('小红书图文', 'red')}
                        ${generateNode('抖音脚本', 'slate')}
                    </div>
                </div>
            `
        },
        'campus': {
            title: '个人学术科研 Copilot',
            desc: '文献阅读效率飙升 10x，为你打造无死角的专属私教答疑。',
            pains: ['英文前沿文献阅读低效，抓不住重点', '缺乏专属导师针对性答疑解惑', '学术论文翻译、排版和润色繁琐耗时'],
            solutions: ['一键上传海量 PDF 与教材，自动总结摘要', '教育级 RAG 模型 (苏格拉底式追问)', '无缝联动飞书/Notion 自动整理结构化笔记'],
            roiMultiplier: 0.80,
            defaultEmp: 1,
            defaultSal: 3000,
            color: 'indigo',
            diagram: `
                <div class="flex flex-col items-center justify-center w-full h-full gap-2">
                    ${generateNode('海量英文论文 / PDF', 'indigo', '📄')}
                    ${vLine}
                    ${generateNode('教育级 RAG 引擎', 'cyan', '🤖')}
                    ${vLine}
                    ${generateNode('飞书/Notion 自动笔记', 'blue', '📝')}
                </div>
            `
        },
        'localstore': {
            title: '同城实体门店拓客雷达',
            desc: '私域复购转化率飙升 40%，打造本地生活智能化中控台。',
            pains: ['群发营销消息枯燥，极易被客户拉黑', '大众点评/美团差评难以及时监控回防', '探店软文、朋友圈素材撰写成本高'],
            solutions: ['微信/点评全渠道触点统一接入与自动回复', '自动化中控台实现精准客户打标', '千人千面私域自动触达，生成个性化话术'],
            roiMultiplier: 0.40,
            defaultEmp: 2,
            defaultSal: 5000,
            color: 'orange',
            diagram: `
                <div class="flex flex-col items-center justify-center w-full h-full gap-2">
                    <div class="flex gap-4">
                        ${generateNode('微信私域', 'green', '💬')}
                        ${generateNode('美团点评', 'yellow', '⭐')}
                    </div>
                    <div class="h-4 border-l-2 border-dashed border-slate-600 relative"></div>
                    ${generateNode('门店智能中控台 (Agent)', 'purple', '🧠')}
                    <div class="h-4 border-l-2 border-dashed border-slate-600 relative"></div>
                    <div class="flex gap-4">
                        ${generateNode('自动打标', 'slate')}
                        ${generateNode('高情商回评', 'slate')}
                    </div>
                </div>
            `
        },
        'office': {
            title: '职场超级办公助手',
            desc: '周报撰写耗时压缩至 1 分钟，强力抹除 80% 枯燥系统劳动。',
            pains: ['深陷每周写周报、做 PPT 等重复粘贴泥沼', '跨部门、多维度的表格数据统计极易出错', '会议与待办等海量碎片信息难以沉淀'],
            solutions: ['会议录音一键转写、提炼核心结论与待办流转', '个人云端大脑 (大模型 + n8n 工作流)', '一键分析数据并生成排版精美的 PPT/Excel'],
            roiMultiplier: 0.80,
            defaultEmp: 1,
            defaultSal: 10000,
            color: 'purple',
            diagram: `
                <div class="flex flex-col items-center justify-center w-full h-full gap-2">
                    ${generateNode('会议录音 / 碎片备忘录', 'purple', '🎙️')}
                    ${vLine}
                    ${generateNode('个人云端大脑 (LLM + n8n)', 'pink', '🧠')}
                    <div class="flex w-48 justify-between border-t-2 border-dashed border-slate-600 pt-6 mt-1 relative">
                        <div class="absolute -top-[2px] left-1/2 -translate-x-1/2 h-6 border-l-2 border-dashed border-slate-600"></div>
                        <div class="absolute top-0 left-0 w-1.5 h-1.5 bg-green-400 rounded-full animate-ping opacity-60"></div>
                        <div class="absolute top-0 right-0 w-1.5 h-1.5 bg-orange-400 rounded-full animate-ping opacity-60" style="animation-delay: 0.5s"></div>
                        ${generateNode('Excel 报表', 'green', '📊')}
                        ${generateNode('精美 PPT', 'orange', '📑')}
                    </div>
                </div>
            `
        }
    };

    const solTabs = document.querySelectorAll('.sol-tab-btn');
    const solTitle = document.getElementById('sol-title');
    const solDesc = document.getElementById('sol-desc');
    const solPainList = document.getElementById('sol-pain-list');
    const solSolutionList = document.getElementById('sol-solution-list');
    const solBgGlow = document.getElementById('sol-bg-glow');
    
    const solRoiEmp = document.getElementById('sol-roi-emp');
    const solRoiEmpVal = document.getElementById('sol-roi-emp-val');
    const solRoiSal = document.getElementById('sol-roi-sal');
    const solRoiSalVal = document.getElementById('sol-roi-sal-val');
    const solRoiResult = document.getElementById('sol-roi-result');
    const solRoiMultiplier = document.getElementById('sol-roi-multiplier');
    const solDiagram = document.getElementById('sol-diagram');

    let currentSolKey = '';

    function formatCurrency(val) {
        return new Intl.NumberFormat('zh-CN').format(val);
    }

    function updateSolROI() {
        if(!solRoiEmp || !solRoiSal) return;
        const emps = parseInt(solRoiEmp.value);
        const sal = parseInt(solRoiSal.value);
        const data = solutionsData[currentSolKey || 'ecommerce'];
        if(!data) return;
        solRoiEmpVal.textContent = emps + ' 人';
        solRoiSalVal.textContent = formatCurrency(sal);
        solRoiMultiplier.textContent = (data.roiMultiplier * 100) + '%';
        
        const savings = emps * sal * 12 * data.roiMultiplier;
        solRoiResult.textContent = '¥ ' + formatCurrency(Math.round(savings));
    }

    if(solRoiEmp && solRoiSal) {
        solRoiEmp.addEventListener('input', updateSolROI);
        solRoiSal.addEventListener('input', updateSolROI);
    }

    function hydrateSolution(key) {
        if(key === currentSolKey) return;
        currentSolKey = key;
        const data = solutionsData[key];
        if(!data) return;

        solTabs.forEach(t => {
            t.className = 'sol-tab-btn w-full text-left px-6 py-4 rounded-2xl border border-slate-700/50 bg-slate-800/30 text-slate-400 hover:text-white hover:border-blue-400/30 hover:bg-slate-800/80 font-bold transition-all duration-300 relative overflow-hidden group hover:translate-x-1';
        });
        
        const activeTab = document.querySelector(`.sol-tab-btn[data-sol="${key}"]`);
        if(activeTab) {
            activeTab.className = `sol-tab-btn active w-full text-left px-6 py-4 rounded-2xl border border-${data.color}-500/50 bg-gradient-to-r from-${data.color}-500/20 to-transparent text-white font-bold transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.05)] border-l-4 border-l-${data.color}-500 relative overflow-hidden group scale-[1.02]`;
        }

        const contentWrap = document.getElementById('solution-content');
        if(!contentWrap) return;

        contentWrap.style.opacity = '0';
        contentWrap.style.transform = 'translateY(10px)';
        
        if(solBgGlow) {
            solBgGlow.className = `absolute -top-32 -right-32 w-64 h-64 blur-[80px] pointer-events-none transition-colors duration-500 bg-${data.color}-500/20`;
        }

        setTimeout(() => {
            if(solTitle) solTitle.textContent = data.title;
            if(solDesc) solDesc.textContent = data.desc;
            
            if(solPainList) {
                solPainList.innerHTML = data.pains.map(p => `<li class="flex gap-2"><span class="text-red-500/50">🔴</span> ${p}</li>`).join('');
            }
            
            if(solSolutionList) {
                solSolutionList.innerHTML = data.solutions.map(s => `<li class="flex gap-2 items-start"><span class="text-emerald-400">✅</span> ${s}</li>`).join('');
            }

            if(solRoiEmp && solRoiSal) {
                solRoiEmp.value = data.defaultEmp;
                solRoiSal.value = data.defaultSal;
                updateSolROI();
            }
            
            if (solDiagram && data.diagram) {
                solDiagram.innerHTML = data.diagram;
            }

            contentWrap.style.opacity = '1';
            contentWrap.style.transform = 'translateY(0)';
        }, 300);
    }

    solTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            hydrateSolution(tab.getAttribute('data-sol'));
        });
    });
    
    // Initial Hydration
    hydrateSolution('ecommerce');
    // ======================= AI 兵器谱 (Sandbox) 逻辑 =======================
    const arsenalData = {
// ================= marketing =================
'seo': { category: 'marketing', tag: '🔥 必玩爆款', title: 'SEO 爆款文案生成器', icon: '📝', endpoint: 'MSZN_API_CONFIG.dify.keys.seoAgent', desc: '输入您的产品关键词、目标人群或竞品链接，我将调用 Dify API 生成高质量软文。', placeholder: '输入测试内容，例如：降噪耳机，目标受众大学生', mockResult: `【爆款标题】预算500内！这副降噪耳机让宿舍秒变图书馆🔇

【正文】
家人们谁懂啊！最近在宿舍复习考研，室友打游戏的声音简直让人抓狂😫。
直到挖到这款平价宝藏降噪耳机，戴上它瞬间世界都安静了！...` },
'media': { category: 'marketing', tag: '🔥 必玩爆款', title: '爆款短视频脚本生成', icon: '📱', endpoint: 'MSZN_API_CONFIG.n8n.endpoints.mediaGen', desc: '输入主题，自动获取全网爆款模型并生成符合黄金3秒规律的口播脚本。', placeholder: '输入主题，例如：职场新人如何高效使用 AI 工具', mockResult: `🎬 【场景设定】：办公室工位，主播略带疲惫但眼神放光。
⏰ 【时长控制】：约 45 秒

【黄金三秒（抓眼球）】：
"天天加到晚上十点，旁边实习生到点就走，关键他业绩还比你高！今天教你3个神仙AI工具..."

【痛点放大】：
"别再傻傻用传统方法写PPT了..."` },
'moments': { category: 'marketing', tag: '⚡ 零代码', title: '销冠朋友圈文案', icon: '💬', endpoint: 'MSZN_API_CONFIG.dify.keys.momentsAgent', desc: '输入简单的产品卖点，我会自动模仿“销售销冠”的语气，生成抓眼球的朋友圈文案。', placeholder: '输入卖点：新上的胶原蛋白面膜，补水好，买一送一', mockResult: `🔥 熬夜党们给我闭眼入！！！
昨天加班到凌晨两点，睡前敷了一片新上的【发光胶原蛋白面膜】
今早一看，绝了！！脸蛋简直像剥了壳的鸡蛋🥚✨

💦 巨补水！巨服帖！
🎁 今天老板疯了：直接【买1送1】！限量前50名手慢无！` },
'localstore': { category: 'marketing', tag: '🤖 智能客服', title: '街边小店获客雷达', icon: '🏪', endpoint: 'MSZN_API_CONFIG.n8n.endpoints.storeRadar', desc: '模拟收到一条美团/点评的三星中评，我将生成高情商回复并顺势将其引流至微信私域。', placeholder: '模拟客户点评：味道还行，就是今天排队太久了。', mockResult: `【差评/中评拦截 & 高情商回复生成】

"亲爱的小主，真的非常抱歉让您久等了！😭 今天生意太火爆，没能给您最完美的体验是我们的失职。下次您来之前，可以提前加店长微信（xxxx），帮您预留免排队神仙座位！另外加微信备注[点评]，送您一份隐藏甜点尝鲜~ 🍰"` },
'xiaohongshu': { category: 'marketing', tag: '📈 流量密码', title: '小红书高赞种草机', icon: '📕', endpoint: 'MSZN_API_CONFIG.dify.keys.xhsAgent', desc: '解析小红书最新流量算法，根据您的产品图片/卖点一键生成图文排版指导与文案。', placeholder: '输入产品：无糖黑咖啡，减脂期喝。', mockResult: `✨【封面建议】：怼脸拍咖啡液倒在冰块上的瞬间，加上大字报“掉秤神仙水”。

【正文】：
减脂期的姐妹们听劝！不要再盲目节食了！🙅‍♀️
每天早上空腹来一杯【XXX无糖黑咖】☕️，去水肿还能加快代谢！关键是完全不酸不涩，就像在喝手冲！✅
#减脂咖啡 #减脂好物 #打工人的续命水` },
'livestream': { category: 'marketing', tag: '🎙️ 自动控场', title: '直播间逼单话术引擎', icon: '🎤', endpoint: 'MSZN_API_CONFIG.dify.keys.liveAgent', desc: '根据当前在线人数和商品剩余库存，实时动态生成主播逼单话术。', placeholder: '输入当前状态：在线5000人，爆款库存仅剩200单。', mockResult: `【紧急逼单话术（高昂语气）】
"直播间现在的5000位家人们，你们赚到了！刚刚运营告诉我，后台这个机制只能再挂最后3分钟！现在库存只剩下最后200单，抢完直接下架，绝不补货！想要的家人，左下角一号链接，准备好了吗？3、2、1，给我上车！！🚀"` },
'community': { category: 'marketing', tag: '👥 自动化', title: '私域社群自动促活助手', icon: '🎪', endpoint: 'MSZN_API_CONFIG.n8n.endpoints.community', desc: '每日定时抓取行业热点，自动润色后发送至企业微信核心客户群，带动群内讨论。', placeholder: '触发机制：模拟每日早晨9点发送早报。', mockResult: `【群发促活（已推送至32个核心群）】

☀️ 家人们早安！
昨晚 AI 圈又发生了一件大事：OpenAI 宣布了最新的价格下调策略！📉

🤔 这对我们做内容变现的兄弟们来说，意味着成本直接砍半。大家今天打算怎么调整自己的业务流？欢迎在群里聊聊，等下我会挑一个最棒的点子发专属大红包！🧧` },
'edm': { category: 'marketing', tag: '📧 增长黑客', title: '邮件营销 AB 测试引擎', icon: '✉️', endpoint: 'MSZN_API_CONFIG.n8n.endpoints.edm', desc: '针对出海客户，自动生成两个版本的不同风格的 EDM 邮件标题与正文进行 A/B Test。', placeholder: '目标：向欧美客户推送 SaaS 黑五大促。', mockResult: `【A 版本 (理性数据驱动)】
Title: Reduce Your API Costs by 40% This Black Friday 📉
Body: Discover how top companies are optimizing their workflows...

【B 版本 (感性紧迫驱动)】
Title: 🚨 Unlock Our Biggest Deal of the Year (48 Hours Only)
Body: Hey! You wouldn't want to miss our exclusive Black Friday offer...` },
'wechat': { category: 'marketing', tag: '🕵️ 竞品监控', title: '公众号竞品追踪雷达', icon: '👀', endpoint: 'MSZN_API_CONFIG.n8n.endpoints.wechatRadar', desc: '监控竞争对手公众号，只要对方发文，立刻用大模型总结核心策略并推送到您的微信。', placeholder: '输入竞品公众号名称：某知名营销大号', mockResult: `【竞品发文告警】
🚨 监控对象 [某知名营销大号] 刚发布了新文章《2024私域最新玩法》。

📊 【AI 秒级分析】：
该文章的核心策略是利用“数字人+本地生活”进行双重引流。他们在文末放了一个诱饵资料包。我们建议今晚我方账号可以发布一篇针对性的“拆解该玩法”的深度文章来截流。` },

// ================= data =================
'data_insight': { category: 'data', tag: '🛠️ 高级工作流', title: '销售数据深度洞察', icon: '📊', endpoint: 'MSZN_API_CONFIG.n8n.endpoints.workflowDemo', desc: '粘贴销售流水数据，触发 n8n 多个智能体进行交叉分析。', placeholder: '分析一下上个月华东区客单价下降的原因。', mockResult: `正在执行 n8n Workflow...
[Agent 1] 已完成数据清洗，发现异常节点：5月12日-15日。
[Agent 2] 关联天气API，发现该时段华东区连续暴雨。
[结论] 客单价下降并非产品问题，而是极端天气导致线下高净值客户流失，建议在此类天气触发线上促销机制。` },
'manufacturing': { category: 'data', tag: '⚠️ 视觉感知', title: '供应链异常预警', icon: '⚙️', endpoint: 'MSZN_API_CONFIG.dify.keys.manufacturingAgent', desc: '输入模拟的生产线传感器数据或库存余量，联动大模型判断是否存在产能风险。', placeholder: '输入：A产线机器温度持续在85度以上超过3小时', mockResult: `⚠️ 【高优先级预警触发】

[A产线分析]：85度已超过安全阈值，结合历史数据，主轴电机可能将在 24 小时内发生卡死故障。已自动生成报修工单推给设备部。` },
'refund': { category: 'data', tag: '💰 智能止损', title: '财务退款异常侦测', icon: '💸', endpoint: 'MSZN_API_CONFIG.n8n.endpoints.refundGuard', desc: '对接支付网关流水，利用 AI 判断是否存在恶意薅羊毛或异常大额退款。', placeholder: '模拟流水：同一IP在凌晨2点发起了15笔仅退款请求。', mockResult: `🛑 【高危退款拦截】
侦测到 IP (192.168.x.x) 在非营业时间发起高频“仅退款”。

【AI 防御动作】：
1. 已自动熔断该账号的退款权限通道。
2. 冻结关联优惠券核销。
3. 已通过企微将恶意订单明细发送至风控总监。` },
'price_crawler': { category: 'data', tag: '🕷️ 数据挖掘', title: '竞品价格动态爬虫', icon: '🏷️', endpoint: 'MSZN_API_CONFIG.n8n.endpoints.priceSpider', desc: '监控全网电商平台，当指定竞品的 SKU 价格低于安全线时，自动输出价格战应对策略。', placeholder: '目标竞品：X品牌护肤套装', mockResult: `【竞品价格变动】
监测到 X 品牌在京东将套装价格下调至 299 元（破价）。

💡 【AI 价格战建议】：
不要直接降价跟进。建议利用我们的供应链优势，推出 329 元但加赠“洁面+面膜”的组合装（实际成本增加仅8元），在感知价值上彻底压制对手。` },
'funnel': { category: 'data', tag: '📉 漏斗分析', title: '用户留存漏斗诊断', icon: '🕳️', endpoint: 'MSZN_API_CONFIG.dify.keys.funnelAgent', desc: '输入简单的日活与留存率变化趋势，AI自动诊断流失节点并给出产研建议。', placeholder: '数据：注册到首次登录转化率 80%，但次日留存骤降到 15%。', mockResult: `【留存诊断报告】
次日留存发生断崖式下跌 (80% -> 15%)，说明用户在“初次体验期”未感受到核心价值（Aha Moment）。

🔧 【产研改进建议】：
1. 检查注册后的新手引导弹窗是否过于繁琐，建议精简至3步以内。
2. 新注册用户立即赠送 7 天 VIP 体验卡，强制用户体验高阶功能。` },
'roi': { category: 'data', tag: '🎯 精准投放', title: '投放 ROI 智能归因', icon: '📈', endpoint: 'MSZN_API_CONFIG.n8n.endpoints.roiCalc', desc: '混合头条、广点通、百度的数据报表，自动清洗并计算出最真实的各渠道投资回报率。', placeholder: '输入三个渠道的模糊 ROI 报表数据。', mockResult: `【跨渠道 ROI 深度清洗】

虽然百度账面 ROI 高达 1:3，但通过归因模型发现，其中 60% 是被头条短视频种草后去百度搜索的品牌词自然量。

📊 【真实 ROI 还原】：
头条实际 ROI：1:2.8 （建议增加 30% 预算）
百度实际 ROI：1:1.2 （建议削减品牌词外包投放）` },
'heatmap': { category: 'data', tag: '🗺️ 空间感知', title: '门店客流热力图解读', icon: '🚶', endpoint: 'MSZN_API_CONFIG.dify.keys.heatmapAgent', desc: '上传实体门店的高空监控热力图，AI 视觉模型自动帮您分析动线并优化商品陈列。', placeholder: '模拟上传：便利店监控热力图。', mockResult: `【动线视觉分析】
👀 发现异常：收银台右侧的“高毛利零食区”呈现冷色（蓝色），说明顾客进店后直接走向了左侧冷饮区。

🛒 【陈列调整策略】：
将最受欢迎的冷饮柜向右深处移动 3 米，强迫顾客的动线穿越零食区，预计可提升 12% 的连带购买率。` },
'report': { category: 'data', tag: '📄 文档提炼', title: '行业财报关键数据提取', icon: '📰', endpoint: 'MSZN_API_CONFIG.dify.keys.financeAgent', desc: '上传数百页的 PDF 财报，立刻提取营收、净利、研发投入等核心指标并生成简报。', placeholder: '目标：提取某大厂Q3财报核心数据。', mockResult: `【Q3 财报核心抽取】

1. 营收：同比大增 45%（主要归功于云服务版块爆发）。
2. 研发占比：提升至 22%，重点提及了“大模型算力基础设施建设”。
3. 隐患提示：广告业务环比下降 3%，可能受到宏观经济复苏疲软影响。

（生成耗时：3.2秒，原文档共 214 页）` },
'inventory': { category: 'data', tag: '📦 智能供应链', title: '跨平台智能调拨中枢', icon: '🔄', endpoint: 'MSZN_API_CONFIG.n8n.endpoints.inventory', desc: '统筹天猫、京东、拼多多多仓库存，通过销量预测大模型自动生成调拨指令单。', placeholder: '输入各平台库存和近期日均销量。', mockResult: `【智能调拨指令已生成】

计算到京东仓的爆款 SKU-A 库存将在 2 天后枯竭（618 流量爆发预报）。

已自动生成 WMS 调拨单：
将天猫华南仓的 5000 件存货加急调往京东华东大仓，预计节省 14 万的断货损失成本。` },

// ================= efficiency =================
'cs': { category: 'efficiency', tag: '⚡ 零代码', title: '高情商私域客服', icon: '🎧', endpoint: 'MSZN_API_CONFIG.dify.keys.customerService', desc: '基于知识库，演示如何带有温度地安抚客户投诉。', placeholder: '客户：你们这破物流怎么那么慢！', mockResult: `【AI 回复】
亲爱的宝子，真的非常抱歉让您久等了！🙏 
我刚查了一下，因为爆单加上天气原因，仓库哥哥们正在通宵打包📦。
为了表达歉意，我刚为您申请了一张10元无门槛优惠券，请您喝杯奶茶消消气哦~ 🥤` },
'campus': { category: 'efficiency', tag: '🎓 RAG引擎', title: '学术论文提炼助手', icon: '🎓', endpoint: 'MSZN_API_CONFIG.dify.keys.campusAgent', desc: '基于教育级 RAG 模型提取 PDF 核心观点并开启苏格拉底式追问。', placeholder: '输入一段复杂的英文学术摘要', mockResult: `【摘要提炼】该论文提出了一种新型大模型剪枝算法，能降低 30% 显存消耗。

【苏格拉底式追问🤔】
1. 这个算法与传统权重剪枝相比，最大创新点在哪？
2. 如果应用在边缘设备上，算力瓶颈解决了吗？` },
'office': { category: 'efficiency', tag: '⚡ 零代码', title: '会议纪要与待办流转', icon: '💼', endpoint: 'MSZN_API_CONFIG.n8n.endpoints.officeHook', desc: '粘贴杂乱会议录音，自动排版提炼并生成飞书/钉钉待办事项。', placeholder: '粘贴会议记录：老王前端周三搞定，小李给客户报价...', mockResult: `【待办事项拆解 (已同步至飞书)】
✅ [研发部-老王]：周三前完成前端开发。(高)
✅ [销售部-小李]：发送最新报价单。(中)` },
'legal': { category: 'efficiency', tag: '⚖️ 风险识别', title: '法务合同风险高亮器', icon: '📜', endpoint: 'MSZN_API_CONFIG.dify.keys.legalAgent', desc: '上传商务合同文本，AI 自动扫描并高亮出对己方不利的违约条款、管辖权条款。', placeholder: '上传合作协议草案...', mockResult: `🚨 【发现 2 处重大法律风险】

1. 管辖权争议 (第 8.2 条)：
原意为“发生争议由甲方所在地法院管辖”。
建议修改为：“由原告所在地或合同履行地法院管辖”，以避免我方异地诉讼的超高成本。

2. 违约金过高 (第 5.1 条)：
违约金比例高达合同总额 30%，超过法律支持的 30% 实际损失上限，建议下调至 20%。` },
'translate': { category: 'efficiency', tag: '🌍 跨国协同', title: '跨语言实时同传会议', icon: '🗣️', endpoint: 'MSZN_API_CONFIG.n8n.endpoints.translate', desc: '接入跨国会议音频流，实时进行双语互译并自动总结各方核心述求。', placeholder: '模拟：输入一段带中东口音的英语会议片段。', mockResult: `【实时同传】
客户(迪拜)："We need the prototype by next Monday, the budget is slightly flexible."
翻译："我们需要下周一看到原型，预算方面有一定弹性。"

📝 【AI 会议纪要】：
中东客户对时间极其敏感（底线是下周一），但对价格不敏感。建议我方优先保障交付周期，并在报价上适当上浮 10% 覆盖加急成本。` },
'bidding': { category: 'efficiency', tag: '📑 文案组装', title: '招投标书一键生成与校验', icon: '📁', endpoint: 'MSZN_API_CONFIG.dify.keys.biddingAgent', desc: '读取甲方招标文件（废标条款），根据公司历史标书库自动组装并进行废标排雷。', placeholder: '输入甲方资质要求：必须具备 ISO9001 认证且盖公章。', mockResult: `✅ 【标书已初步组装】（共 182 页）

🛑 【废标风险拦截测试】：
扫描发现：在第 45 页的《资质证明附件》中，检测到上传的 ISO9001 扫描件为【黑白复印件】且【未见红色公章】！
警告：这极其容易触发废标条款！请立即替换为加盖红章的原件扫描件。` },
'compensation': { category: 'efficiency', tag: '💰 智能理赔', title: '差评自动定损与快速赔付', icon: '🤝', endpoint: 'MSZN_API_CONFIG.n8n.endpoints.autoComp', desc: '识别电商平台的中差评，结合商品价值和客户等级，自动决定是否触发秒赔/补发流程。', placeholder: '买家反馈：水果收到坏了两个，太坑了。', mockResult: `【定损与理赔执行】
识别到客诉：坏果 (数量:2)。客单价较低，且该客户为 4 星优质老客。

🤖 【执行动作】：
绕过人工客服审核，直接触发 n8n 调用支付宝企业打款 API，向客户退回 8 元，并附带高情商致歉短信，成功拦截潜在差评。` },
'sop': { category: 'efficiency', tag: '🗺️ 架构可视化', title: '业务 SOP 流程图渲染引擎', icon: '📊', endpoint: 'MSZN_API_CONFIG.dify.keys.sopAgent', desc: '用大白话输入您的业务流程，AI 将自动将其转化为专业的 Mermaid 流程图代码。', placeholder: '描述：客户扫码，没填表就提醒，填了就推给销售。', mockResult: `【SOP 架构图已生成】
\`\`\`mermaid
graph TD
A[客户扫码] --> B{是否填写表单?}
B -- 否 --> C[发送三次召回提醒]
B -- 是 --> D[数据打标清洗]
D --> E[飞书推送至对应的销售组]
\`\`\`
(点击右侧按钮可直接预览该业务流的可视化蓝图)` },
'email_sort': { category: 'efficiency', tag: '🗂️ 智能分类', title: 'VIP 客户邮件智能分类', icon: '📨', endpoint: 'MSZN_API_CONFIG.n8n.endpoints.emailSort', desc: '接管企业邮箱，通过语义分析将询盘、客诉、垃圾邮件精准分类并打标签。', placeholder: '新邮件：Product is totally broken and my boss is furious!', mockResult: `【邮件智能路由】
情绪识别：极度愤怒 🧨
意图识别：严重客诉 / 退款
发件人分析：企业域 (@bigcorp.com) -> VIP 客户

➡️ 【路由动作】：
标记为 [P0 紧急]，跳过一线客服，直接转发给客户成功总监，并触发钉钉电话强提醒。` },

// ================= hr =================
'mood': { category: 'hr', tag: '❤️ 情感关怀', title: '员工情绪与离职预警', icon: '🎭', endpoint: 'MSZN_API_CONFIG.n8n.endpoints.hrMood', desc: '分析内部通讯工具中的工作强度、请假频率等非敏感脱敏数据，预测离职风险。', placeholder: '某核心骨干最近一个月请了3次半天假，钉钉回复字数变少。', mockResult: `⚠️ 【离职风险预警】
该员工（核心研发岗）近期活跃度模型发生突变，且频繁在周五/周一请假半天（高概率为外出面试）。
离职概率评估：85%

💡 HR 建议动作：
建议业务线主管在本周内安排一次非正式的 1V1 咖啡闲聊，了解其近期项目压力及职级诉求。` },
'okr': { category: 'hr', tag: '🎯 目标管理', title: '千人千面 OKR 拆解助手', icon: '🎯', endpoint: 'MSZN_API_CONFIG.dify.keys.okrAgent', desc: '输入公司年度战略大目标，AI 自动向下拆解到各部门乃至个人的周级别 Key Results。', placeholder: '公司 O：下半年实现营收翻倍 (1000万)。', mockResult: `【OKR 智能拆解矩阵】

🎯 销售部 KR：
- KR1：每月新增高净值线索 500 条。
- KR2：客单价从 2W 提升至 3.5W。

🎯 产研部 KR：
- KR1：在 8 月前上线“尊享版”以支撑高客单价策略。
- KR2：重构 CRM 系统，使线索流转耗时缩短 40%。` },
'interview': { category: 'hr', tag: '🎤 AI 面试官', title: '候选人面试智能评分', icon: '🎙️', endpoint: 'MSZN_API_CONFIG.n8n.endpoints.interview', desc: '基于录音转写，对候选人的回答进行逻辑清晰度、抗压能力、专业匹配度多维打分。', placeholder: '面试录音片段分析...', mockResult: `【候选人 360° 评估报告】

表达逻辑：A- (STAR法则运用熟练，能清晰讲述项目难点)
专业技能：B+ (提及了 Kubernetes 的容灾，但深度追问时稍显犹豫)
文化契合：A (展现出极强的自驱力和对加班的客观认知)

综合建议：强烈推荐进入二面，建议下一轮侧重考察其底层源码级深度。` },
'weekly': { category: 'hr', tag: '📝 自动文秘', title: '高管周报自动汇总生成', icon: '📅', endpoint: 'MSZN_API_CONFIG.dify.keys.weeklyAgent', desc: '自动抓取 Jira、GitLab、CRM 中的客观数据，为团队长生成图文并茂的管理周报。', placeholder: '一键生成本周产研与销售数据周报。', mockResult: `【团队周报自动生成完毕】

📈 核心指标：
- 本周研发交付代码 24,000 行，提测 bug 率下降 2%。
- 销售部录入新客 45 家，成单 3 家。

🚩 需要高管关注的阻塞点：
- CRM 二期项目因为前端人手不足，存在延期 3 天的风险，需要协调资源介入。` },
'culture': { category: 'hr', tag: '🤖 数字人', title: '企业规章答疑数字人', icon: '🏢', endpoint: 'MSZN_API_CONFIG.dify.keys.cultureAgent', desc: '打通公司员工手册与报销制度，新员工有任何鸡毛蒜皮的问题直接问它。', placeholder: '员工问：我晚上打车报销的额度是多少？发票抬头是什么？', mockResult: `【行政答疑 AI】
Hi 同学！晚上加班打车报销政策如下：
⏰ 晚上 21:30 以后下班打车，单程最高可报销 80 元。
🧾 咱们公司的发票抬头是【某某科技有限公司】，税号：91xxxxxxx。
🔗 [点击这里] 可以直接跳转到财务报销系统的填报页面哦！` },
'audit': { category: 'hr', tag: '👮 风控合规', title: '差旅报销违规自动审计', icon: '🧾', endpoint: 'MSZN_API_CONFIG.n8n.endpoints.audit', desc: '利用 OCR 和视觉大模型，自动审核发票截图与行程单是否匹配，防范虚假报销。', placeholder: '审核：一张周六在娱乐场所的发票。', mockResult: `🛑 【报销审核退回】

AI 审计发现异常：
1. 发票开具时间为 [周六晚上 23:00]，非工作时间。
2. 发票开具地点 [XX KTV]，且无对应的事前商务宴请审批单据。

处理结果：已自动退回该流程，并抄送部门主管补充说明。` },
'schedule': { category: 'hr', tag: '⏱️ 智能排班', title: '跨国团队排班引擎', icon: '🌐', endpoint: 'MSZN_API_CONFIG.n8n.endpoints.schedule', desc: '根据各地区员工的时区、当地节假日、病假情况，自动生成无缝衔接的 7x24 排班表。', placeholder: '中美欧三地客服团队排班需求。', mockResult: `【7x24 全球接力排班表】

发现冲突：下周四是美国感恩节，纽约团队集体休假。
AI 智能调整：已自动增加北京团队在夜班时段（北京时间凌晨 2点-8点）的排班密度，并核算了 3 倍夜班津贴，确保全球工单响应 SLA 维持在 5 分钟内。` },
'onboarding': { category: 'hr', tag: '👋 破冰助手', title: '新人入职指引数字人', icon: '🚀', endpoint: 'MSZN_API_CONFIG.dify.keys.onboardAgent', desc: '新人入职第一天，自动推送工位地图、开通各类系统权限，并介绍部门架构。', placeholder: '新员工“小李”今日入职。', mockResult: `🎉 欢迎小李加入麻升智能！

我已经为你准备好了“入职大礼包”：
1. 你的工位在 4 楼 A区 023，旁边是你的导师老张。
2. GitLab 和飞书的高级权限已经由机器人自动为你开通。
3. 下午 3 点我在茶水间为你预定了 15 分钟的部门破冰下午茶。
祝你在第一天玩得开心！` },
'training': { category: 'hr', tag: '📚 智能培训', title: '内部培训考卷自动生成', icon: '📝', endpoint: 'MSZN_API_CONFIG.dify.keys.examAgent', desc: '上传产品说明书，大模型自动生成选择题、判断题，甚至是情景模拟简答题。', placeholder: '上传《最新 V3.0 SaaS 计费规则》', mockResult: `【试卷生成完成】
包含 10 道单选，5 道情景题。

💡 精选情景题抢先看：
“如果老客户在合约期内想要降级套餐，退费金额该如何计算？请列出具体公式并说明安抚话术。”
（支持一键将本试卷推送到飞书培训考试系统）` },

// ================= industry =================
'crossborder': { category: 'industry', tag: '🌐 跨境电商', title: '侵权词排雷与本土化', icon: '🚢', endpoint: 'MSZN_API_CONFIG.dify.keys.crossborder', desc: '扫描亚马逊 Listing，自动剔除潜在侵权商标词，并翻译为地道的俚语。', placeholder: 'Listing 包含 "Velcro" 和 "Frisbee"。', mockResult: `🚨 【侵权风险拦截】
发现危险商标词：
- "Velcro" 是注册商标，极易被起诉！已替换为安全词 "Hook and loop fastener"。
- "Frisbee" 是注册商标，已替换为 "Flying disc"。

🇺🇸 【本土化润色】：文案已调整为更符合北美 Gen-Z 审美的俚语表达。` },
'medical': { category: 'industry', tag: '🏥 大健康', title: '医疗处方前置审核', icon: '💊', endpoint: 'MSZN_API_CONFIG.n8n.endpoints.medical', desc: '结合《药典》知识库，审核互联网医院开具的处方是否存在配伍禁忌。', placeholder: '处方：头孢拉定 + 藿香正气水。', mockResult: `☠️ 【严重配伍禁忌拦截】

警报：藿香正气水含有 40%-50% 乙醇（酒精）。
头孢类药物与酒精相遇会引发严重的【双硫仑样反应】，严重可致死！

拦截动作：处方已被强制驳回，并向开方医生发送高优先级安全弹窗警告。` },
'catering': { category: 'industry', tag: '🍽️ 餐饮零售', title: '后厨浪费与卫生视觉巡检', icon: '🍳', endpoint: 'MSZN_API_CONFIG.dify.keys.catering', desc: '接入后厨摄像头，利用视觉大模型识别员工是否戴口罩，以及泔水桶的浪费异常。', placeholder: '接入 3 号后厨摄像头画面。', mockResult: `【后厨视觉合规报告】

😷 卫生违规：11:32 分，2 号切配岗位员工未正确佩戴口罩（漏出鼻子），已记录并推送到店长。

🗑️ 成本预警：昨日晚市泔水桶倾倒量高出基准线 35%。经识别，大量完整蔬菜边角料被丢弃。建议复盘切配 SOP，预计每月可挽回成本 4000 元。` },
'realestate': { category: 'industry', tag: '🏠 房地产', title: '带看录音智能质检', icon: '🏢', endpoint: 'MSZN_API_CONFIG.n8n.endpoints.realestate', desc: '分析房产中介带看客户时的录音，判断是否充分介绍了核心卖点并逼单。', placeholder: '分析销售“小刘”长达 40 分钟的带看录音。', mockResult: `【带看质检与成交预测】

🎙️ 过程拆解：
- 卖点覆盖度：60%（漏讲了学区政策这一核心优势）。
- 客户意愿：高（客户 3 次主动询问了首付比例和贷款利率）。

🎯 预判：该客户处于极高意向阶段。但由于小刘未讲解学区，客户仍在犹豫。已自动生成跟进话术推给小刘，建议今晚立即回访补充学区信息！` },
'gaming': { category: 'industry', tag: '🎮 游戏互娱', title: '买量素材吸量评分', icon: '👾', endpoint: 'MSZN_API_CONFIG.dify.keys.gaming', desc: '上传短视频买量素材，AI 根据海量游戏爆款模型，预测其点击率并给出修改建议。', placeholder: '上传一段 15 秒的传奇类游戏砍怪视频。', mockResult: `【素材爆率预测】
综合评分：65分 (预计 CTR: 1.2%)

✂️ 优化建议：
1. 前 3 秒缺乏反转，怪物的血条扣减没有带来强烈的“爆装”爽感。
2. 建议在第 5 秒加入“一刀999”配合夸张的金币掉落音效。
3. 结尾诱导下载的 CTA 按钮颜色不够醒目，建议改为高亮动态呼吸灯。` },
'law': { category: 'industry', tag: '⚖️ 法律服务', title: '律所案卷关键要素批量提取', icon: '🏛️', endpoint: 'MSZN_API_CONFIG.n8n.endpoints.law', desc: '读取数百页的判决书或卷宗，瞬间提取原被告、诉求、争议焦点、判决结果，生成简表。', placeholder: '上传一份 30 页的民间借贷纠纷判决书。', mockResult: `【卷宗要素瞬时提取】
原告：张三 | 被告：李四
争议焦点：是否存在合法的借贷关系及利息计算标准。

核心判决：
1. 驳回原告主张的 36% 高额年化利息，仅支持 LPR 的 4 倍（14.8%）。
2. 判定李四需偿还本金 50 万及合法利息。
（本报告一键生成 Excel，助力律师快速梳理类案）` },
'education': { category: 'industry', tag: '📚 教育培训', title: '学员完课率与续费预测', icon: '🎒', endpoint: 'MSZN_API_CONFIG.dify.keys.edu', desc: '分析学员的登录频次、作业提交质量、互动发言，精准找出可能不再续费的高危学员。', placeholder: '分析 Python 零基础进阶班的 200 名学员数据。', mockResult: `【续费流失风险洞察】

🚨 重点预警：学员“王某某”过去两周作业完成度从 90% 降至 20%，且近 3 节直播课仅观看了录播的开头 10 分钟。

流失概率评估：92%
挽回动作：已将该学员分配给资深班主任，并生成了针对性的关怀话术（强调本期难点，并赠送 1V1 辅导课时）。` },
'logistics': { category: 'industry', tag: '🚚 智慧物流', title: '干线物流时效拥堵预测', icon: '🛣️', endpoint: 'MSZN_API_CONFIG.n8n.endpoints.logistics', desc: '融合高速路况 API 与天气数据，提前为货运车队规划避堵和抗冰雪路线。', placeholder: '从广州运往北京的冷链车队即将发车。', mockResult: `【智能路线重构】

🌤️ 天气/路况融合预警：
侦测到京港澳高速途径湖南段今晚将有大暴雪，极易封路导致冷链断链。

🗺️ AI 重新规划：
建议车队改走大广高速绕开降雪中心，虽然增加 120 公里路程，但预计能准时送达，避免 30 万元的生鲜损毁违约金。` },
'agriculture': { category: 'industry', tag: '🌾 智慧农业', title: '病虫害视觉识别与农药配比', icon: '🌱', endpoint: 'MSZN_API_CONFIG.dify.keys.agri', desc: '农户拍照上传叶片，视觉模型秒级识别病虫害种类，并给出精确到毫升的用药指导。', placeholder: '上传一张长满褐色斑点的水稻叶片照片。', mockResult: `【农业专家 AI 诊断】
🔍 确诊结果：稻瘟病（急性型）

🧪 科学用药指导：
当前病害处于爆发初期，建议立即使用 75% 三环唑可湿性粉剂。
您的稻田面积为 50 亩，用药量测算：需购买 1.5 公斤，按 1:1000 比例兑水喷雾。切记在晴天下午 4 点后作业，避开高温！` }
};

let currentArsenal = 'seo';
    const gridContainer = document.getElementById('arsenal-grid');
    const sandboxModal = document.getElementById('sandbox-modal');
    const sandboxModalContent = document.getElementById('sandbox-modal-content');

    // 1. Render Grid dynamically
    function renderArsenalGrid(filterCategory = 'all') {
        if(!gridContainer) return;
        
        const filteredData = Object.entries(arsenalData).filter(([key, data]) => {
            return filterCategory === 'all' || data.category === filterCategory;
        });

        gridContainer.innerHTML = filteredData.map(([key, data]) => `
            <div class="arsenal-card relative group cursor-pointer h-full transition-all duration-500 transform" onclick="openSandbox('${key}')" style="opacity: 0; transform: translateY(20px);">
                <!-- Animated background glow -->
                <div class="absolute -inset-0.5 bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-cyan-500/30 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition duration-700 group-hover:duration-200"></div>
                
                <!--Main Card-->
                <div class="relative h-full bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 group-hover:border-pink-500/50 rounded-3xl p-6 sm:p-8 transition-all duration-300 hover:-translate-y-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden">

                    <!-- Top bar: Icon & Badges -->
                    <div class="flex items-start justify-between mb-6">
                        <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 flex items-center justify-center text-3xl shadow-inner group-hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] group-hover:border-pink-500/40 transition-all duration-300 transform group-hover:scale-110">
                            ${data.icon}
                        </div>
                        <div class="flex flex-col items-end gap-2">
                            <span class="text-xs font-bold px-3 py-1 bg-gradient-to-r from-pink-500/10 to-orange-500/10 rounded-full border border-pink-500/30 text-pink-400 group-hover:bg-pink-500 group-hover:text-white transition-all duration-300 shadow-sm whitespace-nowrap">
                                ${data.tag}
                            </span>
                        </div>
                    </div>

                    <!-- Content -->
                    <h4 class="text-xl font-black text-slate-100 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-pink-200 mb-3 transition-all duration-300 tracking-tight leading-snug">
                        ${data.title}
                    </h4>
                    <p class="text-sm text-slate-400 group-hover:text-slate-300 line-clamp-3 transition-colors leading-relaxed font-medium flex-1">
                        ${data.desc}
                    </p>

                    <!-- Hover Terminal Effect & Action -->
                    <div class="mt-8 relative h-12 overflow-hidden border-t border-slate-800/60 pt-4">
                        <!-- Default Footer -->
                        <div class="absolute inset-0 flex items-center justify-between pt-4 transform transition-transform duration-300 group-hover:-translate-y-full opacity-100 group-hover:opacity-0">
                            <span class="text-[10px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <span class="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                                ${data.endpoint.split('.').pop()}
                            </span>
                            <div class="text-xs text-slate-400 flex items-center gap-1 font-bold">点击体验 <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg></div>
                        </div>
                        <!-- Hover Footer (Terminal) -->
                        <div class="absolute inset-0 flex flex-col justify-center pt-4 transform transition-transform duration-300 translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100">
                            <div class="flex items-center justify-between">
                                <div class="font-mono text-[10px] text-green-400 flex items-center gap-1.5">
                                    <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                    > initializing agent...
                                </div>
                                <div class="px-3 py-1 bg-pink-500 text-white text-xs font-bold rounded shadow-[0_0_10px_rgba(236,72,153,0.5)]">
                                    立即唤醒
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        // Trigger staggered reveal animation
        setTimeout(() => {
            const cards = gridContainer.querySelectorAll('.arsenal-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 50);
            });
        }, 50);
    }

    // Initial render
    renderArsenalGrid();

    // Filter logic
    const arsenalFilterBtns = document.querySelectorAll('.arsenal-filter-btn');
    arsenalFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            arsenalFilterBtns.forEach(b => {
                b.classList.remove('border-pink-500/50', 'bg-pink-500/20', 'text-white', 'shadow-[0_0_15px_rgba(236,72,153,0.3)]');
                b.classList.add('border-slate-700/80', 'bg-slate-800/50', 'text-slate-400');
            });
            btn.classList.remove('border-slate-700/80', 'bg-slate-800/50', 'text-slate-400');
            btn.classList.add('border-pink-500/50', 'bg-pink-500/20', 'text-white', 'shadow-[0_0_15px_rgba(236,72,153,0.3)]');
            
            // Render
            renderArsenalGrid(btn.getAttribute('data-filter'));
        });
    });

    // 2. Global handlers for Modal
    window.openSandbox = function(key) {
        currentArsenal = key;
        const data = arsenalData[key];
        
        const sandboxModal = document.getElementById('sandbox-modal');
        const sandboxModalContent = document.getElementById('sandbox-modal-content');
        const sbTitle = document.getElementById('sandbox-title');
        const sbEndpoint = document.getElementById('sandbox-endpoint');
        const sbOutput = document.getElementById('sandbox-output');
        const sbInput = document.getElementById('sandbox-input');

        if(sbTitle) sbTitle.textContent = data.title;
        if(sbEndpoint) sbEndpoint.textContent = data.endpoint;
        if(sbOutput) {
            sbOutput.innerHTML = `
            <!-- Initial Greeting -->
                <div class="flex items-start gap-4">
                    <div class="w-12 h-12 rounded-xl bg-pink-500/20 border border-pink-500/50 flex items-center justify-center text-2xl shrink-0">${data.icon}</div>
                    <div class="bg-slate-800/80 border border-slate-600 rounded-2xl rounded-tl-sm p-5 text-sm text-slate-200 max-w-[80%] leading-relaxed shadow-lg">
                        您好！我是 <strong class="text-pink-400 text-base">${data.title}</strong>。<br>
                            <span class="text-slate-400 mt-2 block">${data.desc}</span>
                    </div>
                </div>
            `;
        }
        if(sbInput) {
            sbInput.placeholder = data.placeholder;
            sbInput.value = '';
        }
        
        if(sandboxModal) {
            sandboxModal.classList.remove('hidden');
            // force reflow
            void sandboxModal.offsetWidth;
            sandboxModal.classList.remove('opacity-0');
            sandboxModal.classList.add('opacity-100');
        }
        
        if(sandboxModalContent) {
            sandboxModalContent.classList.remove('scale-95');
            sandboxModalContent.classList.add('scale-100');
        }
        
        document.body.style.overflow = 'hidden';
    };

    window.closeSandbox = function() {
        const sandboxModal = document.getElementById('sandbox-modal');
        const sandboxModalContent = document.getElementById('sandbox-modal-content');
        if(sandboxModal) {
            sandboxModal.classList.remove('opacity-100');
            sandboxModal.classList.add('opacity-0');
        }
        if(sandboxModalContent) {
            sandboxModalContent.classList.remove('scale-100');
            sandboxModalContent.classList.add('scale-95');
        }
        setTimeout(() => {
            if(sandboxModal) sandboxModal.classList.add('hidden');
            document.body.style.overflow = '';
        }, 500);
    };

    // We must attach submit handler on the body to catch it dynamically, 
    // or wait and attach it once. Better to delegate or attach whenever the form exists.
    // However, if the form is in the DOM when this script executes, we can attach it.
    // Let's attach using event delegation to be 100% robust against DOM replacement.
    document.body.addEventListener('submit', (e) => {
        if (e.target && e.target.id === 'sandbox-form') {
            e.preventDefault();
            const sbInput = document.getElementById('sandbox-input');
            const sbOutput = document.getElementById('sandbox-output');
            const sbLoading = document.getElementById('sandbox-loading');
            if(!sbInput || !sbOutput) return;

            const val = sbInput.value.trim();
            if (!val) return;

            // 1. Add user message
            const userMsg = document.createElement('div');
            userMsg.className = 'flex items-start gap-4 flex-row-reverse mb-4';
            userMsg.innerHTML = `
            <div class="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl shrink-0">👤</div>
                <div class="bg-blue-600 border border-blue-500 rounded-2xl rounded-tr-sm p-4 text-sm text-white max-w-[80%] leading-relaxed shadow-[0_0_15px_rgba(37,99,235,0.2)]">
                    ${val.replace(/\n/g, '<br>')}
                </div>
            `;
            sbOutput.appendChild(userMsg);
            sbInput.value = '';
            sbOutput.scrollTop = sbOutput.scrollHeight;

            // 2. Show loading
            if(sbLoading) {
                sbLoading.classList.remove('hidden');
                void sbLoading.offsetWidth;
                sbLoading.classList.remove('opacity-0');
                sbLoading.classList.add('opacity-100');
            }

            const data = arsenalData[currentArsenal];
            console.log(`[AI Armory Mock] Calling ${data.endpoint}...`);

            setTimeout(() => {
                if(sbLoading) {
                    sbLoading.classList.remove('opacity-100');
                    sbLoading.classList.add('opacity-0');
                    setTimeout(() => sbLoading.classList.add('hidden'), 300);
                }

                const aiMsg = document.createElement('div');
                aiMsg.className = 'flex items-start gap-4 mb-4';
                aiMsg.innerHTML = `
                <div class="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/50 flex items-center justify-center text-xl shrink-0">${data.icon}</div>
                    <div class="bg-slate-900 border border-slate-700 rounded-2xl rounded-tl-sm p-4 text-sm text-slate-300 max-w-[80%] leading-relaxed">
                        ${data.mockResult.replace(/\n/g, '<br>')}
                    </div>
                `;
                sbOutput.appendChild(aiMsg);
                sbOutput.scrollTop = sbOutput.scrollHeight;
            }, 2000);
        }
    });

    document.body.addEventListener('keydown', (e) => {
        if (e.target && e.target.id === 'sandbox-input') {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const form = document.getElementById('sandbox-form');
                if(form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
            }
        }
    });
});
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
        blueprint: `<svg viewBox="0 0 400 200" class="w-full h-full max-w-[350px]">
    <defs>
        <filter id="glow1" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
    </defs>
    <path d="M 60 100 C 130 50, 130 150, 200 100" fill="none" stroke="#334155" stroke-width="2" stroke-dasharray="4 4" />
    <path d="M 200 100 C 270 50, 270 50, 340 60" fill="none" stroke="#334155" stroke-width="2" stroke-dasharray="4 4" />
    <path d="M 200 100 C 270 150, 270 150, 340 140" fill="none" stroke="#334155" stroke-width="2" stroke-dasharray="4 4" />
    <circle r="4" fill="#06b6d4" filter="url(#glow1)"><animateMotion dur="2.5s" repeatCount="indefinite" path="M 60 100 C 130 50, 130 150, 200 100" /></circle>
    <circle r="3.5" fill="#3b82f6" filter="url(#glow1)"><animateMotion dur="2s" repeatCount="indefinite" path="M 200 100 C 270 50, 270 50, 340 60" begin="0.5s" /></circle>
    <circle r="3.5" fill="#8b5cf6" filter="url(#glow1)"><animateMotion dur="2s" repeatCount="indefinite" path="M 200 100 C 270 150, 270 150, 340 140" begin="1s" /></circle>
    <g transform="translate(40, 80)"><rect width="40" height="40" rx="10" fill="#0f172a" stroke="#3b82f6" stroke-width="1.5" /><text x="20" y="24" text-anchor="middle" fill="#94a3b8" font-size="16" dominant-baseline="middle">📥</text><text x="20" y="54" text-anchor="middle" fill="#64748b" font-size="8" font-family="monospace">Zendesk</text></g>
    <g transform="translate(175, 75)"><circle cx="25" cy="25" r="25" fill="#1e1b4b" stroke="#8b5cf6" stroke-width="2" filter="url(#glow1)" /><text x="25" y="27" text-anchor="middle" fill="#c4b5fd" font-size="20" dominant-baseline="middle">🧠</text><text x="25" y="65" text-anchor="middle" fill="#a855f7" font-size="9" font-family="sans-serif" font-weight="bold">n8n Router</text></g>
    <g transform="translate(320, 40)"><rect width="40" height="40" rx="10" fill="#0f172a" stroke="#0ea5e9" stroke-width="1.5" /><text x="20" y="22" text-anchor="middle" fill="#94a3b8" font-size="16" dominant-baseline="middle">🛍️</text><text x="20" y="54" text-anchor="middle" fill="#64748b" font-size="8" font-family="monospace">Shopify</text></g>
    <g transform="translate(320, 120)"><rect width="40" height="40" rx="10" fill="#0f172a" stroke="#10b981" stroke-width="1.5" /><text x="20" y="22" text-anchor="middle" fill="#94a3b8" font-size="16" dominant-baseline="middle">📦</text><text x="20" y="54" text-anchor="middle" fill="#64748b" font-size="8" font-family="monospace">Logistics</text></g>
</svg>`,
        metrics: {
            confidence: 98.4,
            level: "L5",
            nodes: 8,
            latencyBefore: "20分钟",
            latencyAfter: "15秒",
            savedHours: 35
        },
        logs: [
            "[INFO] Initializing Zendesk Webhook Trigger...",
            "[INFO] Ticket #29104 received: \"Item damaged during shipping\"",
            "[INFO] Running LLM sentiment analysis: score=0.18 (Dissatisfied)",
            "[INFO] Parsing Shopify order ID: SH-883921... Order Found.",
            "[ACTION] Initiating auto-refund & generating compensation coupon.",
            "[SUCCESS] Shopify API Refund processed. SMS apology sent."
        ]
    },
    "TikTok 爆款短视频矩阵分发器": {
        before: `2 名运营每天花费 4 小时刷榜、2 小时写脚本，人工同步多账号。每天产出视频上限为 5-8 条。`,
        after: `通过 Dify Agent 每天定时抓取爆款趋势，自动调用大模型生成 50 套符合账号人设 of 短视频脚本并自动分发，将运营团队变成矩阵主理人。`,
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
        blueprint: `<svg viewBox="0 0 400 200" class="w-full h-full max-w-[360px]">
    <defs>
        <filter id="glow2" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
    </defs>
    <path d="M 60 100 L 140 100" fill="none" stroke="#334155" stroke-width="2" stroke-dasharray="4 4" />
    <path d="M 180 100 L 260 100" fill="none" stroke="#334155" stroke-width="2" stroke-dasharray="4 4" />
    <path d="M 300 100 C 330 100, 330 60, 360 60" fill="none" stroke="#334155" stroke-width="2" stroke-dasharray="4 4" />
    <path d="M 300 100 C 330 100, 330 140, 360 140" fill="none" stroke="#334155" stroke-width="2" stroke-dasharray="4 4" />
    <circle r="3.5" fill="#f43f5e" filter="url(#glow2)"><animateMotion dur="1.8s" repeatCount="indefinite" path="M 60 100 L 140 100" /></circle>
    <circle r="3.5" fill="#10b981" filter="url(#glow2)"><animateMotion dur="1.8s" repeatCount="indefinite" path="M 180 100 L 260 100" /></circle>
    <circle r="3.5" fill="#a855f7" filter="url(#glow2)"><animateMotion dur="1.5s" repeatCount="indefinite" path="M 300 100 C 330 100, 330 60, 360 60" /></circle>
    <circle r="3.5" fill="#06b6d4" filter="url(#glow2)"><animateMotion dur="1.5s" repeatCount="indefinite" path="M 300 100 C 330 100, 330 140, 360 140" /></circle>
    <g transform="translate(20, 80)"><rect width="40" height="40" rx="10" fill="#0f172a" stroke="#f43f5e" stroke-width="1.5" /><text x="20" y="22" text-anchor="middle" fill="#94a3b8" font-size="16" dominant-baseline="middle">🔥</text><text x="20" y="54" text-anchor="middle" fill="#64748b" font-size="8" font-family="monospace">Trends API</text></g>
    <g transform="translate(140, 80)"><rect width="40" height="40" rx="10" fill="#0f172a" stroke="#10b981" stroke-width="1.5" /><text x="20" y="22" text-anchor="middle" fill="#94a3b8" font-size="16" dominant-baseline="middle">🤖</text><text x="20" y="54" text-anchor="middle" fill="#64748b" font-size="8" font-family="monospace">Dify Agent</text></g>
    <g transform="translate(260, 80)"><rect width="40" height="40" rx="10" fill="#0f172a" stroke="#a855f7" stroke-width="1.5" /><text x="20" y="22" text-anchor="middle" fill="#94a3b8" font-size="16" dominant-baseline="middle">🎥</text><text x="20" y="54" text-anchor="middle" fill="#64748b" font-size="8" font-family="monospace">Video Render</text></g>
    <g transform="translate(360, 45)"><circle cx="10" cy="10" r="10" fill="#0f172a" stroke="#0ea5e9" stroke-width="1.5" /><text x="10" y="11" text-anchor="middle" fill="#0ea5e9" font-size="8" dominant-baseline="middle">T1</text></g>
    <g transform="translate(360, 125)"><circle cx="10" cy="10" r="10" fill="#0f172a" stroke="#0ea5e9" stroke-width="1.5" /><text x="10" y="11" text-anchor="middle" fill="#0ea5e9" font-size="8" dominant-baseline="middle">T2</text></g>
</svg>`,
        metrics: {
            confidence: 96.8,
            level: "L5",
            nodes: 12,
            latencyBefore: "6小时",
            latencyAfter: "45秒",
            savedHours: 48
        },
        logs: [
            "[INFO] Fetching daily TikTok trending hashtags via API...",
            "[INFO] Top trend identified: #cyberpunk_outfit",
            "[ACTION] Dify Agent scripting 50 unique video variants...",
            "[INFO] Generating scripts with emotional triggers...",
            "[ACTION] Rendering video assets with virtual avatar engine...",
            "[SUCCESS] 50 videos generated. Dispatched to 15 TikTok accounts."
        ]
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
        blueprint: `<svg viewBox="0 0 400 200" class="w-full h-full max-w-[360px]">
    <defs>
        <filter id="glow3" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
    </defs>
    <path d="M 60 40 C 120 40 140 100 180 100" fill="none" stroke="#334155" stroke-width="2" stroke-dasharray="4 4" />
    <path d="M 60 100 L 180 100" fill="none" stroke="#334155" stroke-width="2" stroke-dasharray="4 4" />
    <path d="M 60 160 C 120 160 140 100 180 100" fill="none" stroke="#334155" stroke-width="2" stroke-dasharray="4 4" />
    <path d="M 220 100 L 320 100" fill="none" stroke="#334155" stroke-width="2" stroke-dasharray="4 4" />
    <circle r="3" fill="#14b8a6" filter="url(#glow3)"><animateMotion dur="2s" repeatCount="indefinite" path="M 60 40 C 120 40 140 100 180 100" /></circle>
    <circle r="3" fill="#14b8a6" filter="url(#glow3)"><animateMotion dur="2s" repeatCount="indefinite" path="M 60 100 L 180 100" /></circle>
    <circle r="3" fill="#14b8a6" filter="url(#glow3)"><animateMotion dur="2s" repeatCount="indefinite" path="M 60 160 C 120 160 140 100 180 100" /></circle>
    <circle r="4" fill="#f59e0b" filter="url(#glow3)"><animateMotion dur="1.5s" repeatCount="indefinite" path="M 220 100 L 320 100" /></circle>
    <g transform="translate(20, 20)"><rect width="40" height="40" rx="8" fill="#0f172a" stroke="#475569" stroke-width="2" /><text x="20" y="24" fill="#64748b" font-size="10" text-anchor="middle">Review</text></g>
    <g transform="translate(20, 80)"><rect width="40" height="40" rx="8" fill="#0f172a" stroke="#475569" stroke-width="2" /><text x="20" y="105" fill="#64748b" font-size="10" text-anchor="middle" transform="translate(0, -80)">Price</text></g>
    <g transform="translate(20, 140)"><rect width="40" height="40" rx="8" fill="#0f172a" stroke="#475569" stroke-width="2" /><text x="20" y="165" fill="#64748b" font-size="10" text-anchor="middle" transform="translate(0, -140)">Listing</text></g>
    <polygon points="200,75 225,100 200,125 175,100" fill="#064e3b" stroke="#10b981" stroke-width="2" filter="url(#glow3)" /><text x="200" y="104" fill="#6ee7b7" font-size="8" text-anchor="middle" font-weight="bold">NLP Core</text>
    <rect x="320" y="80" width="40" height="40" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="2" /><text x="340" y="105" fill="#94a3b8" font-size="10" text-anchor="middle">BI Plan</text>
</svg>`,
        metrics: {
            confidence: 95.2,
            level: "L4",
            nodes: 14,
            latencyBefore: "48小时",
            latencyAfter: "5分钟",
            savedHours: 20
        },
        logs: [
            "[INFO] Triggering Amazon ASIN Reviews scraper...",
            "[INFO] Ingested 1,200 new review texts for ASIN: B08XX921",
            "[ACTION] Loading Bart-Large-MNLI model for categorization...",
            "[INFO] Clustering results: Quality (42%), Packaging (31%), Shipping (27%)",
            "[WARN] Alert: \"Damaged box\" keyword occurrences spike by 15%!",
            "[SUCCESS] Pushed insights to Enterprise WeChat and BI database."
        ]
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
        blueprint: `<svg viewBox="0 0 400 200" class="w-full h-full max-w-[350px]">
    <defs>
        <filter id="glow4" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
    </defs>
    <path d="M 60 50 C 130 50, 130 100, 200 100" fill="none" stroke="#334155" stroke-width="2" stroke-dasharray="4 4" />
    <path d="M 60 150 C 130 150, 130 100, 200 100" fill="none" stroke="#334155" stroke-width="2" stroke-dasharray="4 4" />
    <path d="M 240 100 L 320 100" fill="none" stroke="#334155" stroke-width="2" stroke-dasharray="4 4" />
    <circle r="3" fill="#22c55e" filter="url(#glow4)"><animateMotion dur="2s" repeatCount="indefinite" path="M 60 50 C 130 50, 130 100, 200 100" /></circle>
    <circle r="3" fill="#3b82f6" filter="url(#glow4)"><animateMotion dur="2s" repeatCount="indefinite" path="M 60 150 C 130 150, 130 100, 200 100" /></circle>
    <circle r="4" fill="#0ea5e9" filter="url(#glow4)"><animateMotion dur="1.5s" repeatCount="indefinite" path="M 240 100 L 320 100" /></circle>
    <g transform="translate(20, 30)"><rect width="40" height="35" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="1.5" /><text x="20" y="20" text-anchor="middle" fill="#94a3b8" font-size="8" dominant-baseline="middle">Chats</text></g>
    <g transform="translate(20, 130)"><rect width="40" height="35" rx="8" fill="#0f172a" stroke="#3b82f6" stroke-width="1.5" /><text x="20" y="20" text-anchor="middle" fill="#94a3b8" font-size="8" dominant-baseline="middle">Email</text></g>
    <g transform="translate(200, 75)"><circle cx="20" cy="25" r="25" fill="#1e1b4b" stroke="#0ea5e9" stroke-width="2" filter="url(#glow4)" /><text x="20" y="27" text-anchor="middle" fill="#c4b5fd" font-size="12" text-anchor="middle" font-weight="bold">n8n</text></g>
    <g transform="translate(320, 80)"><rect width="50" height="40" rx="8" fill="#0f172a" stroke="#0ea5e9" stroke-width="1.5" /><text x="25" y="24" text-anchor="middle" fill="#94a3b8" font-size="9" dominant-baseline="middle">CRM</text></g>
</svg>`,
        metrics: {
            confidence: 97.4,
            level: "L5",
            nodes: 6,
            latencyBefore: "4小时",
            latencyAfter: "2分钟",
            savedHours: 16
        },
        logs: [
            "[INFO] Ingestion listener active for WhatsApp/FB/Email...",
            "[DEBUG] Incoming query: \"Need quote for 2,000 units. Budget is $15k\"",
            "[ACTION] Extracting intent and entities...",
            "[INFO] Intent: Pricing_Inquiry | Budget: $15,000 | Co: Acme Corp",
            "[ACTION] Creating lead record in HubSpot. Assigning to Sales A.",
            "[SUCCESS] CRM synced. Push warning alert to WeChat sales group."
        ]
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
        blueprint: `<svg viewBox="0 0 400 200" class="w-full h-full max-w-[360px]">
    <defs>
        <filter id="glow5" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
    </defs>
    <path d="M 60 100 L 150 100" fill="none" stroke="#334155" stroke-width="2" stroke-dasharray="4 4" />
    <path d="M 210 100 L 300 100" fill="none" stroke="#334155" stroke-width="2" stroke-dasharray="4 4" />
    <circle r="3.5" fill="#a855f7" filter="url(#glow5)"><animateMotion dur="1.5s" repeatCount="indefinite" path="M 60 100 L 150 100" /></circle>
    <circle r="3.5" fill="#06b6d4" filter="url(#glow5)"><animateMotion dur="1.8s" repeatCount="indefinite" path="M 210 100 L 300 100" /></circle>
    <g transform="translate(20, 80)"><rect width="40" height="40" rx="8" fill="#0f172a" stroke="#a855f7" stroke-width="1.5" /><text x="20" y="24" text-anchor="middle" fill="#94a3b8" font-size="9" dominant-baseline="middle">Specs</text></g>
    <g transform="translate(150, 75)"><circle cx="25" cy="25" r="25" fill="#1e1b4b" stroke="#06b6d4" stroke-width="2" filter="url(#glow5)" /><text x="25" y="27" text-anchor="middle" fill="#c4b5fd" font-size="9" dominant-baseline="middle" font-weight="bold">GPT Writer</text></g>
    <g transform="translate(300, 80)"><rect width="45" height="40" rx="8" fill="#0f172a" stroke="#0ea5e9" stroke-width="1.5" /><text x="22.5" y="24" text-anchor="middle" fill="#94a3b8" font-size="9" dominant-baseline="middle">Listing</text></g>
</svg>`,
        metrics: {
            confidence: 94.6,
            level: "L4",
            nodes: 8,
            latencyBefore: "2天",
            latencyAfter: "15分钟",
            savedHours: 30
        },
        logs: [
            "[INFO] Reading PIM CSV import: 100 new product SKUs",
            "[ACTION] GPT-4 Listing Writer processing item: \"Ergonomic Office Chair\"",
            "[INFO] Translating descriptions to German, French, and Japanese...",
            "[ACTION] Running compliance validator against Amazon policy...",
            "[INFO] Policy Scan: 0 restricted words found. SEO score: 94/100",
            "[SUCCESS] 100 listings generated & uploaded to Seller Central draft."
        ]
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
        blueprint: `<svg viewBox="0 0 400 200" class="w-full h-full max-w-[360px]">
    <defs>
        <filter id="glow6" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
    </defs>
    <path d="M 60 100 L 140 100" fill="none" stroke="#334155" stroke-width="2" stroke-dasharray="4 4" />
    <path d="M 180 70 L 180 40 L 260 40" fill="none" stroke="#334155" stroke-width="2" stroke-dasharray="4 4" />
    <path d="M 260 40 L 320 100" fill="none" stroke="#334155" stroke-width="2" stroke-dasharray="4 4" />
    <path d="M 220 100 L 320 100" fill="none" stroke="#334155" stroke-width="2" stroke-dasharray="4 4" />
    <circle r="3" fill="#22c55e" filter="url(#glow6)"><animateMotion dur="1s" repeatCount="indefinite" path="M 60 100 L 140 100" /></circle>
    <circle r="3" fill="#a855f7" filter="url(#glow6)"><animateMotion dur="1s" repeatCount="indefinite" path="M 180 70 L 180 40 L 260 40" /></circle>
    <circle r="3" fill="#f43f5e" filter="url(#glow6)"><animateMotion dur="1.5s" repeatCount="indefinite" path="M 220 100 L 320 100" /></circle>
    <rect x="20" y="80" width="40" height="40" rx="8" fill="#0f172a" stroke="#22c55e" stroke-width="2" /><text x="40" y="105" fill="#bbf7d0" font-size="10" text-anchor="middle" transform="translate(0, -80)">Return</text>
    <circle cx="180" cy="100" r="40" fill="#4c1d95" stroke="#a855f7" stroke-width="2" filter="url(#glow6)" /><text x="180" y="104" fill="#e9d5ff" font-size="10" text-anchor="middle" font-weight="bold" transform="translate(0, -100)">Defense</text>
    <rect x="260" y="20" width="40" height="40" rx="8" fill="#0f172a" stroke="#06b6d4" stroke-width="2" /><text x="280" y="45" fill="#cffafe" font-size="10" text-anchor="middle" transform="translate(0, -20)">Compensate</text>
    <rect x="320" y="80" width="40" height="40" rx="8" fill="#0f172a" stroke="#f43f5e" stroke-width="2" /><text x="340" y="105" fill="#fecdd3" font-size="10" text-anchor="middle" transform="translate(0, -80)">Resolve</text>
</svg>`,
        metrics: {
            confidence: 93.8,
            level: "L5",
            nodes: 5,
            latencyBefore: "1小时",
            latencyAfter: "10秒",
            savedHours: 25
        },
        logs: [
            "[INFO] Customer refund request received: Order #SH-40012",
            "[ACTION] Calculating Customer LTV index... LTV = $1,420 (High)",
            "[INFO] Analyzing refund justification: \"Minor scratch on leg\"",
            "[ACTION] Formulating dynamic compensation offer via RAG...",
            "[INFO] Proposing 30% partial refund + 15% discount voucher...",
            "[SUCCESS] Offer accepted by customer. Refund processed. Order closed."
        ]
    }
};

// ======================= Tab and Terminal Interaction Logic =======================
function switchCaseTab(tabName) {
    // Hide all tab panels
    const panels = document.querySelectorAll('.tab-panel');
    panels.forEach(p => p.classList.add('hidden'));

    // Show selected panel
    const activePanel = document.getElementById(`cm-tab-panel-${tabName}`);
    if (activePanel) {
        activePanel.classList.remove('hidden');
    }

    // Reset tab button states
    const tabs = ['topology', 'console', 'metrics'];
    tabs.forEach(t => {
        const btn = document.getElementById(`tab-btn-${t}`);
        if (btn) {
            if (t === tabName) {
                btn.className = "flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 text-white bg-slate-800 shadow-[0_2px_8px_rgba(6,182,212,0.15)] border border-cyan-500/20 focus:outline-none";
            } else {
                btn.className = "flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 text-slate-400 hover:text-slate-200 focus:outline-none";
            }
        }
    });

    // If switching to console, kick off simulated terminal typing (if not already typed)
    if (tabName === 'console') {
        const titleEl = document.getElementById('cm-title');
        const title = titleEl ? titleEl.innerText : '';
        initConsoleLogs(title);
    }
}

// Global state for terminal typing animation
let terminalTypingInterval = null;
let currentCaseTitleForLogs = '';

function initConsoleLogs(caseTitle) {
    if (currentCaseTitleForLogs === caseTitle) {
        const logsContainer = document.getElementById('cm-console-logs');
        if (logsContainer && logsContainer.innerText !== '') {
            return; // Already initialized for this case
        }
    }
    
    currentCaseTitleForLogs = caseTitle;
    
    // Clear any active typing animation
    if (terminalTypingInterval) {
        clearInterval(terminalTypingInterval);
        terminalTypingInterval = null;
    }
    
    const logsContainer = document.getElementById('cm-console-logs');
    if (!logsContainer) return;
    logsContainer.innerText = '';
    
    // Look up logs from CASE_DETAILS_DATA or generate
    const details = (typeof CASE_DETAILS_DATA !== 'undefined' && CASE_DETAILS_DATA[caseTitle]) 
                    ? CASE_DETAILS_DATA[caseTitle] 
                    : generateDynamicFallback(caseTitle, '');
    
    const logs = details.logs || generateLogsForCase(caseTitle);
    
    // Quick type-writer for initial logs
    let lineIdx = 0;
    terminalTypingInterval = setInterval(() => {
        if (lineIdx < logs.length) {
            logsContainer.innerText += logs[lineIdx] + '\n';
            logsContainer.scrollTop = logsContainer.scrollHeight;
            lineIdx++;
        } else {
            clearInterval(terminalTypingInterval);
            terminalTypingInterval = null;
        }
    }, 100);
}

function generateLogsForCase(title) {
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
        hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    return [
        `[INFO] Booting system service for: ${title}...`,
        `[INFO] Establishing SSL handshake with AI Gateway Node...`,
        `[DEBUG] Fetching workflow blueprints...`,
        `[INFO] Starting execution engine, active nodes: ${Math.abs(hash % 10) + 5}`,
        `[INFO] Scanning system health... Status: green`,
        `[SUCCESS] Test run completed. Latency: 25ms.`
    ];
}

function triggerConsoleSimulation() {
    const btn = document.getElementById('cm-run-test-btn');
    if (btn) {
        btn.disabled = true;
        btn.innerText = '⏳ 运行中...';
    }

    if (terminalTypingInterval) {
        clearInterval(terminalTypingInterval);
        terminalTypingInterval = null;
    }

    const logsContainer = document.getElementById('cm-console-logs');
    if (logsContainer) {
        logsContainer.innerText = '>>> [SYSTEM] Starting Diagnostic Test Simulation...\n';
    }

    const simLogs = [
        '[TEST] Checking API Endpoint Handshakes...',
        '[TEST] Simulating payload transfer (size: 4.8kb)...',
        '[TEST] Executing LLM decision node matrix...',
        '[DEBUG] Token usage: 481 prompt, 120 completion',
        '[TEST] Routing action to downstream nodes...',
        '[SUCCESS] Test transaction executed successfully!',
        '>>> [SYSTEM] Diagnostic Complete. All systems operational.'
    ];

    let lineIdx = 0;
    terminalTypingInterval = setInterval(() => {
        if (logsContainer) {
            if (lineIdx < simLogs.length) {
                logsContainer.innerText += simLogs[lineIdx] + '\n';
                logsContainer.scrollTop = logsContainer.scrollHeight;
                lineIdx++;
            } else {
                clearInterval(terminalTypingInterval);
                terminalTypingInterval = null;
                if (btn) {
                    btn.disabled = false;
                    btn.innerText = '⚡ 运行测试';
                }
                
                // Automatically switch to the metrics tab after a short delay
                setTimeout(() => {
                    switchCaseTab('metrics');
                    const metricsBtn = document.getElementById('tab-btn-metrics');
                    if (metricsBtn) {
                        metricsBtn.classList.add('animate-pulse');
                        setTimeout(() => metricsBtn.classList.remove('animate-pulse'), 2000);
                    }
                }, 800);
            }
        }
    }, 200);
}

function openCaseModal(cardElement) {
    try {
        const modal = document.getElementById('case-modal');
        const content = document.getElementById('case-modal-content');
        
        if (!modal) {
            console.error("Modal element not found in DOM.");
            return;
        }

        // Extract basic data from card safely
        const titleEl = cardElement.querySelector('h3');
        const descEl = cardElement.querySelector('p');
        const roiEl = cardElement.querySelector('.flex.items-center.justify-between span:last-child');
        
        const title = titleEl ? titleEl.innerText : 'Case Study';
        const fallbackDesc = descEl ? descEl.innerText : '';
        const roi = roiEl ? roiEl.innerText : '';

        // Extract tags
        const tagsDiv = cardElement.querySelector('.absolute.bottom-4.left-4.z-10');
        const tagsHTML = tagsDiv ? tagsDiv.innerHTML : '';

        // Lookup details or use fallback
        const details = (typeof CASE_DETAILS_DATA !== 'undefined' && CASE_DETAILS_DATA[title]) 
                        ? CASE_DETAILS_DATA[title] 
                        : generateDynamicFallback(title, fallbackDesc);

        // Populate Modal safely
        const cmTitle = document.getElementById('cm-title');
        const cmBefore = document.getElementById('cm-before');
        const cmAfter = document.getElementById('cm-after');
        const cmRoi = document.getElementById('cm-roi');
        const cmTags = document.getElementById('cm-tags');
        const cmCodeTitle = document.getElementById('cm-code-title');
        const cmCodeContent = document.getElementById('cm-code-content');

        if(cmTitle) cmTitle.innerText = title;
        if(cmBefore) cmBefore.innerText = details.before;
        if(cmAfter) cmAfter.innerText = details.after;
        if(cmRoi) cmRoi.innerText = roi;
        if(cmTags) cmTags.innerHTML = tagsHTML;
        if(cmCodeTitle) cmCodeTitle.innerText = details.codeTitle;
        if(cmCodeContent) cmCodeContent.innerText = details.code;

        const cmBlueprintContainer = document.getElementById('cm-blueprint-container');
        if(cmBlueprintContainer && details.blueprint) {
            cmBlueprintContainer.innerHTML = details.blueprint;
        }

        // Inject Metrics HTML dynamically to guarantee rendering
        const cmMetricsPanel = document.getElementById('cm-tab-panel-metrics');
        if (cmMetricsPanel) {
            cmMetricsPanel.innerHTML = `
                <h4 class="text-slate-400 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-cyan-500"></span> 运行指标监视器 (Metrics)
                </h4>
                <div class="flex flex-wrap gap-4 w-full" style="display: flex !important; flex-wrap: wrap !important; width: 100% !important; min-height: 250px;">
                    <!-- Circular Confidence Gauge -->
                    <div style="flex: 1 1 calc(50% - 1rem); min-width: 140px; background-color: rgba(2, 6, 23, 0.4); border: 1px solid rgba(30, 41, 59, 0.8); border-radius: 1.5rem; padding: 1rem; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                        <p class="text-slate-500 text-[9px] font-bold uppercase tracking-wider mb-2">AI 准确率 (Confidence)</p>
                        <div style="width: 6rem; height: 6rem; border-radius: 50%; border: 6px solid #1e293b; border-top-color: #22d3ee; display: flex; align-items: center; justify-content: center;">
                            <div style="text-align: center;">
                                <span id="cm-metric-confidence-val" class="text-lg font-black text-white font-mono">95.2</span>
                                <span class="text-[9px] text-cyan-400 font-mono">%</span>
                            </div>
                        </div>
                    </div>

                    <!-- Automation Level -->
                    <div style="flex: 1 1 calc(50% - 1rem); min-width: 140px; background-color: rgba(2, 6, 23, 0.4); border: 1px solid rgba(30, 41, 59, 0.8); border-radius: 1.5rem; padding: 1rem; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                        <p class="text-slate-500 text-[9px] font-bold uppercase tracking-wider mb-2">自动化等级 (Level)</p>
                        <div style="width: 5rem; height: 5rem; border-radius: 50%; background-color: rgba(88, 28, 135, 0.2); border: 1px solid rgba(168, 85, 247, 0.2); display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative;">
                            <div style="position: absolute; top: -2px; width: 6px; height: 6px; border-radius: 50%; background-color: #a855f7;"></div>
                            <span id="cm-metric-level-val" class="text-3xl font-black text-purple-400 font-mono">L4</span>
                            <span class="text-[8px] text-purple-300 font-light mt-1 tracking-wider uppercase font-bold">Autonomous</span>
                        </div>
                    </div>

                    <!-- Active Nodes -->
                    <div style="flex: 1 1 calc(50% - 1rem); min-width: 140px; background-color: rgba(2, 6, 23, 0.4); border: 1px solid rgba(30, 41, 59, 0.8); border-radius: 1.5rem; padding: 1rem; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                        <p class="text-slate-500 text-[9px] font-bold uppercase tracking-wider mb-1">活跃节点数 (Nodes)</p>
                        <div style="display: flex; align-items: baseline; gap: 4px; margin-top: 4px;">
                            <span id="cm-metric-nodes-val" class="text-3xl font-black text-emerald-400 font-mono">12</span>
                            <span class="text-[9px] text-slate-500 font-mono uppercase font-bold">Nodes</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px; margin-top: 8px; background-color: rgba(6, 78, 59, 0.25); border: 1px solid rgba(16, 185, 129, 0.2); padding: 2px 12px; border-radius: 9999px;">
                            <span style="width: 4px; height: 4px; border-radius: 50%; background-color: #34d399;"></span>
                            <span class="text-[8px] text-emerald-400 font-mono uppercase font-bold">All Active</span>
                        </div>
                    </div>

                    <!-- Latency / Response Time Performance -->
                    <div style="flex: 1 1 calc(50% - 1rem); min-width: 140px; background-color: rgba(2, 6, 23, 0.4); border: 1px solid rgba(30, 41, 59, 0.8); border-radius: 1.5rem; padding: 1rem; display: flex; flex-direction: column; justify-content: center;">
                        <p class="text-slate-500 text-[9px] font-bold uppercase tracking-wider mb-2">时效提升 (Latency Savings)</p>
                        <div style="display: flex; flex-direction: column; gap: 8px; width: 100%;">
                            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 10px; font-family: monospace;">
                                <span class="text-slate-400">Before:</span>
                                <span id="cm-metric-latency-before" class="text-red-400 font-bold">60分钟</span>
                            </div>
                            <div style="width: 100%; background-color: #0f172a; border-radius: 9999px; height: 6px; overflow: hidden;">
                                <div style="background: linear-gradient(to right, #ef4444, #10b981); height: 100%; width: 99.6%;" id="cm-metric-latency-bar"></div>
                            </div>
                            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 10px; font-family: monospace;">
                                <span class="text-slate-400">After:</span>
                                <span id="cm-metric-latency-after" class="text-emerald-400 font-bold">25秒</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        // Populate Metrics
        const confValEl = document.getElementById('cm-metric-confidence-val');
        const confRingEl = document.getElementById('cm-metric-confidence-ring');
        const levelValEl = document.getElementById('cm-metric-level-val');
        const nodesValEl = document.getElementById('cm-metric-nodes-val');
        const latencyBeforeEl = document.getElementById('cm-metric-latency-before');
        const latencyAfterEl = document.getElementById('cm-metric-latency-after');
        
        const metrics = details.metrics || {
            confidence: 95.0,
            level: "L4",
            nodes: 8,
            latencyBefore: "60分钟",
            latencyAfter: "25秒"
        };

        if (confValEl) confValEl.innerText = parseFloat(metrics.confidence).toFixed(1);
        if (confRingEl) {
            const dashoffset = 251.2 - (251.2 * parseFloat(metrics.confidence) / 100);
            confRingEl.style.strokeDashoffset = dashoffset;
        }
        if (levelValEl) levelValEl.innerText = metrics.level;
        if (nodesValEl) nodesValEl.innerText = metrics.nodes;
        if (latencyBeforeEl) latencyBeforeEl.innerText = metrics.latencyBefore;
        if (latencyAfterEl) latencyAfterEl.innerText = metrics.latencyAfter;

        // Reset console log trigger state
        currentCaseTitleForLogs = '';
        const logsContainer = document.getElementById('cm-console-logs');
        if (logsContainer) logsContainer.innerText = '';

        // Reset to first tab
        switchCaseTab('topology');

        // Show modal
        modal.classList.remove('hidden');
        modal.classList.add('flex');

        // Trigger animation
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            modal.classList.add('opacity-100');
            if(content) {
                content.classList.remove('translate-x-full');
                content.classList.add('translate-x-0');
            }
        }, 10);

        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } catch (e) {
        console.error("openCaseModal failed:", e);
        // Fallback
        const modal = document.getElementById('case-modal');
        if(modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            modal.classList.remove('opacity-0');
            modal.classList.add('opacity-100');
        }
    }
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
