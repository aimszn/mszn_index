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

    open: function(title, urlKey, initialInput = '') {
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

        WorkspaceUI.switchTool(urlKey, title, resolvedIcon, initialInput);
    },

    close: function() {
        if (typeof WorkspaceUI.stopPoetryAudio === 'function') {
            WorkspaceUI.stopPoetryAudio(); // 关闭工作台时停止试听音频
        }
        if (typeof WorkspaceUI.stopResultPlayers === 'function') {
            WorkspaceUI.stopResultPlayers(); // 停止结果界面的音视频播放
        }
        if (typeof WorkspaceUI.stopPoetAmbient === 'function') {
            WorkspaceUI.stopPoetAmbient(); // 停止诗仙背景环境音
        }
        const ws = document.getElementById('view-workspace');
        if (ws) {
            ws.classList.remove('active');
            setTimeout(() => {
                ws.style.display = 'none';
                document.body.style.overflow = '';
            }, 600);
        }
    },

    goToContact: function() {
        WorkspaceUI.close();
        setTimeout(() => {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 650);
    },

    switchTool: function(id, title, icon, initialInput = '') {
        if (typeof WorkspaceUI.stopPoetryAudio === 'function') {
            WorkspaceUI.stopPoetryAudio(); // 切换到其他工具时停止试听音频
        }
        if (typeof WorkspaceUI.stopResultPlayers === 'function') {
            WorkspaceUI.stopResultPlayers(); // 停止结果界面的音视频播放
        }
        if (typeof WorkspaceUI.stopPoetAmbient === 'function') {
            WorkspaceUI.stopPoetAmbient(); // 停止诗仙背景环境音
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
        if (id === 'blogRag') type = 'blog-rag';

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
                if (typeof WorkspaceUI.renderPoetAgent === 'function') {
                    WorkspaceUI.renderPoetAgent(title, icon);
                }
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
            if (typeof WorkspaceUI.renderLocalPromo === 'function') {
                WorkspaceUI.renderLocalPromo(title, icon);
            }
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
            if (typeof WorkspaceUI.renderSongPoetry === 'function') {
                WorkspaceUI.renderSongPoetry(title, icon);
            }
        } else if (type === 'blog-rag') {
            tagEl.innerText = 'n8n Workflow - AI 知识库检索中控';
            tagEl.className = 'text-[10px] font-mono px-2 py-0.5 rounded border border-amber-500/30 bg-amber-900/20 text-amber-400';
            if (typeof WorkspaceUI.renderBlogRag === 'function') {
                WorkspaceUI.renderBlogRag(title, icon, initialInput);
            }
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
    },

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
                response = "🎲【无限流互动跑团】DM 判定开启！<br><b>【初始场景】：</b>你若有所思地睁开眼，发现自己身处一间闪烁着幽蓝霓虹的废弃仿生人实验室。四周是破碎玻璃培养舱，冰冷的警报声在空旷的空间里回荡：‘自毁程序已启动，剩余时间：5分钟。’<br>在你的面前有三个选项，请选择你要采取的行动：<br><br><b>1. [检查左侧闪烁绿光的控制终端] (进行智力检定)</b><br><b>2. [砸碎右侧反锁的合金液压大门] (进行力量检定)</b><br><b>3. [快速搜索地上的仿生人残骸] (进行感知检定)</b><br><br>请输入你想采取的行动（直接输入数字 1/2/3 或自由描述你想做的动作，我会为你投骰子决定成败）：";
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