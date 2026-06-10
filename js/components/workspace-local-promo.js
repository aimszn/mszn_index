// ============================================
// 麻升智能工作室 - 沉浸式工作台
// 街边店爆款营销大脑 (Local Promo) Component
// ============================================

Object.assign(window.WorkspaceUI, {
    promoTone: 'sensory',
    promoSelectedImage: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=600',
    promoLikeActive: false,
    promoLikeCount: 99,
    promoLatelyData: null,

    promoImages: {
        coffee: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=600',
        bakery: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600',
        flowers: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=600',
        boutique: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=600',
        dining: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=600',
        beauty: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=600',
        wellness: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600'
    },

    renderLocalPromo: function(title, icon) {
        const content = document.getElementById('ws-main-content');
        content.innerHTML = `
            <style>
                .promo-tone-btn {
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .promo-img-preset {
                    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .promo-img-preset.border-emerald-500 {
                    box-shadow: 0 0 12px rgba(16, 185, 129, 0.3);
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                @keyframes pulse-flow {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animated-flow-line {
                    background: linear-gradient(90deg, #1e293b, #10b981, #1e293b);
                    background-size: 200% 200%;
                    animation: pulse-flow 2s linear infinite;
                }
            </style>
            <div class="h-full flex flex-col md:flex-row w-full overflow-hidden">
                <!-- 左侧表单参数控制区 -->
                <div class="ws-sidebar-panel fixed md:relative inset-y-0 left-0 z-50 md:z-0 w-[300px] md:w-[340px] bg-[#0d1324] md:bg-slate-900/50 border-r border-slate-800 p-6 flex flex-col gap-5 overflow-y-auto no-scrollbar shrink-0 transform -translate-x-full md:translate-x-0 transition-transform duration-300">
                    <div>
                        <label class="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">目标受众行业</label>
                        <select id="promo-industry" onchange="WorkspaceUI.changePromoIndustry(this.value)" class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors">
                            <option value="coffee">☕ 咖啡茶饮 (Coffee & Tea)</option>
                            <option value="bakery">🍰 烘焙甜品 (Bakery & Dessert)</option>
                            <option value="flowers">💐 鲜花绿植 (Floristry & Plants)</option>
                            <option value="boutique">👗 精品服饰 (Boutique & Apparel)</option>
                            <option value="dining">🍝 特色餐饮 (Dining & Catering)</option>
                            <option value="beauty">💇‍♂️ 美容美发 (Beauty & Hairdressing)</option>
                            <option value="wellness">🧘 健康养生 (Health & Wellness)</option>
                        </select>
                    </div>
                    
                    <div>
                        <label class="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider font-semibold">输出口吻预设</label>
                        <div class="grid grid-cols-2 gap-2" id="promo-tone-group">
                            <button onclick="WorkspaceUI.selectPromoTone('sensory')" data-tone="sensory" class="promo-tone-btn bg-emerald-950/20 border border-emerald-500/50 text-emerald-400 text-[11px] py-2 rounded-lg font-bold transition-all">😋 诱人吸睛</button>
                            <button onclick="WorkspaceUI.selectPromoTone('poetic')" data-tone="poetic" class="promo-tone-btn bg-slate-950 border border-slate-800 text-slate-400 text-[11px] py-2 rounded-lg hover:border-slate-700 transition-all">🌸 文艺浪漫</button>
                            <button onclick="WorkspaceUI.selectPromoTone('promo')" data-tone="promo" class="promo-tone-btn bg-slate-950 border border-slate-800 text-slate-400 text-[11px] py-2 rounded-lg hover:border-slate-700 transition-all">🔥 限时促销</button>
                            <button onclick="WorkspaceUI.selectPromoTone('meme')" data-tone="meme" class="promo-tone-btn bg-slate-950 border border-slate-800 text-slate-400 text-[11px] py-2 rounded-lg hover:border-slate-700 transition-all">😂 幽默玩梗</button>
                            <button onclick="WorkspaceUI.selectPromoTone('daily')" data-tone="daily" class="promo-tone-btn bg-slate-950 border border-slate-800 text-slate-400 text-[11px] py-2 rounded-lg hover:border-slate-700 transition-all">🌤️ 日常打卡</button>
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">核心素材 / 关键词</label>
                        <textarea id="promo-keywords" class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 h-24 resize-none leading-relaxed" placeholder="输入你想宣传的新品、核心卖点或活动细节... (如: 草莓新品、买一送一)"></textarea>
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">实物图片模拟选择</label>
                        <div class="grid grid-cols-3 gap-2" id="promo-image-selector">
                            <!-- Filled by JS -->
                        </div>
                    </div>

                    <button id="btn-submit-promo" onclick="WorkspaceUI.submitLocalPromo()" class="mt-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center gap-2">
                         <span>🏪</span> 一键生成朋友圈爆款
                    </button>
                </div>

                <!-- 右侧模拟器/工作流渲染区 -->
                <div class="flex-1 p-4 sm:p-8 overflow-y-auto bg-tech-grid flex flex-col items-center justify-center relative">
                    <!-- Idle View -->
                    <div id="promo-idle-view" class="w-full max-w-md bg-[#191919] border border-slate-800 rounded-[36px] shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col transition-all duration-300">
                        <div class="h-6 bg-[#2c2c2c] flex items-center justify-between px-6 text-[10px] text-slate-400 select-none border-b border-[#1f1f1f]">
                            <span>9:41</span>
                            <div class="flex items-center gap-1">
                                <span>📶</span>
                                <span>🔋 100%</span>
                            </div>
                        </div>
                        
                        <div class="bg-[#2c2c2c] py-3.5 px-4 flex items-center border-b border-[#1f1f1f]">
                            <span class="text-xs text-slate-400 mr-auto flex items-center gap-1 select-none">◀ 微信</span>
                            <span class="text-sm font-bold text-[#e5e5e5]">朋友圈模拟器</span>
                            <span class="text-base text-slate-400 ml-auto select-none">📷</span>
                        </div>

                        <div class="flex-1 p-6 flex flex-col justify-center items-center text-center gap-4 bg-[#191919] min-h-[460px]">
                            <div class="w-16 h-16 rounded-full bg-emerald-950/30 border border-emerald-500/20 flex items-center justify-center text-3xl animate-bounce">🏪</div>
                            <h4 class="text-[#e5e5e5] font-bold text-base">实体店营销沙箱</h4>
                            <p class="text-xs text-slate-500 max-w-[280px] leading-relaxed">在左侧设置您的店铺行业、营销口吻和产品关键词，点击“一键生成”即可在此处实时模拟预览高保真的朋友圈推广贴！</p>
                        </div>
                    </div>

                    <!-- Processing View -->
                    <div id="promo-processing-view" class="hidden w-full max-w-md bg-slate-900/80 border border-slate-800 p-8 rounded-3xl flex flex-col gap-6 shadow-2xl backdrop-blur-md">
                        <h4 class="text-white font-bold text-sm tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
                            <div class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
                            n8n 自动化营销大脑运转中...
                        </h4>
                        <div class="space-y-3" id="promo-pipeline-steps">
                            <!-- Filled by JS -->
                        </div>
                    </div>

                    <!-- Result View -->
                    <div id="promo-result-view" class="hidden w-full max-w-4xl h-full flex flex-col gap-4">
                        <div class="flex border-b border-slate-800 pb-2 gap-4 shrink-0">
                            <button onclick="WorkspaceUI.switchPromoTab('moments')" id="promo-tab-btn-moments" class="promo-tab-btn px-4 py-2 text-xs font-bold text-emerald-400 border-b-2 border-emerald-500">📱 朋友圈实时模拟</button>
                            <button onclick="WorkspaceUI.switchPromoTab('n8n')" id="promo-tab-btn-n8n" class="promo-tab-btn px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors">⚙️ 查看n8n营销工作流流程图</button>
                        </div>

                        <div class="flex-grow overflow-hidden relative">
                            <!-- Tab Content: Moments -->
                            <div id="promo-tab-content-moments" class="h-full flex items-center justify-center">
                                <div class="w-full max-w-md bg-[#191919] border border-slate-800 rounded-[36px] shadow-[0_20px_50px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col h-[95%]">
                                    <!-- Mobile top bar -->
                                    <div class="h-6 bg-[#2c2c2c] flex items-center justify-between px-6 text-[10px] text-slate-400 select-none border-b border-[#1f1f1f]">
                                        <span>9:41</span>
                                        <div class="flex items-center gap-1">
                                            <span>📶</span>
                                            <span>🔋 100%</span>
                                        </div>
                                    </div>
                                    <div class="bg-[#2c2c2c] py-3 px-4 flex items-center border-b border-[#1f1f1f] shrink-0">
                                        <span class="text-xs text-slate-400 mr-auto select-none">◀ 微信</span>
                                        <span class="text-sm font-bold text-[#e5e5e5]">朋友圈</span>
                                        <span class="text-base text-slate-400 ml-auto select-none">📷</span>
                                    </div>

                                    <!-- Moments Feed scrollable container -->
                                    <div class="flex-1 overflow-y-auto no-scrollbar bg-[#191919] p-4 space-y-4">
                                        <div class="flex gap-3">
                                            <!-- Store Avatar -->
                                            <div id="moments-avatar" class="w-10 h-10 rounded-lg bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-xl shrink-0"></div>
                                            
                                            <!-- Post content -->
                                            <div class="flex-1 space-y-2.5">
                                                <!-- Store Name -->
                                                <div class="flex flex-col">
                                                    <span id="moments-store-name" class="font-bold text-[#576b95] text-[13px] hover:underline cursor-pointer"></span>
                                                    <span class="text-[9px] text-slate-500">主理人 AI 分身</span>
                                                </div>

                                                <!-- Generated copy text -->
                                                <p id="moments-copy-text" class="text-[13px] text-[#e5e5e5] whitespace-pre-wrap leading-relaxed select-text"></p>

                                                <!-- Post photo -->
                                                <div class="w-48 rounded-lg overflow-hidden border border-slate-800 shadow-sm bg-[#121212]">
                                                    <img id="moments-photo" class="w-full h-32 object-cover" src="" alt="Promo Photo">
                                                </div>

                                                <!-- Location & Time -->
                                                <div class="flex flex-col gap-1.5">
                                                    <span id="moments-location" class="text-[10px] text-[#576b95] hover:underline cursor-pointer">📍 </span>
                                                    <div class="flex justify-between items-center text-[10px] text-slate-500">
                                                        <span>刚刚</span>
                                                        <button onclick="WorkspaceUI.toggleMomentsLike()" class="text-slate-400 hover:text-rose-500 text-xs flex items-center gap-0.5 select-none bg-slate-800/50 px-2 py-0.5 rounded border border-slate-700 active:scale-95 transition-all">
                                                            <span id="moments-like-heart" class="text-slate-400">🤍</span> <span class="text-[10px]">赞</span>
                                                        </button>
                                                    </div>
                                                </div>

                                                <!-- Comments and likes box -->
                                                <div class="bg-[#222] rounded-[4px] p-2.5 text-[11px] space-y-2 border border-slate-800 relative mt-2">
                                                    <!-- Likes line -->
                                                    <div class="flex items-center gap-1.5 border-b border-[#2a2a2a] pb-1.5 text-[#576b95] font-bold">
                                                        <span>❤️</span>
                                                        <span id="moments-like-list"></span>
                                                    </div>
                                                    <!-- Comments list -->
                                                    <div class="space-y-1.5 leading-relaxed" id="moments-comments-list">
                                                        <!-- Filled by JS -->
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Action buttons at bottom of moments phone -->
                                    <div class="bg-[#2c2c2c] border-t border-[#1f1f1f] p-3 flex gap-3 shrink-0">
                                        <button onclick="WorkspaceUI.copyPromoText()" class="flex-1 py-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold transition-all active:scale-95">📋 复制朋友圈文案</button>
                                        <button onclick="WorkspaceUI.copyPromoImagePrompt()" class="flex-1 py-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold transition-all active:scale-95">🎨 复制 AI 绘图提示词</button>
                                    </div>
                                </div>
                            </div>

                            <!-- Tab Content: n8n Details -->
                            <div id="promo-tab-content-n8n" class="hidden h-full flex flex-col gap-4 bg-slate-950/60 border border-slate-800 rounded-2xl p-6">
                                <div class="flex justify-between items-center bg-slate-900/40 p-4 border border-slate-800 rounded-xl shrink-0">
                                    <div>
                                        <h4 class="text-white font-bold text-xs">n8n 商业增长工作流 (已装载)</h4>
                                        <p class="text-[10px] text-slate-500 mt-1">此工作流由前端意图调度分发给不同的风格文案子代理，进行排版整合后，直推飞书并回执。</p>
                                    </div>
                                    <div class="flex gap-2">
                                        <button onclick="WorkspaceUI.copyPromoN8NJson()" class="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-750 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all">
                                            <span>📋</span> 复制工作流 JSON
                                        </button>
                                        <button onclick="WorkspaceUI.downloadLocalPromoN8NJson()" class="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all">
                                            <span>📥</span> 下载工作流 JSON 文件
                                        </button>
                                    </div>
                                </div>
                                
                                <!-- Visual flow pipeline -->
                                <div class="flex-grow flex flex-col items-center justify-center border border-slate-800 bg-[#0c0f17] rounded-xl p-8 relative overflow-hidden min-h-[300px]">
                                    <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(rgba(255,255,255,0.08) 1px, transparent 0); background-size: 20px 20px;"></div>
                                    <div class="absolute top-4 left-4 text-[9px] font-mono text-slate-600 uppercase select-none tracking-wider">n8n Workflow Canvas</div>
                                    
                                    <div class="flex items-center justify-between w-full max-w-3xl relative z-10 gap-1.5">
                                        <!-- Node 1: Webhook -->
                                        <div class="flex flex-col items-center w-28 bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-lg relative group hover:border-emerald-500/40 transition-colors">
                                            <div class="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-emerald-500 border border-[#0c0f17] shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></div>
                                            <div class="w-9 h-9 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-sm mb-2 shadow-inner">⚡</div>
                                            <span class="text-[11px] font-bold text-white">Webhook</span>
                                            <span class="text-[8px] font-mono text-slate-500 mt-1 select-none">触发端点</span>
                                        </div>
                                        <div class="h-0.5 flex-1 relative min-w-[20px] animated-flow-line"></div>
                                        
                                        <!-- Node 2: Router -->
                                        <div class="flex flex-col items-center w-28 bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-lg relative group hover:border-emerald-500/40 transition-colors">
                                            <div class="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-emerald-500 border border-[#0c0f17] shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></div>
                                            <div class="w-9 h-9 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-sm mb-2 shadow-inner">🧠</div>
                                            <span class="text-[11px] font-bold text-white">调度中脑</span>
                                            <span class="text-[8px] font-mono text-slate-500 mt-1 select-none">意图解析</span>
                                        </div>
                                        <div class="h-0.5 flex-1 relative min-w-[20px] animated-flow-line"></div>
                                        
                                        <!-- Node 3: Switch -->
                                        <div class="flex flex-col items-center w-28 bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-lg relative group hover:border-emerald-500/40 transition-colors">
                                            <div class="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-emerald-500 border border-[#0c0f17] shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></div>
                                            <div class="w-9 h-9 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-sm mb-2 shadow-inner">🔀</div>
                                            <span class="text-[11px] font-bold text-white">风格流转</span>
                                            <span class="text-[8px] font-mono text-slate-500 mt-1 select-none">流转矩阵</span>
                                        </div>
                                        <div class="h-0.5 flex-1 relative min-w-[20px] animated-flow-line"></div>
                                        
                                        <!-- Node 4: Agent (Active) -->
                                        <div class="flex flex-col items-center w-28 bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-3 shadow-lg relative group hover:border-emerald-500 transition-colors">
                                            <div class="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-emerald-400 border border-[#0c0f17] shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-ping"></div>
                                            <div class="w-9 h-9 rounded-lg bg-slate-950 border border-emerald-500/30 flex items-center justify-center text-sm mb-2 text-emerald-400 shadow-inner">✍️</div>
                                            <span class="text-[11px] font-bold text-emerald-400" id="n8n-pipeline-active-agent">风格专家</span>
                                            <span class="text-[8px] font-mono text-emerald-500 mt-1 select-none">写作智能体</span>
                                        </div>
                                        <div class="h-0.5 flex-1 relative min-w-[20px] animated-flow-line"></div>
                                        
                                        <!-- Node 5: Format -->
                                        <div class="flex flex-col items-center w-28 bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-lg relative group hover:border-emerald-500/40 transition-colors">
                                            <div class="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-emerald-500 border border-[#0c0f17] shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></div>
                                            <div class="w-9 h-9 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-sm mb-2 shadow-inner">📱</div>
                                            <span class="text-[11px] font-bold text-white">微信排版</span>
                                            <span class="text-[8px] font-mono text-slate-500 mt-1 select-none">格式化输出</span>
                                        </div>
                                        <div class="h-0.5 flex-1 relative min-w-[20px] animated-flow-line"></div>
                                        
                                        <!-- Node 6: Feishu -->
                                        <div class="flex flex-col items-center w-28 bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-lg relative group hover:border-emerald-500/40 transition-colors">
                                            <div class="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-emerald-500 border border-[#0c0f17] shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></div>
                                            <div class="w-9 h-9 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-sm mb-2 shadow-inner">🕊️</div>
                                            <span class="text-[11px] font-bold text-white">推送回执</span>
                                            <span class="text-[8px] font-mono text-slate-500 mt-1 select-none">飞书通知</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="w-full mt-4 bg-slate-900 border border-slate-850 p-4 rounded-xl font-mono text-xs text-slate-400 overflow-x-auto whitespace-pre-wrap select-all hidden" id="promo-tab-content-n8n-raw">
                                    <pre id="promo-n8n-json-box"></pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        WorkspaceUI.renderPromoImageSelector();
        WorkspaceUI.selectPromoTone('sensory');
        WorkspaceUI.changePromoIndustry('coffee');
    },

    renderPromoImageSelector: function() {
        const selector = document.getElementById('promo-image-selector');
        if (!selector) return;
        
        const presets = [
            { key: 'coffee', name: '咖啡拿铁', url: WorkspaceUI.promoImages.coffee },
            { key: 'bakery', name: '草莓蛋糕', url: WorkspaceUI.promoImages.bakery },
            { key: 'flowers', name: '玫瑰花束', url: WorkspaceUI.promoImages.flowers },
            { key: 'boutique', name: '精品服饰', url: WorkspaceUI.promoImages.boutique },
            { key: 'dining', name: '意面特色菜', url: WorkspaceUI.promoImages.dining },
            { key: 'beauty', name: '美发沙龙', url: WorkspaceUI.promoImages.beauty },
            { key: 'wellness', name: '艾灸养生', url: WorkspaceUI.promoImages.wellness }
        ];
        
        selector.innerHTML = presets.map(p => `
            <div onclick="WorkspaceUI.selectPromoImage('${p.url}')" data-img-url="${p.url}" class="promo-img-preset relative aspect-square rounded-lg overflow-hidden border-2 border-transparent cursor-pointer group hover:scale-95 transition-all">
                <img class="w-full h-full object-cover" src="${p.url}" alt="${p.name}">
                <div class="absolute inset-0 bg-black/40 flex items-end p-1">
                    <span class="text-[8px] text-white font-bold truncate">${p.name}</span>
                </div>
                <div class="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border border-white flex items-center justify-center text-[8px] text-white opacity-0 transition-opacity checkmark">✓</div>
            </div>
        `).join('');
    },

    selectPromoImage: function(url) {
        WorkspaceUI.promoSelectedImage = url;
        document.querySelectorAll('.promo-img-preset').forEach(el => {
            const itemUrl = el.getAttribute('data-img-url');
            const check = el.querySelector('.checkmark');
            if (itemUrl === url) {
                el.classList.add('border-emerald-500');
                if (check) check.classList.remove('opacity-0');
            } else {
                el.classList.remove('border-emerald-500');
                if (check) check.classList.add('opacity-0');
            }
        });
    },

    selectPromoTone: function(toneKey) {
        WorkspaceUI.promoTone = toneKey;
        document.querySelectorAll('.promo-tone-btn').forEach(btn => {
            const key = btn.getAttribute('data-tone');
            if (key === toneKey) {
                btn.className = "promo-tone-btn bg-emerald-950/20 border border-emerald-500/50 text-emerald-400 text-[11px] py-2 rounded-lg font-bold transition-all";
            } else {
                btn.className = "promo-tone-btn bg-slate-950 border border-slate-800 text-slate-400 text-[11px] py-2 rounded-lg hover:border-slate-700 transition-all";
            }
        });
    },

    changePromoIndustry: function(industryKey) {
        const defaultUrl = WorkspaceUI.promoImages[industryKey];
        if (defaultUrl) {
            WorkspaceUI.selectPromoImage(defaultUrl);
        }
        
        const guides = {
            coffee: '冰生椰拿铁、盛夏消暑、下午茶、拉丝奶盖',
            bakery: '草莓爆浆牛角包、刚出炉麦香、限量供应',
            flowers: '香槟玫瑰、心意礼赠、生活仪式感',
            boutique: '真丝法式长裙、夏装新品上架、高级质感',
            dining: '招牌黑椒海鲜意面、主厨推荐、限时套餐优惠',
            beauty: '设计感短发、质感冷茶色、头皮深层护理、开业体验特惠',
            wellness: '艾灸温通、古法经络推拿、草本足浴、五行膳食'
        };
        
        const keywordsEl = document.getElementById('promo-keywords');
        if (keywordsEl) {
            keywordsEl.value = guides[industryKey] || '';
        }
    },

    submitLocalPromo: async function() {
        const industry = document.getElementById('promo-industry').value;
        const tone = WorkspaceUI.promoTone;
        const keywords = document.getElementById('promo-keywords').value.trim();
        const imageUrl = WorkspaceUI.promoSelectedImage;

        if (!keywords) {
            alert('请填写核心素材或产品关键词！');
            return;
        }

        const btn = document.getElementById('btn-submit-promo');
        btn.disabled = true;
        btn.innerHTML = `<span>⏳</span> 正在唤醒大脑...`;
        
        if (window.WorkspaceUI && window.WorkspaceUI.toggleMobileSidebar) {
            window.WorkspaceUI.toggleMobileSidebar(false);
        }

        const idleView = document.getElementById('promo-idle-view');
        const processingView = document.getElementById('promo-processing-view');
        const resultView = document.getElementById('promo-result-view');

        if (idleView) idleView.classList.add('hidden');
        if (resultView) resultView.classList.add('hidden');
        if (processingView) processingView.classList.remove('hidden');

        const stepsContainer = document.getElementById('promo-pipeline-steps');
        const steps = [
            { name: '步骤一：🏪 实体店素材及图片分析', desc: '提取产品特征及行业场景...' },
            { name: '步骤二：🧠 中枢营销意图路由分发', desc: '根据所选的口吻及行业，匹配专属智能体...' },
            { name: '步骤三：✍️ 风格文案大模型生成', desc: '段落排版、情感灌装、绘图提示词生成...' },
            { name: '步骤四：🎨 朋友圈社交渲染与评论植入', desc: '美化版面，合理增加Emoji，设计顾客互动评论...' },
            { name: '步骤五：✉️ 飞书推送及响应打包', desc: '成品灌装推送及结果返回...' }
        ];

        stepsContainer.innerHTML = steps.map((s, idx) => `
            <div class="flex items-center gap-3 bg-slate-900 border border-slate-800/85 p-3 rounded-xl relative" id="promo-step-node-${idx + 1}">
                <div class="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-xs shrink-0 font-bold" id="promo-step-icon-${idx + 1}">⏳</div>
                <div class="flex-grow min-w-0">
                    <div class="flex justify-between items-center mb-0.5">
                        <span class="text-xs font-bold text-slate-200">${s.name}</span>
                        <span class="text-[8px] text-slate-500 font-mono" id="promo-step-status-${idx + 1}">排队中...</span>
                    </div>
                    <p class="text-[9px] text-slate-500 truncate">${s.desc}</p>
                </div>
            </div>
            ${idx < steps.length - 1 ? '<div class="w-0.5 h-3 bg-slate-800/80 ml-7"></div>' : ''}
        `).join('');

        const updateStep = (stepNum, statusText, borderClass, iconHtml) => {
            const node = document.getElementById(`promo-step-node-${stepNum}`);
            const status = document.getElementById(`promo-step-status-${stepNum}`);
            const icon = document.getElementById(`promo-step-icon-${stepNum}`);
            if (node) {
                node.className = `flex items-center gap-3 bg-slate-900 border ${borderClass} p-3 rounded-xl transition-all duration-300 shadow-md`;
            }
            if (status) {
                status.innerText = statusText;
                status.className = `text-[8px] font-mono ${borderClass.includes('emerald') ? 'text-emerald-400 font-bold' : 'text-slate-500'}`;
            }
            if (icon && iconHtml) {
                icon.innerHTML = iconHtml;
            }
        };

        updateStep(1, '进行中...', 'border-emerald-500/40', '<div class="animate-spin text-[10px]">⏳</div>');

        let timer1 = setTimeout(() => {
            updateStep(1, '✅ 已完成', 'border-emerald-500/30', '🏪');
            updateStep(2, '进行中...', 'border-emerald-500/40', '<div class="animate-spin text-[10px]">⏳</div>');
            
            let timer2 = setTimeout(() => {
                updateStep(2, '✅ 已完成', 'border-emerald-500/30', '🧠');
                updateStep(3, '进行中...', 'border-emerald-500/40', '<div class="animate-spin text-[10px]">⏳</div>');
                
                let timer3 = setTimeout(() => {
                    updateStep(3, '✅ 已完成', 'border-emerald-500/30', '✍️');
                    updateStep(4, '进行中...', 'border-emerald-500/40', '<div class="animate-spin text-[10px]">⏳</div>');
                    
                    let timer4 = setTimeout(() => {
                        updateStep(4, '✅ 已完成', 'border-emerald-500/30', '🎨');
                        updateStep(5, '进行中...', 'border-emerald-500/40', '<div class="animate-spin text-[10px]">⏳</div>');
                    }, 3500);
                }, 3000);
            }, 1500);
        }, 1000);

        const baseWebhookUrl = window.MSZN_GLOBAL_CONFIG?.api?.n8nWebhook || 'http://192.168.1.58:5678/webhook/efficiency-diagnosis';
        const promoWebhookUrl = baseWebhookUrl.replace(/efficiency-diagnosis$/, 'marketing-brain-webhook');
        
        let resData = null;
        let fetchError = null;

        try {
            const payload = {
                message: {
                    content: `【店铺行业】：${industry}\n【设定风格】：${tone}\n【核心素材】：${keywords}\n【图片】：${imageUrl}`
                }
            };
            const response = await Promise.race([
                fetch(promoWebhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                }),
                new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), 90000))
            ]);

            if (response && response.ok) {
                resData = await response.json();
            } else {
                throw new Error(`Status ${response ? response.status : 'error'}`);
            }
        } catch (err) {
            console.warn('Webhook request deferred, using smart local fallback engine:', err);
            fetchError = err;
        }

        clearTimeout(timer1);
        
        for (let i = 1; i <= 5; i++) {
            const finalIcons = ['🏪', '🧠', '✍️', '🎨', '🕊️'];
            updateStep(i, '✅ 已完成', 'border-emerald-500/30', finalIcons[i-1]);
        }
        await new Promise(r => setTimeout(r, 600));

        if (processingView) processingView.classList.add('hidden');
        if (resultView) resultView.classList.remove('hidden');
        btn.disabled = false;
        btn.innerHTML = `<span>🏪</span> 一键生成朋友圈爆款`;

        let finalData = null;
        if (resData && typeof resData === 'object' && resData.wechatCopy) {
            finalData = resData;
        } else {
            finalData = WorkspaceUI.getLocalPromoFallbackData(industry, tone, keywords);
        }
        
        WorkspaceUI.promoLatelyData = finalData;
        WorkspaceUI.promoLikeActive = false;
        
        WorkspaceUI.renderPromoResult(finalData, imageUrl);
        WorkspaceUI.switchPromoTab('moments');
    },

    getLocalPromoFallbackData: function(industry, tone, keywords) {
        const db = {
            coffee: {
                sensory: {
                    storeName: '时光咖啡馆',
                    avatar: '☕',
                    location: '时光咖啡馆 · 梧桐树下',
                    copyText: `✨ 冰镇厚乳在黑咖啡中慢速坠落，形成好看的云雾拉花。☁️\n\n大口吸入，咸甜的乳酪在舌尖滑开，紧接着是深烘咖啡豆那黑巧克力般的微苦与坚果香，冰爽直击灵魂！\n\n下午三点，用一杯「${keywords || '冰拿铁'}」重新唤醒元气，这杯清凉解药请查收！🥤✨\n\n#冰美式 #芝士控 #咖啡时光`,
                    imagePrompt: `A close-up shot of an iced cheese foam latte in a clear glass, dripping condensation, rich wooden counter background, warm ray of sun, 8k, photorealistic`,
                    comments: [
                        '常客小林：天呐，这个拉花太治愈了吧！下午必须去买一杯！',
                        '店主回复：好嘞，给你多加一份浓缩，冰爽加倍！😎',
                        '新客小雨：店里有位置可以自习吗？',
                        '店主回复：有的，靠窗的位置有插座，非常适合阅读自习哦。'
                    ]
                },
                poetic: {
                    storeName: '时光咖啡馆',
                    avatar: '☕',
                    location: '时光咖啡馆 · 树影长廊',
                    copyText: `🌿 阳光穿过法桐叶子的缝隙，在咖啡杯上留下斑驳的光影。☕️\n\n今天不聊KPI，只聊夏天的风。浅烘的「${keywords || '耶加雪菲'}」入口，是淡淡的柑橘香与茉莉清甜，像风掠过山丘。\n\n找个窗边的椅子，虚度一个温柔的下午，也是生活的一场盛宴。🍂\n\n#慢生活 #咖啡日常 #夏日树荫`,
                    imagePrompt: `Minimalist visual style, a single cup of pour-over coffee on a rustic wooden table near a sunlit window with tree shadows, 8k, warm tones`,
                    comments: [
                        '顾客小陈：文字好温柔，下午过去坐坐。',
                        '店主回复：欢迎，今天刚烤了柠檬麦芬，很配手冲。'
                    ]
                },
                promo: {
                    storeName: '时光咖啡馆',
                    avatar: '☕',
                    location: '时光咖啡馆 · 领地旗舰店',
                    copyText: `🔥 摸鱼警报！不对，是夏日福利风暴！‼️\n\n【买一送一 ｜ 限时狂欢】\n即日起至本周五，每天14:00-17:00，招牌「${keywords || '生椰拿铁'}」买一送一！\n\n精选冷榨椰乳，浓郁清甜，前10名到店还赠送「手工曲奇」一份！快拉上你的搭子冲！🏃‍♂️💨`,
                    imagePrompt: `Commercial shot of two glasses of iced coconut latte, neon highlight on the glasses, bright energy, pop vector background, 8k`,
                    comments: [
                        '摸鱼老手：@小李 快走，下午茶安排！',
                        '小李回复：收到，这就小程序领券，两点准时冲！'
                    ]
                },
                meme: {
                    storeName: '时光咖啡馆',
                    avatar: '☕',
                    location: '时光咖啡馆 · 续命窗口',
                    copyText: `🤡 “打工人的命是冰美式给的，但今天，我需要一桶。” 😂\n\n咖啡师今天心情不好（因为失恋了），手抖多倒了双倍浓缩「${keywords || '超浓缩咖啡'}」。现在的冰美式已经苦得能直接唤醒沉睡的灵魂。\n\n如果你今天也快被工作折磨得睡着了，赶紧来领这一杯“社畜续命水”吧！保你精神到明天！\n\n#打工人续命水 #冰美式 #咖啡师整活`,
                    imagePrompt: `A funny comic style drawing of a tiny tired worker hanging onto a giant mug of black coffee, steam rising, high dynamic color`,
                    comments: [
                        '加班狗小白：哈哈哈哈哈哈老板太真实了，先点两杯续命！',
                        '店主回复：双倍苦，送给坚强的你！✊'
                    ]
                },
                daily: {
                    storeName: '时光咖啡馆',
                    avatar: '☕',
                    location: '时光咖啡馆 · 街角的老地方',
                    copyText: `🌤️ 早安，街角的小店已经开门啦。🏡\n\n今天早上的风很凉快，刚做好的「${keywords || '招牌拿铁'}」还在冒着热气。磨豆机的声音，是这个清晨最治愈的闹钟。\n\n出门上班前，来带一杯热拿铁吧，祝你拥有美好的一天！☕️☀️\n\n#清晨第一杯咖啡 #元气满满的一天 #我的开店日常`,
                    imagePrompt: `Cozy neighborhood coffee shop front door in the morning light, chalkboard menu outside, peaceful and welcoming street view, 8k`,
                    comments: [
                        '常客李阿姨：早上那杯拿铁温度刚好，很舒服。',
                        '店主回复: 谢谢李阿姨，明天给您试试刚到的耶加雪菲！'
                    ]
                }
            },
            bakery: {
                sensory: {
                    storeName: '影梅庵手作面包坊',
                    avatar: '🍰',
                    location: '影梅庵手作面包 · 烤炉旁',
                    copyText: `🥐 刚出炉的「${keywords || '海盐羊角包'}」，外皮金黄酥脆到轻轻一碰就掉渣！\n\n撕开的瞬间，面筋丝丝相连，浓郁的法国黄油香和海盐的微咸交织，香气直往鼻腔里钻！\n\n这一口，温热、蓬松、咸甜，是面粉与黄油最完美的相遇。赶紧趁热来尝尝吧！🥖✨\n\n#烘焙时光 #刚出炉的面包 #黄油香气`,
                    imagePrompt: `A detailed close-up shot of a golden crispy croissant being pulled apart, steam rising, rich yellow butter crumb, bakery environment, 8k`,
                    comments: [
                        '吃货A：天啊，隔着屏幕都闻到香味了！',
                        '店主回复：下午三点还有一炉刚出炉的，欢迎准时来！'
                    ]
                },
                poetic: {
                    storeName: '影梅庵手作面包坊',
                    avatar: '🍰',
                    location: '影梅庵手作面包 · 树影长椅',
                    copyText: `🌤️ 影梅庵下的麦香，是清晨最温柔的苏醒。🍃\n\n面粉与酵母在时间里静静发酵，如同平淡日子里的等待。这一款「${keywords || '手作欧包'}」没有复杂的调味，只有麦子最本真的回甘与坚果香。\n\n撕一块面包，佐一杯热茶，阳光慢慢挪上桌子，这就是最奢侈的诗意。\n\n#面包与诗 #手作的温度 #安静角落`,
                    imagePrompt: `Ethereal visual, rustic sourdough bread wrapped in a linen cloth, next to an incense burner with rising smoke, soft morning light, 8k`,
                    comments: [
                        '静默客：好有画面感的面包，周末去打卡。',
                        '店主回复：随时静候您的光临，祝您工作日愉快。'
                    ]
                },
                promo: {
                    storeName: '影梅庵手作面包坊',
                    avatar: '🍰',
                    location: '影梅庵手作面包 · 烘焙厨房',
                    copyText: `🔥 【全场8折 ｜ 烘焙狂欢周】\n\n小店手工无添加「${keywords || '鲜奶切片吐司'}」限时三天全场8折优惠！\n\n更有会员专属：买满38元即赠送经典蛋挞一只，每日限量50份，先到先得！错过再等一年，快冲鸭！🏃‍♂️🎁`,
                    imagePrompt: `A dynamic shop counter display of fresh fruit pastries with a bold percentage discount sign, bright modern lighting, 8k`,
                    comments: [
                        '常客小李：太给力了，今天下班去扫货！',
                        '店主回复：吐司刚出炉，给你预留两包！'
                    ]
                },
                daily: {
                    storeName: '影梅庵手作面包坊',
                    avatar: '🍰',
                    location: '影梅庵手作面包 · 街角店',
                    copyText: `🥖 早上好！第一炉「${keywords || '全麦多谷面包'}」已经出炉啦，整个街区都是暖洋洋的麦子香。\n\n手作的面包，装满的是我们对生活诚恳的心意。上班路上的你，记得吃顿热乎的早餐呀！\n\n今天也是元气满满的一天，加油！🌤️🧡\n\n#早安问候 #社区老店 #我的烘焙日记`,
                    imagePrompt: `Warm street viewpoint of a small local bakery shop front, warm lights inside shining through window in dawn mist, 8k`,
                    comments: [
                        '邻居张姐：每天早上闻到你们店的香味，就觉得很踏实。',
                        '店主回复：定个时间过来，给您留一个刚出炉的羊角面包！'
                    ]
                },
                meme: {
                    storeName: '影梅庵手作面包坊',
                    avatar: '🍰',
                    location: '影梅庵手作面包 · 翻车现场',
                    copyText: `😂 救命！今天店长又把「${keywords || '黑金乳酪面包'}」烤得有点微焦了……\n\n为了掩盖他的罪行，也为了防止老板扣工资，我们决定把这批面包以“大艺术家熔岩风格”半价甩卖！\n\n虽然长得黑，但内馅的流心乳酪绝对爆浆！快来帮我们消灭罪证！💸🤡\n\n#烘焙翻车现场 #流心乳酪 #搞笑打工人`,
                    imagePrompt: `A funny drawing of a burnt bread cartoon character crying, charcoal black texture with bright yellow cheese inside, cute comic style`,
                    comments: [
                        '消网侠：哈哈哈哈帮你们保守秘密，下午去带俩！',
                        '店主回复：叩谢壮士！嘘，别被老板听见了！🤫'
                    ]
                }
            },
            flowers: {
                sensory: {
                    storeName: '初见鲜花美学馆',
                    avatar: '💐',
                    location: '初见鲜花美学 · 水晶花瓶旁',
                    copyText: `🌹 带着清晨露水的「${keywords || '香槟玫瑰'}」，柔粉娇艳。\n\n花瓣在水雾中层层舒展，凑近一闻，是极为细腻的淡雅清香。花艺师精心搭配了尤加利叶，那一抹灰绿更衬托出玫瑰的高级质感。\n\n把春天装进水晶瓶，让整个客厅都亮起来吧！✨🌸\n\n#鲜花美学 #香槟玫瑰 #生活中的光影`,
                    imagePrompt: `A stunning close-up shot of fresh champagne roses with water droplets on petals, eucalyptus leaves, soft studio backlight, 8k`,
                    comments: [
                        '爱花人：太美了！想给卧室定一束！',
                        '店主回复：好呀，今日刚到货，下午配送！'
                    ]
                },
                poetic: {
                    storeName: '初见鲜花美学馆',
                    avatar: '💐',
                    location: '初见鲜花美学 · 绿植角落',
                    copyText: `🥀 “买花送给自己，是平凡日子里最体面的浪漫。” 🌿\n\n今天的主角是「${keywords || '野生洋桔梗'}」。花瓣的边缘泛着柔润的紫色，像极了傍晚西沉的晚霞。它静静开在角落，不争不抢，却自有风骨。\n\n风吹过来，花影微动，连空气都慢了下来。\n\n#鲜花与诗 #悦己生活 #主理人手记`,
                    imagePrompt: `Delicate purple eustoma flowers in a clay vase on an antique stool, soft atmospheric natural lighting, desaturated painterly look, 8k`,
                    comments: [
                        '文艺青年：真好看。买花不为别人，只为取悦自己的心情。',
                        '店主回复：说得真好，花会记得你的温柔。'
                    ]
                },
                promo: {
                    storeName: '初见鲜花美学馆',
                    avatar: '💐',
                    location: '初见鲜花美学 · 包扎台',
                    copyText: `🔥 【周末鲜花特惠 ｜ 满99减20】\n\n新一季「${keywords || '向日葵花束'}」元气上架！在这个充满阳光的周末，全店精选向日葵及绣球花束，买满99立减20！\n\n前30名预定客户，免费加赠精美卡片及定制丝带。快来为你爱的人送上一束小太阳吧！🌻🎁💨`,
                    imagePrompt: `A gorgeous bouquet of bright yellow sunflowers wrapped in brown kraft paper on a florist table, bright commercial shot, 8k`,
                    comments: [
                        '送花达人：给女朋友定一束，正好减20！',
                        '店主回复：好嘞，花艺师正在为您精心包扎，期待您的反馈！'
                    ]
                },
                daily: {
                    storeName: '初见鲜花美学馆',
                    avatar: '💐',
                    location: '初见鲜花美学 · 老地方',
                    copyText: `🌤️ 早安！今天店里刚进了一大批新鲜的「${keywords || '小雏菊'}」，花瓣开得格外精神，水灵灵的。\n\n我们正在把它们修枝、插瓶。看着这一朵朵朝气蓬勃的小雏菊，一整天的心情都跟着明亮了。路过花店的朋友，欢迎进来闻闻花香哦！🌸🏡\n\n#早安花店 #每日鲜花打卡 #治愈系小雏菊`,
                    imagePrompt: `A warm friendly look inside a flower shop from the open door, colorful buckets of fresh flowers, welcoming atmosphere, 8k`,
                    comments: [
                        '李大姐：每天路过你们店，心情都变好了。',
                        '店主回复：谢谢李大姐，今天进店送您一枝雏菊！'
                    ]
                },
                meme: {
                    storeName: '初见鲜花美学馆',
                    avatar: '💐',
                    location: '初见鲜花美学 · 自娱自乐',
                    copyText: `😂 别等别人给你送花了，自己买的「${keywords || '刺头玫瑰'}」开得更带劲！\n\n今天被顾客放了鸽子，大批鲜红玫瑰无人领养。店长决定亲自把它们包装成“独立大女主”风格甩卖！\n\n自带防御属性（刺还没拔完），非常适合摆在办公桌上防小人！快来抱走它们！🌹🗡️\n\n#自买鲜花真香 #防小人玫瑰 #搞笑花店`,
                    imagePrompt: `A funny high-contrast image of a beautiful red rose with comic-like tiny boxing gloves on its thorns, solid background, 8k`,
                    comments: [
                        '打工人小白：哈哈发生冲突防小人我太需要了，给我留一束！',
                        '店主回复：妥了！刺特意给你留着！💪'
                    ]
                }
            },
            boutique: {
                sensory: {
                    storeName: '野性衣橱 Boutique',
                    avatar: '👗',
                    location: '野性衣橱 · 试衣镜前',
                    copyText: `👗 触碰这一件「${keywords || '真丝法式长裙'}」，如牛奶般细腻丝滑。✨\n\n轻盈的真丝面料贴合肌肤，泛着柔和的哑光色泽。裙摆随风摇曳，剪裁立体贴合，勾勒出优雅的曲线。\n\n上身瞬间，是夏日午后最慵懒的高级感。快来试穿你的夏日新战衣吧！💃💄\n\n#法式真丝长裙 #高级面料 #优雅穿搭`,
                    imagePrompt: `Fashion lookbook shot, an elegant woman wearing a flowing cream silk slip dress, sun rays filtering through linen curtains, warm highlights, 8k`,
                    comments: [
                        '时尚达人：版型太高级了！有其他颜色吗？',
                        '店主回复：还有复古绿和珍珠白，都非常显白，下午可以来店里试穿哦！'
                    ]
                },
                poetic: {
                    storeName: '野性衣橱 Boutique',
                    avatar: '👗',
                    location: '野性衣橱 · 窗边陈列区',
                    copyText: `🌿 “把夏天的风穿在身上，是对平凡日子最温柔的抵抗。”\n\n今天陈列的这一款「${keywords || '水洗棉麻衬衫'}」，带着植物特有的亲肤与淡泊。天然棉麻的纹理粗糙而温和，带着手作的温度，松弛、自在。\n\n不迎合流行，只讨好自己。🍂☕️\n\n#棉麻松弛感 #松弛感穿搭 #穿衣自由`,
                    imagePrompt: `Minimalist fashion shot of a loose water-washed linen shirt hanging on a wooden hanger against a clean plaster wall, soft side light, 8k`,
                    comments: [
                        '松弛女孩：棉麻的最舒服了，有大码吗？',
                        '店主回复：有宽松落肩款，包容各种身材，穿上极度舒服。'
                    ]
                },
                promo: {
                    storeName: '野性衣橱 Boutique',
                    avatar: '👗',
                    location: '野性衣橱 · 促销特惠区',
                    copyText: `🔥 【换季狂欢 ｜ 两件8折 ｜ 满299赠时尚包包】\n\n新一季「${keywords || '修身显瘦连衣裙'}」全系上新！即日起至周末，全场连衣裙及夏装外套两件立享8折，买满299元即赠时尚帆布包一个！\n\n库存有限，爆款断码超快，赶紧来挑走你的秋季新搭吧！🛍️样衣🎁`,
                    imagePrompt: `Commercial lookbook layout of multiple fashionable summer garments on a clothing rack, bold sales promotional badge on top, 8k`,
                    comments: [
                        '购物狂A：@闺蜜 快来，下班试衣服去，凑单买包包！',
                        '闺蜜回复：行啊，五点半店里见！'
                    ]
                },
                daily: {
                    storeName: '野性衣橱 Boutique',
                    avatar: '👗',
                    location: '野性衣橱 · 主理人室',
                    copyText: `🌤️ 早安！店里今天刚做好了新品陈列，挂满了「${keywords || '秋季薄针织衫'}」，颜色暖融融的，像秋天的麦田。\n\n衣服不仅是避寒的织物，更是你面对世界的底气。希望这件温柔的针织衫，能陪你度过轻快的一天。路过进来看衣服哦！🧥🏡\n\n#每日穿搭打卡 #主理人的日常 #秋装上新`,
                    imagePrompt: `Warm aesthetic view inside a boutique clothing store, warm wooden racks, plants, golden morning sunlight shining on the garments, 8k`,
                    comments: [
                        '老熟客：新品针织衫手感很好，上次买的那件洗了不缩水。',
                        '店主回复：是的呀，都是精梳棉做的，贴身穿非常软！'
                    ]
                },
                meme: {
                    storeName: '野性衣橱 Boutique',
                    avatar: '👗',
                    location: '野性衣橱 · 整活前线',
                    copyText: `😂 别再问为什么衣柜满了还要买衣服了，因为今天的「${keywords || '宽松遮肉卫衣'}」实在是太香了！\n\n店长因为昨晚吃火锅水肿，今天特意穿上这件“一秒遮百肉”的超级大卫衣。穿上瞬间，腰身直接离家出走，只剩下酷酷的气场。\n\n微胖女孩冲！遮肉效果防翻车！🤡✊\n\n#遮肉卫衣 #微胖女孩救星 #搞笑店长穿搭`,
                    imagePrompt: `A funny fashion sketch of a cartoon girl swimming inside a giant warm oversized hoodie, big eyes, comic cute look, 8k`,
                    comments: [
                        '吃瓜群众：哈哈哈哈店长太逗了，种草了这件卫衣！',
                        '店主回复：真的很遮！今天穿它我吃了三碗饭都没人看出来！😂'
                    ]
                }
            },
            dining: {
                sensory: {
                    storeName: '深夜食堂特色菜',
                    avatar: '🍝',
                    location: '深夜食堂 · 砂锅滋滋响',
                    copyText: `🍝 招牌「${keywords || '黑椒海鲜意面'}」热气腾腾上桌！\n\n浓油赤酱的黑椒汁紧紧包裹着爽滑的意面，大颗的虾仁与扇贝在盘中滋滋作响。一口下去，胡椒的微辣和海鲜的甜美在口中瞬间爆开，大口租咽，面条筋道，海味十足！\n\n今晚的快乐，就从这盘浓郁的面开始吧！🦐🔥✨\n\n#海鲜意面 #黑椒控 #深夜美食诱惑`,
                    imagePrompt: `A gorgeous steaming plate of black pepper seafood pasta, fresh prawns and parsley on top, high detailed textures, macro shot, cinematic lighting, 8k`,
                    comments: [
                        '常客老李：每次去必点这道面，分量足，黑椒味很正！',
                        '店主回复：老李懂吃！今晚过来给你多加两只虾！🦐',
                        '新客小林：店里有包厢吗？晚上聚餐。',
                        '店主回复：有的，二楼有10人包间，建议您拨打电话提前预订哦。'
                    ]
                },
                poetic: {
                    storeName: '深夜食堂特色菜',
                    avatar: '🍝',
                    location: '深夜食堂 · 昏黄吊灯下',
                    copyText: `🌤️ “最治愈的人间烟火，是深夜小馆里的一碗「${keywords || '砂锅暖心粉'}」。”\n\n文火慢炖的骨汤咕嘟咕嘟冒着白气，浸润着软糯的粉丝和鲜嫩的蔬菜。在疲惫的深夜，看着热气氤氲，胃暖了，心也就踏实了。\n\n店里的灯一直为你亮着，辛苦啦，都市的赶路人。🍵🍂\n\n#深夜食堂 #治愈系美食 #人间烟火气`,
                    imagePrompt: `Warm atmospheric photo of a steaming hot clay pot soup on a dark wooden table in a dimly lit cozy restaurant, steam glowing in light, 8k`,
                    comments: [
                        '加班狗：下班去吃一碗，加班的怨气全没了。',
                        '店主回复：辛苦了，今晚给你卧个荷包蛋，暖暖胃。🍳'
                    ]
                },
                promo: {
                    storeName: '深夜食堂特色菜',
                    avatar: '🍝',
                    location: '深夜食堂 · 大堂',
                    copyText: `🔥 【深夜食堂大放水 ｜ 主厨双人餐限时6折】\n\n答谢新老顾客，招牌「${keywords || '铁板肥牛'}」双人套餐即日起限时6折特惠！\n\n精选雪花肥牛在铁板上滋滋作响，搭配爽口配菜，原价198现仅需118！每日限量30桌，售完即恢复原价，快约上饭搭子冲！🏃‍♂️🥩🎁`,
                    imagePrompt: `A sizzle shot of thinly sliced beef and onions cooking on a hot iron teppanyaki plate in a high-end restaurant, dynamic fire sparks, 8k`,
                    comments: [
                        '干饭人：这折扣给力！@阿强 走，晚上干饭去！',
                        '阿强回复：妥了，我六点下班，先用小程序排队！'
                    ]
                },
                daily: {
                    storeName: '深夜食堂特色菜',
                    avatar: '🍝',
                    location: '深夜食堂 · 柜台前',
                    copyText: `🌤️ 早安！店里的大厨已经在提炼今天的「${keywords || '老火土鸡汤'}」了，清晨的厨房里飘满了浓浓的鸡汤香气。\n\n好好吃饭，是每天最正经的大事。忙碌了一天的你，下班后来喝碗热汤吧，犒劳一下辛苦的自己。我们晚上见！🍲🏡\n\n#好好吃饭 #清晨厨房 #主厨日记`,
                    imagePrompt: `Cozy small neighborhood bistro interior, clean wooden dining tables, menu board, soft light, peaceful morning setting, 8k`,
                    comments: [
                        '常客老刘：今天有新鲜的土鸡汤啊，晚上留一碗！',
                        '店主回复：没问题老刘，给您留个鸡腿大碗的！🐔'
                    ]
                },
                meme: {
                    storeName: '深夜食堂特色菜',
                    avatar: '🍝',
                    location: '深夜食堂 · 整活窗口',
                    copyText: `😂 别再问我们店的肥牛为什么这么嫩了，因为店长今天「${keywords || '手切肥牛'}」手抖切得太薄了！\n\n厚度直逼0.01毫米，入锅1秒即熟，嫩到入口即化，连牙齿都省了。为了弥补大厨的手抖过失，今天双倍分量上菜！\n\n来吃“薄如蝉翼”的牛肉卷，爆笑体验，手慢无！🥩🤡✊\n\n#手抖大厨 #双倍分量 #肥牛卷整活`,
                    imagePrompt: `A funny close-up photo of ultra-thin beef rolls held by chopsticks, so thin it is translucent in warm steam, funny food photo, 8k`,
                    comments: [
                        '吃货老张：哈哈包装大厨我爱了，今晚必冲！',
                        '店主回复：多谢捧场，今天肥牛卷确实堆得像小山一样！'
                    ]
                }
            },
            beauty: {
                sensory: {
                    storeName: '极剪美学沙龙',
                    avatar: '💈',
                    location: '极剪美学沙龙 · 镜前光影',
                    copyText: `💇‍♂️ 刚刚完成的「${keywords || '设计感短发'}」，每一缕发丝都带着蓬松的空气感与立体线条。✨\n\n阳光下折射出微微的「冷茶色」光泽，低调而温柔，瞬间拉满显白滤镜。\n\n指尖抚过，如丝绸般轻盈柔顺。想在换季换个新形象？今天就是最好的时刻，来预约你的夏日新造型吧！✨✂️\n\n#发型设计 #冷茶色 #沙龙日常`,
                    imagePrompt: `A close-up shot of a stylish woman showing her newly cut and dyed ash brown hair in a modern neon-lit hair salon, mirror reflections, premium look, 8k, photorealistic`,
                    comments: [
                        '小美：这个颜色太显白了，周末我也要去染！',
                        '店主回复：好嘞，提前帮你约总监阿Tom，记得提早半小时到哦！😎',
                        '发型控：平时需要怎么打理啊？',
                        '店主回复：洗完后顺着发丝吹干即可，非常适合懒人，蓬松感十足。'
                    ]
                },
                poetic: {
                    storeName: '极剪美学沙龙',
                    avatar: '💈',
                    location: '极剪美学沙龙 · 暖阳休憩区',
                    copyText: `🌿 “换个发型，换个心情，是对平淡生活最温柔的仪式感。” 🍂\n\n不盲目追求流行，只为剪出最适合你轮廓的松弛感。修剪完「${keywords || '法式轻盈卷发'}」，发梢的弧度带着随性与洒脱，像风轻抚过琴键。\n\n在温暖的午后，静静坐在椅前，看着镜中的自己慢慢变得精致，这本身就是一种生活美学。☕️💈\n\n#发型与生活 #松弛感日常 #主理人手记`,
                    imagePrompt: `Artistic photographic style, hair stylist gently working on a woman's hair in a warm wooden interior salon with green plants, soft cinematic lighting, 8k`,
                    comments: [
                        '顾客小李：每次去老板剪完都觉得特别放松，心情都变好了。',
                        '店主回复：发型是心情的延伸，剪发也是剪掉烦恼的过程。'
                    ]
                },
                promo: {
                    storeName: '极剪美学沙龙',
                    avatar: '💈',
                    location: '极剪美学沙龙 · 专属包厢',
                    copyText: `🔥 【开业大促 ｜ 充值送豪礼 ｜ 两人同行一人免单】\n\n招牌「${keywords || '头皮深层护理+高阶剪发'}」新客体验特惠火爆开启！\n\n即日起至本周五，通过朋友圈预约立享98元新客特惠（原价298元）！现场充值500元立赠200元，更有两人同行一人免单！名额有限，快拉上闺蜜冲！🏃‍♂️💇‍♀️🎁\n\n#沙龙特惠 #头皮深层护理 #发型改造`,
                    imagePrompt: `Professional shot of luxury hair care bottles on a glowing glass shelf in a high-end salon, bold sales badge overlay, 8k`,
                    comments: [
                        '省钱达人：已经和闺蜜约好周六过去了，真的免单一个吗？',
                        '店主回复：是真的哦！免单项目以价格低的为准，赶紧小程序抢占座位吧！'
                    ]
                },
                meme: {
                    storeName: '极剪美学沙龙',
                    avatar: '💈',
                    location: '极剪美学沙龙 · 整活避坑前线',
                    copyText: `😂 “千万别招惹心情不好的发型师，除非你想拥有一个‘能看清你所有智商’的超清爽刘海。”\n\n我们家发型师今天被太太罚跪了，手抖把客人的刘海「${keywords || '眉上刘海'}」剪短了半厘米，结果意外地巨显脸小、巨时尚！\n\n为了庆祝发型师没有被赶出家门，今天凡是来店里剪短发的朋友，全部赠送现磨冷萃一杯！\n\n#发型师手抖现场 #时尚刘海 #沙龙日常`,
                    imagePrompt: `A funny high-contrast drawing of a girl looking shocked at her funny trendy bangs in a mirror, cute comic style, 8k`,
                    comments: [
                        '冲浪少女：哈哈笑死了，明天我要去赌一把发型师的手抖运气！',
                        '店主回复：放心，发型师今天心态极稳，保证剪得美美的！😂'
                    ]
                },
                daily: {
                    storeName: '极剪美学沙龙',
                    avatar: '💈',
                    location: '极剪美学沙龙 · 阳光落地窗前',
                    copyText: `🌤️ 早上好！沙龙的第一缕晨光已经洒在落地镜上。剪刀与梳子皆已消毒完毕，整齐排列。💈\n\n今天的第一位客人约了「${keywords || '招牌柔顺洗护'}」。用一把剪刀，修剪掉分叉的发梢，也修剪出生活的利落与清爽。愿你带着全新造型，自信地开启新的一天！✂️☀️\n\n#早安问候 #开店日记 #自信发型`,
                    imagePrompt: `Warm neighborhood hair salon interior, vintage leather styling chairs, green plants, soft morning sunbeams, 8k`,
                    comments: [
                        '常客陈姐：上次吹的造型保持了好几天，非常赞！',
                        '店主回复：陈姐喜欢就好，下次来店里给您试试我们新进的香氛洗发水！'
                    ]
                }
            },
            wellness: {
                sensory: {
                    storeName: '御品堂健康养生馆',
                    avatar: '🧘',
                    location: '御品堂养生 · 香薰温阁',
                    copyText: `🧘 伴着淡淡的沉香与温热的「${keywords || '五行艾灸温理'}」，全身紧绷的肌肉在温热中一点点舒展开来。\n\n理疗师的手法沉稳而精准，顺着肩颈经络缓缓推开体内的酸胀结节，暖流随着气血流向四肢百骸，仿佛每个毛孔都在重新呼吸。🍃\n\n这一刻，卸下所有紧绷，给身体做一次深度的温柔和解吧！💆‍♂️✨\n\n#健康养生 #艾灸理疗 #身心治愈`,
                    imagePrompt: `A close-up shot of a smooth black spa stone placed on a back with steam and warm light, essential oil massage, peaceful wellness environment, 8k, photorealistic`,
                    comments: [
                        '养生达人：做完艾灸整个人都暖呼呼的，昨晚睡得特别香！',
                        '店主回复：艾灸能温通经络，今晚再给您倒杯温热的草本茶哦。🛌✨',
                        '白领小周：肩膀酸痛做哪个项目比较合适？',
                        '店主回复：推荐我们的「古法经络推拿」，能有效缓解长期伏案的肩颈酸痛。'
                    ]
                },
                poetic: {
                    storeName: '御品堂健康养生馆',
                    avatar: '🧘',
                    location: '御品堂养生 · 禅意竹庭',
                    copyText: `🌿 “大隐隐于市，心安即是家。” 🧘\n\n一盏清热解郁的「${keywords || '草本养生茶'}」，一缕袅袅轻烟，在这里，时间慢了下来。温润的木桶足浴伴随着草本幽香，舒缓着尘世奔波的疲惫。\n\n让紧绷的神经在草木芬芳中得以安放。听一曲古琴，享一刻清闲，生活便多了一份从容淡雅。\n\n#禅意生活 #养生美学 #身心安顿`,
                    imagePrompt: `Traditional Chinese wellness tea room, steam rising from a clay tea pot next to an incense burner, soft bamboo shadow on window, 8k`,
                    comments: [
                        '静修客：太有禅意了，周末想去安安静静躺个下午。',
                        '店主回复：静候琴声与茶香，为您留一间安静的禅意推拿房。'
                    ]
                },
                promo: {
                    storeName: '御品堂健康养生馆',
                    avatar: '🧘',
                    location: '御品堂养生 · 养生大堂',
                    copyText: `🔥 【打工人元气回血周 ｜ 养生调理限时特惠】\n\n主打项目「${keywords || '肩颈古法推拿+草本足浴'}」特惠福利上线！\n\n即日起至周末，全套疗程原价358元，限时体验仅需168元！前20名预约到店的顾客免费赠送「五行养生膳食汤」一碗！快叫上你的加班搭子来回血！🏃‍♂️观景🥣`,
                    imagePrompt: `Warm commercial visual of clean stacked fluffy towels, bamboo shoots, aromatherapy oil bottle, discount offer badge, 8k`,
                    comments: [
                        '加班狂魔：写PPT写得肩膀快废了，下班就跟同事冲！',
                        '店主回复：收到，已经为您排号，下班直接过来享受！'
                    ]
                },
                meme: {
                    storeName: '御品堂健康养生馆',
                    avatar: '🧘',
                    location: '御品堂养生 · 朋克养生区',
                    copyText: `😂 “熬最深的夜，敷最贵的面膜，最后还是得老老实实来我们店，端着保温杯泡「${keywords || '人参枸杞原汁'}」。”\n\n药膳师今天炖汤手抖，多放了半两野生老山参，香气直接飘到了隔壁街。为了不让药膳师被老板以“败家”扣工资，今天买推拿项目直接送参汤！\n\n保温杯里倒满参汤，让我们一起完成这场高尚的“朋克养生”！😎✊\n\n#朋克养生 #人参枸杞茶 #推拿整活`,
                    imagePrompt: `A funny cute illustration of a sleepy office worker hugging a giant thermos bottle with goji berries and ginseng floating around, 8k`,
                    comments: [
                        '打工魂：哈哈哈哈老板好逗，野生参汤我可太想要了！',
                        '店主回复：限量20份，快来拯救我们的大厨！🤫'
                    ]
                },
                daily: {
                    storeName: '御品堂健康养生馆',
                    avatar: '🧘',
                    location: '御品堂养生 · 暖阁',
                    copyText: `🌤️ 早上好！第一炉「${keywords || '老中医草本艾条'}」已经点燃，阁子里正飘着淡淡的艾草清香。🧘\n\n身体是奋斗的本钱，好好照顾自己是每天最正经的功课。劳累了一天，下班后来喝碗热汤，做个理疗。我们晚上见！🛀🏡\n\n#早安养生 #好好爱自己 #养生主理人日记`,
                    imagePrompt: `Cozy small traditional Chinese medicine style spa room, massage bed, wooden cabinet with tiny drawers, warm lighting, 8k`,
                    comments: [
                        '老顾客王叔：每周去按一次，腰椎好多了。',
                        '店主回复：谢谢王叔的肯定，今天给您留个手法最好的师傅！'
                    ]
                }
            }
        };
        
        const indData = db[industry] || db.coffee;
        const toneData = indData[tone] || indData.sensory;
        
        const result = JSON.parse(JSON.stringify(toneData));
        return result;
    },

    renderPromoResult: function(data, imageUrl) {
        const avatarEl = document.getElementById('moments-avatar');
        if (avatarEl) {
            avatarEl.innerText = data.avatar || '🏪';
        }
        
        const storeNameEl = document.getElementById('moments-store-name');
        if (storeNameEl) {
            storeNameEl.innerText = data.storeName || '爆款营销大脑店';
        }
        
        const copyTextEl = document.getElementById('moments-copy-text');
        if (copyTextEl) {
            copyTextEl.innerText = data.copyText || '';
        }
        
        const photoEl = document.getElementById('moments-photo');
        if (photoEl) {
            photoEl.src = imageUrl;
        }
        
        const locationEl = document.getElementById('moments-location');
        if (locationEl) {
            locationEl.innerHTML = `📍 ${data.location || '定位生成中'}`;
        }
        
        const commentsContainer = document.getElementById('moments-comments-list');
        if (commentsContainer && data.comments) {
            commentsContainer.innerHTML = data.comments.map(c => {
                const parts = c.split(/：|:/);
                if (parts.length >= 2) {
                    const name = parts[0].trim();
                    const content = parts.slice(1).join('：').trim();
                    if (name.includes('店主') || name.includes('回复')) {
                        return `<div class="mt-0.5"><span class="font-bold text-[#576b95]">店主</span> <span class="text-[#e5e5e5]">回复</span> <span class="font-bold text-[#576b95]">${name.replace('店主回复', '').replace('回复', '') || '顾客'}</span><span class="text-[#e5e5e5]">：${content}</span></div>`;
                    }
                    return `<div class="mt-0.5"><span class="font-bold text-[#576b95]">${name}</span><span class="text-[#e5e5e5]">：${content}</span></div>`;
                }
                return `<div class="mt-0.5 text-slate-400">${c}</div>`;
            }).join('');
        }
        
        WorkspaceUI.promoLikeCount = 99;
        WorkspaceUI.updatePromoLikeList();

        const agentNameEl = document.getElementById('n8n-pipeline-active-agent');
        if (agentNameEl) {
            const toneNames = {
                sensory: '😋 爆品美食家',
                poetic: '🌸 生活艺术家',
                promo: '🔥 金牌带货主播',
                meme: '😂 爆笑段子手',
                daily: '🌤️ 温暖社区邻居'
            };
            agentNameEl.innerText = toneNames[WorkspaceUI.promoTone] || '风格专家';
        }

        const jsonBox = document.getElementById('promo-n8n-json-box');
        if (jsonBox) {
            jsonBox.innerText = WorkspaceUI.getPromoN8NJsonString(data);
        }
    },

    updatePromoLikeList: function() {
        const listEl = document.getElementById('moments-like-list');
        const heartEl = document.getElementById('moments-like-heart');
        if (!listEl) return;
        
        let baseList = '张小龙, 马化腾, 库克, 乔布斯';
        if (WorkspaceUI.promoLikeActive) {
            listEl.innerHTML = `<span class="font-semibold text-emerald-400">你</span>, ${baseList} 以及 ${WorkspaceUI.promoLikeCount} 人觉得很赞`;
            if (heartEl) {
                heartEl.innerText = '❤️';
                heartEl.className = 'text-rose-500 font-bold';
            }
        } else {
            listEl.innerHTML = `${baseList} 以及 ${WorkspaceUI.promoLikeCount} 人觉得很赞`;
            if (heartEl) {
                heartEl.innerText = '🤍';
                heartEl.className = 'text-slate-400';
            }
        }
    },

    toggleMomentsLike: function() {
        WorkspaceUI.promoLikeActive = !WorkspaceUI.promoLikeActive;
        if (WorkspaceUI.promoLikeActive) {
            WorkspaceUI.promoLikeCount += 1;
        } else {
            WorkspaceUI.promoLikeCount -= 1;
        }
        WorkspaceUI.updatePromoLikeList();
        
        if (typeof WorkspaceUI.playGuzhengNote === 'function') {
            WorkspaceUI.playGuzhengNote(WorkspaceUI.promoLikeActive ? 523 : 392, 0.1);
        }
    },

    switchPromoTab: function(tabId) {
        document.querySelectorAll('.promo-tab-btn').forEach(btn => {
            if (btn.id === `promo-tab-btn-${tabId}`) {
                btn.className = "promo-tab-btn px-4 py-2 text-xs font-bold text-emerald-400 border-b-2 border-emerald-500";
            } else {
                btn.className = "promo-tab-btn px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors";
            }
        });
        
        if (tabId === 'moments') {
            document.getElementById('promo-tab-content-moments').classList.remove('hidden');
            document.getElementById('promo-tab-content-n8n').classList.add('hidden');
        } else {
            document.getElementById('promo-tab-content-moments').classList.add('hidden');
            document.getElementById('promo-tab-content-n8n').classList.remove('hidden');
        }
    },

    copyPromoText: function() {
        const copyEl = document.getElementById('moments-copy-text');
        if (!copyEl) return;
        WorkspaceUI.copyTextToClipboard(copyEl.innerText);
        alert('朋友圈爆款文案已复制到剪贴板！');
    },

    copyPromoImagePrompt: function() {
        if (!WorkspaceUI.promoLatelyData) return;
        WorkspaceUI.copyTextToClipboard(WorkspaceUI.promoLatelyData.imagePrompt);
        alert('AI 绘图提示词已复制到剪贴板！');
    },

    copyPromoN8NJson: function() {
        const box = document.getElementById('promo-n8n-json-box');
        if (!box) return;
        WorkspaceUI.copyTextToClipboard(box.innerText);
        alert('n8n 工作流 JSON 文本已成功复制！');
    },

    downloadLocalPromoN8NJson: function() {
        const jsonStr = document.getElementById('promo-n8n-json-box')?.innerText || WorkspaceUI.getPromoN8NJsonString(WorkspaceUI.promoLatelyData);
        if (!jsonStr) return;
        
        const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = '【官网】街边店爆款营销大脑_V1.0.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    getPromoN8NJsonString: function(data) {
        const keywords = data ? data.keywords || '生椰拿铁' : '生椰拿铁';
        const industry = data ? data.industry || '咖啡茶饮' : '咖啡茶饮';
        const style = data ? data.style || '诱人食欲' : '诱人食欲';
        const location = data ? data.location || '时光咖啡馆' : '时光咖啡馆';
        const copyText = data ? data.copyText || '生椰拿铁，买一送一！' : '生椰拿铁，买一送一！';
        const imagePrompt = data ? data.imagePrompt || 'Two glasses of iced coconut latte, warm wood counter' : 'Two glasses of iced coconut latte, warm wood counter';
        const comments = data ? data.comments || [] : [];
        
        const n8n = {
            name: "【官网】街边店爆款营销大脑_V1.0",
            nodes: [
                {
                    parameters: {
                        httpMethod: "POST",
                        path: "marketing-brain-webhook",
                        options: {},
                        responseMode: "lastNode"
                    },
                    id: "c23daf3d-d6b0-47fa-838f-fa48b685da7f",
                    name: "Webhook",
                    type: "n8n-nodes-base.webhook",
                    typeVersion: 2.1
                },
                {
                    parameters: {
                        promptType: "define",
                        text: "你是一个深谙实体店私域营销的策划中脑。请分析输入并推荐风格。\n目前输入行业是:" + industry + "，关键词是:" + keywords
                    },
                    id: "a8e305c5-a6cb-4aab-bce0-16bf06c2caf8",
                    name: "🧠 营销意向解析与风格分发",
                    type: "@n8n/n8n-nodes-langchain.chainLlm",
                    typeVersion: 1.4
                },
                {
                    parameters: {
                        rules: {
                            values: [
                                { conditions: { conditions: [{ leftValue: "={{ $json.style }}", rightValue: "诱人食欲", operator: { type: "string", operation: "contains" } }] }, renameOutput: true, outputKey: "诱人食欲" },
                                { conditions: { conditions: [{ leftValue: "={{ $json.style }}", rightValue: "文艺浪漫", operator: { type: "string", operation: "contains" } }] }, renameOutput: true, outputKey: "文艺浪漫" },
                                { conditions: { conditions: [{ leftValue: "={{ $json.style }}", rightValue: "限时促销", operator: { type: "string", operation: "contains" } }] }, renameOutput: true, outputKey: "限时促销" },
                                { conditions: { conditions: [{ leftValue: "={{ $json.style }}", rightValue: "幽默玩梗", operator: { type: "string", operation: "contains" } }] }, renameOutput: true, outputKey: "幽默玩梗" },
                                { conditions: { conditions: [{ leftValue: "={{ $json.style }}", rightValue: "日常打卡", operator: { type: "string", operation: "contains" } }] }, renameOutput: true, outputKey: "日常打卡" }
                            ]
                        }
                    },
                    id: "ec803ecd-1177-40a5-9564-43cd0a0b0583",
                    name: "🔀 营销风格流转矩阵",
                    type: "n8n-nodes-base.switch",
                    typeVersion: 3.3
                },
                {
                    parameters: {
                        promptType: "define",
                        text: "你是营销写手代理[" + style + "]。请针对产品[" + keywords + "]以及定位[" + location + "]写一篇带朋友圈排版、AI图Prompt和神回复的朋友圈文案。"
                    },
                    id: "76dafdb2-fe05-43d2-9003-9724e3b743f0",
                    name: "✍️ " + style + "代理",
                    type: "@n8n/n8n-nodes-langchain.chainLlm",
                    typeVersion: 1.4
                },
                {
                    parameters: {
                        jsCode: "return [{ json: { wechatCopy: '" + copyText.replace(/\n/g, "\\n").replace(/'/g, "\\'") + "', imagePrompt: '" + imagePrompt.replace(/'/g, "\\'") + "', locationTag: '" + location.replace(/'/g, "\\'") + "', comments: " + JSON.stringify(comments) + ", style: '" + style + "', industry: '" + industry + "' } }];"
                    },
                    id: "e93daf3d-d6b0-47fa-838f-fa48b685da7e",
                    name: "返回响应",
                    type: "n8n-nodes-base.code",
                    typeVersion: 2
                }
            ],
            connections: {
                "Webhook": { main: [[{ node: "🧠 营销意向解析与风格分发", type: "main", index: 0 }]] },
                "🧠 营销意向解析与风格分发": { main: [[{ node: "🔀 营销风格流转矩阵", type: "main", index: 0 }]] },
                "🔀 营销风格流转矩阵": { main: [
                    [{ node: "✍️ " + style + "代理", type: "main", index: 0 }]
                ] },
                ["✍️ " + style + "代理"]: { main: [[{ node: "返回响应", type: "main", index: 0 }]] }
            }
        };
        
        return JSON.stringify(n8n, null, 2);
    }
});
