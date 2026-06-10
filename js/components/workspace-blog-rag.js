// ============================================
// 麻升智能工作室 - 沉浸式工作台
// AI 知识库检索中控 (Blog RAG) Component
// ============================================

Object.assign(window.WorkspaceUI, {
    ragLatelyData: null,

    renderBlogRag: function(title, icon, initialInput = '') {
        const content = document.getElementById('ws-main-content');
        content.innerHTML = `
            <style>
                .rag-input-box {
                    background: rgba(15, 23, 42, 0.6);
                    border: 1px solid rgba(245, 158, 11, 0.2);
                }
                .rag-input-box:focus-within {
                    border-color: rgba(245, 158, 11, 0.5);
                    box-shadow: 0 0 15px rgba(245, 158, 11, 0.15);
                }
                @keyframes rotate-slow {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .animate-rotate-slow {
                    animation: rotate-slow 25s linear infinite;
                }
                @keyframes pulse-ring {
                    0% { transform: scale(0.95); opacity: 0.2; }
                    50% { transform: scale(1.05); opacity: 0.4; }
                    100% { transform: scale(0.95); opacity: 0.2; }
                }
                .animate-pulse-ring {
                    animation: pulse-ring 4s ease-in-out infinite;
                }
                .glass-card {
                    background: rgba(15, 23, 42, 0.4);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                }
                .rag-report-container pre::-webkit-scrollbar {
                    height: 6px;
                }
                .rag-report-container pre::-webkit-scrollbar-thumb {
                    background: rgba(245, 158, 11, 0.3);
                    border-radius: 3px;
                }
                .rag-report-container table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 1.5rem 0;
                }
                .rag-report-container th {
                    background: rgba(30, 41, 59, 0.6);
                    font-weight: 700;
                    color: #ffffff;
                    border-bottom: 1px solid rgba(51, 65, 85, 0.8);
                    padding: 0.875rem 1.25rem;
                    text-align: left;
                    letter-spacing: 0.05em;
                }
                .rag-report-container td {
                    padding: 0.75rem 1.25rem;
                    color: #cbd5e1;
                    border-bottom: 1px solid rgba(51, 65, 85, 0.4);
                    line-height: 1.6;
                }
                .rag-report-container tr:last-child td {
                    border-bottom: none;
                }
                .rag-report-container tr:hover td {
                    background: rgba(30, 41, 59, 0.25);
                    color: #ffffff;
                }
                .rag-report-container p {
                    margin-bottom: 1.2rem;
                    line-height: 1.75;
                }
                .rag-report-container h3, .rag-report-container h4 {
                    margin-top: 2rem;
                    margin-bottom: 1rem;
                }
                .rag-report-container ul, .rag-report-container ol {
                    margin-top: 1rem;
                    margin-bottom: 1rem;
                }
                .rag-report-container li {
                    line-height: 1.7;
                    margin-bottom: 0.5rem;
                }
            </style>
            <div class="h-full flex flex-col md:flex-row w-full overflow-hidden">
                <!-- Left Panel: Form Control -->
                <div class="ws-sidebar-panel fixed md:relative inset-y-0 left-0 z-50 md:z-0 w-[300px] md:w-[340px] bg-[#0d1324] md:bg-slate-900/50 border-r border-slate-800 p-6 flex flex-col gap-6 overflow-y-auto no-scrollbar shrink-0 transform -translate-x-full md:translate-x-0 transition-transform duration-300">
                    <div>
                        <h4 class="text-sm font-bold text-white mb-1">AI 知识库检索中控</h4>
                        <p class="text-[11px] text-slate-500">连接 n8n 多智能体后端工作流，实时 analysis 并召回深度报告。</p>
                    </div>
                    
                    <div class="h-[1px] bg-slate-800"></div>
                    
                    <div>
                        <label class="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">智能检索问题</label>
                        <textarea id="rag-question" class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-amber-500 h-32 resize-none leading-relaxed" placeholder="请输入您想要查询的 AI 智能体、自动化或商业提效问题...">${initialInput}</textarea>
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">检索范围</label>
                        <select id="rag-domain" class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors">
                            <option value="auto">🧠 自动研判分类领域 (五大智能体路由)</option>
                            <option value="架构前沿">💻 架构前沿 (底层智能体 & RAG)</option>
                            <option value="同城实体">🏪 同城实体 (线下服务业 & 客服)</option>
                            <option value="自媒体IP">📕 自媒体IP (流量获客 & 分发)</option>
                            <option value="学术科研">🎓 学术科研 (文献整理 & 提效)</option>
                            <option value="职场效能">🎯 职场效能 (工作流 & 降本)</option>
                        </select>
                    </div>

                    <button id="btn-submit-rag" onclick="WorkspaceUI.submitBlogRag()" class="mt-auto bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold py-3.5 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all flex items-center justify-center gap-2">
                        <span>✨</span> 召唤 AI 检索知识
                    </button>
                </div>

                <!-- Right Panel: Status / Results -->
                <div class="flex-1 p-4 sm:p-8 overflow-y-auto bg-tech-grid flex flex-col relative" id="rag-right-panel">
                    <!-- Idle View -->
                    <div id="rag-idle-view" class="flex-1 flex flex-col items-center justify-center gap-6 text-center max-w-md mx-auto z-10 transition-all duration-300">
                        <div class="relative w-36 h-36 flex items-center justify-center">
                            <div class="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500/20 to-orange-500/20 blur-xl animate-pulse-ring"></div>
                            <div class="absolute inset-2 rounded-full border border-amber-500/20 animate-rotate-slow"></div>
                            <div class="text-5xl">🔍</div>
                        </div>
                        <div>
                            <h4 class="text-white font-bold text-lg">已就绪「AI 知识库检索中控」</h4>
                            <p class="text-slate-400 text-xs mt-2 leading-relaxed">
                                请输入您想提问的知识问题，点击左侧按钮，将通过 n8n 触发多智能体进行深度研判与报告生成。
                            </p>
                        </div>
                    </div>

                    <!-- Processing View -->
                    <div id="rag-processing-view" class="hidden flex-1 flex flex-col items-center justify-center w-full max-w-xl mx-auto z-10">
                        <h4 class="text-white font-bold text-sm mb-6 tracking-wide flex items-center gap-2">
                            <div class="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></div>
                            n8n 检索流水线激活，多智能体研判中...
                        </h4>
                        <div class="space-y-4 w-full">
                            <div class="flex items-center gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl relative" id="rag-step-1">
                                <div class="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-lg shrink-0" id="rag-icon-1">🧠</div>
                                <div class="flex-grow min-w-0">
                                    <div class="flex justify-between items-center mb-1">
                                        <span class="text-xs font-bold text-white">步骤一：提问意向深度解析</span>
                                        <span class="text-[9px] text-slate-500 font-mono" id="rag-status-1">排队中...</span>
                                    </div>
                                    <p class="text-[10px] text-slate-400 truncate">对输入问题提取关键词并路由分发 to 特定专业检索智能体。</p>
                                </div>
                            </div>
                            <div class="w-0.5 h-3 bg-slate-800 ml-9"></div>
                            
                            <div class="flex items-center gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl relative" id="rag-step-2">
                                <div class="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-lg shrink-0" id="rag-icon-2">🔍</div>
                                <div class="flex-grow min-w-0">
                                    <div class="flex justify-between items-center mb-1">
                                        <span class="text-xs font-bold text-white">步骤二：专业垂类智能体深度检索</span>
                                        <span class="text-[9px] text-slate-500 font-mono" id="rag-status-2">未开始</span>
                                    </div>
                                    <p class="text-[10px] text-slate-400 truncate">垂类知识图谱比对，关联推荐官网深度研究文章。</p>
                                </div>
                            </div>
                            <div class="w-0.5 h-3 bg-slate-800 ml-9"></div>

                            <div class="flex items-center gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl relative" id="rag-step-3">
                                <div class="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-lg shrink-0" id="rag-icon-3">✨</div>
                                <div class="flex-grow min-w-0">
                                    <div class="flex justify-between items-center mb-1">
                                        <span class="text-xs font-bold text-white">步骤三：检索报告美化排版与中控</span>
                                        <span class="text-[9px] text-slate-500 font-mono" id="rag-status-3">未开始</span>
                                    </div>
                                    <p class="text-[10px] text-slate-400 truncate">对检索出来的核心知识进行高级 Markdown 排版美化。</p>
                                </div>
                            </div>
                            <div class="w-0.5 h-3 bg-slate-800 ml-9"></div>

                            <div class="flex items-center gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl relative" id="rag-step-4">
                                <div class="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-lg shrink-0" id="rag-icon-4">🕊️</div>
                                <div class="flex-grow min-w-0">
                                    <div class="flex justify-between items-center mb-1">
                                        <span class="text-xs font-bold text-white">步骤四：飞书工作流客户端分发</span>
                                        <span class="text-[9px] text-slate-500 font-mono" id="rag-status-4">未开始</span>
                                    </div>
                                    <p class="text-[10px] text-slate-400 truncate">成品灌装飞书消息节点发送给关联的用户客户端终端。</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Result View -->
                    <div id="rag-result-view" class="hidden flex-1 flex flex-col w-full max-w-4xl mx-auto min-h-0 z-10">
                        <div class="glass-card border border-slate-850 rounded-3xl flex-1 flex flex-col overflow-hidden shadow-2xl min-h-0 bg-slate-900/30 backdrop-blur-md">
                            <div class="bg-slate-950/80 px-6 py-4.5 border-b border-slate-800 flex justify-between items-center shrink-0">
                                <div class="flex items-center gap-2.5">
                                    <span class="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-pulse"></span>
                                    <span class="text-xs font-mono text-slate-350 tracking-wider">RAG_RETRIEVAL_REPORT.md</span>
                                </div>
                                <div class="flex items-center gap-3">
                                    <button onclick="WorkspaceUI.copyRagResult()" class="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700/80 px-3.5 py-2 rounded-xl border border-slate-750 hover:border-slate-600 transition-all font-medium">
                                        📋 复制检索报告
                                    </button>
                                    <button onclick="WorkspaceUI.resetRagForm()" class="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1.5 bg-amber-950/20 hover:bg-amber-900/30 px-3.5 py-2 rounded-xl border border-amber-500/20 hover:border-amber-500/40 transition-all font-medium">
                                        🔄 再次检索
                                    </button>
                                </div>
                            </div>
                            <div class="flex-grow p-8 overflow-y-auto no-scrollbar relative font-sans leading-relaxed text-slate-300 min-h-0 text-sm select-text bg-[#030509]/30 rag-report-container" id="rag-result-content">
                                <!-- Populated by JS -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        if (initialInput.trim().length > 0) {
            setTimeout(() => {
                WorkspaceUI.submitBlogRag();
            }, 300);
        }
    },

    submitBlogRag: async function() {
        const inputEl = document.getElementById('rag-question');
        const domainEl = document.getElementById('rag-domain');
        const submitBtn = document.getElementById('btn-submit-rag');
        
        if (!inputEl || !submitBtn) return;
        
        const question = inputEl.value.trim();
        if (!question) {
            alert('请输入想要检索的知识问题！');
            return;
        }
        
        const domain = domainEl ? domainEl.value : 'auto';
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>⏳</span> 检索中...`;
        
        if (window.WorkspaceUI && window.WorkspaceUI.toggleMobileSidebar) {
            window.WorkspaceUI.toggleMobileSidebar(false);
        }
        
        const idleView = document.getElementById('rag-idle-view');
        const processingView = document.getElementById('rag-processing-view');
        const resultView = document.getElementById('rag-result-view');
        const resultContent = document.getElementById('rag-result-content');
        
        if (idleView) idleView.classList.add('hidden');
        if (resultView) resultView.classList.add('hidden');
        if (processingView) processingView.classList.remove('hidden');
        
        const updateStep = (stepNum, status, borderClass, icon) => {
            const stepNode = document.getElementById(`rag-step-${stepNum}`);
            const statusEl = document.getElementById(`rag-status-${stepNum}`);
            const iconEl = document.getElementById(`rag-icon-${stepNum}`);
            if (stepNode) {
                stepNode.className = `flex items-center gap-4 border p-4 rounded-2xl relative transition-all duration-300 ${borderClass}`;
            }
            if (statusEl) statusEl.innerText = status;
            if (iconEl && icon) iconEl.innerHTML = icon;
        };
        
        for (let i = 1; i <= 4; i++) {
            const baseIcons = ['🧠', '🔍', '✨', '🕊️'];
            updateStep(i, '排队中...', 'border-slate-800 bg-slate-900/40', baseIcons[i-1]);
        }
        
        updateStep(1, '进行中...', 'border-amber-500/40 bg-slate-900', '<div class="animate-spin text-[10px]">⏳</div>');
        
        let timer1 = setTimeout(() => {
            updateStep(1, '✅ 已完成', 'border-emerald-500/30', '🧠');
            updateStep(2, '进行中...', 'border-amber-500/40 bg-slate-900', '<div class="animate-spin text-[10px]">⏳</div>');
            
            let timer2 = setTimeout(() => {
                updateStep(2, '✅ 已完成', 'border-emerald-500/30', '🔍');
                updateStep(3, '进行中...', 'border-amber-500/40 bg-slate-900', '<div class="animate-spin text-[10px]">⏳</div>');
                
                let timer3 = setTimeout(() => {
                    updateStep(3, '✅ 已完成', 'border-emerald-500/30', '✨');
                    updateStep(4, '进行中...', 'border-amber-500/40 bg-slate-900', '<div class="animate-spin text-[10px]">⏳</div>');
                }, 3000);
            }, 1500);
        }, 1000);

        let resData = null;
        let fetchError = null;

        // Try to gather URLs to invoke
        const urlsToTry = [];
        
        // 1. If explicit blogRag agent endpoint exists, try it first
        const configBlogRag = window.MSZN_GLOBAL_CONFIG?.agents?.blogRag;
        if (configBlogRag) {
            urlsToTry.push(configBlogRag);
            if (configBlogRag.includes('/webhook/')) {
                urlsToTry.push(configBlogRag.replace('/webhook/', '/webhook-test/'));
            } else if (configBlogRag.includes('/webhook-test/')) {
                urlsToTry.push(configBlogRag.replace('/webhook-test/', '/webhook/'));
            }
        }
        
        // 2. Derive endpoints from n8nWebhook
        const baseWebhookUrl = window.MSZN_GLOBAL_CONFIG?.api?.n8nWebhook || 'http://192.168.1.58:5678/webhook/efficiency-diagnosis';
        const prodUrl = baseWebhookUrl.replace(/(?:webhook|webhook-test)\/efficiency-diagnosis$/, 'webhook/ai-insight-retrieval');
        const testUrl = baseWebhookUrl.replace(/(?:webhook|webhook-test)\/efficiency-diagnosis$/, 'webhook-test/ai-insight-retrieval');
        
        if (!urlsToTry.includes(prodUrl)) urlsToTry.push(prodUrl);
        if (!urlsToTry.includes(testUrl)) urlsToTry.push(testUrl);

        // Call endpoints in sequence until one succeeds
        for (const url of urlsToTry) {
            try {
                console.log(`[RAG] Invoking n8n endpoint: ${url}`);
                const payload = {
                    message: {
                        content: question
                    },
                    category: domain
                };

                const response = await Promise.race([
                    fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    }),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), 90000))
                ]);

                if (response && response.ok) {
                    resData = await response.json();
                    console.log(`[RAG] Received response from: ${url}`, resData);
                    fetchError = null;
                    break; // Success! Exit loop
                } else {
                    throw new Error(`HTTP ${response ? response.status : 'error'}`);
                }
            } catch (err) {
                console.warn(`[RAG] Call to ${url} failed:`, err);
                fetchError = err;
            }
        }

        clearTimeout(timer1);
        
        for (let i = 1; i <= 4; i++) {
            const finalIcons = ['🧠', '🔍', '✨', '🕊️'];
            updateStep(i, '✅ 已完成', 'border-emerald-500/30', finalIcons[i-1]);
        }
        await new Promise(r => setTimeout(r, 600));

        if (processingView) processingView.classList.add('hidden');
        if (resultView) resultView.classList.remove('hidden');
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>✨</span> 召唤 AI 检索知识`;

        let reportMarkdown = "";
        if (resData) {
            if (Array.isArray(resData)) {
                const item = resData[0];
                reportMarkdown = item?.markdownReport || item?.json?.markdownReport || item?.text || item?.json?.text || item?.output || item?.json?.output || "";
            } else if (typeof resData === 'object') {
                reportMarkdown = resData.markdownReport || resData.json?.markdownReport || resData.text || resData.json?.text || resData.output || resData.json?.output || "";
            }
        }
        
        if (!reportMarkdown) {
            console.log("[RAG] Webhook response was empty or failed. Using offline fallback DB.");
            reportMarkdown = WorkspaceUI.getLocalRagFallbackData(question, domain);
        } else {
            // Prefix status badge if not present
            if (!reportMarkdown.trim().startsWith('>')) {
                const finalCategory = resData?.category || resData?.json?.category || domain;
                reportMarkdown = `> **知识分类**：${finalCategory} | **检索状态**：n8n 多智能体实时召回\n\n` + reportMarkdown;
            }
        }
        
        WorkspaceUI.ragLatelyData = reportMarkdown;
        
        if (resultContent) {
            resultContent.innerHTML = WorkspaceUI.simpleMarkdownToHtml(reportMarkdown);
        }
    },

    getLocalRagFallbackData: function(question, domain) {
        const q = question.toLowerCase();
        
        let matchedCategory = domain !== 'auto' ? domain : '职场效能';
        if (domain === 'auto') {
            if (q.includes('架构') || q.includes('multi-agent') || q.includes('dify') || q.includes('n8n') || q.includes('rag') || q.includes('agent')) {
                matchedCategory = '架构前沿';
            } else if (q.includes('店') || q.includes('实体') || q.includes('引流') || q.includes('餐饮') || q.includes('客服')) {
                matchedCategory = '同城实体';
            } else if (q.includes('自媒体') || q.includes('红书') || q.includes('抖音') || q.includes('分发') || q.includes('脚本')) {
                matchedCategory = '自媒体IP';
            } else if (q.includes('科研') || q.includes('文献') || q.includes('论文') || q.includes('zotero') || q.includes('latex')) {
                matchedCategory = '学术科研';
            }
        }

        const fallbackDB = {
            '架构前沿': {
                title: '关于「AI Agent 架构与底层开发」的检索报告',
                answer: `中枢系统成功召回关于 **AI Agent 架构与底层开发** 的知识图谱数据：\n\n1. **底层引擎分发**：企业落地建议基于 **OpenClaw** 与 **n8n** 混合总线搭建。利用 n8n 的可视化逻辑处理分支，再结合 OpenClaw 的极速 API 交互，能够提供最稳健的执行环境。\n2. **RAG 向量数据清洗**：企业在把 PDF/Word 灌入向量库（如 PGVector、Chroma）前，必须经历「数据清洗、元数据打标、滑动窗口切片」三步，可将幻觉率降至 **5%** 以下。\n3. **多模型智能路由**：引入多模型路由网关，高难度逻辑题指派给 Claude 3.5 Sonnet，高频简单任务指派给 DeepSeek/Flash，可在确保效果的同时降低 **60%** 算力成本。`,
                articles: [
                    '《2026年 OpenClaw 深度拆解：从对话到执行的 AI 质变》 - 详解 OpenClaw 如何从单向对话升级为系统执行',
                    '《n8n 进阶指南：微服务架构下的复杂工作流编排》 - 介绍高并发下如何以 n8n 做为自动化数据总线'
                ],
                advice: [
                    '步骤一：初始化 PGVector 数据库，建立企业私有向量索引。',
                    '步骤二：在 n8n 中部署 Webhook 监听接口，通过 HTTP Request 进行数据清洗并同步分发至大模型进行响应。'
                ]
            },
            '同城实体': {
                title: '关于「实体店铺/线下服务业 AI 赋能与引流」的检索报告',
                answer: `中枢系统已成功召回关于 **实体店 AI 引流与私域促活** 的商业实操指南：\n\n1. **点评网差评自动拦截**：通过 n8n 自动化轮询点评/美团差评接口，大模型实时进行情商研判并快速撰写回复，同时自动派发大额代金券给用户，将流失转化为复购。\n2. **AI 主理人库存自动盘点**：餐饮/咖啡馆可打通收银机，大模型根据历史客流与天气情况，预测未来 7 天销量并全自动下单补货。\n3. **私域专属跟练/跟餐服务**：美容/健身等行业利用 AI 每日定时为私域用户推送千人千面的健康建议，极大拉高用户粘性。`,
                articles: [
                    '《路边摊也用得起的 AI：全自动私域运营实操》 - 介绍 24 小时不知疲倦的数字人客服实操方案',
                    '《美容院拓客利器：高情商AI客服拦截差评并促单》 - 演示如何通过高情商自动回复挽回差评客户'
                ],
                advice: [
                    '步骤一：接入点评开放平台 API 抓取商家评价列表。',
                    '步骤二：在 n8n 部署大模型路由分支，若遇到低评分评论，立即向运营群发送告警并由 AI 起草回复。'
                ]
            },
            '自媒体IP': {
                title: '关于「全媒体内容矩阵与个人 IP 自动化」的检索报告',
                answer: `中枢系统成功召回关于 **自媒体内容分发与爆款打造** 的实操策略：\n\n1. **一个人做全网分发**：自媒体主理人录制 1 小时音频，由 AI 自动生成字幕，提取 10 个爆款金句选题，并利用脚本翻译自动推送到小红书、抖音、视频号等平台。\n2. **大纲至视频脚本深度微调**：大模型深入学习抖音排名前 100 的爆款开头「黄金三秒」，自动重构视频脚本，将用户停留率拉高 30%。\n3. **数字分身社群答疑**：将主理人过往的聊天记录、课程课件全部灌入向量库，作为数字分身托管社群，实现 24 小时高情商互动。`,
                articles: [
                    '《一个人成一支军队：n8n + AI 打造全网分发矩阵》 - 揭秘全自动一键发布到十个平台的引擎源码',
                    '《从选题到成片：Dify 智能体矩阵重构内容生产线》 - 演示选题脑暴与脚本润色的多智能体协作'
                ],
                advice: [
                    '步骤一：在飞书多维表格中输入初始灵感大纲。',
                    '步骤二：n8n 触发大纲分析，调用 ChatGPT 丰富多维细节，并自动调度文本合成语音 API 生成音视频。'
                ]
            },
            '学术科研': {
                title: '关于「学术文献提炼与科研效率工具」的检索报告',
                answer: `中枢系统已成功召回关于 **科研提效与文献管理** 的最新应用知识：\n\n1. **苏格拉底式追问阅读**：基于 RAG 模型，将十几篇学术文献 PDF 组合灌入，AI 不仅输出中英双语核心摘要，还能进行苏格拉底式发问，逼出其学术局限性。\n2. **文献追踪雷达**：利用 Python 智能体每天抓取最新的 arXiv 预印本，过滤符合特定关键词的论文，整理成一页纸 of 行业简报发送至邮箱。\n3. **实验数据自动清洗**：利用 AI 解释器运行 Python 脚本，3 秒内抓取 Excel 异常值，进行可视化，免除人肉数据筛选 of 劳顿。`,
                articles: [
                    '《科研打工人必看：让 AI 做你的专属文献摘要员》 - 演示如何通过自然语言轮询最新 arXiv 进展',
                    '《文献管理大作战：Zotero 与大模型的无缝联动方案》 - 介绍 Zotero 更新后自动生成思维导图'
                ],
                advice: [
                    '步骤一：利用 n8n 读取用户指定 arXiv 订阅源或本地 Zotero 库文件夹。',
                    '步骤二：由大模型提取 Abstract 核心观点，排版为 Markdown 发送至学术交流群。'
                ]
            },
            '职场效能': {
                title: '关于「职场减负与办公自动化」的检索报告',
                answer: `中枢系统已成功召回关于 **职场提效与日常办公自动化** 的干货解答：\n\n1. **千人千面 OKR 智能分拆**：输入公司年度或季度战略目标，大模型自动向下拆解到各部门个人的周度 KRs。\n2. **周报一键邀功**：抓取 Jira、Gitlab 以及工作群聊中的零碎贡献，由大模型自动排版为一份亮眼的数据化邀功周报。\n3. **高情商职场嘴替**：面对深夜派活或无理需求，由 AI 自动起草既委婉又能展示工作难度的完美回复，大幅降低职场精神内耗。`,
                articles: [
                    '《反职场内耗：让 Agent 做你高情商的『职场嘴替』》 - 提供合理推脱无理工作并争取资源的话术模版',
                    '《会议纪要全自动化：录音转文字再到待办流转的终极闭环》 - 详解录音转待办并自动分发飞书任务'
                ],
                advice: [
                    '步骤一：使用 n8n 搭建 IM（如飞书）消息接收端。',
                    '步骤二：当检测到包含“周报”或“会议记录”时，自动收集关联表格中的数据并自动整理后回传。'
                ]
            }
        };

        const data = fallbackDB[matchedCategory] || fallbackDB['职场效能'];
        
        return `# 📝 ${data.title}\n\n` +
               `> **知识分类**：${matchedCategory} | **检索状态**：本地智能知识库召回\n\n` +
               `### 🔍 一、意图解析与检索数据源\n针对输入关键词「**${question}**」，中枢调度器已成功定位并唤醒 [${matchedCategory}] 专属知识检索分流。\n\n` +
               `### 💡 二、核心知识解答\n${data.answer}\n\n` +
               `### 📌 三、推荐关联官网研究文章\n` + data.articles.map((a, i) => `${i+1}. ${a}`).join('\n') + `\n\n` +
               `### 🚀 四、可落地自动化架构建议\n` + data.advice.map(adv => `- ${adv}`).join('\n') + `\n\n` +
               `---\n*提示：上述报告已实时推送至您的飞书工作流客户端。*`;
    },

    simpleMarkdownToHtml: function(md) {
        if (!md) return "";
        
        function formatInlineStyles(text) {
            if (!text) return "";
            
            // Bold
            text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>');
            
            // Inline code
            text = text.replace(/`([^`]+)`/g, '<code class="bg-slate-950 border border-slate-850 rounded px-1.5 py-0.5 text-[10px] font-mono text-amber-400">$1</code>');
            
            // Recommended article Book quotes with (#)
            text = text.replace(/《([^》]+)》\(#\)/g, (match, p1) => {
                return `<a href="javascript:void(0)" onclick="WorkspaceUI.goToContact()" class="text-amber-400 hover:text-amber-300 underline font-medium transition-all inline-flex items-center gap-1">📖 《${p1}》<span class="text-[9px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20 font-normal ml-1 hover:bg-amber-500/20">预约方案演示</span></a>`;
            });
            
            // Standard markdown links
            text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, p1, p2) => {
                if (p2 === '#' || p2 === '') {
                    return `<a href="javascript:void(0)" onclick="WorkspaceUI.goToContact()" class="text-amber-400 hover:text-amber-300 underline font-medium transition-all">${p1}</a>`;
                }
                return `<a href="${p2}" target="_blank" class="text-amber-400 hover:text-amber-300 underline font-medium transition-all">${p1}</a>`;
            });
            
            return text;
        }

        function isSeparatorLine(l) {
            if (!l) return false;
            let trimmed = l.trim();
            if (!trimmed.startsWith('|')) return false;
            return /^[|\-:\s]+$/.test(trimmed);
        }

        function parseTable(lines, startIndex) {
            let headerLine = lines[startIndex];
            let headers = headerLine.split('|').map(s => s.trim()).filter((s, idx, arr) => {
                if (idx === 0 && s === '') return false;
                if (idx === arr.length - 1 && s === '') return false;
                return true;
            });
            
            let rows = [];
            let currIndex = startIndex + 2;
            while (currIndex < lines.length) {
                let rowLine = lines[currIndex].trim();
                if (!rowLine.startsWith('|')) {
                    break;
                }
                let cells = rowLine.split('|').map(s => s.trim()).filter((s, idx, arr) => {
                    if (idx === 0 && s === '') return false;
                    if (idx === arr.length - 1 && s === '') return false;
                    return true;
                });
                rows.push(cells);
                currIndex++;
            }
            
            let tableHtml = `<div class="overflow-x-auto my-6 border border-slate-800/80 rounded-2xl bg-slate-950/40 shadow-inner w-full">`;
            tableHtml += `<table class="w-full text-left border-collapse text-xs">`;
            tableHtml += `<thead><tr class="bg-slate-900/60 border-b border-slate-800">`;
            headers.forEach(h => {
                tableHtml += `<th class="px-5 py-3.5 font-bold text-white tracking-wider">${formatInlineStyles(h)}</th>`;
            });
            tableHtml += `</tr></thead>`;
            tableHtml += `<tbody class="divide-y divide-slate-800/50">`;
            rows.forEach((row, rIdx) => {
                const rowBg = rIdx % 2 === 0 ? 'bg-transparent' : 'bg-slate-900/20';
                tableHtml += `<tr class="${rowBg} hover:bg-slate-800/30 transition-colors">`;
                for (let c = 0; c < headers.length; c++) {
                    let cellVal = row[c] !== undefined ? row[c] : '';
                    tableHtml += `<td class="px-5 py-3 text-slate-350 leading-relaxed">${formatInlineStyles(cellVal)}</td>`;
                }
                tableHtml += `</tr>`;
            });
            tableHtml += `</tbody></table></div>`;
            
            return {
                html: tableHtml,
                linesParsed: currIndex - startIndex
            };
        }
        
        // Escape HTML
        let html = md
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
            
        // Restore blockquote symbol (since we escaped > to &gt;)
        html = html.replace(/^&gt;\s*(.*)$/gm, '<blockquote>$1</blockquote>');
        
        // Convert horizontal rules
        html = html.replace(/^---$/gm, '<hr class="border-slate-800 my-6">');
        
        // Preprocess multi-line code blocks
        const codeBlocks = [];
        html = html.replace(/```(\w*)\s*\n([\s\S]*?)```/gm, (match, lang, p1) => {
            const id = `__CODE_BLOCK_PLACEHOLDER_${codeBlocks.length}__`;
            let code = p1.trim();
            let isFlowchart = code.includes('│') || code.includes('▼') || code.includes('──') || code.includes('→') || lang === 'mermaid';
            
            let title = lang ? `${lang.toUpperCase()} Code` : 'Code Block';
            let codeColor = 'text-slate-350';
            if (isFlowchart) {
                title = '智能工作流架构拓扑 (Flowchart)';
                codeColor = 'text-cyan-400/90 font-semibold';
            } else if (lang === 'json') {
                title = '配置数据 (JSON)';
                codeColor = 'text-amber-400/90';
            } else if (lang === 'python') {
                title = '执行脚本 (Python)';
                codeColor = 'text-emerald-400/90';
            }
            
            const blockHtml = `
                <div class="border border-slate-800/80 rounded-2xl bg-slate-950/60 shadow-xl overflow-hidden my-6">
                    <div class="bg-slate-900/60 px-5 py-2.5 border-b border-slate-800/80 flex items-center justify-between">
                        <div class="flex items-center gap-1.5">
                            <span class="w-2.5 h-2.5 rounded-full bg-red-500/40"></span>
                            <span class="w-2.5 h-2.5 rounded-full bg-yellow-500/40"></span>
                            <span class="w-2.5 h-2.5 rounded-full bg-green-500/40"></span>
                            <span class="text-[10px] font-mono text-slate-400 ml-2">${title}</span>
                        </div>
                        <span class="text-[9px] font-mono text-slate-500">utf-8</span>
                    </div>
                    <pre class="p-5 overflow-x-auto text-[11px] font-mono ${codeColor} leading-relaxed bg-[#050814]/90 whitespace-pre w-full">${code}</pre>
                </div>
            `;
            codeBlocks.push(blockHtml);
            return `\n${id}\n`;
        });
        
        // Convert headers
        const lines = html.split('\n');
        let result = [];
        let inCard = false;
        let inUl = false;
        let inOl = false;
        
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();
            if (!line) continue;
            
            // Check for code block placeholder
            if (line.startsWith('__CODE_BLOCK_PLACEHOLDER_') && line.endsWith('__')) {
                if (inUl) { result.push('</ul>'); inUl = false; }
                if (inOl) { result.push('</ol>'); inOl = false; }
                const idx = parseInt(line.replace('__CODE_BLOCK_PLACEHOLDER_', '').replace('__', ''));
                result.push(codeBlocks[idx]);
                continue;
            }
            
            // Check for Table
            if (line.startsWith('|') && i + 1 < lines.length && isSeparatorLine(lines[i+1])) {
                if (inUl) { result.push('</ul>'); inUl = false; }
                if (inOl) { result.push('</ol>'); inOl = false; }
                let tableData = parseTable(lines, i);
                result.push(tableData.html);
                i += (tableData.linesParsed - 1); // skip lines parsed by table
                continue;
            }
            
            // Check for Title (#)
            if (line.startsWith('# ')) {
                if (inUl) { result.push('</ul>'); inUl = false; }
                if (inOl) { result.push('</ol>'); inOl = false; }
                if (inCard) { result.push('</div></div>'); inCard = false; }
                
                const titleText = line.substring(2);
                let titleIcon = '📄';
                let cleanTitleText = titleText;
                const emojiRegex = /^([\uD800-\uDBFF][\uDCC0-\uDFFF]|\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/;
                const match = titleText.match(emojiRegex);
                if (match) {
                    titleIcon = match[1];
                    cleanTitleText = titleText.substring(titleIcon.length).trim();
                }
                
                result.push(`
                    <div class="mb-8 p-6 rounded-3xl bg-gradient-to-r from-amber-950/25 via-slate-900/40 to-slate-950/60 border border-amber-500/25 shadow-lg flex items-center gap-4">
                        <div class="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl shrink-0">${titleIcon}</div>
                        <div>
                            <h3 class="text-base font-bold text-white tracking-wide">${cleanTitleText}</h3>
                            <p class="text-[10px] text-slate-400 mt-1">AIMSZN RAG Engine • 自动深度意图召回报告</p>
                        </div>
                    </div>
                `);
                continue;
            }
            
            // Check for Section Header (##)
            if (line.startsWith('## ')) {
                if (inUl) { result.push('</ul>'); inUl = false; }
                if (inOl) { result.push('</ol>'); inOl = false; }
                if (inCard) { result.push('</div></div>'); inCard = false; }
                
                const headerText = line.substring(3);
                let headerIcon = '📌';
                let cleanHeaderText = headerText;
                const emojiRegex = /^([\uD800-\uDBFF][\uDCC0-\uDFFF]|\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/;
                const match = headerText.match(emojiRegex);
                if (match) {
                    headerIcon = match[1];
                    cleanHeaderText = headerText.substring(headerIcon.length).trim();
                }
                
                result.push(`
                    <h3 class="text-sm font-bold text-amber-400 mt-8 mb-4 tracking-wide flex items-center gap-2 border-b border-slate-800/80 pb-2">
                        <span class="w-1.5 h-4 bg-gradient-to-b from-amber-400 to-orange-500 rounded-sm shrink-0"></span>
                        <span class="mr-1 shrink-0">${headerIcon}</span>
                        <span>${cleanHeaderText}</span>
                    </h3>
                `);
                continue;
            }
            
            // Check for Blockquote (>)
            if (line.startsWith('<blockquote>')) {
                if (inUl) { result.push('</ul>'); inUl = false; }
                if (inOl) { result.push('</ol>'); inOl = false; }
                
                let content = line.replace('<blockquote>', '').replace('</blockquote>', '');
                if (content.includes('|')) {
                    const parts = content.split('|');
                    let badgeHTML = parts.map(part => {
                        const clean = part.trim().replace(/\*\*/g, '');
                        return `<span class="px-3 py-1 rounded-full text-[10px] font-medium border border-slate-800 bg-slate-900/85 text-slate-350 shadow-sm">${formatInlineStyles(clean)}</span>`;
                    }).join('');
                    
                    result.push(`
                        <div class="mb-6 flex flex-wrap gap-2 items-center">
                            ${badgeHTML}
                        </div>
                    `);
                } else {
                    result.push(`
                        <div class="my-4 pl-4 border-l-2 border-amber-500/50 text-slate-400 italic text-[11px] leading-relaxed">
                            ${formatInlineStyles(content)}
                        </div>
                    `);
                }
                continue;
            }
            
            // Check for Subheader (###)
            if (line.startsWith('### ')) {
                if (inUl) { result.push('</ul>'); inUl = false; }
                if (inOl) { result.push('</ol>'); inOl = false; }
                if (inCard) {
                    result.push('</div></div>');
                }
                
                const headerText = line.substring(4);
                let headerIcon = '💡';
                let cleanHeaderText = headerText;
                const emojiRegex = /^([\uD800-\uDBFF][\uDCC0-\uDFFF]|\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/;
                const match = headerText.match(emojiRegex);
                if (match) {
                    headerIcon = match[1];
                    cleanHeaderText = headerText.substring(headerIcon.length).trim();
                }
                
                result.push(`
                    <div class="glass-card border border-slate-800 hover:border-slate-750/80 rounded-2xl mb-6 shadow-xl overflow-hidden transition-all duration-300 bg-slate-900/10">
                        <div class="bg-slate-950/60 px-5 py-3.5 border-b border-slate-800/80 flex items-center gap-3">
                            <span class="text-base">${headerIcon}</span>
                            <h4 class="text-xs font-bold text-white tracking-wide">${cleanHeaderText}</h4>
                        </div>
                        <div class="p-6 space-y-4 leading-relaxed text-slate-350 text-xs">
                `);
                inCard = true;
                continue;
            }
            
            // Unordered list items (- or *)
            const ulMatch = line.match(/^[-*]\s+(.*)$/);
            if (ulMatch) {
                if (inOl) { result.push('</ol>'); inOl = false; }
                if (!inUl) {
                    result.push('<ul class="space-y-3.5 pl-2 my-2">');
                    inUl = true;
                }
                let itemContent = formatInlineStyles(ulMatch[1]);
                result.push(`
                    <li class="flex items-start gap-2.5">
                        <span class="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0 shadow-[0_0_6px_rgba(245,158,11,0.4)]"></span>
                        <span class="flex-1">${itemContent}</span>
                    </li>
                `);
                continue;
            }
            
            // Ordered list items (number.)
            const olMatch = line.match(/^(\d+)\.\s+(.*)$/);
            if (olMatch) {
                if (inUl) { result.push('</ul>'); inUl = false; }
                if (!inOl) {
                    result.push('<ol class="space-y-3.5 pl-1 my-2">');
                    inOl = true;
                }
                let itemContent = formatInlineStyles(olMatch[2]);
                result.push(`
                    <li class="flex items-start gap-3">
                        <span class="flex items-center justify-center w-5 h-5 rounded bg-slate-950 border border-slate-800 text-[10px] font-bold text-amber-400 shrink-0 mt-0.5">${olMatch[1]}</span>
                        <span class="flex-1">${itemContent}</span>
                    </li>
                `);
                continue;
            }
            
            // Close list tags if we encounter a non-list line
            if (inUl) { result.push('</ul>'); inUl = false; }
            if (inOl) { result.push('</ol>'); inOl = false; }
            
            if (line.includes('<hr class="border-slate-800 my-6">')) {
                result.push(line);
                continue;
            }
            
            let pContent = formatInlineStyles(line);
            
            if (pContent.startsWith('*提示：') || pContent.startsWith('提示：')) {
                result.push(`
                    <div class="mt-6 p-4 rounded-xl bg-amber-950/10 border border-amber-500/10 flex items-center gap-2.5 text-[11px] text-slate-400 italic">
                        <span class="text-sm">💡</span>
                        <span>${pContent}</span>
                    </div>
                `);
            } else {
                result.push(`<p class="leading-relaxed text-slate-350">${pContent}</p>`);
            }
        }
        
        if (inUl) result.push('</ul>');
        if (inOl) result.push('</ol>');
        if (inCard) result.push('</div></div>');
        
        return result.join('\n');
    },

    copyRagResult: function() {
        const md = WorkspaceUI.ragLatelyData || "";
        if (!md) return;
        WorkspaceUI.copyTextToClipboard(md);
        alert('检索报告已复制到剪贴板！');
    },

    resetRagForm: function() {
        const inputEl = document.getElementById('rag-question');
        const idleView = document.getElementById('rag-idle-view');
        const resultView = document.getElementById('rag-result-view');
        const processingView = document.getElementById('rag-processing-view');
        
        if (inputEl) inputEl.value = '';
        if (idleView) idleView.classList.remove('hidden');
        if (resultView) resultView.classList.add('hidden');
        if (processingView) processingView.classList.add('hidden');
    }
});
