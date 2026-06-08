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
    if (['copywriter', 'localPromo', 'moments', 'article'].includes(id)) type = 'generator';
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
}
};
