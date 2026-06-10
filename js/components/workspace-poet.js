// ============================================
// 麻升智能工作室 - 沉浸式工作台
// 千古诗仙 (Poet Agent) Component
// ============================================

Object.assign(window.WorkspaceUI, {
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

                    <!-- Flying Flower Input -->
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
                    customPoem = customPoem.replace(/\n/g, '\\n');
                    poetComment = `贤友在现代打拼，创业奔波、加班辛劳，太白深感敬佩。千年前我亦曾“仰天大笑出门去，我辈岂是盆蒿人”，世俗羁绊虽多，但心怀万里野望，必能乘风破浪！此诗赠予贤友，愿助一臂之力。`;
                } else if (text.includes('伤心') || text.includes('失恋') || text.includes('难过') || text.includes('痛苦')) {
                    customPoem = `【浣溪沙 · 赠贤友】\n冷雨敲窗夜未央，凄清小阁伴残香。\n何须珠泪湿罗裳。\n往事如烟终散去，春风入户又芬芳。\n明朝晴日照疏窗。`;
                    customPoem = customPoem.replace(/\n/g, '\\n');
                    poetComment = `小女子易安，亦曾经历国破家亡、半生漂泊，深知“物是人非事事休，欲语泪先流”之苦。然而，阴雨终会放晴，错过的落花亦是春泥。愿贤友听一曲易安词，早日拨云见日，重拾欢颜。`;
                } else if (text.includes('迷茫') || text.includes('选择') || text.includes('考试') || text.includes('顺利')) {
                    customPoem = `【定风波 · 励贤友】\n莫道前路雾满川，徐行竹杖自怡然。\n金榜题名终有日，何难？一腔热血破尘烟。\n料峭春风吹梦醒，微冷。斜阳万道正相迎。\n回首向来风雨处，归去，长河浪静海天清。`;
                    customPoem = customPoem.replace(/\n/g, '\\n');
                    poetComment = `子瞻一生，颠沛流离，黄州、惠州、儋州，皆是险途。但只要心中超脱，何处不东坡？贤友面临考验或决择，不必迷茫，但行好事，莫问前程，老夫在此祝你金榜题名、万事顺遂！`;
                } else {
                    customPoem = `【七绝 · 赠现代贤友】\n跨越千载见知音，片语只言动古今。\n砚里飞花诗意满，长河月下伴君心。`;
                    customPoem = customPoem.replace(/\n/g, '\\n');
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
    }
});
