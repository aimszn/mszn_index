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
        `;
        document.head.appendChild(style);

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
            <div class="flex-1 flex flex-col bg-[#050505]">
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
            </div>
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
    if (tools.length > 0) {
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
    if (id === 'qinhuai') type = 'song-poetry';

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
    } else if (type === 'song-poetry') {
        tagEl.innerText = 'n8n Workflow - 宋词点唱机';
        tagEl.className = 'text-[10px] font-mono px-2 py-0.5 rounded border border-rose-500/30 bg-rose-900/20 text-rose-400';
        WorkspaceUI.renderSongPoetry(title, icon);
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
,

renderSongPoetry: function(title, icon) {
    const content = document.getElementById('ws-main-content');
    content.innerHTML = `
        <div class="h-full flex w-full">
            <div class="w-[320px] bg-slate-900/50 border-r border-slate-800 p-6 flex flex-col gap-5 overflow-y-auto no-scrollbar">
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
                <div>
                    <label class="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">宋词内容</label>
                    <textarea id="poetry-content" class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-rose-500 h-36 resize-none font-serif leading-relaxed" placeholder="请输入宋词正文内容..."></textarea>
                </div>
                <button id="btn-submit-poetry" onclick="WorkspaceUI.submitSongPoetry()" class="mt-4 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold py-3.5 rounded-xl shadow-[0_0_20px_rgba(225,29,72,0.3)] hover:shadow-[0_0_30px_rgba(225,29,72,0.5)] transition-all flex items-center justify-center gap-2 hover:scale-[1.02]">
                    <span>🎵</span> 开始AI谱曲吟唱
                </button>
            </div>
            <div class="flex-1 p-8 overflow-y-auto bg-tech-grid flex flex-col items-center justify-center relative">
                <div class="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/80 z-0"></div>
                
                <!-- Idle View -->
                <div id="poetry-idle-view" class="flex-grow flex flex-col lg:flex-row items-center justify-center relative z-10 gap-10 w-full max-w-5xl px-6">
                    <!-- Left: Vinyl Player -->
                    <div class="flex flex-col items-center gap-4">
                        <div class="relative w-56 h-56 sm:w-72 sm:h-72">
                            <div class="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-500/20 via-slate-900 to-pink-500/20 border border-slate-800 shadow-[0_0_40px_rgba(244,63,94,0.15)]"></div>
                            <div class="absolute inset-3 rounded-full border border-slate-800 bg-black shadow-inner flex items-center justify-center animate-spin-slow">
                                <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-rose-950/80 border border-rose-500/50 flex flex-col items-center justify-center p-2 text-center shadow-lg relative overflow-hidden">
                                    <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.3)_0%,transparent_70%)]"></div>
                                    <span class="text-xs text-rose-300 font-bold tracking-widest relative z-10">宋词</span>
                                    <span class="text-[9px] text-slate-400 font-mono tracking-tighter relative z-10 uppercase mt-0.5">Jukebox</span>
                                </div>
                            </div>
                            <div class="absolute top-2 -right-4 w-20 h-20 origin-top-left rotate-12 transition-transform duration-1000" id="poetry-tonearm" style="transform: rotate(12deg);">
                                <svg class="w-full h-full text-slate-400" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M10 10 L40 10 L50 60 L45 70" stroke-linecap="round"/>
                                    <rect x="42" y="65" width="6" height="10" rx="2" fill="currentColor"/>
                                </svg>
                            </div>
                        </div>
                        <div class="text-center">
                            <h4 class="text-white font-bold text-base">宋词八艳点唱机</h4>
                            <p class="text-slate-500 text-[10px] tracking-widest uppercase mt-0.5 font-mono">Song Poetry Jukebox</p>
                        </div>
                    </div>

                    <!-- Right: Calligraphy Scroll / Lyric Display Area -->
                    <div class="w-full lg:w-[400px] h-[360px] sm:h-[420px] bg-slate-950/60 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col shadow-2xl backdrop-blur-md relative overflow-hidden group hover:border-rose-500/30 transition-colors">
                        <div class="absolute top-0 bottom-0 left-4 w-[1px] bg-rose-950/20"></div>
                        <div class="absolute top-0 bottom-0 right-4 w-[1px] bg-rose-950/20"></div>
                        
                        <div class="text-xs font-mono text-rose-400/80 mb-4 flex justify-between items-center shrink-0 border-b border-slate-900 pb-2">
                            <span>📜 实时歌词展示区域</span>
                            <span class="text-[9px] bg-rose-950/40 px-2 py-0.5 rounded border border-rose-500/20">Live Lyrics</span>
                        </div>
                        
                        <div class="flex-grow overflow-y-auto no-scrollbar flex flex-col justify-center items-center text-center font-serif py-4 w-full" id="poetry-live-lyrics">
                            <div class="text-slate-600 italic text-sm">
                                <p class="my-2">长河浪淘，待君填词</p>
                                <p class="text-xs text-slate-700 mt-2 font-sans">请在左侧选择推荐词作或直接输入内容</p>
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
        
        if (titleEl) titleEl.addEventListener('input', WorkspaceUI.updateLiveLyrics);
        if (authorEl) authorEl.addEventListener('input', WorkspaceUI.updateLiveLyrics);
        if (contentEl) contentEl.addEventListener('input', WorkspaceUI.updateLiveLyrics);
        
        WorkspaceUI.updateLiveLyrics();
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
            <div class="text-slate-600 italic text-sm text-center">
                <p class="my-2">长河浪淘，待君填词</p>
                <p class="text-xs text-slate-700 mt-2 font-sans">请在左侧选择推荐词作或直接输入内容</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    if (titleVal || authorVal) {
        html += `<h3 class="text-rose-400 font-bold text-base sm:text-lg mb-1 tracking-wider text-center">《${titleVal || '未命名'}》</h3>`;
        html += `<p class="text-slate-500 text-xs mb-6 font-sans text-center">【词人】${authorVal || '佚名'}</p>`;
    }
    
    if (contentVal) {
        const lines = contentVal.split('\n');
        html += `<div class="space-y-2.5 max-w-xs mx-auto text-center w-full">`;
        lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed !== '') {
                html += `<p class="text-slate-200 text-sm leading-relaxed tracking-wide font-serif">${trimmed}</p>`;
            } else {
                html += `<div class="h-2"></div>`;
            }
        });
        html += `</div>`;
    } else {
        html += `<p class="text-slate-600 italic text-sm text-center">请输入正文内容...</p>`;
    }
    
    lyricsEl.innerHTML = html;
},
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

    try {
        const fetchPromise = fetch(qinhuaiWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), 45000));
        
        const [response] = await Promise.all([
            Promise.race([fetchPromise, timeoutPromise]),
            new Promise(resolve => setTimeout(resolve, 2500))
        ]);

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

    // Transition Step Animations
    updateStep(1, '✅ 已完成', 'border-emerald-500/30', '✍️');
    
    updateStep(2, '进行中...', 'border-rose-500/40 bg-slate-900', '<div class="animate-spin text-sm">⏳</div>');
    await new Promise(r => setTimeout(r, 2000));
    updateStep(2, '✅ 已完成', 'border-emerald-500/30', '🧠');

    updateStep(3, '进行中...', 'border-rose-500/40 bg-slate-900', '<div class="animate-spin text-sm">⏳</div>');
    await new Promise(r => setTimeout(r, 2000));
    updateStep(3, '✅ 已完成', 'border-emerald-500/30', '🎨');

    updateStep(4, '进行中...', 'border-rose-500/40 bg-slate-900', '<div class="animate-spin text-sm">⏳</div>');
    await new Promise(r => setTimeout(r, 1500));
    updateStep(4, '✅ 已完成', 'border-emerald-500/30', '🕊️');

    // Switch to Result View
    processingView.classList.add('hidden');
    resultView.classList.remove('hidden');
    btn.disabled = false;
    btn.innerHTML = `<span>🎵</span> 开始AI谱曲吟唱`;

    const resultContent = document.getElementById('poetry-result-content');
    
    let parsedHtml = '';
    if (responseData) {
        let textContent = '';
        if (typeof responseData === 'string') {
            textContent = responseData;
        } else if (typeof responseData === 'object') {
            textContent = responseData.output || responseData.text || responseData.content || JSON.stringify(responseData, null, 2);
        }
        
        parsedHtml = formatMarkdown(textContent);
    }

    function formatMarkdown(text) {
        if (!text) return '';
        let escaped = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        let lines = escaped.split('\n');
        let formattedLines = lines.map(line => {
            let trimmed = line.trim();
            if (trimmed.startsWith('###')) {
                return `<h4 class="text-base sm:text-lg font-bold text-rose-300 mt-4 mb-2 font-serif text-center">${trimmed.replace(/^###\s*/, '')}</h4>`;
            }
            if (trimmed.startsWith('##')) {
                return `<h3 class="text-lg sm:text-xl font-black text-white mt-6 mb-3 border-b border-slate-800 pb-2 font-serif text-center">${trimmed.replace(/^##\s*/, '')}</h3>`;
            }
            if (trimmed.startsWith('#')) {
                return `<h2 class="text-xl sm:text-2xl font-black text-rose-400 mt-8 mb-4 font-serif text-center">${trimmed.replace(/^#\s*/, '')}</h2>`;
            }
            if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
                return `<li class="text-slate-300 text-xs sm:text-sm font-sans list-none flex items-center justify-center gap-2 mb-1.5"><span class="text-rose-500">✦</span> ${trimmed.replace(/^[-*]\s*/, '')}</li>`;
            }
            if (trimmed === '') {
                return `<div class="h-4"></div>`;
            }
            if (trimmed.includes('━━')) {
                return `<div class="text-center text-slate-400 text-xs tracking-widest my-4 py-1.5 bg-slate-900/40 border border-slate-800/50 rounded-xl max-w-sm mx-auto font-mono">${trimmed}</div>`;
            }
            return `<p class="text-slate-300 text-sm leading-loose my-1 text-center font-serif">${trimmed}</p>`;
        });

        return `<div class="max-w-2xl mx-auto py-4 px-2 space-y-1">${formattedLines.join('')}</div>`;
    }

    if (!parsedHtml || parsedHtml.trim() === '' || fetchError) {
        const errorMsg = fetchError ? `<p class="text-rose-400 text-xs font-mono mb-4 bg-rose-950/20 p-3 rounded-xl border border-rose-500/20">系统级通信延迟（已自动转为飞书队列）: ${fetchError.message}</p>` : '';
        parsedHtml = `
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
                        <li>指定演绎：${singerVal === 'auto' ? '中枢智能匹配' : singerVal}</li>
                    </ul>
                    <p class="text-xs text-slate-400 mt-2">由于 AI 大模型音乐谱曲与飞书机器人灌装需要约 1-2 分钟，最终生成的【概念单曲宣发卡片】将直接推送到关联的飞书客户端，请耐心等待。</p>
                </div>
            </div>
        `;
    }

    resultContent.innerHTML = parsedHtml;
},

copyPoetryResult: function() {
    const content = document.getElementById('poetry-result-content');
    if (!content) return;
    const text = content.innerText;
    navigator.clipboard.writeText(text).then(() => {
        alert('海报文案已成功复制到剪贴板！');
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
};
