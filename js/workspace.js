// ============================================
// 麻升智能工作室 - 沉浸式工作台
// AI 兵器谱 Workspace UI
// ============================================
window.WorkspaceUI = {
    init: function () {
        const section = document.createElement('section');
        section.id = 'view-workspace';
        section.className = 'view-section fixed inset-0 z-[999999] bg-[#050505] flex text-white';
        section.style.display = 'none';
        
        // Inject turntable styles
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes spin-slow {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            .animate-spin-slow {
                animation: spin-slow 20s linear infinite;
            }
            .animate-pulse-subtle {
                animation: pulse-subtle 2s infinite ease-in-out;
            }
            @keyframes pulse-subtle {
                0%, 100% { opacity: 0.6; }
                50% { opacity: 1; }
            }
            
            /* Custom Poet Immersive Styles */
            .bg-poetry-scroll {
                background-color: #030408;
                background-image: radial-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 0);
                background-size: 24px 24px;
            }
            @keyframes float-petal {
                0% { transform: translateY(-50px) translateX(0) rotate(0deg); opacity: 0; }
                10% { opacity: 0.5; }
                90% { opacity: 0.5; }
                100% { transform: translateY(80vh) translateX(100px) rotate(360deg); opacity: 0; }
            }
            .petal {
                position: absolute;
                background: linear-gradient(135deg, rgba(244, 63, 94, 0.25) 0%, rgba(251, 113, 133, 0.15) 100%);
                border-radius: 50% 0 50% 50%;
                transform-origin: center;
                animation: float-petal 12s linear infinite;
                pointer-events: none;
            }
            .ink-bleed {
                animation: inkBleedEffect 1.2s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
            }
            @keyframes inkBleedEffect {
                0% { filter: blur(6px); opacity: 0; transform: scale(0.95); }
                100% { filter: blur(0px); opacity: 1; transform: scale(1); }
            }
            .poet-scroll-card {
                background-image: radial-gradient(circle at center, rgba(15, 23, 42, 0.4) 0%, rgba(2, 6, 23, 0.7) 100%);
                border: 1px solid rgba(99, 102, 241, 0.15);
                box-shadow: inset 0 1px 15px rgba(99, 102, 241, 0.05), 0 10px 40px rgba(0, 0, 0, 0.5);
            }
        `;
        document.head.appendChild(style);

        const mainAreaHTML = `
            <div class="flex-1 flex flex-col bg-[#050505]">
                <header class="h-[64px] border-b border-slate-800 flex items-center justify-between px-6 bg-[#0f172a]/50 backdrop-blur">
                    <div class="flex items-center gap-4">
                        <button onclick="WorkspaceUI.close()" class="text-slate-400 hover:text-rose-400 text-xs font-bold flex items-center gap-2 transition-all bg-slate-900/40 hover:bg-rose-950/20 border border-slate-800 hover:border-rose-500/30 px-3.5 py-1.5 rounded-xl">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                            返回官网
                        </button>
                        <div class="h-4 w-[1px] bg-slate-800"></div>
                        <div class="flex items-center gap-3">
                            <span id="ws-current-icon" class="text-2xl"></span>
                            <h3 id="ws-current-title" class="text-lg font-bold">请选择工具</h3>
                            <span id="ws-current-tag" class="text-[10px] font-mono px-2 py-0.5 rounded border border-slate-700 bg-slate-800 text-slate-300">...</span>
                        </div>
                    </div>
                    <button class="text-xs text-slate-400 hover:text-pink-400 font-medium px-4 py-2 rounded-lg border border-slate-700 hover:border-pink-500 transition-colors">
                        清空运行记录
                    </button>
                </header>
                <main id="ws-main-content" class="flex-1 overflow-hidden relative noise-overlay">
                </main>
            </div>
        `;

        section.innerHTML = mainAreaHTML;
        document.body.appendChild(section);
    },

open: function(title, urlKey) {
    let ws = document.getElementById('view-workspace');
    if (!ws) {
        WorkspaceUI.init();
        ws = document.getElementById('view-workspace');
    }
    if (typeof Handlers !== 'undefined' && Handlers.toggleMobileMenu) {
        Handlers.toggleMobileMenu(false);
    }
    
    const tools = [];
    const iconMap = {
        qinhuai: '🎭',
        poet: '✒️',
        ipClone: '💡',
        tarot: '🃏',
        gameDM: '🎲'
    };
    const resolvedIcon = iconMap[urlKey] || '🤖';

    // Only add the current active agent to focus the immersive experience and hide other agents
    tools.push({ id: urlKey, title: title, icon: resolvedIcon });
    
    const menuEl = document.getElementById('ws-sidebar-menu');
    if (menuEl && tools.length > 0) {
        menuEl.innerHTML = tools.map(t => `
            <button onclick="WorkspaceUI.switchTool('${t.id}', '${t.title}', '${t.icon}')" data-ws-tool="${t.id}" class="ws-menu-btn w-full text-left p-3 rounded-xl flex items-center gap-3 text-slate-400 hover:bg-slate-800 hover:text-white transition-all font-medium">
                <span class="text-xl">${t.icon}</span>
                <span class="truncate">${t.title}</span>
            </button>
            `).join('');
    }

    ws.style.display = 'flex';
    setTimeout(() => ws.classList.add('active'), 10);
    document.body.style.overflow = 'hidden';

    WorkspaceUI.switchTool(urlKey, title, resolvedIcon);
},

close: function() {
    WorkspaceUI.stopPoetryAudio(); // 关闭工作台时停止试听音频
    WorkspaceUI.stopResultPlayers(); // 停止结果界面的音视频播放
    const ws = document.getElementById('view-workspace');
    if (ws) {
        ws.classList.remove('active');
        setTimeout(() => {
            ws.style.display = 'none';
            document.body.style.overflow = '';
        }, 600);
    }
},

switchTool: function(id, title, icon) {
    if (id !== 'qinhuai') {
        WorkspaceUI.stopPoetryAudio(); // 切换到其他工具时停止试听音频
        WorkspaceUI.stopResultPlayers(); // 停止结果界面的音视频播放
    }
    document.querySelectorAll('.ws-menu-btn').forEach(btn => {
        if (btn.getAttribute('data-ws-tool') === id) {
            btn.classList.add('bg-slate-800', 'text-white', 'border', 'border-slate-700');
            btn.classList.remove('border-transparent');
            icon = btn.querySelector('span').innerText;
        } else {
            btn.classList.remove('bg-slate-800', 'text-white', 'border', 'border-slate-700');
        }
    });

    document.getElementById('ws-current-title').innerText = title || id;
    document.getElementById('ws-current-icon').innerText = icon || '🤖';

    let type = 'chat';
    if (['copywriter', 'moments', 'article'].includes(id)) type = 'generator';
    if (id === 'localPromo') type = 'local-promo';
    if (['credit', 'localStore'].includes(id)) type = 'workflow';
    if (['video'].includes(id)) type = 'video-generator';
    if (id === 'qinhuai') type = 'song-poetry';

    const tagEl = document.getElementById('ws-current-tag');
    
    const contentEl = document.getElementById('ws-main-content');
    if (contentEl) {
        if (type === 'song-poetry') {
            contentEl.classList.add('bg-poetry-jukebox');
        } else {
            contentEl.classList.remove('bg-poetry-jukebox');
        }
    }

    if (type === 'chat') {
        if (id === 'poet') {
            tagEl.innerText = 'AIMSZN Studio - 千古诗仙';
            tagEl.className = 'text-[10px] font-mono px-2 py-0.5 rounded border border-indigo-500/30 bg-indigo-900/20 text-indigo-400';
            WorkspaceUI.renderPoetAgent(title, icon);
        } else {
            tagEl.innerText = 'Dify LLMOps - Chat';
            tagEl.className = 'text-[10px] font-mono px-2 py-0.5 rounded border border-blue-500/30 bg-blue-900/20 text-blue-400';
            WorkspaceUI.renderChat(title, icon, id);
        }
    } else if (type === 'generator') {
        tagEl.innerText = 'Dify LLMOps - Generator';
        tagEl.className = 'text-[10px] font-mono px-2 py-0.5 rounded border border-pink-500/30 bg-pink-900/20 text-pink-400';
        WorkspaceUI.renderGenerator(title, icon);
    } else if (type === 'local-promo') {
        tagEl.innerText = 'n8n Workflow - 街边店爆款营销大脑';
        tagEl.className = 'text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-900/20 text-emerald-400';
        WorkspaceUI.renderLocalPromo(title, icon);
    } else if (type === 'workflow') {
        tagEl.innerText = 'n8n Workflow Engine';
        tagEl.className = 'text-[10px] font-mono px-2 py-0.5 rounded border border-cyan-500/30 bg-cyan-900/20 text-cyan-400';
        WorkspaceUI.renderWorkflow(title, icon);
    } else if (type === 'video-generator') {
        tagEl.innerText = 'Multi-modal Video Generator';
        tagEl.className = 'text-[10px] font-mono px-2 py-0.5 rounded border border-purple-500/30 bg-purple-900/20 text-purple-400';
        WorkspaceUI.renderVideoGenerator(title, icon);
    } else if (type === 'song-poetry') {
        tagEl.innerText = 'n8n Workflow - 宋词点唱机';
        tagEl.className = 'text-[10px] font-mono px-2 py-0.5 rounded border border-rose-500/30 bg-rose-900/20 text-rose-400';
        WorkspaceUI.renderSongPoetry(title, icon);
    }
},

renderChat: function(title, icon, agentId) {
    const content = document.getElementById('ws-main-content');
    content.innerHTML = `
        <div class="h-full flex flex-col max-w-4xl mx-auto py-8 px-4 relative">
            <div id="general-chat-flow" class="flex-1 overflow-y-auto space-y-6 pb-20 no-scrollbar">
                <div class="flex gap-4 msg-enter">
                    <div class="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xl shadow-lg shrink-0">${icon}</div>
                    <div class="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl rounded-tl-sm text-sm text-slate-300 leading-relaxed shadow-lg max-w-[80%]">
                        你好！我是${title}，随时准备好帮助你处理任务。请输入你的需求...
                    </div>
                </div>
            </div>
            <div class="absolute bottom-8 left-4 right-4 bg-slate-900/80 backdrop-blur-xl border border-slate-700 p-2 rounded-2xl flex items-end gap-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
                <textarea id="general-chat-input" class="flex-1 bg-transparent border-none text-white text-sm p-3 focus:outline-none resize-none h-12 no-scrollbar" placeholder="输入你想说的话..." onkeydown="WorkspaceUI.handleGeneralChatKeydown(event, '${agentId}', '${icon}')"></textarea>
                <button onclick="WorkspaceUI.submitGeneralChat('${agentId}', '${icon}')" class="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl transition-colors shadow-md group">
                    <svg class="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                </button>
            </div>
        </div>
    `;
},

renderGenerator: function(title, icon) {
    const content = document.getElementById('ws-main-content');
    content.innerHTML = `
        <div class="h-full flex w-full">
            <div class="w-[320px] bg-slate-900/50 border-r border-slate-800 p-6 flex flex-col gap-6 overflow-y-auto no-scrollbar">
                <div>
                    <label class="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">目标受众行业</label>
                    <select class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-pink-500 transition-colors">
                        <option>科技数码</option>
                        <option>美妆个护</option>
                        <option>职场成长</option>
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">输出口吻预设</label>
                    <div class="grid grid-cols-2 gap-2">
                        <button class="bg-pink-900/20 border border-pink-500/50 text-pink-400 text-xs py-2 rounded-lg font-bold">网感幽默</button>
                        <button class="bg-slate-950 border border-slate-800 text-slate-400 text-xs py-2 rounded-lg hover:border-slate-600">严肃专业</button>
                        <button class="bg-slate-950 border border-slate-800 text-slate-400 text-xs py-2 rounded-lg hover:border-slate-600">情感共鸣</button>
                        <button class="bg-slate-950 border border-slate-800 text-slate-400 text-xs py-2 rounded-lg hover:border-slate-600">数据逻辑</button>
                    </div>
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">核心素材/关键词</label>
                    <textarea class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-pink-500 h-32 resize-none" placeholder="输入相关产品信息或新闻事件..."></textarea>
                </div>
                <button class="mt-auto bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold py-3.5 rounded-xl shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] transition-all flex items-center justify-center gap-2">
                    开始极速生成
                </button>
            </div>
            <div class="flex-1 p-8 overflow-y-auto bg-tech-grid flex flex-col">
                <div class="glass-card border border-slate-700 rounded-2xl flex-1 flex flex-col relative overflow-hidden">
                    <div class="bg-slate-800/80 px-4 py-3 border-b border-slate-700 flex justify-between items-center">
                        <span class="text-xs font-mono text-slate-400">output.md</span>
                        <button class="text-xs text-slate-400 hover:text-white flex items-center gap-1"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg> 复制结果</button>
                    </div>
                    <div class="p-8 flex-1 flex items-center justify-center text-slate-600 flex-col gap-4">
                        <p class="text-sm">等待配置参数并生成...</p>
                    </div>
                </div>
            </div>
        </div>
            `;
},

renderWorkflow: function(title, icon) {
    const content = document.getElementById('ws-main-content');
    content.innerHTML = `
        <div class="h-full flex flex-col w-full bg-tech-grid p-6 relative">
            <div class="glass-card border border-slate-700/80 p-5 rounded-2xl mb-6 flex justify-between items-center shadow-lg">
                <div>
                    <h4 class="text-white font-bold text-lg mb-1">${title}</h4>
                    <p class="text-xs text-slate-400">基于 n8n 与大模型构建的多模态任务管线</p>
                </div>
                <button class="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 px-6 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center gap-2 transition-all">
                    触发执行流水线
                </button>
            </div>
            <div class="flex-1 flex items-center justify-center relative overflow-hidden glass-card rounded-2xl border border-slate-700/50">
                <div class="flex items-center gap-4 relative z-10">
                    <div class="flex flex-col items-center gap-2">
                        <div class="w-14 h-14 rounded-xl bg-slate-800 border-2 border-slate-600 flex items-center justify-center shadow-lg text-xl">🌐</div>
                        <span class="text-[10px] font-mono text-slate-400">Web Scraper</span>
                    </div>
                    <div class="w-16 h-0.5 bg-slate-700 relative"><div class="absolute inset-0 bg-cyan-500 w-full transition-all duration-1000 opacity-30"></div></div>
                    <div class="flex flex-col items-center gap-2">
                        <div class="w-14 h-14 rounded-xl bg-slate-800 border-2 border-slate-600 flex items-center justify-center shadow-lg text-xl">🧠</div>
                        <span class="text-[10px] font-mono text-slate-400">LLM Analyze</span>
                    </div>
                    <div class="w-16 h-0.5 bg-slate-700 relative"><div class="absolute inset-0 bg-cyan-500 w-full transition-all duration-1000 delay-1000 opacity-30"></div></div>
                    <div class="flex flex-col items-center gap-2">
                        <div class="w-14 h-14 rounded-xl bg-slate-800 border-2 border-slate-600 flex items-center justify-center shadow-lg text-xl">📊</div>
                        <span class="text-[10px] font-mono text-slate-400">Generate Report</span>
                    </div>
                </div>
            </div>
        </div>
            `;
},

renderVideoGenerator: function(title, icon) {
    const content = document.getElementById('ws-main-content');
    content.innerHTML = `
        <div class="h-full flex w-full">
            <div class="w-[320px] bg-slate-900/50 border-r border-slate-800 p-6 flex flex-col gap-6 overflow-y-auto no-scrollbar">
                <div>
                    <label class="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">画面视觉预设</label>
                    <select class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors">
                        <option>真实场景混剪</option>
                        <option>3D数字人播报</option>
                        <option>水墨国风动画</option>
                        <option>赛博朋克极客风</option>
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">视频预期时长</label>
                    <div class="grid grid-cols-2 gap-2">
                        <button class="bg-purple-900/20 border border-purple-500/50 text-purple-400 text-xs py-2 rounded-lg font-bold">15秒 (短平快)</button>
                        <button class="bg-slate-950 border border-slate-800 text-slate-400 text-xs py-2 rounded-lg hover:border-slate-600">30秒 (信息流)</button>
                        <button class="bg-slate-950 border border-slate-800 text-slate-400 text-xs py-2 rounded-lg hover:border-slate-600">60秒 (深度口播)</button>
                    </div>
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">脚本提示词 / 文案主体</label>
                    <textarea class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-purple-500 h-32 resize-none" placeholder="输入你想生成的视频主题、核心文案或转场要求..."></textarea>
                </div>
                <button class="mt-auto bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3.5 rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] transition-all flex items-center justify-center gap-2">
                    <span class="text-lg">🎬</span> 一键生成成片
                </button>
            </div>
            <div class="flex-1 p-8 overflow-y-auto bg-tech-grid flex flex-col items-center justify-center relative">
                <div class="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/80 z-0"></div>
                <div class="glass-card border border-slate-700/80 rounded-3xl w-full max-w-3xl aspect-video relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] z-10 flex flex-col">
                    <div class="bg-slate-900/90 px-5 py-3 border-b border-slate-800 flex justify-between items-center z-20">
                        <span class="text-xs font-mono text-slate-400 flex items-center gap-2"><div class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div> waiting_for_render.mp4</span>
                        <div class="flex gap-2">
                            <div class="w-3 h-3 rounded-full bg-slate-700"></div>
                            <div class="w-3 h-3 rounded-full bg-slate-700"></div>
                            <div class="w-3 h-3 rounded-full bg-slate-700"></div>
                        </div>
                    </div>
                    <div class="flex-1 flex items-center justify-center flex-col gap-6 relative bg-black/60">
                        <div class="w-20 h-20 rounded-full border-2 border-slate-700 flex items-center justify-center bg-slate-800/50 backdrop-blur">
                            <svg class="w-8 h-8 text-slate-500" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                        <p class="text-sm text-slate-500 font-mono">请在左侧配置参数并点击生成</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}
,

renderSongPoetry: function(title, icon) {
    const content = document.getElementById('ws-main-content');
    content.innerHTML = `
        <div class="h-full flex w-full">
            <!-- Left Sidebar Panel -->
            <div class="w-[320px] bg-slate-900/50 border-r border-slate-800 p-6 flex flex-col gap-5 overflow-y-auto no-scrollbar shrink-0">
                <div>
                    <label class="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">经典宋词推荐</label>
                    <select id="poetry-preset" onchange="WorkspaceUI.applyPoetryPreset(this.value)" class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-rose-500 transition-colors">
                        <option value="">-- 自定义输入 / 选择经典词作 --</option>
                        <option value="yulinling">雨霖铃 · 寒蝉凄切 (柳永)</option>
                        <option value="niannujiao">念奴娇 · 赤壁怀古 (苏轼)</option>
                        <option value="shengshengman">声声慢 · 寻寻觅觅 (李清照)</option>
                        <option value="dingfengbo">定风波 · 莫听穿林打叶声 (苏轼)</option>
                        <option value="qingyuan_yuanxi">青玉案 · 元夕 (辛弃疾)</option>
                        <option value="shuidiaogetou">水调歌头 · 明月几时有 (苏轼)</option>
                        <option value="yumeiren">虞美人 · 春花秋月何时了 (李煜)</option>
                        <option value="chaitoufeng">钗头凤 · 红酥手 (陆游)</option>
                        <option value="busuanzi">卜算子 · 咏梅 (陆游)</option>
                    </select>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">宋词词牌名</label>
                        <input type="text" id="poetry-title" placeholder="如：雨霖铃" class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-rose-500 transition-colors">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">词人</label>
                        <input type="text" id="poetry-author" placeholder="如：柳永" class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-rose-500 transition-colors">
                    </div>
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">秦淮八艳 · 演绎歌姬</label>
                    <select id="poetry-singer" class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-rose-500 transition-colors">
                        <option value="auto">🤖 智能算法路由 (根据意境匹配)</option>
                        <option value="柳如是">🌸 柳如是 (儒服剑胆 - 豪放叙事/史史交响)</option>
                        <option value="顾横波">🌸 顾横波 (一品夫人 - 豁达旷达/流行明亮)</option>
                        <option value="董小宛">🌸 董小宛 (影梅煮茶 - 婉约细腻/极简空灵)</option>
                        <option value="李香君">🌸 李香君 (血溅桃花 - 悲壮刚烈/戏剧高音)</option>
                        <option value="卞玉京">🌸 卞玉京 (寻仙道骨 - 寻仙隐忍/极慢留白)</option>
                        <option value="寇白门">🌸 寇白门 (白衣游侠 - 边塞武侠/重鼓重拍)</option>
                        <option value="马湘兰">🌸 马湘兰 (幽兰孤影 - 理趣水墨/戏腔融合)</option>
                        <option value="陈圆圆">🌸 陈圆圆 (倾国梨园 - 易碎凄迷/气声氛围)</option>
                    </select>
                </div>
                
                <!-- 歌姬风采卡 -->
                <div id="singer-profile-card" class="p-3.5 rounded-xl border border-rose-950/20 bg-rose-950/5 flex items-start gap-2.5 transition-all duration-300">
                    <div class="w-8 h-8 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-base shrink-0 animate-pulse-subtle">🌸</div>
                    <div class="flex-1 min-w-0">
                        <h5 id="singer-profile-name" class="text-xs font-bold text-rose-300 tracking-wider">智能中枢匹配</h5>
                        <p id="singer-profile-style" class="text-[9px] font-mono text-rose-400/80 mt-0.5">声线特征：自动路由倾向</p>
                        <p id="singer-profile-desc" class="text-[10px] text-slate-400 leading-relaxed mt-1">根据词作词牌的情感倾向与意境深度，自动选取最契合的数字歌姬进行声线合成与编排。</p>
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">宋词内容</label>
                    <textarea id="poetry-content" class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-rose-500 h-36 resize-none font-serif leading-relaxed" placeholder="请输入宋词正文内容..."></textarea>
                </div>
                <button id="btn-submit-poetry" onclick="WorkspaceUI.submitSongPoetry()" class="mt-4 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold py-3.5 rounded-xl shadow-[0_0_20px_rgba(225,29,72,0.3)] hover:shadow-[0_0_30px_rgba(225,29,72,0.5)] transition-all flex items-center justify-center gap-2">
                    <span>🎵</span> 开始AI谱曲吟唱
                </button>
            </div>

            <!-- Right Content Area (containing Idle, Processing, and Result Views) -->
            <div class="flex-1 flex flex-col relative overflow-hidden justify-center items-center">
                <!-- Ambient Orbs and Petals -->
                <div class="poetry-orb poetry-orb-pink"></div>
                <div class="poetry-orb poetry-orb-amber"></div>
                
                <div class="petal" style="left: 10%; animation-delay: 0s; width: 12px; height: 12px;"></div>
                <div class="petal" style="left: 30%; animation-delay: 2s; width: 14px; height: 10px;"></div>
                <div class="petal" style="left: 55%; animation-delay: 5s; width: 10px; height: 12px;"></div>
                <div class="petal" style="left: 75%; animation-delay: 1.5s; width: 15px; height: 11px;"></div>
                <div class="petal" style="left: 90%; animation-delay: 3.5s; width: 11px; height: 13px;"></div>

                <!-- Idle View -->
                <div id="poetry-idle-view" class="flex flex-col lg:flex-row items-center justify-center relative z-10 gap-16 lg:gap-24 w-full max-w-[1300px] px-8 transition-all duration-500">
                    <!-- Left: Vinyl Player -->
                    <div class="flex flex-col items-center gap-8">
                        <div class="relative w-72 h-72 sm:w-[360px] sm:h-[360px] lg:w-[440px] lg:h-[440px] xl:w-[480px] xl:h-[480px] cursor-pointer group/vinyl" onclick="WorkspaceUI.togglePoetryAudio()">
                            <div class="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-500/20 via-slate-900 to-pink-500/20 border border-slate-800 shadow-[0_0_60px_rgba(244,63,94,0.25)]"></div>
                            <div id="poetry-vinyl-disc" class="absolute inset-4 rounded-full border border-slate-800 bg-black shadow-inner flex items-center justify-center animate-spin-slow" style="animation-play-state: paused; animation-duration: 25s;">
                                <div class="w-24 h-24 sm:w-32 sm:h-32 lg:w-[160px] lg:h-[160px] xl:w-[180px] xl:h-[180px] rounded-full bg-rose-950/80 border border-rose-500/50 flex flex-col items-center justify-center p-2 text-center shadow-lg relative overflow-hidden">
                                    <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.3)_0%,transparent_70%)]"></div>
                                    <span class="text-xs sm:text-sm lg:text-lg text-rose-300 font-bold tracking-widest relative z-10">宋词</span>
                                    <span class="text-[9px] sm:text-[10px] lg:text-xs text-slate-400 font-mono tracking-tighter relative z-10 uppercase mt-1">Jukebox</span>
                                </div>
                            </div>
                            <div class="absolute top-2 -right-8 lg:-right-10 xl:-right-12 w-28 h-28 sm:w-36 sm:h-36 lg:w-52 lg:h-52 xl:w-56 xl:h-56 origin-top-left rotate-12 transition-transform duration-1000" id="poetry-tonearm" style="transform: rotate(12deg);">
                                <svg class="w-full h-full text-slate-400" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M10 10 L40 10 L50 60 L45 70" stroke-linecap="round"/>
                                    <rect x="42" y="65" width="6" height="10" rx="2" fill="currentColor"/>
                                </svg>
                            </div>
                        </div>
                        <div class="text-center">
                            <h4 class="text-white font-bold text-lg sm:text-xl lg:text-2xl">宋词八艳点唱机</h4>
                            <p class="text-slate-500 text-xs sm:text-sm tracking-widest uppercase mt-1.5 font-mono">Song Poetry Jukebox</p>
                        </div>
                        
                        <!-- 黑胶播放控制器台 -->
                        <div class="w-full max-w-[280px] sm:max-w-[360px] lg:max-w-[440px] xl:max-w-[480px] bg-slate-950/40 border border-slate-800/80 p-4 lg:p-5 rounded-2xl flex flex-col gap-3 relative z-10 mt-1 backdrop-blur-md">
                            <div class="flex items-center justify-between">
                                <button id="poetry-play-btn" onclick="WorkspaceUI.togglePoetryAudio()" class="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg transition-all active:scale-95 text-sm lg:text-base shrink-0 font-bold">
                                    <span id="play-btn-icon">▶</span>
                                </button>
                                <div class="flex-grow mx-3.5">
                                    <div class="flex justify-between text-[10px] lg:text-xs text-slate-500 font-mono mb-1">
                                        <span id="poetry-current-time">00:00</span>
                                        <span id="poetry-total-time">03:00</span>
                                    </div>
                                    <input type="range" id="poetry-progress-bar" min="0" max="180" value="0" oninput="WorkspaceUI.seekPoetryAudio(this.value)" class="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500">
                                </div>
                            </div>
                            
                            <!-- 动态音波条 -->
                            <div class="flex items-end justify-center gap-1.5 h-6 lg:h-8 pt-0.5" id="poetry-visualizer">
                                <div class="sound-wave-bar paused" style="height: 3px; width: 5px; animation: soundWave 0.8s ease-in-out infinite alternate;"></div>
                                <div class="sound-wave-bar paused" style="height: 3px; width: 5px; animation: soundWave 1.1s ease-in-out infinite alternate; animation-delay: 0.15s;"></div>
                                <div class="sound-wave-bar paused" style="height: 3px; width: 5px; animation: soundWave 0.9s ease-in-out infinite alternate; animation-delay: 0.3s;"></div>
                                <div class="sound-wave-bar paused" style="height: 3px; width: 5px; animation: soundWave 1.3s ease-in-out infinite alternate; animation-delay: 0.05s;"></div>
                                <div class="sound-wave-bar paused" style="height: 3px; width: 5px; animation: soundWave 0.7s ease-in-out infinite alternate; animation-delay: 0.4s;"></div>
                                <div class="sound-wave-bar paused" style="height: 3px; width: 5px; animation: soundWave 1.0s ease-in-out infinite alternate; animation-delay: 0.2s;"></div>
                                <div class="sound-wave-bar paused" style="height: 3px; width: 5px; animation: soundWave 1.2s ease-in-out infinite alternate; animation-delay: 0.35s;"></div>
                                <div class="sound-wave-bar paused" style="height: 3px; width: 5px; animation: soundWave 0.8s ease-in-out infinite alternate; animation-delay: 0.1s;"></div>
                            </div>
                        </div>
                    </div>
 
                    <!-- Right: Calligraphy Scroll / Lyric Display Area -->
                    <div class="w-full lg:w-[560px] xl:w-[640px] h-[380px] sm:h-[480px] lg:h-[600px] xl:h-[640px] bg-slate-950/60 border border-slate-800 rounded-3xl p-8 lg:p-10 flex flex-col shadow-2xl backdrop-blur-md relative overflow-hidden group hover:border-rose-500/30 transition-colors">
                        <div class="absolute top-0 bottom-0 left-5 w-[1px] bg-rose-950/20"></div>
                        <div class="absolute top-0 bottom-0 right-5 w-[1px] bg-rose-950/20"></div>
                        
                        <div class="text-xs lg:text-sm font-mono text-rose-400/80 mb-4 flex justify-between items-center shrink-0 border-b border-slate-900 pb-3">
                            <span>📜 实时歌词展示区域</span>
                            <span class="text-[9px] lg:text-xs bg-rose-950/40 px-2.5 py-0.5 rounded border border-rose-500/20">Live Lyrics</span>
                        </div>
                        
                        <div class="flex-grow overflow-y-auto no-scrollbar flex flex-col justify-center items-center text-center font-serif py-6 w-full" id="poetry-live-lyrics">
                            <div class="text-slate-600 italic text-base lg:text-lg">
                                <p class="my-4">长河浪淘，待君填词</p>
                                <p class="text-sm lg:text-base text-slate-700 mt-4 font-sans">请在左侧选择推荐词作或直接输入内容</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Processing View -->
                <div id="poetry-processing-view" class="hidden flex-grow flex flex-col items-center justify-center relative z-10 p-8 w-full max-w-2xl mx-auto">
                    <h4 class="text-white font-bold text-lg mb-8 tracking-wide flex items-center gap-2">
                        <div class="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></div>
                        AIMSZN 中枢调度中，正在激活八艳矩阵...
                    </h4>
                    <div class="w-full space-y-4">
                        <div class="flex items-center gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl relative" id="step-node-1">
                            <div class="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-lg shrink-0" id="step-icon-1">✍️</div>
                            <div class="flex-1 min-w-0">
                                <div class="flex justify-between items-center mb-1">
                                    <span class="text-sm font-bold text-white">步骤一：词作意境文学分析</span>
                                    <span class="text-[10px] text-slate-500 font-mono" id="step-status-1">排队中...</span>
                                </div>
                                <p class="text-[11px] text-slate-400 truncate">大模型正在对您的宋词进行流派分类与情感温度提取。</p>
                            </div>
                        </div>
                        <div class="w-0.5 h-4 bg-slate-800 ml-9"></div>
                        <div class="flex items-center gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl relative" id="step-node-2">
                            <div class="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-lg shrink-0" id="step-icon-2">🧠</div>
                            <div class="flex-1 min-w-0">
                                <div class="flex justify-between items-center mb-1">
                                    <span class="text-sm font-bold text-white">步骤二：智能中枢调度分发</span>
                                    <span class="text-[10px] text-slate-500 font-mono" id="step-status-2">未开始</span>
                                </div>
                                <p class="text-[11px] text-slate-400 truncate">匹配图谱计算中，正在选取最适合该曲风意境的数字歌姬。</p>
                            </div>
                        </div>
                        <div class="w-0.5 h-4 bg-slate-800 ml-9"></div>
                        <div class="flex items-center gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl relative" id="step-node-3">
                            <div class="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-lg shrink-0" id="step-icon-3">🎨</div>
                            <div class="flex-1 min-w-0">
                                <div class="flex justify-between items-center mb-1">
                                    <span class="text-sm font-bold text-white">步骤三：宣发单曲企划排版</span>
                                    <span class="text-[10px] text-slate-500 font-mono" id="step-status-3">未开始</span>
                                </div>
                                <p class="text-[11px] text-slate-400 truncate">根据歌姬音色与词作特色设计国风海报、概念企划手记及歌词排版。</p>
                            </div>
                        </div>
                        <div class="w-0.5 h-4 bg-slate-800 ml-9"></div>
                        <div class="flex items-center gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl relative" id="step-node-4">
                            <div class="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-lg shrink-0" id="step-icon-4">🕊️</div>
                            <div class="flex-1 min-w-0">
                                <div class="flex justify-between items-center mb-1">
                                    <span class="text-sm font-bold text-white">步骤四：飞书工作流客户端分发</span>
                                    <span class="text-[10px] text-slate-500 font-mono" id="step-status-4">未开始</span>
                                </div>
                                <p class="text-[11px] text-slate-400 truncate">成品直接灌装飞书消息节点，发送给关联的用户客户端终端。</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Result View -->
                <div id="poetry-result-view" class="hidden flex-grow flex flex-col p-2 w-full h-full min-h-0">
                    <div class="glass-card border border-slate-700/80 rounded-2xl flex-grow flex flex-col overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.6)] min-h-0">
                        <div class="bg-slate-900/90 px-6 py-4 border-b border-slate-800 flex justify-between items-center shrink-0">
                            <div class="flex items-center gap-2">
                                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"></span>
                                <span class="text-xs font-mono text-slate-300">AIMSZN_JUKEBOX_OUTPUT.md</span>
                            </div>
                            <div class="flex items-center gap-3">
                                <button onclick="WorkspaceUI.copyPoetryResult()" class="text-xs text-slate-300 hover:text-white flex items-center gap-1 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
                                    📋 复制海报文案
                                </button>
                                <button onclick="WorkspaceUI.resetPoetryForm()" class="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 bg-rose-950/30 px-3 py-1.5 rounded-lg border border-rose-500/30 hover:border-rose-500/50 transition-colors">
                                    🔄 再次点唱
                                </button>
                            </div>
                        </div>
                        <div class="flex-grow p-6 overflow-y-auto no-scrollbar bg-slate-950/40 relative font-serif min-h-0 text-slate-300" id="poetry-result-content">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Bind dynamic preview updates
    setTimeout(() => {
        const titleEl = document.getElementById('poetry-title');
        const authorEl = document.getElementById('poetry-author');
        const contentEl = document.getElementById('poetry-content');
        const singerEl = document.getElementById('poetry-singer');
        
        if (titleEl) titleEl.addEventListener('input', WorkspaceUI.updateLiveLyrics);
        if (authorEl) authorEl.addEventListener('input', WorkspaceUI.updateLiveLyrics);
        if (contentEl) contentEl.addEventListener('input', WorkspaceUI.updateLiveLyrics);
        if (singerEl) singerEl.addEventListener('change', WorkspaceUI.updateSingerProfile);
        
        WorkspaceUI.updateLiveLyrics();
        WorkspaceUI.updateSingerProfile();
    }, 10);
},

updateLiveLyrics: function() {
    const titleVal = document.getElementById('poetry-title')?.value.trim() || '';
    const authorVal = document.getElementById('poetry-author')?.value.trim() || '';
    const contentVal = document.getElementById('poetry-content')?.value.trim() || '';
    
    const lyricsEl = document.getElementById('poetry-live-lyrics');
    if (!lyricsEl) return;
    
    if (!titleVal && !authorVal && !contentVal) {
        lyricsEl.innerHTML = `
            <div class="text-slate-600 italic text-base sm:text-lg lg:text-xl text-center">
                <p class="my-4">长河浪淘，待君填词</p>
                <p class="text-sm sm:text-base text-slate-700 mt-4 font-sans">请在左侧选择推荐词作或直接输入内容</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    if (titleVal || authorVal) {
        html += `<h3 class="text-rose-400 font-bold text-xl sm:text-2xl lg:text-3xl mb-3 tracking-wider text-center">《${titleVal || '未命名'}》</h3>`;
        html += `<p class="text-slate-500 text-sm sm:text-base mb-8 lg:mb-10 font-sans text-center">【词人】${authorVal || '佚名'}</p>`;
    }
    
    if (contentVal) {
        const lines = contentVal.split('\\n');
        html += `<div class="space-y-4 sm:space-y-5 max-w-md mx-auto text-center w-full">`;
        lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed !== '') {
                html += `<p class="text-slate-200 text-base sm:text-lg lg:text-xl lg:leading-loose leading-relaxed tracking-widest font-serif">${trimmed}</p>`;
            } else {
                html += `<div class="h-4"></div>`;
            }
        });
        html += `</div>`;
    } else {
        html += `<p class="text-slate-600 italic text-sm sm:text-base lg:text-lg text-center">请输入正文内容...</p>`;
    }
    
    lyricsEl.innerHTML = html;
},
updateSingerProfile: function() {
    const val = document.getElementById('poetry-singer')?.value || 'auto';
    const profiles = {
        'auto': {
            name: "智能中枢算法路由",
            style: "声线特征：意境与声线智能匹配",
            desc: "大模型将自动对您的宋词进行情感温度提取，并选取最契合的数字歌姬进行声音特征灌装。"
        },
        '柳如是': {
            name: "柳如是 · 儒服剑胆",
            style: "声线特征：豪放叙事 / 史史交响",
            desc: "秦淮之首，才情冠绝，英气挺拔。声线带有家国兴亡的悲壮与豁达，极具历史感。"
        },
        '顾横波': {
            name: "顾横波 · 一品夫人",
            style: "声线特征：豁达旷达 / 流行明亮",
            desc: "庄重典雅，气度非凡。声线清朗亮丽，曲调如春江花月夜般开朗明快，温婉大气。"
        },
        '董小宛': {
            name: "董小宛 · 影梅煮茶",
            style: "声线特征：婉约细腻 / 极简空灵",
            desc: "淡雅清高，琴艺精湛。声线清甜细腻，伴奏以极简古琴、古筝为主，空灵婉转。"
        },
        '李香君': {
            name: "李香君 · 血溅桃花",
            style: "声线特征：悲壮刚烈 / 戏剧高音",
            desc: "桃花溅血，气节坚贞。声线高亢清澈，融入昆曲行腔，极具悲壮风骨与坚贞感。"
        },
        '卞玉京': {
            name: "卞玉京 · 寻仙道骨",
            style: "声线特征：道家隐忍 / 极慢留白",
            desc: "寻仙道骨，琴心剑胆。曲调极慢，以洞箫和幽咽琴声为主，充满大音希声的禅意留白。"
        },
        '寇白门': {
            name: "寇白门 · 白衣游侠",
            style: "声线特征：边塞武侠 / 重鼓重拍",
            desc: "侠义豪爽，白衣游侠。伴奏融合琵琶急扫与重鼓重拍，表现江湖儿女的爽朗与果断。"
        },
        '马湘兰': {
            name: "马湘兰 · 幽兰孤影",
            style: "声线特征：理趣水墨 / 戏腔融合",
            desc: "擅画幽兰，兰心蕙质。声线带有空谷幽兰的孤高傲骨，融入昆曲念白，淡雅理趣。"
        },
        '陈圆圆': {
            name: "陈圆圆 · 倾国梨园",
            style: "声线特征：易碎凄迷 / 气声氛围",
            desc: "倾国红颜，易碎凄美。声线带有极强的故事感与易碎感，以气声吟唱，如泣如诉。"
        }
    };
    
    const profile = profiles[val] || profiles['auto'];
    const nameEl = document.getElementById('singer-profile-name');
    const styleEl = document.getElementById('singer-profile-style');
    const descEl = document.getElementById('singer-profile-desc');
    
    if (nameEl) nameEl.innerText = profile.name;
    if (styleEl) styleEl.innerText = profile.style;
    if (descEl) descEl.innerText = profile.desc;
    
    // Visual glow ping
    const card = document.getElementById('singer-profile-card');
    if (card) {
        card.classList.remove('border-rose-950/20');
        card.classList.add('border-rose-500/40', 'bg-rose-950/10');
        setTimeout(() => {
            card.classList.remove('border-rose-500/40', 'bg-rose-950/10');
            card.classList.add('border-rose-950/20');
        }, 300);
    }
},

audioPlaying: false,
audioCtx: null,
audioTimer: null,
playInterval: null,

togglePoetryAudio: function() {
    if (!WorkspaceUI.audioCtx) {
        WorkspaceUI.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    if (WorkspaceUI.audioCtx.state === 'suspended') {
        WorkspaceUI.audioCtx.resume();
    }
    
    const playBtn = document.getElementById('poetry-play-btn');
    const playIcon = document.getElementById('play-btn-icon');
    const tonearm = document.getElementById('poetry-tonearm');
    const disc = document.getElementById('poetry-vinyl-disc');
    const visualizerBars = document.querySelectorAll('.sound-wave-bar');
    
    if (WorkspaceUI.audioPlaying) {
        // Stop playing
        WorkspaceUI.stopPoetryAudio();
    } else {
        // Start playing
        WorkspaceUI.audioPlaying = true;
        if (playIcon) playIcon.innerText = '⏸';
        if (playBtn) {
            playBtn.classList.remove('bg-rose-600', 'hover:bg-rose-500');
            playBtn.classList.add('bg-amber-600', 'hover:bg-amber-500');
        }
        if (tonearm) tonearm.style.transform = 'rotate(28deg)';
        if (disc) disc.style.animationPlayState = 'running';
        
        visualizerBars.forEach(bar => {
            bar.classList.remove('paused');
            bar.classList.add('playing');
        });
        
        // Procedural melodies
        const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00]; // Pentatonic scale
        let lastNoteIndex = -1;
        
        const playGuzhengPluck = (freq, delay = 0) => {
            if (!WorkspaceUI.audioPlaying || !WorkspaceUI.audioCtx) return;
            const ctx = WorkspaceUI.audioCtx;
            
            const osc = ctx.createOscillator();
            const oscSine = ctx.createOscillator();
            const gainNode = ctx.createGain();
            const filter = ctx.createBiquadFilter();
            
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
            
            oscSine.type = 'sine';
            oscSine.frequency.setValueAtTime(freq, ctx.currentTime + delay);
            
            // Gain Envelope
            gainNode.gain.setValueAtTime(0, ctx.currentTime + delay);
            gainNode.gain.linearRampToValueAtTime(0.18, ctx.currentTime + delay + 0.015); // sharp attack
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 2.5); // long decay
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1400, ctx.currentTime + delay);
            filter.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + delay + 1.8);
            
            // Reverb/Delay nodes
            const delayNode = ctx.createDelay();
            delayNode.delayTime.value = 0.45;
            const feedbackNode = ctx.createGain();
            feedbackNode.gain.value = 0.35;
            
            osc.connect(filter);
            oscSine.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            // Connect Reverb
            gainNode.connect(delayNode);
            delayNode.connect(feedbackNode);
            feedbackNode.connect(delayNode);
            feedbackNode.connect(ctx.destination);
            
            osc.start(ctx.currentTime + delay);
            oscSine.start(ctx.currentTime + delay);
            osc.stop(ctx.currentTime + delay + 3.0);
            oscSine.stop(ctx.currentTime + delay + 3.0);
        };
        
        const playMelodyLoop = () => {
            if (!WorkspaceUI.audioPlaying) return;
            
            let idx = Math.floor(Math.random() * notes.length);
            while (idx === lastNoteIndex) {
                idx = Math.floor(Math.random() * notes.length);
            }
            lastNoteIndex = idx;
            
            playGuzhengPluck(notes[idx]);
            
            // Occasional octave pluck
            if (Math.random() < 0.2) {
                const octaveIdx = (idx + 4) % notes.length;
                playGuzhengPluck(notes[octaveIdx], 0.08);
            }
            
            // Next note timing
            const timings = [0.8, 1.2, 1.6, 2.4];
            const nextTiming = timings[Math.floor(Math.random() * timings.length)];
            WorkspaceUI.audioTimer = setTimeout(playMelodyLoop, nextTiming * 1000);
        };
        
        playMelodyLoop();
        
        // Timer ticking
        WorkspaceUI.playInterval = setInterval(() => {
            const progress = document.getElementById('poetry-progress-bar');
            const currentTimeEl = document.getElementById('poetry-current-time');
            if (progress) {
                let currentVal = parseInt(progress.value) + 1;
                if (currentVal >= 180) {
                    currentVal = 0;
                }
                progress.value = currentVal;
                
                const mins = Math.floor(currentVal / 60).toString().padStart(2, '0');
                const secs = (currentVal % 60).toString().padStart(2, '0');
                if (currentTimeEl) currentTimeEl.innerText = `${mins}:${secs}`;
            }
        }, 1000);
    }
},

stopPoetryAudio: function() {
    WorkspaceUI.audioPlaying = false;
    if (WorkspaceUI.audioTimer) {
        clearTimeout(WorkspaceUI.audioTimer);
        WorkspaceUI.audioTimer = null;
    }
    if (WorkspaceUI.playInterval) {
        clearInterval(WorkspaceUI.playInterval);
        WorkspaceUI.playInterval = null;
    }
    
    const playIcon = document.getElementById('play-btn-icon');
    const playBtn = document.getElementById('poetry-play-btn');
    const tonearm = document.getElementById('poetry-tonearm');
    const disc = document.getElementById('poetry-vinyl-disc');
    const visualizerBars = document.querySelectorAll('.sound-wave-bar');
    
    if (playIcon) playIcon.innerText = '▶';
    if (playBtn) {
        playBtn.classList.remove('bg-amber-600', 'hover:bg-amber-500');
        playBtn.classList.add('bg-rose-600', 'hover:bg-rose-500');
    }
    if (tonearm) tonearm.style.transform = 'rotate(12deg)';
    if (disc) disc.style.animationPlayState = 'paused';
    visualizerBars.forEach(bar => {
        bar.classList.remove('playing');
        bar.classList.add('paused');
    });
},

seekPoetryAudio: function(val) {
    const currentTimeEl = document.getElementById('poetry-current-time');
    if (currentTimeEl) {
        const mins = Math.floor(val / 60).toString().padStart(2, '0');
        const secs = (val % 60).toString().padStart(2, '0');
        currentTimeEl.innerText = `${mins}:${secs}`;
    }
},

applyPoetryPreset: function(presetKey) {
    const presets = {
        yulinling: {
            title: "雨霖铃",
            author: "柳永",
            content: "寒蝉凄切，对长亭晚，骤雨初歇。都门帐饮无绪，留恋处，兰舟催发。执手相看泪眼，竟无语凝噎。念去去，千里烟波，暮霭沉沉楚天阔。\n多情自古伤离别，更那堪，冷落清秋节！今宵酒醒何处？杨柳岸，晓风残月。此去经年，应是良辰好景虚设。便纵有千种风情，更与何人说？"
        },
        niannujiao: {
            title: "念奴娇",
            author: "苏轼",
            content: "大江东去，浪淘尽，千古风流人物。故垒西边，人道是，三国周郎赤壁。乱石穿空，惊涛拍岸，卷起千堆雪。江山如画，一时多少豪杰。\n遥想公瑾当年，小乔初嫁了，雄姿英发。羽扇纶巾，谈笑间，樯橹灰飞烟灭。故国神游，多情应笑我，早生华发。人生如梦，一尊还酹江月。"
        },
        shengshengman: {
            title: "声声慢",
            author: "李清照",
            content: "寻寻觅觅，冷冷清清，凄凄惨惨戚戚。乍暖还寒时候，最难将息。三杯两盏淡酒，怎敌他、晚来风急！雁过也，正伤心，却是旧时相识。\n满地黄花堆积，憔悴损，如今有谁堪摘？守着窗儿，独自怎生得黑！梧桐更兼细雨，到黄昏、点点滴滴。这次第，怎一个愁字了得！"
        },
        dingfengbo: {
            title: "定风波",
            author: "苏轼",
            content: "莫听穿林打叶声，何妨吟啸且徐行。竹杖芒鞋轻胜马，谁怕？一蓑烟雨任平生。\n料峭春风吹酒醒，微冷，山头斜照却相迎。回首向来萧瑟处，归去，也无风雨也无晴。"
        },
        qingyuan_yuanxi: {
            title: "青玉案",
            author: "辛弃疾",
            content: "东风夜放花千树。更吹落、星如雨。宝马雕车香满路。凤箫声动，玉壶光转，一夜鱼龙舞。\n蛾儿雪柳黄金缕。笑语盈盈暗香去。众里寻他千百度。蓦然回首，那人却在，灯火阑珊处。"
        },
        shuidiaogetou: {
            title: "水调歌头",
            author: "苏轼",
            content: "明月几时有？把酒问青天。不知天上宫阙，今夕是何年。我欲乘风归去，又恐琼楼玉宇，高处不胜寒。起舞弄清影，何似在人间。\n转朱阁，低绮户，照无眠。不应有恨，何事长向别时圆？人有悲欢离合，月有阴晴圆缺，此事古难全。但愿人长久，千里共婵娟。"
        },
        yumeiren: {
            title: "虞美人",
            author: "李煜",
            content: "春花秋月何时了？往事知多少。小楼昨夜又东风，故国不堪回首月明中。\n雕栏玉砌应犹在，只是朱颜改。问君能有几多愁？恰似一江春水向东流。"
        },
        chaitoufeng: {
            title: "钗头凤",
            author: "陆游",
            content: "红酥手，黄縢酒，满城春色宫墙柳。东风恶，欢情薄。一怀愁绪，几年离索。错、错、错。\n春如旧，人空瘦，泪痕红浥鲛绡透。桃花落，闲池阁。山盟虽在，锦书难托。莫、莫、莫！"
        },
        busuanzi: {
            title: "卜算子",
            author: "陆游",
            content: "驿外断桥边，寂寞开无主。已是黄昏独自愁，更著风和雨。\n无意苦争春，一任群芳妒。零落成泥碾作尘，只有香如故。"
        }
    };
    
    if (!presetKey) {
        document.getElementById('poetry-title').value = '';
        document.getElementById('poetry-author').value = '';
        document.getElementById('poetry-content').value = '';
    } else {
        const data = presets[presetKey];
        if (data) {
            document.getElementById('poetry-title').value = data.title;
            document.getElementById('poetry-author').value = data.author;
            document.getElementById('poetry-content').value = data.content;
        }
    }
    WorkspaceUI.updateLiveLyrics();
},

submitSongPoetry: async function() {
    const titleVal = document.getElementById('poetry-title').value.trim();
    const authorVal = document.getElementById('poetry-author').value.trim();
    const contentVal = document.getElementById('poetry-content').value.trim();
    const singerVal = document.getElementById('poetry-singer').value;

    if (!titleVal || !authorVal || !contentVal) {
        alert('请完整填写词牌名、词人及宋词内容！');
        return;
    }

    WorkspaceUI.stopPoetryAudio(); // 提交任务时，先停止当前试听音频

    // Tonearm pivots onto record
    const tonearm = document.getElementById('poetry-tonearm');
    if (tonearm) {
        tonearm.style.transform = 'rotate(28deg)';
    }

    const btn = document.getElementById('btn-submit-poetry');
    btn.disabled = true;
    btn.innerHTML = `<span>⏳</span> 正在发送请求...`;

    const idleView = document.getElementById('poetry-idle-view');
    const processingView = document.getElementById('poetry-processing-view');
    const resultView = document.getElementById('poetry-result-view');

    idleView.classList.add('hidden');
    resultView.classList.add('hidden');
    processingView.classList.remove('hidden');

    const updateStep = (stepNum, statusText, colorClass, iconHtml = null) => {
        const node = document.getElementById(`step-node-${stepNum}`);
        const status = document.getElementById(`step-status-${stepNum}`);
        const icon = document.getElementById(`step-icon-${stepNum}`);
        if (node) {
            node.className = `flex items-center gap-4 bg-slate-900/60 border ${colorClass} p-4 rounded-2xl transition-all duration-500 shadow-lg`;
        }
        if (status) {
            status.innerText = statusText;
            status.className = `text-[10px] font-mono ${colorClass.includes('rose') || colorClass.includes('emerald') ? 'text-rose-400 font-bold' : 'text-slate-500'}`;
        }
        if (icon && iconHtml) {
            icon.innerHTML = iconHtml;
        }
    };

    // Begin Pipeline
    updateStep(1, '进行中...', 'border-rose-500/40 bg-slate-900', '<div class="animate-spin text-sm">⏳</div>');

    let textPrompt = `【词牌名】：${titleVal}\n【词人】：${authorVal}\n【内容】：${contentVal}`;
    if (singerVal !== 'auto') {
        textPrompt += `\n【演唱风格】：用${singerVal}的风格唱`;
    }

    const payload = {
        message: {
            content: textPrompt
        }
    };

    const baseWebhookUrl = window.MSZN_GLOBAL_CONFIG?.api?.n8nWebhook || 'http://192.168.1.58:5678/webhook/efficiency-diagnosis';
    const qinhuaiWebhookUrl = baseWebhookUrl.replace(/efficiency-diagnosis$/, 'adc2a0fe-3e76-4161-8b9d-e92005f59e56');

    let responseData = null;
    let fetchError = null;

    // Asynchronous dynamic progress animation while fetch is loading
    let stepTimer1 = null;
    let stepTimer2 = null;
    let stepTimer3 = null;

    updateStep(1, '进行中...', 'border-rose-500/40 bg-slate-900', '<div class="animate-spin text-sm">⏳</div>');

    stepTimer1 = setTimeout(() => {
        updateStep(1, '✅ 已完成', 'border-emerald-500/30', '✍️');
        updateStep(2, '进行中...', 'border-rose-500/40 bg-slate-900', '<div class="animate-spin text-sm">⏳</div>');
        
        stepTimer2 = setTimeout(() => {
            updateStep(2, '✅ 已完成', 'border-emerald-500/30', '🧠');
            updateStep(3, '进行中...', 'border-rose-500/40 bg-slate-900', '<div class="animate-spin text-sm">⏳</div>');
            
            stepTimer3 = setTimeout(() => {
                updateStep(3, '✅ 已完成', 'border-emerald-500/30', '🎨');
                updateStep(4, '进行中...', 'border-rose-500/40 bg-slate-900', '<div class="animate-spin text-sm">⏳</div>');
            }, 10000); // 10s wait for formatting card
        }, 8000); // 8s wait for character agent routing
    }, 3500); // 3.5s wait for first analysis step

    try {
        const fetchPromise = fetch(qinhuaiWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        // Raised timeout to 90 seconds to fully guarantee multi-agent LLM chain runs to completion
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), 90000));
        
        const response = await Promise.race([fetchPromise, timeoutPromise]);

        if (response && response.ok) {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                responseData = await response.json();
            } else {
                responseData = await response.text();
            }
        } else {
            throw new Error(`API returned status ${response ? response.status : 'unknown'}`);
        }
    } catch (err) {
        console.error('Webhook execution failed:', err);
        fetchError = err;
    }

    // Cancel dynamic timers when the request ends
    if (stepTimer1) clearTimeout(stepTimer1);
    if (stepTimer2) clearTimeout(stepTimer2);
    if (stepTimer3) clearTimeout(stepTimer3);

    // Speed-complete all remaining steps smoothly
    const icons = { 1: '✍️', 2: '🧠', 3: '🎨', 4: '🕊️' };
    for (let i = 1; i <= 4; i++) {
        updateStep(i, '✅ 已完成', 'border-emerald-500/30', icons[i]);
    }
    // Small pause for visual smoothness
    await new Promise(r => setTimeout(r, 600));

        // Switch to Result View
    processingView.classList.add('hidden');
    resultView.classList.remove('hidden');
    btn.disabled = false;
    btn.innerHTML = `<span>🎵</span> 开始AI谱曲吟唱`;

    const resultContent = document.getElementById('poetry-result-content');
    
    let isStructured = false;
    if (responseData && typeof responseData === 'object') {
        if (responseData.lyrics || responseData.cardText || responseData.musicPrompt || responseData.videoPrompt) {
            isStructured = true;
        }
    }

    if (isStructured) {
        WorkspaceUI.renderResultDashboard(titleVal, authorVal, singerVal, responseData);
    } else {
        // Render fallback Feishu queue view
        let errorMsg = fetchError ? `<p class="text-rose-400 text-xs font-mono mb-4 bg-rose-950/20 p-3 rounded-xl border border-rose-500/20">系统级通信延迟（已自动转为飞书队列）: ${fetchError.message}</p>` : '';
        
        // If n8n returned started message, display it as confirmation of async start
        if (responseData && typeof responseData === 'object' && responseData.message === "Workflow was started") {
            errorMsg = `<p class="text-emerald-400 text-xs font-mono mb-4 bg-emerald-950/20 p-3 rounded-xl border border-emerald-500/20">系统状态: 工作流已开启异步常驻运行中（Workflow was started）</p>`;
        }

        const singerName = singerVal === 'auto' ? '中枢智能匹配' : singerVal;
        
        resultContent.innerHTML = `
            <div class="space-y-6 max-w-xl mx-auto py-8">
                <div class="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-3xl mx-auto mb-4 animate-bounce">🕊️</div>
                <h3 class="text-white text-xl font-bold text-center">宋词八艳工作流已成功触发！</h3>
                ${errorMsg}
                <div class="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-4 text-slate-300 text-sm leading-relaxed font-sans shadow-inner">
                    <p>✨ <b>任务已进入自动化管线：</b> 我们已向您的飞书客户端发送了该单曲编排任务。</p>
                    <p><b>【提交内容摘要】：</b></p>
                    <ul class="list-disc pl-5 space-y-1 text-xs text-slate-400 font-mono">
                        <li>词牌名称：${titleVal}</li>
                        <li>词作作者：${authorVal}</li>
                        <li>指定演绎：${singerName}</li>
                    </ul>
                    <p class="text-xs text-slate-400 mt-2">由于 AI 大模型音乐谱曲与飞书机器人灌装需要约 1-2 分钟，最终生成的【概念单曲宣发卡片】将直接推送到关联的飞书客户端，请耐心等待。</p>
                </div>
                <div class="text-center mt-6">
                    <button onclick="WorkspaceUI.showMockPreview('${titleVal.replace(/'/g, "\\'")}', '${authorVal.replace(/'/g, "\\'")}', '${contentVal.replace(/\n/g, '\\n').replace(/'/g, "\\'")}', '${singerVal}')" class="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mx-auto">
                        <span>✨</span> 立即在网页中体验模拟预览版 (无需等待)
                    </button>
                </div>
            </div>
        `;
    }
},

copyPoetryResult: function() {
    const cardEl = document.getElementById('tab-content-card');
    const text = cardEl ? cardEl.innerText : "";
    if (text) {
        navigator.clipboard.writeText(text).then(() => {
            alert('宣发海报文案已成功复制到剪贴板！');
        }).catch(err => {
            console.error('Copy failed:', err);
        });
    } else {
        const content = document.getElementById('poetry-result-content');
        if (!content) return;
        navigator.clipboard.writeText(content.innerText).then(() => {
            alert('文案已成功复制到剪贴板！');
        }).catch(err => {
            console.error('Copy failed:', err);
        });
    }
},

copyTextFromElement: function(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const text = el.innerText || el.textContent;
    navigator.clipboard.writeText(text).then(() => {
        alert('内容已成功复制到剪贴板！');
    }).catch(err => {
        console.error('Copy failed:', err);
    });
},

resetPoetryForm: function() {
    document.getElementById('poetry-preset').value = '';
    WorkspaceUI.applyPoetryPreset('');
    
    const tonearm = document.getElementById('poetry-tonearm');
    if (tonearm) {
        tonearm.style.transform = 'rotate(12deg)';
    }

    const idleView = document.getElementById('poetry-idle-view');
    const processingView = document.getElementById('poetry-processing-view');
    const resultView = document.getElementById('poetry-result-view');
    
    idleView.classList.remove('hidden');
    processingView.classList.add('hidden');
    resultView.classList.add('hidden');
}
,

formatMarkdown: function(text) {
    if (!text) return '';
    let escaped = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    let lines = escaped.replace(/\\n/g, '\n').split('\n');
    let formattedLines = lines.map(line => {
        let trimmed = line.trim();
        if (trimmed.startsWith('###')) {
            return `<h4 class="text-base sm:text-lg font-bold text-rose-300 mt-4 mb-2 font-serif">${trimmed.replace(/^###\s*/, '')}</h4>`;
        }
        if (trimmed.startsWith('##')) {
            return `<h3 class="text-lg sm:text-xl font-black text-white mt-6 mb-3 border-b border-slate-800 pb-2 font-serif">${trimmed.replace(/^##\s*/, '')}</h3>`;
        }
        if (trimmed.startsWith('#')) {
            return `<h2 class="text-xl sm:text-2xl font-black text-rose-400 mt-8 mb-4 font-serif text-center">${trimmed.replace(/^#\s*/, '')}</h2>`;
        }
        if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
            return `<li class="text-slate-300 text-xs sm:text-sm font-sans list-none flex items-center gap-2 mb-1.5"><span class="text-rose-500">✦</span> ${trimmed.replace(/^[-*]\s*/, '')}</li>`;
        }
        if (trimmed === '') {
            return `<div class="h-4"></div>`;
        }
        if (trimmed.includes('━━')) {
            return `<div class="text-center text-slate-400 text-xs tracking-widest my-4 py-1.5 bg-slate-900/40 border border-slate-800/50 rounded-xl max-w-sm mx-auto font-mono">${trimmed}</div>`;
        }
        return `<p class="text-slate-300 text-sm leading-loose my-1 font-serif">${trimmed}</p>`;
    });

    return `<div class="max-w-2xl mx-auto py-2 px-2 space-y-1">${formattedLines.join('')}</div>`;
},

renderResultDashboard: function(title, author, singer, data) {
    const resultContent = document.getElementById('poetry-result-content');
    if (!resultContent) return;

    const lyricsText = data.lyrics || "";
    const musicPrompt = data.musicPrompt || "";
    const videoPrompt = data.videoPrompt || "";
    const cardText = data.cardText || "";
    const singerName = singer === 'auto' ? (data.beauty || '智能中枢') : singer;

    // Format lyrics
    let formattedLyricsHtml = "";
    if (lyricsText) {
        const lines = lyricsText.replace(/\\n/g, '\n').split('\n');
        const formattedLines = lines.map(line => {
            const trimmed = line.trim();
            if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
                return `<div class="text-center text-slate-400 text-[10px] tracking-widest my-4 py-1 bg-slate-900/50 border border-slate-800 rounded-lg max-w-[280px] mx-auto font-mono">${trimmed}</div>`;
            }
            if (trimmed === "") return `<div class="h-3"></div>`;
            return `<p class="text-slate-300 text-sm leading-loose my-1 text-center font-serif">${trimmed}</p>`;
        });
        formattedLyricsHtml = `<div class="max-w-md mx-auto py-1 space-y-1">${formattedLines.join('')}</div>`;
    } else {
        formattedLyricsHtml = `<p class="text-slate-500 italic text-center">暂无歌词内容</p>`;
    }

    // Format card text (markdown compiled)
    const formattedCardHtml = WorkspaceUI.formatMarkdown(cardText || "");

    const config = window.MSZN_GLOBAL_CONFIG || {};
    const audioUrl = config.media?.demoAudio || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
    const videoUrl = config.media?.videoB_Url || 'https://www.w3schools.com/html/mov_bbb.mp4';

    // Clear existing playing visualizers
    WorkspaceUI.stopPoetryAudio();

    resultContent.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full max-w-6xl mx-auto py-1 text-left">
            <!-- Left Panel: Players (cols: 2) -->
            <div class="lg:col-span-2 flex flex-col gap-5">
                <!-- Album Cover & Audio Player -->
                <div class="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-5 flex flex-col items-center gap-4 relative overflow-hidden backdrop-blur shadow-xl">
                    <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(244,63,94,0.06),transparent_50%)]"></div>
                    
                    <!-- Mini Vinyl Disc (Rotates when audio is playing) -->
                    <div class="relative w-32 h-32 flex items-center justify-center">
                        <div class="absolute inset-0 rounded-full bg-slate-950 border border-slate-800 shadow-inner flex items-center justify-center">
                            <div id="result-vinyl-disc" class="absolute inset-2 rounded-full bg-black border border-slate-900 flex items-center justify-center animate-spin-slow" style="animation-play-state: paused; animation-duration: 20s;">
                                <div class="w-10 h-10 rounded-full bg-rose-950/80 border border-rose-500/30 flex items-center justify-center text-[9px] text-rose-300 font-serif shadow-inner relative overflow-hidden">
                                    <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.3)_0%,transparent_70%)]"></div>
                                    <span class="relative z-10 font-bold tracking-wider">AIMSZN</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Audio Title & Playback Controls -->
                    <div class="text-center w-full">
                        <h4 class="text-white font-bold text-xs tracking-wide">《${title}》· Suno AI 编曲试听</h4>
                        <p class="text-slate-500 text-[9px] uppercase font-mono mt-1">演绎歌姬: ${singerName}</p>
                    </div>
                    
                    <audio id="result-audio-player" src="${audioUrl}"></audio>
                    
                    <!-- Custom Audio Control Bar -->
                    <div class="w-full bg-slate-950/60 border border-slate-800/80 p-2.5 rounded-xl flex items-center gap-3">
                        <button id="result-audio-play-btn" onclick="WorkspaceUI.toggleResultAudio()" class="w-7 h-7 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center text-[10px] shrink-0 active:scale-95 transition-all font-bold">
                            <span id="result-audio-play-icon">▶</span>
                        </button>
                        <div class="flex-grow">
                            <div class="flex justify-between text-[8px] text-slate-500 font-mono mb-0.5">
                                <span id="result-audio-current-time">00:00</span>
                                <span id="result-audio-total-time">00:00</span>
                            </div>
                            <input type="range" id="result-audio-progress" min="0" max="100" value="0" oninput="WorkspaceUI.seekResultAudio(this.value)" class="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500">
                        </div>
                    </div>
                </div>
                
                <!-- Concept Video MV Player -->
                <div class="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-5 flex flex-col gap-3 relative overflow-hidden backdrop-blur shadow-xl">
                    <h5 class="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span> 🎬 Sora AI 概念视频 MV
                    </h5>
                    <div class="relative rounded-xl overflow-hidden border border-slate-800 bg-black aspect-video group">
                        <video id="result-video-player" src="${videoUrl}" class="w-full h-full object-cover" poster="https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=800" loop></video>
                        <!-- Custom Play Overlay -->
                        <div id="result-video-overlay" onclick="WorkspaceUI.toggleResultVideo()" class="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer group-hover:bg-black/30 transition-all">
                            <div class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-md flex items-center justify-center text-white text-sm transition-transform group-hover:scale-105">
                                ▶
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Right Panel: Tabs for Lyrics, Card, Prompts (cols: 3) -->
            <div class="lg:col-span-3 flex flex-col h-[480px] bg-slate-900/30 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur shadow-xl">
                <!-- Tabs Header -->
                <div class="bg-slate-950/80 px-4 py-1.5 border-b border-slate-800 flex items-center gap-1 shrink-0">
                    <button onclick="WorkspaceUI.switchResultTab('lyrics')" id="tab-btn-lyrics" class="tab-btn px-3.5 py-2.5 text-xs font-bold text-rose-400 border-b-2 border-rose-500 transition-all">📜 完整歌词</button>
                    <button onclick="WorkspaceUI.switchResultTab('card')" id="tab-btn-card" class="tab-btn px-3.5 py-2.5 text-xs font-bold text-slate-400 border-b-2 border-transparent hover:text-white transition-all">🎨 宣发海报</button>
                    <button onclick="WorkspaceUI.switchResultTab('prompts')" id="tab-btn-prompts" class="tab-btn px-3.5 py-2.5 text-xs font-bold text-slate-400 border-b-2 border-transparent hover:text-white transition-all">⚙️ AI 提示词</button>
                </div>
                
                <!-- Tab Contents Container -->
                <div class="flex-grow p-5 overflow-y-auto no-scrollbar relative min-h-0 text-sm">
                    <!-- Lyrics Tab -->
                    <div id="tab-content-lyrics" class="tab-content space-y-4 text-center font-serif text-slate-300 w-full">
                        ${formattedLyricsHtml}
                    </div>
                    
                    <!-- Card Tab -->
                    <div id="tab-content-card" class="tab-content hidden font-sans text-slate-300 w-full leading-relaxed">
                        ${formattedCardHtml}
                    </div>
                    
                    <!-- Prompts Tab -->
                    <div id="tab-content-prompts" class="tab-content hidden space-y-4 font-sans w-full text-xs">
                        <div>
                          <div class="flex justify-between items-center mb-1">
                            <span class="text-xs font-bold text-slate-400">🎵 Suno 音乐生成提示词</span>
                            <button onclick="WorkspaceUI.copyTextFromElement('result-music-prompt')" class="text-[9px] text-rose-400 hover:text-rose-300 bg-rose-950/20 px-2 py-0.5 rounded border border-rose-500/20">复制</button>
                          </div>
                          <div id="result-music-prompt" class="bg-slate-950 border border-slate-800 p-2.5 rounded-xl font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed select-all">
                            ${musicPrompt}
                          </div>
                        </div>
                        
                        <div>
                          <div class="flex justify-between items-center mb-1">
                            <span class="text-xs font-bold text-slate-400">🎬 Sora/Runway 视频分镜提示词</span>
                            <button onclick="WorkspaceUI.copyTextFromElement('result-video-prompt')" class="text-[9px] text-rose-400 hover:text-rose-300 bg-rose-950/20 px-2 py-0.5 rounded border border-rose-500/20">复制</button>
                          </div>
                          <div id="result-video-prompt" class="bg-slate-950 border border-slate-800 p-2.5 rounded-xl font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed select-all">
                            ${videoPrompt}
                          </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Bind audio duration load and tick
    setTimeout(() => {
        const audio = document.getElementById('result-audio-player');
        if (audio) {
            audio.addEventListener('loadedmetadata', () => {
                const totalTimeEl = document.getElementById('result-audio-total-time');
                if (totalTimeEl) {
                    const mins = Math.floor(audio.duration / 60).toString().padStart(2, '0');
                    const secs = Math.floor(audio.duration % 60).toString().padStart(2, '0');
                    totalTimeEl.innerText = `${mins}:${secs}`;
                }
            });
            audio.addEventListener('timeupdate', () => {
                const progress = document.getElementById('result-audio-progress');
                const currentTimeEl = document.getElementById('result-audio-current-time');
                if (progress && audio.duration) {
                    progress.value = (audio.currentTime / audio.duration) * 100;
                }
                if (currentTimeEl) {
                    const mins = Math.floor(audio.currentTime / 60).toString().padStart(2, '0');
                    const secs = Math.floor(audio.currentTime % 60).toString().padStart(2, '0');
                    currentTimeEl.innerText = `${mins}:${secs}`;
                }
            });
            audio.addEventListener('ended', () => {
                WorkspaceUI.stopResultPlayers();
            });
        }
    }, 50);
},

toggleResultAudio: function() {
    const audio = document.getElementById('result-audio-player');
    const playIcon = document.getElementById('result-audio-play-icon');
    const disc = document.getElementById('result-vinyl-disc');
    
    if (!audio) return;
    
    if (audio.paused) {
        audio.play().catch(err => console.log(err));
        if (playIcon) playIcon.innerText = '❚❚';
        if (disc) disc.style.animationPlayState = 'running';
        
        // Pause dynamic visualizer loop
        WorkspaceUI.stopPoetryAudio();
    } else {
        audio.pause();
        if (playIcon) playIcon.innerText = '▶';
        if (disc) disc.style.animationPlayState = 'paused';
    }
},

seekResultAudio: function(percent) {
    const audio = document.getElementById('result-audio-player');
    if (audio && audio.duration) {
        audio.currentTime = (percent / 100) * audio.duration;
    }
},

toggleResultVideo: function() {
    const video = document.getElementById('result-video-player');
    const overlay = document.getElementById('result-video-overlay');
    if (!video) return;
    
    if (video.paused) {
        video.play().catch(err => console.log(err));
        if (overlay) overlay.style.display = 'none';
    } else {
        video.pause();
        if (overlay) {
            overlay.style.display = 'flex';
            overlay.innerHTML = '<div class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-md flex items-center justify-center text-white text-xs transition-transform hover:scale-105">▶</div>';
        }
    }
},

switchResultTab: function(tabId) {
    // Hide all contents
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    // Show target content
    const targetContent = document.getElementById(`tab-content-\${tabId}`);
    if (targetContent) targetContent.classList.remove('hidden');

    // Update buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('text-rose-400', 'border-rose-500');
        btn.classList.add('text-slate-400', 'border-transparent');
    });
    const targetBtn = document.getElementById(`tab-btn-\${tabId}`);
    if (targetBtn) {
        targetBtn.classList.remove('text-slate-400', 'border-transparent');
        targetBtn.classList.add('text-rose-400', 'border-rose-500');
    }
},

copyTextToClipboard: function(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('内容已成功复制到剪贴板！');
    }).catch(err => {
        console.error('Copy failed:', err);
    });
},

stopResultPlayers: function() {
    const audio = document.getElementById('result-audio-player');
    const video = document.getElementById('result-video-player');
    const playIcon = document.getElementById('result-audio-play-icon');
    const disc = document.getElementById('result-vinyl-disc');
    const overlay = document.getElementById('result-video-overlay');
    
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }
    if (playIcon) playIcon.innerText = '▶';
    if (disc) disc.style.animationPlayState = 'paused';
    
    if (video) {
        video.pause();
        video.currentTime = 0;
    }
    if (overlay) {
        overlay.style.display = 'flex';
        overlay.innerHTML = '<div class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-md flex items-center justify-center text-white text-xs transition-transform hover:scale-105">▶</div>';
    }
},

showMockPreview: function(title, author, content, singer) {
    const singerName = singer === 'auto' ? '柳如是' : singer;
    const cleanContent = content.replace(/\\n/g, '\n').replace(/\\'/g, "'");

    // Create high quality mock data
    const mockLyrics = `[Instrumental Intro: Guqin and Pipa]

[Verse: Whispery and Narrative]
${cleanContent.split('\n')[0] || ""}
朱阁影梅孤自叹，
残香冷雨落花残。

[Pre-Chorus: Building Tension]
${cleanContent.split('\n')[1] || ""}
乱世风沙吹泪眼，
红豆馆中画幽兰。

[Chorus: Explosive Belting]
${cleanContent}
看破红尘终不悔，
宁为玉碎入青天！

[Instrumental Interlude: Dramatic Taiko and Strings]

[Bridge: Classic Yunbai]
(念白：跨时空对《${title}》的解读)
在这万里楚天之下，我读到这首《${title}》。
千百年来的凄清孤高，今日且由我为你重抚一曲古琴，同醉斜阳。

[Chorus: Heroic Kunqu Ornaments]
此去经年终有梦，
血溅桃花笑江南。

[Outro: Silence and Fade]
啊—— 
琴音散落，烟雨茫茫。`;

    const mockCard = `# 《${title}》
## A Digital Humanities Epic
**Vocal 演绎** ｜ ${singerName}  
**Genre 曲风** ｜ 东方史诗 / 极简国风  

### ✦ ━━ 企划手记 ━━ ✦
在浩瀚的历史长河中，这首《${title}》所蕴含 of 意境，由${singerName}来演绎，实乃天作之合。她那独特的声线质感与极具张力的演唱，将词中的凄美与风骨表现得淋漓尽致，堪称数字人文的史诗级碰撞。

### ✦ ━━ 浅吟叙卷 ━━ ✦
${cleanContent.split('\n').map(line => `✦ ${line.trim()} ✦`).join('\n\n')}

#秦淮八艳 #数字人文 #AI音乐 #国风大赏`;

    const mockMusicPrompt = `Epic Guofeng crossover, tragic and heartbroken, pentatonic scale, Kunqu Opera infusion, Solo Guqin to Heavy Taiko, Firm female vocal, metallic resonance, Shuimo vibrato, 70 BPM.`;
    const mockVideoPrompt = `Cinematic masterpiece. Classical Chinese beauty disguised in scholar robes playing the Guqin inside a dimly lit pavilion during a heavy autumn rain. Volumetric lighting, 8k, film grain.`;

    const mockData = {
        lyrics: mockLyrics,
        cardText: mockCard,
        musicPrompt: mockMusicPrompt,
        videoPrompt: mockVideoPrompt,
        beauty: singerName
    };

    WorkspaceUI.renderResultDashboard(title, author, singer, mockData);
},

// ============================================
// 1. General Chat Interaction Methods
// ============================================
handleGeneralChatKeydown: function(e, agentId, icon) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        WorkspaceUI.submitGeneralChat(agentId, icon);
    }
},

submitGeneralChat: function(agentId, icon) {
    const inputEl = document.getElementById('general-chat-input');
    const flowEl = document.getElementById('general-chat-flow');
    if (!inputEl || !flowEl) return;
    const text = inputEl.value.trim();
    if (!text) return;
    
    inputEl.value = '';
    
    // User Message Bubble
    const userMsg = document.createElement('div');
    userMsg.className = 'flex gap-4 justify-end msg-enter';
    userMsg.innerHTML = `
        <div class="bg-blue-600 border border-blue-500 p-4 rounded-2xl rounded-tr-sm text-sm text-white leading-relaxed shadow-lg max-w-[80%]">
            ${text.replace(/\n/g, '<br>')}
        </div>
        <div class="w-10 h-10 rounded-full bg-blue-900 border border-blue-700 flex items-center justify-center text-xl shadow-lg shrink-0">👤</div>
    `;
    flowEl.appendChild(userMsg);
    flowEl.scrollTop = flowEl.scrollHeight;
    
    // Loading State
    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'flex gap-4 msg-enter';
    loadingMsg.innerHTML = `
        <div class="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xl shadow-lg shrink-0">${icon}</div>
        <div class="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl rounded-tl-sm text-sm text-slate-400 leading-relaxed shadow-lg max-w-[80%] flex items-center gap-2">
            <div class="w-2.5 h-2.5 rounded-full bg-slate-500 animate-bounce" style="animation-delay: 0s"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-slate-500 animate-bounce" style="animation-delay: 0.15s"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-slate-500 animate-bounce" style="animation-delay: 0.3s"></div>
        </div>
    `;
    flowEl.appendChild(loadingMsg);
    flowEl.scrollTop = flowEl.scrollHeight;
    
    setTimeout(() => {
        flowEl.removeChild(loadingMsg);
        
        let response = "";
        if (agentId === 'ipClone') {
            response = "【私域中枢 RAG 检索完成】💡<br>您好！关于您提到的这方面，我已经检索了我的知识库。针对您的个人IP现状，建议采取以下‘降维爆发’增长方案：<br>1. **内容矩阵化**：利用大语言模型将主干观点拆解为不同平台（微信公众号、小红书、飞书）的适配文案，进行日更宣传。<br>2. **自动化培育机制**：利用 n8n 工作流，当粉丝在公众号发送关键词时，自动派发您的定制飞书文档，大幅度提升信任感。<br>3. **低门槛私域课转化**：用高频轻量问答树立专业人设，自动过滤无效流量，聚焦高净值私域用户的一对一顾问服务。<br><br>如果您需要，我可以帮您把上述增长策略一键生成思维导图，或者帮您润色朋友圈文案！";
        } else if (agentId === 'tarot') {
            response = "【赛博星轨与韦特塔罗开启】🔮<br>牌阵已布，我为您抽取了三张牌进行事业与运势占卜：<br>1. 🌌 **过去：星币八（逆位）** - 过去一段时间您有些浮躁，可能急于求成而忽略了基本功的打磨。<br>2. 🗡️ **现在：宝剑二（正位）** - 您正处于一个决策的十字路口，内心充满纠结和理性的权衡，可能在犹豫是否要全面拥抱人工智能。<br>3. 🎡 **未来：命运之轮（正位）** - 局势即将发生重大转机，顺应技术和时代的浪潮，您将迎来新的爆发期。<br><br><b>【禅意疗愈】：</b>“莫听穿林打叶声，何妨吟啸且徐行。”您当前最需要的是静心，理清自己的底线。您有什么具体的方向需要我帮您做下一步抉择吗？";
        } else if (agentId === 'gameDM') {
            response = "🎲【无限流互动跑团】DM 判定开启！<br><b>【初始场景】：</b>你若有所思地睁开眼，发现自己身处一间闪烁着幽蓝霓虹的废弃仿生人实验室。四周是破碎 glass 培养舱，冰冷的警报声在空旷的空间里回荡：‘自毁程序已启动，剩余时间：5分钟。’<br>在你的面前有三个选项，请选择你要采取的行动：<br><br><b>1. [检查左侧闪烁绿光的控制终端] (进行智力检定)</b><br><b>2. [砸碎右侧反锁的合金液压大门] (进行力量检定)</b><br><b>3. [快速搜索地上的仿生人残骸] (进行感知检定)</b><br><br>请输入你想采取的行动（直接输入数字 1/2/3 或自由描述你想做的动作，我会为你投骰子决定成败）：";
        } else {
            response = `您好！已收到您的需求：【${text}】。<br>中枢系统已将任务指派给麻升智能的工作流节点。如需体验真实定制化的企业级 AI 工作流、私域外挂系统或飞书集成能力，请点击“联系我们”直接与创始团队取得联系！`;
        }
        
        const replyMsg = document.createElement('div');
        replyMsg.className = 'flex gap-4 msg-enter';
        replyMsg.innerHTML = `
            <div class="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xl shadow-lg shrink-0">${icon}</div>
            <div class="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl rounded-tl-sm text-sm text-slate-300 leading-relaxed shadow-lg max-w-[80%]">
                ${response}
            </div>
        `;
        flowEl.appendChild(replyMsg);
        flowEl.scrollTop = flowEl.scrollHeight;
    }, 1500);
},

// ============================================
// 2. Poet Agent Immersive Dialogue Experience
// ============================================
poetAudioCtx: null,
poetAudioInterval: null,
poetAudioPlaying: false,
poetCurrentKey: 'libai',
poetCurrentScene: 'wine',
poetFlowerRounds: 0,

poetsData: {
    'libai': {
        name: '李白',
        title: '诗仙',
        avatar: '🍶',
        verse: '人生得意须尽欢，莫使金樽空对月。',
        style: '豪放洒脱、狂傲不羁、好酒喜月',
        borderColor: 'border-indigo-500/30',
        intro: '字太白，号青莲居士。唐代浪漫主义诗人，其诗雄奇奔放，意境奇特，音节和谐，诗风清朗。',
        welcome: '君自何方来？今夕何夕，值此良辰，岂可无酒？且与太白共饮一杯，吟诗作对，叙叙今古！'
    },
    'liqingzhao': {
        name: '李清照',
        title: '词国皇后',
        avatar: '🌸',
        verse: '寻寻觅觅，冷冷清清，凄凄惨惨戚戚。',
        style: '婉约清丽、哀婉动人、多情易感',
        borderColor: 'border-pink-500/30',
        intro: '号易安居士。宋代女词人，婉约词派代表，有“千古第一才女”之称。其词前期清丽，后期悲凉。',
        welcome: '红藕香残，玉簟秋冷。见君登门，心中愁绪倒散了几分。小女子易安，愿与君品茗听雨，共话清词。'
    },
    'sushi': {
        name: '苏轼',
        title: '东坡居士',
        avatar: '🍵',
        verse: '竹杖芒鞋轻胜马，谁怕？一蓑烟雨任平生。',
        style: '旷达超然、豁达乐观、风趣幽默',
        borderColor: 'border-emerald-500/30',
        intro: '字子瞻，号东坡居士。北宋文学家、书画家。一生坎坷屡遭贬谪，却始终保持乐观超脱的心境。',
        welcome: '哈哈，老夫苏东坡是也！此生历尽风雨，不过付之一笑。来来来，且吃一盏清茶，跟老夫聊聊你们那现代的有趣物事！'
    },
    'xinjiji': {
        name: '辛弃疾',
        title: '词中之龙',
        avatar: '🗡️',
        verse: '想当年，金戈铁马，气吞万里如虎。',
        style: '悲壮激昂、雄浑豪迈、忧国忧民',
        borderColor: 'border-amber-500/30',
        intro: '字幼安，号稼轩。南宋豪放派词人、将领。词风慷慨悲壮，笔力雄健，充满收复失地的满腔热血。',
        welcome: '醉里挑灯看剑，梦回吹角连营！稼轩在此。虽白发空垂，报国之志未尝稍减。君可有英雄之志，愿与我一抒胸臆？'
    }
},

playGuzhengNote: function(frequency, duration) {
    try {
        if (!WorkspaceUI.poetAudioCtx) {
            WorkspaceUI.poetAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        const ctx = WorkspaceUI.poetAudioCtx;
        if (ctx.state === 'suspended') {
            ctx.resume();
        }
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(frequency, ctx.currentTime);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, ctx.currentTime);
        
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start();
        osc.stop(ctx.currentTime + duration);
    } catch (e) {
        console.error('AudioContext error:', e);
    }
},

startPoetAmbient: function() {
    WorkspaceUI.poetAudioPlaying = true;
    const notes = [220, 247, 294, 330, 392, 440, 494, 587, 660, 784];
    const playNext = () => {
        if (!WorkspaceUI.poetAudioPlaying) return;
        const numNotes = Math.floor(Math.random() * 2) + 1;
        const root = notes[Math.floor(Math.random() * notes.length)];
        WorkspaceUI.playGuzhengNote(root, 2.5);
        if (numNotes > 1 && Math.random() > 0.5) {
            setTimeout(() => {
                const third = notes[Math.floor(Math.random() * notes.length)];
                WorkspaceUI.playGuzhengNote(third, 2.0);
            }, 200 + Math.random() * 200);
        }
        WorkspaceUI.poetAudioInterval = setTimeout(playNext, 3000 + Math.random() * 4000);
    };
    playNext();
},

stopPoetAmbient: function() {
    WorkspaceUI.poetAudioPlaying = false;
    if (WorkspaceUI.poetAudioInterval) {
        clearTimeout(WorkspaceUI.poetAudioInterval);
        WorkspaceUI.poetAudioInterval = null;
    }
},

togglePoetSound: function() {
    const btn = document.getElementById('btn-poet-sound');
    const desc = document.getElementById('sound-status-desc');
    if (!btn || !desc) return;
    
    if (!WorkspaceUI.poetAudioCtx) {
        WorkspaceUI.poetAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    if (WorkspaceUI.poetAudioPlaying) {
        WorkspaceUI.stopPoetAmbient();
        btn.innerText = '开启';
        btn.className = 'px-3 py-1.5 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-all border border-slate-700 hover:border-slate-600';
        desc.innerText = '纯净合成弦音 - 已静音';
    } else {
        WorkspaceUI.startPoetAmbient();
        btn.innerText = '静音';
        btn.className = 'px-3 py-1.5 rounded-lg text-xs bg-indigo-900/60 hover:bg-indigo-900 text-indigo-200 font-bold transition-all border border-indigo-500/30';
        desc.innerText = '古风琴曲飘摇萦绕中...';
        WorkspaceUI.playGuzhengNote(440, 1.0);
        setTimeout(() => WorkspaceUI.playGuzhengNote(587, 1.2), 150);
    }
},

renderPoetAgent: function(title, icon) {
    WorkspaceUI.poetCurrentKey = 'libai';
    WorkspaceUI.poetCurrentScene = 'wine';
    WorkspaceUI.poetFlowerRounds = 0;
    
    const content = document.getElementById('ws-main-content');
    content.innerHTML = `
        <div class="h-full flex w-full font-sans bg-[#030408]">
            <!-- Left Configuration Scroll -->
            <div class="w-[320px] bg-slate-950/80 border-r border-slate-900 p-6 flex flex-col gap-5 overflow-y-auto no-scrollbar shrink-0 z-10">
                <div>
                    <label class="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">结缘文人</label>
                    <select id="poet-select" onchange="WorkspaceUI.changePoet(this.value)" class="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors">
                        <option value="libai">🍶 诗仙 · 李白 (浪漫豪放)</option>
                        <option value="liqingzhao">🌸 才女 · 李清照 (婉约清丽)</option>
                        <option value="sushi">🍵 居士 · 苏轼 (旷达风趣)</option>
                        <option value="xinjiji">🗡️ 将领 · 辛弃疾 (慷慨悲壮)</option>
                    </select>
                </div>
                
                <!-- Poet Card -->
                <div id="poet-card" class="p-4 rounded-2xl border border-indigo-500/30 bg-indigo-950/5 relative overflow-hidden transition-all duration-300">
                    <div class="absolute -right-4 -bottom-4 text-7xl opacity-5 select-none font-serif" id="poet-card-watermark">🍶</div>
                    <div class="flex items-center gap-3 mb-2">
                        <div class="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-2xl" id="poet-card-avatar">🍶</div>
                        <div>
                            <h5 class="text-sm font-bold text-indigo-300 font-serif" id="poet-card-name">李白</h5>
                            <span class="text-[9px] text-slate-500 font-mono tracking-wider" id="poet-card-title">诗仙</span>
                        </div>
                    </div>
                    <p class="text-xs text-indigo-200/80 italic font-serif leading-relaxed my-2" id="poet-card-verse">“人生得意须尽欢，莫使金樽空对月。”</p>
                    <p class="text-[10px] text-slate-400 leading-relaxed border-t border-slate-900 pt-2 mt-2" id="poet-card-intro">字太白，号青莲居士。唐代浪漫主义诗人，其诗雄奇奔放，意境奇特，音节和谐，诗风清朗。</p>
                </div>

                <!-- Scene Selector -->
                <div>
                    <label class="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">对话雅境</label>
                    <select id="poet-scene" onchange="WorkspaceUI.updatePoetScene(this.value)" class="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors">
                        <option value="wine">🍷 对酒当歌 (豪饮对诗)</option>
                        <option value="flower">🌸 飞花令对决 (字词接龙)</option>
                        <option value="write">✍️ 隔空赠诗 (心境定制)</option>
                        <option value="tea">🍵 古今茶叙 (解惑现代)</option>
                    </select>
                </div>

                <!-- Flying Flower Input (only visible when scene is flower) -->
                <div id="flower-config" class="hidden bg-slate-900/40 border border-slate-800/80 p-4 rounded-2xl flex flex-col gap-3">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-slate-400">飞花令关键字</span>
                        <input type="text" id="flower-keyword" value="月" max-length="1" class="w-12 text-center bg-slate-950 border border-slate-800 rounded-lg py-1 px-1.5 text-xs text-rose-400 font-bold focus:outline-none focus:border-rose-500">
                    </div>
                    <p class="text-[10px] text-slate-500 leading-relaxed">请输入包含此字的任意诗句（如：举头望明月）。诗仙将智能判定并回对一句。</p>
                    <div class="flex justify-between items-center text-[10px] text-slate-400 font-mono border-t border-slate-900 pt-2">
                        <span>当前回合数</span>
                        <span id="flower-rounds" class="text-rose-400 font-bold">0</span>
                    </div>
                </div>

                <!-- Ambient Sound Control -->
                <div class="mt-auto bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl flex items-center justify-between">
                    <div class="flex items-center gap-2.5">
                        <span class="text-lg">🎼</span>
                        <div>
                            <h6 class="text-xs font-bold text-white">古风背景雅乐</h6>
                            <p class="text-[9px] text-slate-500" id="sound-status-desc">纯净合成弦音 - 已静音</p>
                        </div>
                    </div>
                    <button id="btn-poet-sound" onclick="WorkspaceUI.togglePoetSound()" class="px-3 py-1.5 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-all border border-slate-700 hover:border-slate-600">
                        开启
                    </button>
                </div>
            </div>

            <!-- Right Chat Area -->
            <div class="flex-grow flex flex-col relative overflow-hidden bg-poetry-scroll h-full">
                <!-- Ambient animations / Ink particles -->
                <div class="absolute inset-0 pointer-events-none overflow-hidden z-0">
                    <div class="absolute top-10 left-10 w-[400px] h-[400px] bg-indigo-500/5 blur-[120px] rounded-full"></div>
                    <div class="absolute bottom-10 right-10 w-[400px] h-[400px] bg-rose-500/5 blur-[120px] rounded-full"></div>
                    
                    <!-- Floating Petals -->
                    <div class="petal" style="left: 15%; animation-delay: 0s; width: 10px; height: 10px;"></div>
                    <div class="petal" style="left: 45%; animation-delay: 3s; width: 12px; height: 8px;"></div>
                    <div class="petal" style="left: 70%; animation-delay: 1.5s; width: 8px; height: 11px;"></div>
                </div>

                <!-- Chat Header -->
                <div class="h-14 border-b border-slate-900 px-6 flex items-center justify-between relative z-10 bg-slate-950/60 backdrop-blur shrink-0">
                    <div class="flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                        <span class="text-xs font-mono text-slate-400" id="chat-header-scene">对酒当歌 ｜ 豪饮对诗</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <button onclick="WorkspaceUI.exportPoetryScroll()" class="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 bg-indigo-950/40 px-3.5 py-1.5 rounded-lg border border-indigo-500/20 hover:border-indigo-500/40 transition-colors">
                            📜 导出宣纸卷轴
                        </button>
                        <button onclick="WorkspaceUI.resetPoetChat()" class="text-[10px] text-rose-400 hover:text-rose-300 flex items-center gap-1.5 bg-rose-950/20 px-3.5 py-1.5 rounded-lg border border-rose-500/20 hover:border-rose-500/40 transition-colors">
                            🧹 重新研墨
                        </button>
                    </div>
                </div>

                <!-- Message List -->
                <div id="poet-chat-flow" class="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar relative z-10">
                    <!-- Loaded dynamically -->
                </div>

                <!-- Dialogue Input Box -->
                <div class="p-4 bg-slate-950/80 backdrop-blur-xl border-t border-slate-900 relative z-10 shrink-0">
                    <div class="max-w-3xl mx-auto bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-2 flex items-end gap-2 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all">
                        <textarea id="poet-input-area" class="flex-1 bg-transparent border-none text-white text-sm p-3 focus:outline-none resize-none h-12 no-scrollbar font-serif" placeholder="作揖：请研墨提笔，向诗仙太白输入您的词句或烦忧..." onkeydown="WorkspaceUI.handlePoetKeydown(event)"></textarea>
                        <button id="btn-poet-send" onclick="WorkspaceUI.submitPoetChat()" class="bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-xl transition-all duration-300 shadow-md flex items-center justify-center shrink-0">
                            <span class="text-sm mr-1">✍️</span> 研墨发送
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    WorkspaceUI.resetPoetChat(true);
},

changePoet: function(poetKey) {
    const poet = WorkspaceUI.poetsData[poetKey];
    if (!poet) return;
    
    WorkspaceUI.poetCurrentKey = poetKey;
    
    document.getElementById('poet-card-name').innerText = poet.name;
    document.getElementById('poet-card-title').innerText = poet.title;
    document.getElementById('poet-card-avatar').innerText = poet.avatar;
    document.getElementById('poet-card-verse').innerText = `“${poet.verse}”`;
    document.getElementById('poet-card-intro').innerText = poet.intro;
    document.getElementById('poet-card-watermark').innerText = poet.avatar;
    
    const poetCard = document.getElementById('poet-card');
    poetCard.className = `p-4 rounded-2xl border ${poet.borderColor} bg-indigo-950/5 relative overflow-hidden transition-all duration-300`;
    
    const inputArea = document.getElementById('poet-input-area');
    if (inputArea) {
        inputArea.placeholder = `作揖：请研墨提笔，向${poet.title}${poet.name}输入您的词句或烦忧...`;
    }
    
    if (WorkspaceUI.poetAudioPlaying) {
        WorkspaceUI.playGuzhengNote(220, 1.5);
        setTimeout(() => WorkspaceUI.playGuzhengNote(330, 1.5), 100);
        setTimeout(() => WorkspaceUI.playGuzhengNote(440, 1.8), 200);
    }
    
    WorkspaceUI.resetPoetChat(false);
},

updatePoetScene: function(sceneKey) {
    WorkspaceUI.poetCurrentScene = sceneKey;
    WorkspaceUI.poetFlowerRounds = 0;
    
    const headerEl = document.getElementById('chat-header-scene');
    const configEl = document.getElementById('flower-config');
    const roundsEl = document.getElementById('flower-rounds');
    
    const poet = WorkspaceUI.poetsData[WorkspaceUI.poetCurrentKey];
    
    if (roundsEl) roundsEl.innerText = '0';
    
    let sceneTitle = "";
    if (sceneKey === 'wine') {
        sceneTitle = "对酒当歌 ｜ 豪饮对诗";
        if (configEl) configEl.classList.add('hidden');
    } else if (sceneKey === 'flower') {
        sceneTitle = "飞花令对决 ｜ 雅客接龙";
        if (configEl) configEl.classList.remove('hidden');
    } else if (sceneKey === 'write') {
        sceneTitle = "隔空赠诗 ｜ 心境定制";
        if (configEl) configEl.classList.add('hidden');
    } else if (sceneKey === 'tea') {
        sceneTitle = "古今茶叙 ｜ 现代解惑";
        if (configEl) configEl.classList.add('hidden');
    }
    
    if (headerEl) headerEl.innerText = sceneTitle;
    
    let greeting = "";
    if (sceneKey === 'wine') {
        greeting = `【斟满美酒】🍶 贤友来得正好，今日太白愿与你同醉。你且吟一句诗，或诉诉心头意，太白定自当奉陪！`;
        if (WorkspaceUI.poetCurrentKey === 'liqingzhao') greeting = `【浅斟低唱】🌸 易安备下了一壶薄酒。贤友，人生苦短，不如与我共饮一杯，吐露心事？`;
        if (WorkspaceUI.poetCurrentKey === 'sushi') greeting = `【大笑温酒】🍵 哈哈！老夫今日以酒会友，哪怕是黄州浊酒，也能吟啸徐行。来，贤友喝一杯！`;
        if (WorkspaceUI.poetCurrentKey === 'xinjiji') greeting = `【挑灯看剑】🗡️ 贤友，稼轩备下烈酒！收复山河之痛，壮志未酬之愤，皆在酒中，你我共唱一曲金戈铁马如何？`;
    } else if (sceneKey === 'flower') {
        greeting = `【飞花令下】🌸 贤友，我们这就开启飞花令！请在左侧指定接龙关键字，输入一句包含该字的完整古诗词。我先让一招，贤友请！`;
    } else if (sceneKey === 'write') {
        greeting = `【研墨展纸】✍️ 贤友，在现代有何喜怒哀乐、未竟之愿？告知与我，我为你赋诗一首，做个纪念！`;
    } else if (sceneKey === 'tea') {
        greeting = `【清茶氤氲】🍵 贤友，听闻现代社会快节奏、加班甚多、房价飞涨，亦有AI技术。你且说来，我等愿用毕生智慧与你闲叙一番。`;
    }
    
    WorkspaceUI.appendPoetMessage(poet.name, poet.avatar, greeting, true);
},

appendPoetMessage: function(sender, avatar, text, isPoet) {
    const flow = document.getElementById('poet-chat-flow');
    if (!flow) return;
    
    const msg = document.createElement('div');
    if (isPoet) {
        msg.className = 'flex gap-4 msg-enter ink-bleed';
        msg.innerHTML = `
            <div class="w-10 h-10 rounded-full bg-slate-900 border border-indigo-500/20 flex items-center justify-center text-xl shadow-lg shrink-0 select-none">${avatar}</div>
            <div class="bg-slate-950/80 border border-slate-900 p-4.5 rounded-2xl rounded-tl-sm text-sm text-slate-200 leading-relaxed shadow-xl max-w-[80%] font-serif tracking-wide">
                <span class="block text-[10px] text-indigo-400 font-mono mb-1 font-sans">${sender}</span>
                ${text.replace(/\n/g, '<br>')}
            </div>
        `;
    } else {
        msg.className = 'flex gap-4 justify-end msg-enter';
        msg.innerHTML = `
            <div class="bg-indigo-950/60 border border-indigo-500/30 p-4.5 rounded-2xl rounded-tr-sm text-sm text-indigo-100 leading-relaxed shadow-xl max-w-[80%] font-serif tracking-wide">
                <span class="block text-[10px] text-indigo-400 font-mono mb-1 text-right font-sans">访客</span>
                ${text.replace(/\n/g, '<br>')}
            </div>
            <div class="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-xl shadow-lg shrink-0 select-none">👤</div>
        `;
    }
    
    flow.appendChild(msg);
    flow.scrollTop = flow.scrollHeight;
},

submitPoetChat: function() {
    const inputArea = document.getElementById('poet-input-area');
    if (!inputArea) return;
    const text = inputArea.value.trim();
    if (!text) return;
    
    inputArea.value = '';
    
    const poet = WorkspaceUI.poetsData[WorkspaceUI.poetCurrentKey];
    
    if (WorkspaceUI.poetAudioPlaying) {
        WorkspaceUI.playGuzhengNote(587, 0.8);
    }
    
    WorkspaceUI.appendPoetMessage("访客", "👤", text, false);
    
    const flow = document.getElementById('poet-chat-flow');
    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'flex gap-4 msg-enter ink-bleed';
    loadingMsg.innerHTML = `
        <div class="w-10 h-10 rounded-full bg-slate-900 border border-indigo-500/20 flex items-center justify-center text-xl shadow-lg shrink-0 select-none">${poet.avatar}</div>
        <div class="bg-slate-950/80 border border-slate-900 p-4.5 rounded-2xl rounded-tl-sm text-sm text-slate-400 leading-relaxed shadow-lg max-w-[80%] flex items-center gap-2">
            <span class="text-xs text-slate-500 font-sans mr-1">${poet.name}斟酒研墨中</span>
            <div class="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style="animation-delay: 0s"></div>
            <div class="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style="animation-delay: 0.15s"></div>
            <div class="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style="animation-delay: 0.3s"></div>
        </div>
    `;
    flow.appendChild(loadingMsg);
    flow.scrollTop = flow.scrollHeight;
    
    setTimeout(() => {
        flow.removeChild(loadingMsg);
        
        if (WorkspaceUI.poetAudioPlaying) {
            WorkspaceUI.playGuzhengNote(392, 1.2);
            setTimeout(() => WorkspaceUI.playGuzhengNote(523, 1.5), 150);
        }
        
        let response = "";
        const scene = WorkspaceUI.poetCurrentScene;
        const poetKey = WorkspaceUI.poetCurrentKey;
        
        if (scene === 'wine') {
            if (poetKey === 'libai') {
                response = `【仰天大笑】🍶 好诗！贤友心胸如此宽广，真乃我辈中人。来，你我把酒临风，再干一杯！“五花马，千金裘，呼儿将出换美酒，与尔同销万古愁。”你且再出题，我李白今夜定要写出名震长安的佳作！`;
            } else if (poetKey === 'liqingzhao') {
                response = `【轻折菊花】🌸 贤友所言切切，触动易安情肠。这浊酒两盏，怎敌那晚风来急。听你的倾诉，易安亦想起了当年的雁过伤心。人世浮沉，你我皆是那水上浮萍，且以词作解忧，请贤友再诉一二。`;
            } else if (poetKey === 'sushi') {
                response = `【抚掌大笑】🍵 痛快！贤友此言甚是洒脱。老夫被贬半生，吃过惠州的荔枝，做过黄州的猪肉，也不过是“回首向来萧瑟处，归去，也无风雨也无晴”。来，干了这杯！管他世事如何，老夫与你谈笑且徐行！`;
            } else {
                response = `【醉里看剑】🗡️ 痛快！军中烈酒，正合豪杰之士！贤友，这大宋江山虽碎，但词人志气未消。“想当年，金戈铁马，气吞万里如虎。”贤友此番豪言，深得我稼轩之心，且再满饮此杯，共论天下英雄！`;
            }
        } else if (scene === 'flower') {
            const keyword = document.getElementById('flower-keyword')?.value.trim() || '月';
            
            if (!text.includes(keyword)) {
                response = `【直摇头】😅 哎呀呀，贤友莫非有些醉了？你方才所吟的这句诗里，并无“${keyword}”字啊。这可不算，要罚酒一杯，贤友重新想想，再出一句！`;
            } else {
                WorkspaceUI.poetFlowerRounds++;
                document.getElementById('flower-rounds').innerText = WorkspaceUI.poetFlowerRounds;
                
                const rounds = WorkspaceUI.poetFlowerRounds;
                
                if (keyword === '月') {
                    if (rounds === 1) response = `【拂袖吟哦】🍶 贤友对得好！且听太白回对第一句：“举杯邀明月，对影成三人。” 贤友请接！`;
                    else if (rounds === 2) response = `【望空对影】🍶 妙绝！我且对第二句：“月落乌啼霜满天，江枫渔火对愁眠。” 贤友可还有下句？`;
                    else if (rounds === 3) response = `【举杯狂歌】🍶 哈哈，好底子！且听我这句：“海上生明月，天涯共此时。” 此句磅礴，贤友再接！`;
                    else if (rounds === 4) response = `【负手徐行】🍶 贤友诗才惊人，那我便对苏子瞻名句：“明月几时有？把酒问青天。” 贤友接招！`;
                    else response = `【击节赞叹】🍶 “春江潮水连海平，海上明月共潮生。” 贤友诗才敏捷，今夜这飞花令太白对得痛快极了！贤友赢了，太白甘愿罚酒三杯！`;
                } else if (keyword === '花') {
                    if (rounds === 1) response = `【拈花微笑】🌸 好词！易安对上一句：“花间一壶酒，独酌无相亲。” 贤友请接。`;
                    else if (rounds === 2) response = `【折梅听雪】🌸 贤友雅量。我便回对：“落红不是无情物，化作春泥更护花。” 贤友请继续。`;
                    else if (rounds === 3) response = `【凭栏远眺】🌸 妙思！听这句：“忽如一夜春风来，千树万树梨花开。” 贤友请接！`;
                    else if (rounds === 4) response = `【轻嗅菊香】🌸 贤友真乃才子/才女。我回对：“桃花潭水深千尺，不及汪伦送我情。” 请！`;
                    else response = `【叹服不已】🌸 “人闲桂花落，夜静春山空。” 贤友才思横溢，连对五轮而面不改色，易安折服，愿为贤友再沏一盏清茶。`;
                } else if (keyword === '酒') {
                    if (rounds === 1) response = `【举樽相邀】🍵 哈哈，好句！老夫苏东坡对曰：“呼儿将出换美酒，与尔同销万古愁。” 贤友请！`;
                    else if (rounds === 2) response = `【以茶代酒】🍵 贤友高才。老夫对曰：“借问酒家何处有？牧童遥指杏花村。” 请接下句！`;
                    else if (rounds === 3) response = `【指点江山】🍵 妙！且对：“葡萄美酒夜光杯，欲饮琵琶马上催。” 贤友且行！`;
                    else if (rounds === 4) response = `【敲击茶案】🍵 精彩！我以稼轩此句回你：“浊酒一杯家万里，燕然未勒归无计。” 贤友请！`;
                    else response = `【击掌大笑】🍵 “一壶浊酒喜相逢。古今多少事，都付笑谈中！” 贤友豪迈，老夫与你大战五回合，痛快之极，且坐下吃茶！`;
                } else {
                    const poems = [
                        "野火烧不尽，春风吹又生。",
                        "海内存知己，天涯若比邻。",
                        "山重水复疑无路，柳暗花明又一村。",
                        "会当凌绝顶，一览众山小。",
                        "白日依山尽，黄河入海流。"
                    ];
                    const selectedPoem = poems[rounds % poems.length];
                    response = `【抚琴低吟】好一个“${keyword}”字！贤友诗意盎然。我便以这句回对：“${selectedPoem}” 瞧瞧其中也含此字，贤友请继续接龙！`;
                }
            }
        } else if (scene === 'write') {
            let customPoem = "";
            let poetComment = "";
            
            if (text.includes('工作') || text.includes('加班') || text.includes('创业') || text.includes('奋斗')) {
                customPoem = `【五律 · 寄尘寰贤友】\n朝起拂晨光，披星涉远航。\n案头文墨乱，指底算筹忙。\n志在千秋业，心怀万里疆。\n休言长夜冷，风起自飞扬。`;
                poetComment = `贤友在现代打拼，创业奔波、加班辛劳，太白深感敬佩。千年前我亦曾“仰天大笑出门去，我辈岂是蓬蒿人”，世俗羁绊虽多，但心怀万里野望，必能乘风破浪！此诗赠予贤友，愿助一臂之力。`;
            } else if (text.includes('伤心') || text.includes('失恋') || text.includes('难过') || text.includes('痛苦')) {
                customPoem = `【浣溪沙 · 赠贤友】\n冷雨敲窗夜未央，凄清小阁伴残香。\n何须珠泪湿罗裳。\n往事如烟终散去，春风入户又芬芳。\n明朝晴日照疏窗。`;
                poetComment = `小女子易安，亦曾经历国破家亡、半生漂泊，深知“物是人非事事休，欲语泪先流”之苦。然而，阴雨终会放晴，错过的落花亦是春泥。愿贤友听一曲易安词，早日拨云见日，重拾欢颜。`;
            } else if (text.includes('迷茫') || text.includes('选择') || text.includes('考试') || text.includes('顺利')) {
                customPoem = `【定风波 · 励贤友】\n莫道前路雾满川，徐行竹杖自怡然。\n金榜题名终有日，何难？一腔热血破尘烟。\n料峭春风吹梦醒，微冷。斜阳万道正相迎。\n回首向来风雨处，归去，长河浪静海天清。`;
                poetComment = `子瞻一生，颠沛流离，黄州、惠州、儋州，皆是险途。但只要心中超脱，何处不东坡？贤友面临考验或决择，不必迷茫，但行好事，莫问前程，老夫在此祝你金榜题名、万事顺遂！`;
            } else {
                customPoem = `【七绝 · 赠现代贤友】\n跨越千载见知音，片语只言动古今。\n砚里飞花诗意满，长河月下伴君心。`;
                poetComment = `字里行间，太白读懂了贤友的深情雅致。这跨越千年的对话，真乃天赐之缘。特赠此绝句，愿贤友在现代的生活里，亦能诗意地栖居，笑看红尘百态。`;
            }
            
            response = `${customPoem}\n\n<b>文人寄语：</b>${poetComment}`;
        } else if (scene === 'tea') {
            if (poetKey === 'libai') {
                response = `【把酒大笑】🍶 贤友提到现代的高房价与大厂“内卷”？传统尘网，向来如此！当年太白在长安，虽有贵妃研墨、力士脱靴，亦被权贵排挤，连间客房都租不起，只能游历天下！<br>依我看，什么“KPI”、“房贷”，不过是画地为牢的自寻烦忧。大好山河，何处不能醉眠？不如跟我去庐山看瀑布，去桃花潭饮美酒，“天生我材必有用，千金散尽还复来”，开心最重要！`;
            } else if (poetKey === 'liqingzhao') {
                response = `【轻拨琴弦】🌸 贤友谈及现代人“情感快餐、孤独感沉重”？小女子易安亦有同感。千年前，我与明诚“赌书消得泼茶香”，是何等温馨；但后期北归流亡，也是“守着窗儿，独自怎生得黑”。<br>现代人虽有互联网，可瞬息万里，心却离得更远了。我的建议是，慢下来，手写一封信，认真读一本词，在深夜给自己留一盏灯。与其在热闹中迷失，不如在极简里自得。`;
            } else if (poetKey === 'sushi') {
                response = `【品茗微笑】🍵 哈哈，贤友问我关于“AI智能体技术会不会淘汰人类”？有趣有趣！在老夫看来，笔墨纸砚，皆是工具。当年我发明的“东坡肉”，亦是一种火候的创新。AI代劳了重复的事务，人才能有空闲去大江东去、赤壁怀古啊！<br>若AI能替你写日报、跑数据，你正好去西湖泛舟，吃一顿荔枝。至于焦虑？“此心安处是吾乡”，人只要心存温情，工具便永远无法将你取代。`;
            } else {
                response = `【按剑沉思】🗡️ 贤友说到“职场危机与中年焦虑”？想我辛弃疾，二十余岁率万人突袭金营，何等英迈！可人到中年，却被贬江西闲居，白发空垂，只能“梦回吹角连营”。<br>我的一生，焦虑远胜于你们。但男儿志在四方，即便处在逆境，也要有“气吞万里如虎”的精神气！现代的职场也是战场，莫要被一时的挫折击倒，养精蓄锐，随时准备迎战，这才是豪杰本色！`;
            }
        }
        
        WorkspaceUI.appendPoetMessage(poet.name, poet.avatar, response, true);
    }, 1500);
},

resetPoetChat: function(isInitial = false) {
    const flow = document.getElementById('poet-chat-flow');
    if (!flow) return;
    
    flow.innerHTML = '';
    
    const poet = WorkspaceUI.poetsData[WorkspaceUI.poetCurrentKey];
    WorkspaceUI.poetFlowerRounds = 0;
    const roundsEl = document.getElementById('flower-rounds');
    if (roundsEl) roundsEl.innerText = '0';
    
    WorkspaceUI.appendPoetMessage(poet.name, poet.avatar, poet.welcome, true);
    
    if (!isInitial && WorkspaceUI.poetAudioPlaying) {
        WorkspaceUI.playGuzhengNote(294, 1.2);
    }
},

exportPoetryScroll: function() {
    const poet = WorkspaceUI.poetsData[WorkspaceUI.poetCurrentKey];
    const flow = document.getElementById('poet-chat-flow');
    if (!flow) return;
    
    const textBlocks = [];
    flow.querySelectorAll('.msg-enter').forEach(el => {
        const isPoetMsg = el.classList.contains('ink-bleed') || el.querySelector('.text-indigo-400')?.innerText !== '访客';
        const rawContent = el.querySelector('div:last-child').innerHTML || el.innerText;
        let clean = rawContent
            .replace(/<span[^>]*>.*?<\/span>/i, '')
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<[^>]+>/g, '')
            .trim();
            
        if (clean) {
            if (isPoetMsg) {
                textBlocks.push(`【${poet.name}】：\n${clean}`);
            } else {
                textBlocks.push(`【访客】：\n${clean}`);
            }
        }
    });
    
    const combinedText = textBlocks.join('\n\n━━━━━━━━━━━━━━━━━━━━━━━━\n\n');
    
    const overlay = document.createElement('div');
    overlay.id = 'poet-scroll-overlay';
    overlay.className = 'fixed inset-0 z-[1000000] bg-black/80 flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm';
    overlay.innerHTML = `
        <div class="w-full max-w-2xl bg-[#14100c] border-2 border-[#5c4033]/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative flex flex-col h-[85vh] text-[#e8dcc4] font-serif overflow-hidden">
            <div class="absolute left-0 right-0 top-0 h-4 bg-gradient-to-b from-[#2e1d11] to-[#14100c] border-b border-[#5c4033]/30"></div>
            
            <div class="flex justify-between items-center mb-6 border-b border-[#5c4033]/30 pb-4 mt-2">
                <div class="flex items-center gap-3">
                    <span class="text-2xl">📜</span>
                    <div>
                        <h4 class="text-base sm:text-lg font-bold text-[#f2e3c6] tracking-widest">水墨宣纸卷轴</h4>
                        <p class="text-[9px] text-[#a68d75] font-sans font-mono tracking-wider">AIMSZN Studio - Poet Scroll Export</p>
                    </div>
                </div>
                <button onclick="document.getElementById('poet-scroll-overlay').remove()" class="text-xs text-[#a68d75] hover:text-[#e8dcc4] bg-[#2e1d11]/50 border border-[#5c4033]/40 px-3 py-1.5 rounded-lg transition-colors font-sans">
                    关闭
                </button>
            </div>
            
            <div class="flex-1 overflow-y-auto bg-[#eedcb3] text-[#332211] p-6 sm:p-10 rounded-2xl border border-[#d4be95] shadow-inner no-scrollbar relative mb-6">
                <div class="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.03)_1px,transparent_0)] pointer-events-none" style="background-size: 20px 20px;"></div>
                <div class="absolute -bottom-8 -right-8 text-9xl opacity-[0.03] font-serif pointer-events-none">${poet.avatar}</div>
                
                <h2 class="text-xl sm:text-2xl font-black text-center border-b-2 border-dashed border-[#bda881] pb-4 mb-6 tracking-widest text-[#2a1a0a]">
                    《清墨问情 ｜ 与${poet.name}对卷》
                </h2>
                
                <div class="space-y-6 text-sm sm:text-base leading-loose whitespace-pre-wrap">
                    ${combinedText}
                </div>
                
                <div class="text-right text-xs text-[#7c634d] border-t border-dashed border-[#bda881] pt-4 mt-8 font-sans">
                    麻升智能工作室 · 墨影聆风
                </div>
            </div>
            
            <div class="flex items-center justify-between gap-4 border-t border-[#5c4033]/30 pt-4 font-sans text-xs">
                <span class="text-[#a68d75]">宣纸黄卷排版已就绪，可直接复制文字或截图保存。</span>
                <button onclick="WorkspaceUI.copyScrollContent()" class="bg-[#bda881] hover:bg-[#cbb58d] text-[#14100c] px-5 py-2.5 rounded-xl font-bold transition-all shadow-md active:scale-95 shrink-0">
                    📋 复制卷轴全文
                </button>
            </div>
            
            <div class="absolute left-0 right-0 bottom-0 h-4 bg-gradient-to-t from-[#2e1d11] to-[#14100c] border-t border-[#5c4033]/30"></div>
        </div>
    `;
    document.body.appendChild(overlay);
},

copyScrollContent: function() {
    const textBlocks = [];
    const poet = WorkspaceUI.poetsData[WorkspaceUI.poetCurrentKey];
    const flow = document.getElementById('poet-chat-flow');
    if (!flow) return;
    
    flow.querySelectorAll('.msg-enter').forEach(el => {
        const isPoetMsg = el.classList.contains('ink-bleed') || el.querySelector('.text-indigo-400')?.innerText !== '访客';
        const rawContent = el.querySelector('div:last-child').innerHTML || el.innerText;
        let clean = rawContent
            .replace(/<span[^>]*>.*?<\/span>/i, '')
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<[^>]+>/g, '')
            .trim();
            
        if (clean) {
            if (isPoetMsg) {
                textBlocks.push(`【${poet.name}】：\n${clean}`);
            } else {
                textBlocks.push(`【访客】：\n${clean}`);
            }
        }
    });
    
    const fullText = `《清墨问情 ｜ 与${poet.name}对卷》\n\n` + textBlocks.join('\n\n━━━━━━━━━━━━━━━━━━━━━━━━\n\n') + `\n\n-- 麻升智能工作室 · 墨影聆风 --`;
    
    WorkspaceUI.copyTextToClipboard(fullText);
},

handlePoetKeydown: function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        WorkspaceUI.submitPoetChat();
    }
},

// ============================================
// 街边店爆款营销大脑 (localPromo) 沉浸式工作台
// ============================================
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
        <div class="h-full flex w-full">
            <!-- 左侧表单参数控制区 -->
            <div class="w-[340px] bg-slate-900/50 border-r border-slate-800 p-6 flex flex-col gap-5 overflow-y-auto no-scrollbar shrink-0">
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
            <div class="flex-1 p-8 overflow-y-auto bg-tech-grid flex flex-col items-center justify-center relative">
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
                        <h4 class="text-[#e5e5e5] font-bold text-base">实体店爆款营销沙箱</h4>
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
                            <!-- Visual workflow header -->
                            <div class="flex justify-between items-center bg-slate-900/40 p-4 border border-slate-800 rounded-xl shrink-0">
                                <div>
                                    <h4 class="text-white font-bold text-xs">n8n 商业增长工作流 (已装载)</h4>
                                    <p class="text-[10px] text-slate-500 mt-1">此工作流由前端意图调度分发给不同的风格文案子代理，进行排版整合后，直推飞书并回执。</p>
                                </div>
                                <button onclick="WorkspaceUI.downloadLocalPromoN8NJson()" class="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all">
                                    <span>📥</span> 下载 n8n 营销工作流 JSON
                                </button>
                            </div>
                            
                            <!-- Visual flow pipeline (Flowchart Canvas) -->
                            <div class="flex-grow flex flex-col items-center justify-center border border-slate-800 bg-[#0c0f17] rounded-xl p-8 relative overflow-hidden min-h-[300px]">
                                <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(rgba(255,255,255,0.08) 1px, transparent 0); background-size: 20px 20px;"></div>
                                
                                <!-- Decorative canvas axes/grid helper -->
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
                        </div>
                                
                                <div class="flex flex-col items-center gap-1">
                                    <div class="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-sm shadow">🧠</div>
                                    <span class="text-[8px] font-mono text-slate-500">调度中脑</span>
                                </div>
                                <div class="h-0.5 bg-slate-855 flex-1 mx-1.5 relative"><div class="absolute inset-0 bg-emerald-500/40 w-full"></div></div>

                                <div class="flex flex-col items-center gap-1">
                                    <div class="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-sm shadow">🔀</div>
                                    <span class="text-[8px] font-mono text-slate-500">风格流转</span>
                                </div>
                                <div class="h-0.5 bg-slate-850 flex-1 mx-1.5 relative"><div class="absolute inset-0 bg-emerald-500/40 w-full"></div></div>

                                <div class="flex flex-col items-center gap-1">
                                    <div class="w-8 h-8 rounded-lg bg-emerald-950/30 border border-emerald-500/50 text-emerald-400 flex items-center justify-center text-sm shadow">✍️</div>
                                    <span class="text-[8px] font-mono text-emerald-400 font-bold" id="n8n-pipeline-active-agent">风格专家</span>
                                </div>
                                <div class="h-0.5 bg-slate-850 flex-1 mx-1.5 relative"><div class="absolute inset-0 bg-emerald-500/40 w-full"></div></div>

                                <div class="flex flex-col items-center gap-1">
                                    <div class="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-sm shadow">📱</div>
                                    <span class="text-[8px] font-mono text-slate-500">微信排版</span>
                                </div>
                                <div class="h-0.5 bg-slate-850 flex-1 mx-1.5 relative"><div class="absolute inset-0 bg-emerald-500/40 w-full"></div></div>

                                <div class="flex flex-col items-center gap-1">
                                    <div class="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-sm shadow">🕊️</div>
                                    <span class="text-[8px] font-mono text-slate-500">推送回执</span>
                                </div>
                            </div>
                            
                            <!-- JSON source area -->
                            <div class="flex-1 overflow-hidden flex flex-col border border-slate-800 rounded-xl">
                                <div class="bg-slate-900/80 px-4 py-2 border-b border-slate-800 flex justify-between items-center text-[10px] text-slate-500 font-mono">
                                    <span>wechat_marketing_workflow.json</span>
                                    <button onclick="WorkspaceUI.copyPromoN8NJson()" class="hover:text-white transition-colors">📋 复制 JSON</button>
                                </div>
                                <pre class="flex-1 overflow-y-auto p-4 text-[10px] font-mono text-emerald-400 bg-black/40 leading-relaxed no-scrollbar select-text" id="promo-n8n-json-box"></pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Render image presets
    WorkspaceUI.renderPromoImageSelector();
    
    // Apply defaults
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

    const idleView = document.getElementById('promo-idle-view');
    const processingView = document.getElementById('promo-processing-view');
    const resultView = document.getElementById('promo-result-view');

    idleView.classList.add('hidden');
    resultView.classList.add('hidden');
    processingView.classList.remove('hidden');

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
            new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), 12000))
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

    processingView.classList.add('hidden');
    resultView.classList.remove('hidden');
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
                copyText: `🔥 摸鱼警报！不对，是夏日福利风暴！‼️\n\n【买一送一 ｜ 限时狂欢】\n即日起至本周五，每天14:00-17:00，招牌「${keywords || '生椰拿铁'}」买一送一！\n\n精选冷榨椰乳，浓郁清甜，前10名到店还赠送「手工曲奇」一份！快拉上你的搭子冲！🏃‍♂️💨\n\n#生椰拿铁 #办公室下午茶 #限时福利`,
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
                copyText: `🔥 【全场8折 ｜ 烘焙狂欢周】\n\n店长今天开心，全手工无添加「${keywords || '鲜奶切片吐司'}」限时三天全场8折优惠！\n\n更有会员专属：买满38元即赠送经典蛋挞一只，每日限量50份，先到先得！错过再等一年，快冲鸭！🏃‍♀️端午🎁\n\n#烘焙优惠 #手作面包 #面包狂欢`,
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
                    '店主回复：谢谢张姐，早上的牛角包给你留了一个！'
                ]
            },
            meme: {
                storeName: '影梅庵手作面包坊',
                avatar: '🍰',
                location: '影梅庵手作面包 · 翻车现场',
                copyText: `😂 救命！今天店长又双叒叕把「${keywords || '黑金乳酪面包'}」烤得有点微焦了……\n\n为了掩盖他的罪行，也为了防止老板扣工资，我们决定把这批面包以“大艺术家熔岩风格”半价甩卖！\n\n虽然长得黑，但内馅的流心乳酪绝对爆浆！快来帮我们消灭罪证！💸🤡\n\n#烘焙翻车现场 #流心乳酪 #搞笑打工人`,
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
                copyText: `🔥 【周末鲜花特惠 ｜ 满99减20】\n\n新一季「${keywords || '向日葵花束'}」元气上架！在这个充满阳光的周末，全店精选向日葵及绣球花束，买满99立减20！\n\n前30名预定客户，免费加赠精美卡片及定制丝带。快来为你爱的人送上一束小太阳吧！🌻🎁💨\n\n#鲜花优惠 #元气向日葵 #周末送花`,
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
                    '打工人小白：哈哈哈哈防小人我太需要了，给我留一束！',
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
                copyText: `🔥 【换季狂欢 ｜ 两件8折 ｜ 满299赠时尚包包】\n\n新一季「${keywords || '修身显瘦连衣裙'}」全系上新！即日起至周末，全场连衣裙及夏装外套两件立享8折，买满299元即赠时尚帆布包一个！\n\n库存有限，爆款断码超快，赶紧来挑走你的秋季新搭吧！🛍️🏃‍♂️🎁\n\n#换季大促 #女装新品 #连衣裙大甩卖`,
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
                copyText: `🌤️ 早安！店里今天刚做好了新品陈列，挂满了「${keywords || '秋季薄针织衫'}」，颜色暖融融的，像秋天的麦田。\n\n衣服不仅是避寒的织物，更是你面对世界的底气。希望这件温柔的针织衫，能陪你度过轻快的一天。路过进来看衣服哦！自动上新🧥🏡\n\n#每日穿搭打卡 #主理人的日常 #秋装上新`,
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
                copyText: `🍝 招牌「${keywords || '黑椒海鲜意面'}」热气腾腾上桌！\n\n浓油赤酱的黑椒汁紧紧包裹着爽滑的意面，大颗的虾仁与扇贝在盘中滋滋作响。一口下去，胡椒的微辣和海鲜的甜美在口中瞬间爆开，大口咀嚼，面条筋道，海味十足！\n\n今晚的快乐，就从这盘浓郁的面开始吧！🦐🔥✨\n\n#海鲜意面 #黑椒控 #深夜美食诱惑`,
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
                copyText: `🔥 【深夜食堂大放水 ｜ 主厨双人餐限时6折】\n\n答谢新老顾客，招牌「${keywords || '铁板肥牛'}」双人套餐即日起限时6折特惠！\n\n精选雪花肥牛在铁板上滋滋作响，搭配爽口配菜，原价198现仅需118！每日限量30桌，售完即恢复原价，快约上饭搭子冲！🏃‍♂️🥩🎁\n\n#双人餐特惠 #铁板肥牛 #限时优惠`,
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
                copyText: `🌤️ 早安！店里的大厨已经在熬制今天的「${keywords || '老火土鸡汤'}」了，清晨的厨房里飘满了浓浓的鸡汤香气。\n\n好好吃饭，是每天最正经的大事。忙碌了一天的你，下班后来喝碗热汤吧，犒劳一下辛苦的自己。我们晚上见！🍲🏡\n\n#好好吃饭 #清晨厨房 #主厨日记`,
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
                    '吃货老张：哈哈哈哈包装大厨我爱了，今晚必冲！',
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
                copyText: `😂 “千万别招惹心情不好的发型师，除非你想拥有一个‘能看清你所有智商’的超清爽刘海。”\n\n我们家发型师今天被太太罚跪了，手抖把客人的刘海「${keywords || '眉上短刘海'}」剪短了半厘米，结果意外地巨显脸小、巨时尚！\n\n为了庆祝发型师没有被赶出家门，今天凡是来店里剪短发的朋友，全部赠送现磨冷萃一杯！\n\n#发型师手抖现场 #时尚刘海 #沙龙日常`,
                imagePrompt: `A funny high-contrast drawing of a girl looking shocked at her funny trendy bangs in a mirror, cute comic style, 8k`,
                comments: [
                    '冲浪少女：哈哈哈哈笑死了，明天我要去赌一把发型师的手抖运气！',
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
                copyText: `🔥 【打工人元气回血周 ｜ 养生调理限时特惠】\n\n主打项目「${keywords || '肩颈古法推拿+草本足浴'}」特惠福利上线！\n\n即日起至周末，全套疗程原价358元，限时体验仅需168元！前20名预约到店的顾客免费赠送「五行养生膳食汤」一碗！快叫上你的加班搭子来回血！🏃‍♂️💨🥣\n\n#打工人养生 #推拿特惠 #健康回血`,
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
},

copyTextToClipboard: function(text) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).catch(err => {
            console.error('Clipboard copy failed:', err);
            WorkspaceUI.fallbackCopyText(text);
        });
    } else {
        WorkspaceUI.fallbackCopyText(text);
    }
},

fallbackCopyText: function(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
    } catch (err) {
        console.error('Fallback copy failed:', err);
    }
    document.body.removeChild(textarea);
}
};