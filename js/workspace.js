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
        const sidebarHTML = `
            <div class="w-[300px] sm:w-[350px] border-r border-slate-800 bg-[#050505] flex flex-col shrink-0">
                <div class="p-6 border-b border-slate-800 bg-[#0a0f1c]">
                    <button onclick="WorkspaceUI.close()" class="text-slate-400 hover:text-cyan-400 text-sm font-bold flex items-center gap-2 transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        返回官网
                    </button>
                    <h2 class="text-xl font-black text-white mt-6 tracking-tight">AI 兵器谱工作台</h2>
                </div>
                <div class="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar" id="ws-sidebar-menu">
                </div>
                <div class="p-4 border-t border-slate-800 bg-[#0a0f1c]">
                    <div class="flex items-center gap-2 text-xs text-slate-500 font-mono">
                        <div class="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></div>
                        API 引擎挂载正常
                    </div>
                </div>
            </div>
        `;

    const mainAreaHTML = `
            < div class="flex-1 flex flex-col bg-[#050505]" >
            <header class="h-[64px] border-b border-slate-800 flex items-center justify-between px-6 bg-[#0f172a]/50 backdrop-blur">
                <div class="flex items-center gap-3">
                    <span id="ws-current-icon" class="text-2xl"></span>
                    <h3 id="ws-current-title" class="text-lg font-bold">请选择工具</h3>
                    <span id="ws-current-tag" class="text-[10px] font-mono px-2 py-0.5 rounded border border-slate-700 bg-slate-800 text-slate-300">...</span>
                </div>
                <button class="text-xs text-slate-400 hover:text-pink-400 font-medium px-4 py-2 rounded-lg border border-slate-700 hover:border-pink-500 transition-colors">
                    清空运行记录
                </button>
            </header>
            <main id="ws-main-content" class="flex-1 overflow-hidden relative noise-overlay">
            </main>
        </div >
            `;

    section.innerHTML = sidebarHTML + mainAreaHTML;
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
    if (window.SITE_CONFIG_DATA && window.SITE_CONFIG_DATA.content && window.SITE_CONFIG_DATA.content.digitalEmployees) {
        window.SITE_CONFIG_DATA.content.digitalEmployees.forEach(e => {
            tools.push({ id: e.urlKey, title: e.title, icon: e.icon });
        });
    }
    
    const menuEl = document.getElementById('ws-sidebar-menu');
    if (tools.length > 0) {
        menuEl.innerHTML = tools.map(t => `
            < button onclick = "WorkspaceUI.switchTool('${t.id}', '${t.title}', '${t.icon}')" data - ws - tool="${t.id}" class="ws-menu-btn w-full text-left p-3 rounded-xl flex items-center gap-3 text-slate-400 hover:bg-slate-800 hover:text-white transition-all font-medium" >
                <span class="text-xl">${t.icon}</span>
                <span class="truncate">${t.title}</span>
            </button >
            `).join('');
    }

    ws.style.display = 'flex';
    setTimeout(() => ws.classList.add('active'), 10);
    document.body.style.overflow = 'hidden';

    WorkspaceUI.switchTool(urlKey, title, '🤖');
},

close: function() {
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
    if (['copywriter', 'localPromo', 'moments', 'article'].includes(id)) type = 'generator';
    if (['credit', 'localStore'].includes(id)) type = 'workflow';
    if (['video'].includes(id)) type = 'video-generator';

    const tagEl = document.getElementById('ws-current-tag');
    if (type === 'chat') {
        tagEl.innerText = 'Dify LLMOps - Chat';
        tagEl.className = 'text-[10px] font-mono px-2 py-0.5 rounded border border-blue-500/30 bg-blue-900/20 text-blue-400';
        WorkspaceUI.renderChat(title, icon);
    } else if (type === 'generator') {
        tagEl.innerText = 'Dify LLMOps - Generator';
        tagEl.className = 'text-[10px] font-mono px-2 py-0.5 rounded border border-pink-500/30 bg-pink-900/20 text-pink-400';
        WorkspaceUI.renderGenerator(title, icon);
    } else if (type === 'workflow') {
        tagEl.innerText = 'n8n Workflow Engine';
        tagEl.className = 'text-[10px] font-mono px-2 py-0.5 rounded border border-cyan-500/30 bg-cyan-900/20 text-cyan-400';
        WorkspaceUI.renderWorkflow(title, icon);
    } else if (type === 'video-generator') {
        tagEl.innerText = 'Multi-modal Video Generator';
        tagEl.className = 'text-[10px] font-mono px-2 py-0.5 rounded border border-purple-500/30 bg-purple-900/20 text-purple-400';
        WorkspaceUI.renderVideoGenerator(title, icon);
    }
},

renderChat: function(title, icon) {
    const content = document.getElementById('ws-main-content');
    content.innerHTML = `
            < div class="h-full flex flex-col max-w-4xl mx-auto py-8 px-4 relative" >
            <div class="flex-1 overflow-y-auto space-y-6 pb-20 no-scrollbar">
                <div class="flex gap-4 msg-enter">
                    <div class="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xl shadow-lg shrink-0">${icon}</div>
                    <div class="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl rounded-tl-sm text-sm text-slate-300 leading-relaxed shadow-lg max-w-[80%]">
                        你好！我是${title}，随时准备好帮助你处理任务。请输入你的需求...
                    </div>
                </div>
            </div>
            <div class="absolute bottom-8 left-4 right-4 bg-slate-900/80 backdrop-blur-xl border border-slate-700 p-2 rounded-2xl flex items-end gap-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
                <textarea class="flex-1 bg-transparent border-none text-white text-sm p-3 focus:outline-none resize-none h-12" placeholder="输入你想说的话..."></textarea>
                <button class="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl transition-colors shadow-md group">
                    <svg class="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                </button>
            </div>
        </div >
            `;
},

renderGenerator: function(title, icon) {
    const content = document.getElementById('ws-main-content');
    content.innerHTML = `
            < div class="h-full flex w-full" >
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
        </div >
            `;
},

renderWorkflow: function(title, icon) {
    const content = document.getElementById('ws-main-content');
    content.innerHTML = `
            < div class="h-full flex flex-col w-full bg-tech-grid p-6 relative" >
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
        </div >
            `;
},

renderVideoGenerator: function(title, icon) {
    const content = document.getElementById('ws-main-content');
    content.innerHTML = `
            < div class="h-full flex w-full" >
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
        </div >
    `;
}
};
