// ============================================
// 麻升智能工作室 - 主应用逻辑
// 渲染器、事件处理、路由、启动引擎
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    // 先加载所有 HTML partials 片段
    if (window.loadPartials) {
        await window.loadPartials();
    }

    // 等待 JSON 数据加载完成
    while (!window.LOCAL_CMS_DATA) {
        await new Promise(r => setTimeout(r, 20));
    }
let isCsOpen = false;
let logTimeouts = [];
let isAudioPlaying = false;
let SITE_CONFIG_DATA = null;
let chartRevInstance = null;
let chartAllocInstance = null;
let currentDashboardCat = 'all';

async function fetchSystemConfig() {
    return window.LOCAL_CMS_DATA;
}

function triggerErrorBoundary(error) {
    console.error("【系统级拦截】配置解析失败:", error);
    document.body.classList.add('sys-error');
}

const Renderers = {
    renderBlueprints: () => {
        const grid = document.getElementById('workflow-blueprints-grid');
        if (!grid || !SITE_CONFIG_DATA.content || !SITE_CONFIG_DATA.content.blueprints) return;
        grid.innerHTML = SITE_CONFIG_DATA.content.blueprints.map((bp, idx) => {
            const nodesHtml = bp.nodes.map((node, nIdx) => `
                <div class="flex items-center">
                    <div class="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-inner group-hover:border-cyan-500/40 transition-colors">
                        <span class="text-sm">${node.icon}</span>
                        <span class="text-[10px] text-slate-300 font-bold whitespace-nowrap">${node.name}</span>
                    </div>
                    ${nIdx !== bp.nodes.length - 1 ? '<svg class="w-4 h-4 mx-1.5 text-slate-600 group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>' : ''}
                </div>
            `).join('');
            return `
                <div class="glass-card p-6 sm:p-8 rounded-[32px] border border-slate-700/80 hover:border-cyan-500/50 transition-all duration-300 group shadow-lg flex flex-col justify-between reveal-on-scroll" style="transition-delay: ${idx * 0.1}s">
                    <div>
                        <div class="flex justify-between items-start mb-4">
                            <h4 class="text-lg font-bold text-white tracking-tight group-hover:text-cyan-400 transition-colors">${bp.title}</h4>
                            <span class="text-[9px] text-green-400 font-bold bg-green-950/40 border border-green-500/30 px-2.5 py-1 rounded-md shadow-sm whitespace-nowrap ml-4">💡 ${bp.roi}</span>
                        </div>
                        <p class="text-xs text-slate-400 leading-relaxed font-light mb-6">${bp.desc}</p>
                    </div>
                    <div class="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 overflow-x-auto no-scrollbar relative shadow-inner">
                        <div class="flex items-center w-max px-2">${nodesHtml}</div>
                    </div>
                </div>
            `;
        }).join('');
    },
    renderCBlueprints: () => {
        const grid = document.getElementById('workflow-blueprints-c-grid');
        if (!grid || !SITE_CONFIG_DATA.content || !SITE_CONFIG_DATA.content.cBlueprints) return;
        grid.innerHTML = SITE_CONFIG_DATA.content.cBlueprints.map((bp, idx) => {
            const nodesHtml = bp.nodes.map((node, nIdx) => `
                <div class="flex items-center">
                    <div class="bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-inner group-hover:border-pink-500/40 transition-colors">
                        <span class="text-sm">${node.icon}</span>
                        <span class="text-[10px] text-slate-300 font-bold whitespace-nowrap">${node.name}</span>
                    </div>
                    ${nIdx !== bp.nodes.length - 1 ? '<svg class="w-3 h-3 mx-1 text-slate-600 group-hover:text-pink-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>' : ''}
                </div>
            `).join('');
            return `
                <div class="glass-card p-6 sm:p-8 rounded-[32px] border border-slate-700/80 hover:border-pink-500/50 transition-all duration-300 group shadow-lg flex flex-col justify-between reveal-on-scroll bg-gradient-to-br from-slate-900/60 to-pink-950/10" style="transition-delay: ${idx * 0.1}s">
                    <div>
                        <div class="flex justify-between items-start mb-4 gap-2">
                            <h4 class="text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-pink-400 transition-colors font-serif">${bp.title}</h4>
                            <span class="text-[9px] text-pink-400 font-bold bg-pink-950/40 border border-pink-500/30 px-2 py-1 rounded shadow-sm whitespace-nowrap mt-1">🚀 ${bp.roi}</span>
                        </div>
                        <p class="text-xs text-slate-400 leading-relaxed font-light mb-6">${bp.desc}</p>
                    </div>
                    <div class="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 overflow-x-auto no-scrollbar relative shadow-inner">
                        <div class="flex items-center w-max">${nodesHtml}</div>
                    </div>
                </div>
            `;
        }).join('');
    },
    renderDailyAgents: () => {
        const grid = document.getElementById('daily-agents-grid');
        if (!grid || !SITE_CONFIG_DATA.content || !SITE_CONFIG_DATA.content.dailyAgents) return;
        grid.innerHTML = SITE_CONFIG_DATA.content.dailyAgents.map((agent, idx) => {
            const tagsHtml = agent.tags.map(t => `<span class="px-2.5 py-1 rounded-md text-[10px] font-mono border ${agent.theme.border} ${agent.theme.text} ${agent.theme.bg} shadow-sm">${t}</span>`).join('');
            return `
                <div class="glass-card p-6 sm:p-8 rounded-[32px] border border-slate-700/80 ${agent.theme.hoverBorder} transition-all duration-500 group shadow-xl flex flex-col h-full bg-slate-900/40 hover:-translate-y-2 reveal-on-scroll" style="transition-delay: ${idx * 0.1}s">
                    <div class="flex justify-between items-start mb-6">
                        <div class="w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center text-2xl border border-slate-800 shadow-inner group-hover:scale-110 transition-transform ${agent.theme.hoverIconBorder}">${agent.icon}</div>
                        <span class="text-[10px] ${agent.theme.text} font-black tracking-widest uppercase ${agent.theme.bg} border ${agent.theme.border} px-3 py-1.5 rounded-lg shadow-sm whitespace-nowrap">🎯 ${agent.target}</span>
                    </div>
                    <h4 class="text-xl font-bold text-white mb-3 ${agent.theme.hoverText} transition-colors tracking-tight font-serif">${agent.title}</h4>
                    <div class="flex flex-wrap gap-2 mb-5">${tagsHtml}</div>
                    <p class="text-sm text-slate-400 leading-relaxed font-light flex-1">${agent.desc}</p>
                    <div class="mt-8 pt-6 border-t border-slate-800/80">
                        <button data-action="open-agent" data-title="${agent.title}" data-url-key="${agent.urlKey}" class="w-full py-3.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold text-sm ${agent.theme.btn} transition-all flex items-center justify-center gap-2 focus:outline-none">
                            <span>🚀 【进入沉浸工作台】</span>
                            <span class="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    },
    renderResources: () => {
        const grid = document.getElementById('resources-grid');
        if (!grid || !SITE_CONFIG_DATA.content || !SITE_CONFIG_DATA.content.resources) return;
        grid.innerHTML = SITE_CONFIG_DATA.content.resources.map((res, idx) => `
            <div class="bg-slate-900/40 border border-slate-700/80 p-6 sm:p-8 rounded-3xl hover:border-${res.color}-500/50 hover:bg-slate-900/80 transition-all duration-300 group shadow-lg flex flex-col justify-between hover:-translate-y-1">
                <div>
                    <div class="flex justify-between items-start mb-5">
                        <div class="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center text-2xl border border-slate-800 shadow-inner group-hover:scale-110 transition-transform">${res.icon}</div>
                        <span class="text-[9px] text-${res.color}-400 font-bold bg-${res.color}-950/30 border border-${res.color}-500/20 px-2 py-1 rounded shadow-sm tracking-widest uppercase">${res.type}</span>
                    </div>
                    <h4 class="text-base font-bold text-white mb-2 group-hover:text-${res.color}-400 transition-colors tracking-tight">${res.title}</h4>
                    <p class="text-xs text-slate-400 leading-relaxed font-light mb-6">${res.desc}</p>
                </div>
                <div class="flex items-center justify-between pt-5 border-t border-slate-800/80 mt-auto">
                    <div class="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        ${res.downloads} 次获取
                    </div>
                    <button data-action="open-qrcode" data-platform="wechat" class="text-[10px] font-bold text-white bg-slate-800 hover:bg-${res.color}-600 px-4 py-2 rounded-lg transition-colors shadow-sm focus:outline-none flex items-center gap-1.5">
                        扫码免费领 <span class="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">→</span>
                    </button>
                </div>
            </div>
        `).join('');
    },
    renderDigitalEmployees: () => {
        const grid = document.getElementById('digital-employees-grid');
        if (!grid || !SITE_CONFIG_DATA.content || !SITE_CONFIG_DATA.content.digitalEmployees) return;
        grid.innerHTML = SITE_CONFIG_DATA.content.digitalEmployees.map((emp, idx) => {
            const tagsHtml = emp.tags.map(t => `<span class="px-2 py-0.5 rounded text-[9px] font-mono border border-${emp.color}-500/30 text-${emp.color}-400 bg-${emp.color}-950/30 shadow-sm">${t}</span>`).join('');
            return `
                <div class="glass-card p-6 sm:p-8 rounded-[32px] border border-slate-700/80 hover:border-${emp.color}-500/60 transition-all duration-300 group shadow-lg flex flex-col h-full bg-slate-900/60 hover:-translate-y-2 reveal-on-scroll" style="transition-delay: ${idx * 0.1}s">
                    <div class="flex justify-between items-start mb-5">
                        <div class="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center text-xl border border-slate-800 shadow-inner group-hover:scale-110 transition-transform group-hover:border-${emp.color}-500/50">${emp.icon}</div>
                        <div class="text-[10px] text-${emp.color}-400 font-black tracking-widest uppercase bg-${emp.color}-900/20 px-2.5 py-1 rounded-lg border border-${emp.color}-500/20 shadow-sm whitespace-nowrap">⏱️ ${emp.metric}</div>
                    </div>
                    <h4 class="text-lg font-bold text-white mb-2 group-hover:text-${emp.color}-400 transition-colors tracking-tight">${emp.title}</h4>
                    <div class="flex flex-wrap gap-1.5 mb-4">${tagsHtml}</div>
                    <p class="text-xs text-slate-400 leading-relaxed font-light flex-1">${emp.desc}</p>
                    <button data-action="open-agent" data-title="${emp.title}" data-url-key="${emp.urlKey}" class="w-full mt-6 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold text-xs hover:bg-${emp.color}-600 hover:border-${emp.color}-500 transition-all flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(0,0,0,0.2)] group-hover:shadow-[0_0_20px_rgba(var(--${emp.color}-500),0.3)] focus:outline-none">
                        <span>🚀 【进入沉浸工作台】</span>
                        <span class="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                    </button>
                </div>
            `;
        }).join('');
    },
    renderGallery: (filterCategory) => {
        const cat = filterCategory || '全部';
        const grid = document.getElementById('gallery-grid');
        if (!grid || !SITE_CONFIG_DATA.gallery) return;
        const filteredItems = cat === '全部' ? SITE_CONFIG_DATA.gallery : SITE_CONFIG_DATA.gallery.filter(item => item.category === cat);
        grid.innerHTML = filteredItems.map(item => {
            const colClass = item.colSpan === 2 ? 'col-span-2' : 'col-span-1';
            const rowClass = item.rowSpan === 2 ? 'row-span-2' : 'row-span-1';
            const heightClass = item.rowSpan === 2 ? 'h-[250px] sm:h-[330px]' : 'h-[120px] sm:h-[160px]';
            return `
                <button data-action="open-gallery" data-id="${item.id}" class="gallery-item relative rounded-2xl sm:rounded-3xl overflow-hidden group cursor-pointer ${colClass} ${rowClass} ${heightClass} border border-slate-800/50 hover:border-pink-500/50 transition-all duration-500 hover:shadow-[0_10px_40px_rgba(236,72,153,0.15)] text-left focus:outline-none w-full" aria-label="查看 ${item.title}">
                    <div class="absolute inset-0 bg-slate-900/30 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                    <div class="absolute bottom-0 w-full p-4 sm:p-5 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent z-20 flex justify-between items-end opacity-90 group-hover:opacity-100 transition-opacity">
                        <span class="text-[10px] sm:text-xs bg-pink-600 text-white px-3 py-1.5 rounded-lg font-bold tracking-widest uppercase shadow-lg">${item.title}</span>
                        <span class="text-[9px] text-white/70 font-mono hidden sm:block bg-slate-900/80 px-2 py-1 rounded backdrop-blur">${item.engine}</span>
                    </div>
                    <img src="${item.image}" loading="lazy" decoding="async" class="w-full h-full object-cover transform group-hover:scale-110 transition duration-700 ease-out" alt="${item.title}">
                </button>
            `;
        }).join('');
        const filterContainer = document.getElementById('gallery-filters');
        if (filterContainer) {
            const categories = ['全部', ...new Set(SITE_CONFIG_DATA.gallery.map(b => b.category))];
            filterContainer.innerHTML = categories.map(c => `
                <button data-action="filter-gallery" data-cat="${c}" class="filter-btn px-5 sm:px-7 py-2 sm:py-2.5 rounded-full border text-xs sm:text-sm font-bold transition-all duration-300 focus:outline-none ${c === cat ? 'border-pink-500/50 text-pink-300 bg-pink-950/50 shadow-[0_0_15px_rgba(236,72,153,0.3)]' : 'border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'}">
                    ${c}
                </button>
            `).join('');
        }
    },
    renderFounderAndSecurity: () => {
        const f = SITE_CONFIG_DATA.founder;
        if (!f) return;
        const nameEl = document.getElementById('founder-name'); if (nameEl) nameEl.innerText = f.name;
        const phEl = document.getElementById('founder-philosophy'); if (phEl) phEl.innerText = `"${f.philosophy}"`;
        const avatarEl = document.getElementById('founder-avatar');
        if (avatarEl && f.avatar) {
            avatarEl.src = f.avatar;
            avatarEl.onerror = function () {
                avatarEl.onerror = null;
                avatarEl.src = 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=200&auto=format&fit=crop';
            };
        }
        const stackContainer = document.getElementById('founder-stack');
        if (stackContainer && f.techStack) {
            stackContainer.innerHTML = f.techStack.map(tech => `<span class="bg-cyan-950/50 text-cyan-300 text-[11px] px-3 py-1.5 rounded-lg border border-cyan-500/30 font-mono shadow-sm">${tech}</span>`).join('');
        }
        const secGrid = document.getElementById('security-grid');
        if (secGrid && SITE_CONFIG_DATA.security) {
            secGrid.innerHTML = SITE_CONFIG_DATA.security.map(s => `
                <div class="flex gap-5 items-start bg-slate-900/50 p-6 rounded-3xl border border-slate-800 hover:border-cyan-500/30 transition-colors">
                    <div class="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center flex-shrink-0 text-xl border border-slate-700 shadow-inner">${s.icon}</div>
                    <div>
                        <h4 class="text-white text-base font-bold mb-2">${s.title}</h4>
                        <p class="text-slate-400 text-xs leading-relaxed font-light">${s.desc}</p>
                    </div>
                </div>
            `).join('');
        }
    },
    renderHomeContent: () => {
        const c = SITE_CONFIG_DATA.content;
        if (!c) return;
        const painGrid = document.getElementById('pain-points-grid');
        if (painGrid && c.painPoints) {
            painGrid.innerHTML = c.painPoints.map((p, idx) => `
                <div class="glass-card p-8 sm:p-10 rounded-[32px] hover:border-cyan-500/30 transition-all duration-500 group shadow-xl hover:-translate-y-2 reveal-on-scroll" style="transition-delay: ${idx * 0.1}s">
                    <div class="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-inner border border-slate-700 group-hover:scale-110 transition-transform">${p.icon}</div>
                    <h4 class="text-xl font-bold mb-3 text-white tracking-tight">${p.title}</h4>
                    <p class="text-slate-400 text-sm leading-relaxed font-light">${p.desc}</p>
                </div>
            `).join('');
        }
        const solGrid = document.getElementById('solutions-grid');
        if (solGrid && c.industrySolutions) {
            solGrid.innerHTML = c.industrySolutions.map((s, idx) => {
                const tagsHtml = s.tags.map(t => `<span class="px-2.5 py-1 bg-cyan-950/50 text-cyan-300 border border-cyan-500/30 rounded-md text-[10px] font-mono shadow-sm">${t}</span>`).join('');
                return `
                    <div class="glass-card p-8 rounded-[32px] border-slate-700 hover:border-cyan-500/50 transition-all duration-500 group cursor-pointer shadow-xl hover:-translate-y-2 reveal-on-scroll" style="transition-delay: ${idx * 0.05}s" data-action="scroll-contact">
                        <h4 class="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors tracking-tight">${s.title}</h4>
                        <div class="flex flex-wrap gap-2 mb-5">${tagsHtml}</div>
                        <p class="text-sm text-slate-400 leading-relaxed font-light">${s.desc}</p>
                    </div>
                `;
            }).join('');
        }
        const metricsGrid = document.getElementById('metrics-grid');
        if (metricsGrid && c.metrics) {
            metricsGrid.innerHTML = c.metrics.map((m, idx) => `
                <div class="glass-card p-8 sm:p-10 rounded-[40px] text-center shadow-xl border-slate-700 reveal-on-scroll hover:border-cyan-500/30 transition-colors" style="transition-delay: ${idx * 0.1}s">
                    <div class="text-4xl sm:text-5xl font-black text-cyan-400 mb-3 font-mono drop-shadow-md">${m.value}${m.suffix}</div>
                    <div class="text-[11px] text-slate-500 font-bold uppercase tracking-widest">${m.label}</div>
                </div>
            `).join('');
        }
        const manifestoTitle = document.getElementById('manifesto-title'); const manifestoContent = document.getElementById('manifesto-content'); const manifestoSig = document.getElementById('manifesto-sig');
        if (c.manifesto && manifestoTitle && manifestoContent && manifestoSig) {
            manifestoTitle.innerHTML = c.manifesto.title; manifestoContent.innerHTML = c.manifesto.content; manifestoSig.innerHTML = c.manifesto.signature;
        }
        const testGrid = document.getElementById('testimonials-grid');
        if (testGrid && c.testimonials) {
            testGrid.innerHTML = c.testimonials.map((t, idx) => `
                <div class="glass-card p-8 sm:p-10 rounded-[40px] relative text-left shadow-2xl reveal-on-scroll hover:border-cyan-500/30 transition-all duration-500 hover:-translate-y-2" style="transition-delay: ${idx * 0.1}s">
                    <p class="text-slate-300 text-sm sm:text-base italic mb-10 leading-loose font-light">"${t.content}"</p>
                    <div class="flex items-center gap-5 pt-6 border-t border-slate-800">
                        <div class="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-lg shadow-inner">${t.color === 'cyan' ? '👩‍💼' : (t.color === 'pink' ? '🎬' : '👨‍⚕️')}</div>
                        <div>
                            <div class="text-white font-black text-base tracking-tight mb-0.5">${t.author}</div>
                            <div class="text-[10px] text-slate-500 font-mono uppercase tracking-widest">${t.title}</div>
                        </div>
                    </div>
                </div>
            `).join('');
        }
        const pb = document.getElementById('pricing-b-grid'); const cp = c.pricing;
        if (pb && cp) {
            const b_basic_features_html = cp.b_basic.features.map(f => `<p class="text-sm text-slate-400 flex items-center justify-center gap-2"><span class="text-cyan-600">✓</span> ${f}</p>`).join('');
            const b_pro_features_html = cp.b_pro.features.map(f => `<p class="text-sm text-cyan-100/90 font-bold flex items-center justify-center gap-2"><span class="text-cyan-300">✓</span> ${f}</p>`).join('');
            pb.innerHTML = `
                <div class="p-10 sm:p-14 rounded-[40px] glass-card text-center relative group hover:border-cyan-500/30 transition-all flex flex-col h-full shadow-2xl">
                    <h4 class="text-2xl font-black text-white mb-3 tracking-tight">${cp.b_basic.title}</h4>
                    <div class="text-6xl font-black text-white my-8 font-mono">¥${cp.b_basic.price}<span class="text-sm text-slate-500 font-normal block mt-3 font-sans uppercase tracking-widest">${cp.b_basic.desc}</span></div>
                    <div class="flex-1 mb-10 space-y-4">${b_basic_features_html}</div>
                    <button data-action="scroll-contact" class="w-full py-4 sm:py-5 rounded-2xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-colors mt-auto text-lg border border-slate-700 shadow-inner">选择基础交付</button>
                </div>
                <div class="p-10 sm:p-14 rounded-[40px] border-2 border-cyan-500 bg-cyan-950/20 relative shadow-[0_20px_60px_rgba(6,182,212,0.15)] text-center flex flex-col h-full">
                    <div class="absolute -top-4 left-1/2 -translate-x-1/2 bg-cyan-500 text-slate-950 text-xs font-black px-6 py-2 rounded-full shadow-lg tracking-widest uppercase">推荐中大型企业</div>
                    <h4 class="text-2xl font-black text-white mb-3 tracking-tight">${cp.b_pro.title}</h4>
                    <div class="text-6xl font-black text-white my-8 font-mono drop-shadow-md">¥${cp.b_pro.price}<span class="text-sm text-cyan-500/80 font-bold block mt-3 font-sans uppercase tracking-widest">${cp.b_pro.desc}</span></div>
                    <div class="flex-1 mb-10 space-y-4">${b_pro_features_html}</div>
                    <button data-action="scroll-contact" class="w-full py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black hover:scale-[1.02] transition-transform shadow-[0_10px_20px_rgba(6,182,212,0.4)] mt-auto text-lg border border-cyan-400/50">获取私有化全案</button>
                </div>
            `;
        }
        const pc = document.getElementById('pricing-c-grid');
        if (pc && cp) {
            const c_basic_features_html = cp.c_basic.features.map(f => `<p class="text-sm text-slate-400 flex items-center justify-center gap-2"><span class="text-pink-600">✓</span> ${f}</p>`).join('');
            const c_pro_features_html = cp.c_pro.features.map(f => `<p class="text-sm text-pink-100/90 font-bold flex items-center justify-center gap-2"><span class="text-pink-300">✓</span> ${f}</p>`).join('');
            pc.innerHTML = `
                <div class="p-10 sm:p-14 rounded-[40px] glass-card text-center border-slate-800 relative group hover:border-pink-500/30 transition-all flex flex-col h-full shadow-2xl">
                    <h4 class="text-2xl font-black text-white mb-3 font-serif tracking-tight">${cp.c_basic.title}</h4>
                    <div class="text-6xl font-black text-white my-8 font-mono">¥${cp.c_basic.price}<span class="text-sm text-slate-500 font-normal block mt-3 font-sans uppercase tracking-widest">${cp.c_basic.desc}</span></div>
                    <div class="flex-1 mb-10 space-y-4">${c_basic_features_html}</div>
                    <button data-action="scroll-contact" class="w-full py-4 sm:py-5 rounded-2xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-colors mt-auto text-lg border border-slate-700 shadow-inner">个人尝鲜定制</button>
                </div>
                <div class="p-10 sm:p-14 rounded-[40px] border-2 border-pink-500 bg-pink-950/20 relative shadow-[0_20px_60px_rgba(236,72,153,0.15)] text-center flex flex-col h-full">
                    <div class="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-black px-6 py-2 rounded-full shadow-[0_5px_15px_rgba(236,72,153,0.5)] tracking-widest uppercase border border-pink-300/50">IP 孵化首选</div>
                    <h4 class="text-2xl font-black text-white mb-3 font-serif tracking-tight">${cp.c_pro.title}</h4>
                    <div class="text-6xl font-black text-white my-8 font-mono drop-shadow-md">¥${cp.c_pro.price}<span class="text-sm text-pink-400/80 font-bold block mt-3 font-sans uppercase tracking-widest">${cp.c_pro.desc}</span></div>
                    <div class="flex-1 mb-10 space-y-4">${c_pro_features_html}</div>
                    <button data-action="scroll-contact" class="w-full py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-black hover:scale-[1.02] transition-transform shadow-[0_10px_30px_rgba(236,72,153,0.4)] mt-auto text-lg border border-pink-400/30">启动商业全案</button>
                </div>
            `;
        }
    },
    renderFAQs: function () {
        const faqList = document.getElementById('faq-list');
        if (faqList && SITE_CONFIG_DATA.content && Array.isArray(SITE_CONFIG_DATA.content.faqs)) {
            faqList.innerHTML = SITE_CONFIG_DATA.content.faqs.map(f => `
                <details class="group glass-card rounded-3xl overflow-hidden hover:border-slate-600 transition-colors mb-4">
                    <summary class="p-6 sm:p-8 font-bold text-white flex justify-between items-center cursor-pointer text-base sm:text-lg tracking-tight">
                        <span>${f.q}</span>
                        <span class="text-slate-500 group-open:rotate-180 transition-transform bg-slate-900 w-8 h-8 rounded-full flex items-center justify-center">↓</span>
                    </summary>
                    <div class="px-6 sm:px-8 pb-6 sm:pb-8 text-slate-400 text-sm leading-relaxed border-t border-slate-800/50 pt-5 font-light">${f.a}</div>
                </details>
            `).join('');
        }
    },
    renderGuarantees: function () {
        const grid = document.getElementById('guarantees-grid');
        if (grid && SITE_CONFIG_DATA.content && Array.isArray(SITE_CONFIG_DATA.content.guarantees)) {
            grid.innerHTML = SITE_CONFIG_DATA.content.guarantees.map((g, idx) => `
                <div class="flex gap-6 p-8 glass-card rounded-[32px] hover:bg-slate-900/80 transition-all duration-300 hover:-translate-y-1 shadow-lg reveal-on-scroll" style="transition-delay: ${idx * 0.1}s">
                    <span class="text-4xl bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center border border-slate-700 shadow-inner flex-shrink-0">${g.icon}</span>
                    <div>
                        <h5 class="text-lg font-bold text-white mb-2 tracking-tight">${g.title}</h5>
                        <p class="text-sm text-slate-400 leading-relaxed font-light">${g.desc}</p>
                    </div>
                </div>
            `).join('');
        }
    },
    renderBlogFilters: function () {
        const filterContainer = document.getElementById('blog-filters');
        if (!filterContainer || !SITE_CONFIG_DATA.blogs) return;
        const categories = ['全部', ...new Set(SITE_CONFIG_DATA.blogs.map(b => b.category))];
        filterContainer.innerHTML = categories.map(cat => `
            <button data-action="filter-blog" data-cat="${cat}" class="filter-btn px-6 sm:px-8 py-2.5 sm:py-3 rounded-full border text-xs sm:text-sm font-bold transition-all duration-300 focus:outline-none tracking-widest uppercase ${cat === '全部' ? 'border-cyan-500/50 text-cyan-300 bg-cyan-950/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white shadow-sm'}">${cat}</button>
        `).join('');
    },
    renderBlogPosts: function (category) {
        const grid = document.getElementById('blog-grid');
        if (!grid || !SITE_CONFIG_DATA.blogs) return;
        const filtered = category === '全部' ? SITE_CONFIG_DATA.blogs : SITE_CONFIG_DATA.blogs.filter(b => b.category === category);

        grid.innerHTML = filtered.map((b, index) => {
            const isFeatured = category === '全部' && b.featured && index === 0;
            const gridClass = isFeatured ? 'md:col-span-2 lg:col-span-2 xl:col-span-2 row-span-2' : 'col-span-1';
            const flexClass = isFeatured ? 'flex-col md:flex-row' : 'flex-col';
            const imgWrapperClass = isFeatured ? 'w-full md:w-1/2 relative min-h-[240px] md:min-h-[auto] shrink-0' : 'w-full relative h-48 sm:h-56 shrink-0';
            const contentWrapperClass = isFeatured ? 'w-full md:w-1/2 p-8 sm:p-10 lg:p-14 flex flex-col justify-center flex-1' : 'w-full p-6 sm:p-8 flex flex-col flex-1';
            const titleClass = isFeatured ? 'text-2xl sm:text-3xl lg:text-4xl mb-4 sm:mb-6 leading-tight' : 'text-lg sm:text-xl mb-3 sm:mb-4 leading-snug';
            const summaryClass = isFeatured ? 'text-sm sm:text-base line-clamp-3 lg:line-clamp-5 mb-8 lg:mb-10' : 'text-xs sm:text-sm line-clamp-3 mb-6 sm:mb-8';

            return `
                <button data-action="open-blog" data-id="${b.id}" class="glass-card rounded-[32px] sm:rounded-[40px] overflow-hidden flex ${flexClass} hover:-translate-y-2 transition-all duration-500 shadow-xl cursor-pointer blog-card-enter ${gridClass} group border border-slate-700 hover:border-cyan-500/40 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] text-left focus:outline-none h-full w-full" style="animation-delay: ${index * 0.1}s" aria-label="阅读文章 ${b.title}">
                    <div class="${imgWrapperClass}">
                        <div class="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors z-10 pointer-events-none"></div>
                        <img src="${b.image}" loading="lazy" decoding="async" class="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" alt="${b.title}">
                        <div class="absolute top-4 left-4 sm:top-5 sm:left-5 bg-slate-950/80 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-lg border border-slate-700/50 text-[10px] font-black text-white uppercase tracking-widest shadow-lg z-20">${b.category}</div>
                    </div>
                    <div class="${contentWrapperClass}">
                        <div class="flex items-center gap-3 mb-4 sm:mb-5 text-[9px] sm:text-[10px] text-slate-400 font-mono uppercase tracking-widest font-bold shrink-0">
                            <span class="bg-slate-900 px-2 py-1 rounded border border-slate-800">${b.date}</span>
                            <span class="flex items-center gap-1.5 text-cyan-500">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>${b.readTime || '5 min read'}
                            </span>
                        </div>
                        <h5 class="${titleClass} font-black text-white group-hover:text-cyan-400 transition-colors tracking-tight">${b.title}</h5>
                        <p class="text-slate-400 ${summaryClass} leading-relaxed font-light">${b.summary}</p>
                        <div class="mt-auto flex items-center gap-3 sm:gap-4 pt-5 sm:pt-6 border-t border-slate-800/80 w-full shrink-0">
                            <img src="${SITE_CONFIG_DATA.founder ? SITE_CONFIG_DATA.founder.avatar : ''}" class="w-8 h-8 rounded-xl object-cover border border-slate-700 shadow-inner shrink-0" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=100&auto=format&fit=crop';">
                            <div class="min-w-0 flex-1">
                                <span class="block text-[11px] sm:text-xs font-bold text-slate-200 mb-0.5 truncate">${SITE_CONFIG_DATA.founder ? SITE_CONFIG_DATA.founder.name : 'Author'}</span>
                                <span class="block text-[8px] sm:text-[9px] text-slate-500 font-mono uppercase tracking-widest truncate">Architect</span>
                            </div>
                            <span class="ml-auto shrink-0 text-[9px] sm:text-[10px] font-black text-cyan-500 group-hover:translate-x-2 transition-transform bg-cyan-950/30 px-3 py-1.5 rounded-lg border border-cyan-900/50 hidden sm:block">READ MORE →</span>
                        </div>
                    </div>
                </button>
            `;
        }).join('');

        document.querySelectorAll('#blog-filters .filter-btn').forEach(function (el) {
            const c = el.getAttribute('data-cat');
            el.className = `filter-btn px-6 sm:px-8 py-2.5 sm:py-3 rounded-full border text-xs sm:text-sm font-bold transition-all duration-300 focus:outline-none tracking-widest uppercase ${c === category ? 'border-cyan-500/50 text-cyan-300 bg-cyan-950/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white shadow-sm'}`;
        });
    },
    renderDiagnosisModal: function (data, type = "申请提效诊断") {
        const diagContent = document.getElementById('diag-analysis');
        const wfContainer = document.getElementById('diag-workflow');

        const modalTitle = document.getElementById('diag-result-title');
        const section1Title = document.getElementById('diag-result-section1');
        const section2Title = document.getElementById('diag-result-section2');
        const footerText = document.getElementById('diag-result-footer');
        const closeBtn = document.getElementById('diag-result-close-btn');

        if (modalTitle) {
            if (type === "商务合作咨询") modalTitle.innerText = "合作意向受理回执";
            else if (type === "预约一对一咨询") modalTitle.innerText = "专家预约状态确认";
            else modalTitle.innerText = "自动化诊断分析报告";
        }

        if (section1Title) {
            if (type === "商务合作咨询") section1Title.innerHTML = `<span class="text-xl">📍</span> 意向初步评估`;
            else if (type === "预约一对一咨询") section1Title.innerHTML = `<span class="text-xl">📍</span> 档期分配提示`;
            else section1Title.innerHTML = `<span class="text-xl">📍</span> 业务痛点分析`;
        }

        if (section2Title) {
            if (type === "商务合作咨询") section2Title.innerHTML = `<span class="text-xl">⚡</span> 后续跟进流程`;
            else if (type === "预约一对一咨询") section2Title.innerHTML = `<span class="text-xl">⚡</span> 咨询准备流程`;
            else section2Title.innerHTML = `<span class="text-xl">⚙️</span> 自动化架构与节点编排建议`;
        }

        if (footerText) {
            if (type === "商务合作咨询") footerText.innerText = "主理人已收到您的合作意向，将在 24 小时内与您联系。";
            else if (type === "预约一对一咨询") footerText.innerText = "专家已收到您的预约，将尽快为您安排档期。";
            else footerText.innerText = "主理人已收到此份报告，将与您做进一步沟通。";
        }

        if (closeBtn) {
            if (type === "商务合作咨询") closeBtn.innerText = "关闭回执";
            else if (type === "预约一对一咨询") closeBtn.innerText = "关闭确认单";
            else closeBtn.innerText = "关闭报告";
        }

        if (diagContent) diagContent.innerHTML = data.diagnosis || "暂无描述。";
        if (wfContainer) {
            wfContainer.innerHTML = '';
            if (data.workflow && Array.isArray(data.workflow)) {
                wfContainer.innerHTML = data.workflow.map(function (step, index) {
                    return `<div class="px-6 py-5 bg-slate-900/80 border border-slate-800 rounded-3xl text-sm text-slate-300 flex items-center gap-5 hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-1 shadow-md"><span class="w-10 h-10 rounded-xl bg-cyan-950 flex items-center justify-center font-black text-cyan-400 border border-cyan-800/50 flex-shrink-0 shadow-inner">${index + 1}</span>${step}</div>`;
                }).join('');
            }
        }
        const diagModal = document.getElementById('diagnosis-modal');
        if (diagModal) { diagModal.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
    },
    initCharts: function () {
        if (typeof Chart === 'undefined') return;
        const ctxRev = document.getElementById('chart-rev'); const ctxAlloc = document.getElementById('chart-alloc');
        if (!ctxRev || !ctxAlloc) return;

        const ctxRev2d = ctxRev.getContext('2d');
        const ctxAlloc2d = ctxAlloc.getContext('2d');
        if (!ctxRev2d || !ctxAlloc2d) {
            console.warn("Canvas 2D Context not available in this environment.");
            return;
        }

        if (chartRevInstance) chartRevInstance.destroy();
        if (chartAllocInstance) chartAllocInstance.destroy();

        Chart.defaults.font.family = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
        Chart.defaults.color = '#64748b';

        const currentData = DASHBOARD_DATA[currentDashboardCat] || DASHBOARD_DATA.all;

        chartRevInstance = new Chart(ctxRev2d, {
            type: 'bar',
            data: {
                labels: currentData.rev.labels,
                datasets: currentData.rev.datasets
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { boxWidth: 10, font: { size: 10, weight: 'bold' }, padding: 15 } } }, scales: { y: { stacked: true, grid: { color: 'rgba(30, 41, 59, 0.5)', borderDash: [4, 4] }, border: { display: false } }, x: { stacked: true, grid: { display: false }, border: { color: 'rgba(51, 65, 85, 0.5)' } } } }
        });

        chartAllocInstance = new Chart(ctxAlloc2d, {
            type: 'doughnut',
            data: {
                labels: currentData.alloc.labels,
                datasets: [{
                    data: currentData.alloc.data,
                    backgroundColor: currentData.alloc.colors,
                    borderWidth: 3,
                    borderColor: '#020617',
                    hoverOffset: 4
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, cutout: '75%', plugins: { legend: { position: 'right', labels: { boxWidth: 10, font: { size: 11, weight: 'bold' }, padding: 15 } } } }
        });
    }
};

const Handlers = {
    scrollToContact: function () {
        const el = document.getElementById('contact');
        if (el) {
            const navHeight = document.getElementById('main-nav') ? document.getElementById('main-nav').offsetHeight : 80;
            const elementPosition = el.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: elementPosition - navHeight, behavior: 'smooth' });
        }
    },
    switchView: function (id) {
        document.querySelectorAll('.view-section').forEach(v => v.classList.remove('active'));
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        const targetView = document.getElementById('view-' + id);
        if (targetView) targetView.classList.add('active');
        const link = document.querySelector(`.nav-link[data-view="${id}"]`);
        if (link) link.classList.add('active');
        document.body.style.backgroundColor = (id === 'moying') ? '#0f0514' : (id === 'masheng' ? '#020617' : 'var(--bg-dark)');
        Handlers.toggleMobileMenu(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (id === 'dashboard') { setTimeout(Renderers.initCharts, 150); }
        setTimeout(() => {
            document.querySelectorAll('.reveal-on-scroll:not(.is-visible)').forEach(el => {
                if (el.getBoundingClientRect().top <= window.innerHeight) el.classList.add('is-visible');
            });
        }, 300);
    },
    filterDashboard: function (category) {
        currentDashboardCat = category;
        const catColors = {
            all: { color: 'cyan', rgb: '6,182,212' },
            local: { color: 'emerald', rgb: '16,185,129' },
            creator: { color: 'pink', rgb: '236,72,153' },
            workedu: { color: 'amber', rgb: '245,158,11' },
            enterprise: { color: 'blue', rgb: '59,130,246' }
        };

        // 1. Update button styles
        document.querySelectorAll('#dashboard-filters .db-filter-btn').forEach(btn => {
            const btnCat = btn.getAttribute('data-cat');
            if (btnCat === category) {
                btn.className = `db-filter-btn active px-4 py-2 rounded-lg border border-${catColors[btnCat].color}-500/50 text-${catColors[btnCat].color}-300 bg-${catColors[btnCat].color}-950/50 text-xs font-bold transition-all shadow-[0_0_15px_rgba(${catColors[btnCat].rgb},0.3)] focus:outline-none`;
            } else {
                btn.className = `db-filter-btn px-4 py-2 rounded-lg border border-slate-700 text-slate-400 hover:text-${catColors[btnCat].color}-400 hover:border-${catColors[btnCat].color}-500/50 bg-slate-900/50 text-xs font-bold transition-all focus:outline-none`;
            }
        });

        // 2. Update Stats with dynamic fade/zoom animation for premium feel
        const stat1 = document.getElementById('dash-stat-1');
        const stat2 = document.getElementById('dash-stat-2');
        const data = DASHBOARD_DATA[category] || DASHBOARD_DATA.all;

        if (stat1 && stat2) {
            stat1.style.transition = 'all 0.15s ease-out';
            stat2.style.transition = 'all 0.15s ease-out';
            stat1.style.opacity = '0';
            stat1.style.transform = 'scale(0.95)';
            stat2.style.opacity = '0';
            stat2.style.transform = 'scale(0.95)';

            setTimeout(() => {
                stat1.innerText = data.stats.concur;
                stat2.innerText = data.stats.peak;

                // Tailored neon shadow colors for stats based on selected category!
                const neonColor = catColors[category].rgb;
                stat1.style.textShadow = `0 0 10px rgba(${neonColor}, 0.5)`;
                stat2.style.textShadow = `0 0 10px rgba(${neonColor}, 0.5)`;

                stat1.style.opacity = '1';
                stat1.style.transform = 'scale(1)';
                stat2.style.opacity = '1';
                stat2.style.transform = 'scale(1)';
            }, 150);
        }

        // 3. Update Chart data and update smoothly
        if (chartRevInstance && chartAllocInstance) {
            // Update bar chart datasets & labels
            chartRevInstance.data.labels = data.rev.labels;
            chartRevInstance.data.datasets = data.rev.datasets;
            chartRevInstance.update();

            // Update doughnut chart
            chartAllocInstance.data.labels = data.alloc.labels;
            chartAllocInstance.data.datasets[0].data = data.alloc.data;
            chartAllocInstance.data.datasets[0].backgroundColor = data.alloc.colors;
            chartAllocInstance.update();
        } else {
            // Fallback if chart instances are not initialized yet
            Renderers.initCharts();
        }
    },
    toggleMobileMenu: function (show) { const drawer = document.getElementById('mobile-drawer'); if (drawer) drawer.classList.toggle('-translate-x-full', !show); },
    openDiagnosis: function (type = "申请提效诊断") {
        const el = document.getElementById('diagnosis-input-modal');
        if (el) {
            const titleEl = document.getElementById('diagnosis-modal-title');
            if (titleEl) titleEl.innerText = type;
            const typeInput = document.getElementById('diag-type');
            if (typeInput) typeInput.value = type;
            const btnText = document.getElementById('diag-btn-text');
            if (btnText) btnText.innerText = type === "申请提效诊断" ? "开始 AI 诊断" : "提交预约申请";

            const extraFields = document.getElementById('diag-extra-fields');
            if (extraFields) {
                if (type === "预约一对一咨询") {
                    extraFields.classList.remove('hidden');
                } else {
                    extraFields.classList.add('hidden');
                }
            }

            el.style.display = 'flex';
            setTimeout(() => el.style.opacity = '1', 10);
            document.body.style.overflow = 'hidden';

            // 重置进度条和消息框状态
            const progressContainer = document.getElementById('diag-progress-container');
            if (progressContainer) {
                progressContainer.classList.add('hidden');
                const progressBar = document.getElementById('diag-progress-bar');
                if (progressBar) progressBar.style.width = '0%';
                const progressPct = document.getElementById('diag-progress-pct');
                if (progressPct) progressPct.innerText = '0%';
            }
            const msgBox = document.getElementById('diag-msg');
            if (msgBox) msgBox.classList.add('hidden');

            const submitBtn = document.getElementById('diag-submit-btn');
            if (submitBtn) submitBtn.disabled = false;
            const loader = document.getElementById('diag-btn-loader');
            if (loader) loader.classList.add('hidden');

            setTimeout(() => { const input = document.getElementById('diag-name'); if (input) input.focus(); }, 100);
        }
    },
    closeDiagnosisInputModal: function () {
        const el = document.getElementById('diagnosis-input-modal');
        if (el) { el.style.opacity = '0'; setTimeout(() => { el.style.display = 'none'; document.body.style.overflow = ''; }, 300); }
    },
    closeDiagnosisResult: function () { const el = document.getElementById('diagnosis-modal'); if (el) { el.style.display = 'none'; document.body.style.overflow = ''; } },
    openAgent: function (t, uKey) {
        if (!SITE_CONFIG_DATA.agents) return;
        Handlers.toggleMobileMenu(false); // Fix: close mobile menu when opening an agent
        const u = uKey.startsWith('http') ? uKey : SITE_CONFIG_DATA.agents[uKey];
        const titleEl = document.getElementById('modal-title'); const frameEl = document.getElementById('modal-frame'); const modalEl = document.getElementById('agent-modal');
        if (titleEl) titleEl.innerText = t;
        if (frameEl) {
            frameEl.srcdoc = '';
            frameEl.src = u || '';
        }
        if (modalEl) {
            modalEl.style.display = 'flex';
            setTimeout(() => modalEl.style.opacity = '1', 10);
            document.body.style.overflow = 'hidden';
        }
    },
    closeAgent: function () {
        const modalEl = document.getElementById('agent-modal');
        if (modalEl) {
            modalEl.style.opacity = '0';
            setTimeout(() => {
                modalEl.style.display = 'none';
                document.body.style.overflow = '';
                const frameEl = document.getElementById('modal-frame');
                if (frameEl) frameEl.src = '';
            }, 300);
        }
    },
    openMusic: function () { const m = document.getElementById('musicModal'); if (m) { m.style.display = 'flex'; document.body.style.overflow = 'hidden'; } },
    closeMusic: function () { const m = document.getElementById('musicModal'); if (m) { m.style.display = 'none'; document.body.style.overflow = ''; } const el = document.getElementById('audioEl'); if (el && !el.paused) Handlers.toggleAudio(); },
    toggleAudio: function () {
        const el = document.getElementById('audioEl'); const btn = document.getElementById('playBtn'); const disc = document.getElementById('disc');
        if (!el || !btn || !disc) return;
        if (isAudioPlaying) { el.pause(); btn.innerHTML = '▶'; btn.classList.remove('pb-1', 'pl-1'); disc.classList.remove('animate-spin-slow', 'shadow-[0_0_30px_rgba(236,72,153,0.3)]'); }
        else { el.play(); btn.innerHTML = '⏸'; btn.classList.add('pb-1', 'pl-1'); disc.classList.add('animate-spin-slow', 'shadow-[0_0_30px_rgba(236,72,153,0.3)]'); }
        isAudioPlaying = !isAudioPlaying;
    },
    openBlog: function (id) {
        if (!SITE_CONFIG_DATA.blogs) return;
        const b = SITE_CONFIG_DATA.blogs.find(x => x.id === id);
        if (!b) return;
        const img = document.getElementById('blog-modal-img'); if (img) img.src = b.image;
        const cat = document.getElementById('blog-modal-category'); if (cat) cat.innerText = b.category;
        const dt = document.getElementById('blog-modal-date'); if (dt) dt.innerText = b.date;
        const title = document.getElementById('blog-modal-title'); if (title) title.innerText = b.title;
        const author = document.getElementById('blog-modal-author'); if (author && SITE_CONFIG_DATA.founder) author.innerText = SITE_CONFIG_DATA.founder.name;
        const avatar = document.getElementById('blog-modal-avatar'); if (avatar && SITE_CONFIG_DATA.founder) avatar.src = SITE_CONFIG_DATA.founder.avatar;
        const content = document.getElementById('blog-modal-content'); if (content) content.innerHTML = b.content;
        const modal = document.getElementById('blog-modal'); if (modal) { modal.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
    },
    closeBlog: function () { const m = document.getElementById('blog-modal'); if (m) { m.style.display = 'none'; document.body.style.overflow = ''; } },
    openPolicy: function (type) {
        const policy = SITE_CONFIG_DATA.policies && SITE_CONFIG_DATA.policies[type];
        if (!policy) return;
        const titleEl = document.getElementById('policy-modal-title'); if (titleEl) titleEl.innerText = policy.title;
        const contentEl = document.getElementById('policy-modal-content'); if (contentEl) contentEl.innerHTML = policy.content;
        const m = document.getElementById('policy-modal'); if (m) { m.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
    },
    closePolicy: function () { const m = document.getElementById('policy-modal'); if (m) { m.style.display = 'none'; document.body.style.overflow = ''; } },
    openGallery: function (id) {
        if (!SITE_CONFIG_DATA.gallery) return;
        const item = SITE_CONFIG_DATA.gallery.find(i => i.id === id);
        if (!item) return;
        const imgEl = document.getElementById('gallery-modal-img'); if (imgEl) imgEl.src = item.image;
        const catEl = document.getElementById('gallery-modal-category'); if (catEl) catEl.innerText = item.category;
        const engEl = document.getElementById('gallery-modal-engine'); if (engEl) engEl.innerText = item.engine;
        const titleEl = document.getElementById('gallery-modal-title'); if (titleEl) titleEl.innerText = item.title;
        const promptEl = document.getElementById('gallery-modal-prompt'); if (promptEl) promptEl.innerText = item.prompt;
        const paramsEl = document.getElementById('gallery-modal-params'); if (paramsEl) paramsEl.innerText = item.params;
        const modalEl = document.getElementById('gallery-modal'); if (modalEl) { modalEl.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
    },
    closeGallery: function () { const m = document.getElementById('gallery-modal'); if (m) { m.style.display = 'none'; document.body.style.overflow = ''; } },
    openQRCode: function (platform) {
        if (!SITE_CONFIG_DATA.media || !SITE_CONFIG_DATA.media.social) return;
        const data = SITE_CONFIG_DATA.media.social[platform];
        if (!data) return;
        document.getElementById('qr-modal-title').innerText = data.title;
        document.getElementById('qr-modal-desc').innerText = data.desc;
        document.getElementById('qr-modal-icon').innerText = data.icon;
        document.getElementById('qr-modal-img').src = data.qrUrl;
        const iconContainer = document.getElementById('qr-modal-icon');
        iconContainer.className = `w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-inner border ${data.bgClass} ${data.colorClass} ${data.borderClass}`;
        const m = document.getElementById('qrcode-modal');
        if (m) { m.style.display = 'flex'; setTimeout(() => m.style.opacity = '1', 10); document.body.style.overflow = 'hidden'; }
    },
    closeQRCode: function () {
        const m = document.getElementById('qrcode-modal');
        if (m) { m.style.opacity = '0'; setTimeout(() => { m.style.display = 'none'; document.body.style.overflow = ''; }, 300); }
    },
    toggleSandboxTag: function (btnEl) {
        const container = btnEl.parentElement;
        container.querySelectorAll('.sb-tag').forEach(b => {
            b.classList.remove('bg-pink-900/30', 'border-pink-500', 'text-pink-300', 'bg-cyan-900/30', 'border-cyan-500', 'text-cyan-300');
        });
        if (container.id === 'sandbox-subject') btnEl.classList.add('bg-pink-900/30', 'border-pink-500', 'text-pink-300');
        else btnEl.classList.add('bg-cyan-900/30', 'border-cyan-500', 'text-cyan-300');
    },
    runSandboxGeneration: function () {
        const btn = document.getElementById('btn-generate-art');
        const loader = document.getElementById('generate-loader');
        const text = document.getElementById('generate-text');
        const idle = document.getElementById('sandbox-idle');
        const terminal = document.getElementById('sandbox-terminal');
        const termContent = document.getElementById('terminal-content');
        const resultContainer = document.getElementById('sandbox-result');

        if (btn.disabled) return;

        const subjBtn = document.querySelector('#sandbox-subject .border-pink-500') || document.querySelector('#sandbox-subject .sb-tag');
        const lightBtn = document.querySelector('#sandbox-lighting .border-cyan-500') || document.querySelector('#sandbox-lighting .sb-tag');
        const subj = subjBtn ? subjBtn.innerText : "意象";
        const light = lightBtn ? lightBtn.innerText : "光影";

        let mockData = SITE_CONFIG_DATA.sandboxMocks[0];
        const matchedData = SITE_CONFIG_DATA.sandboxMocks.find(m => m.keywords.includes(subj) && m.keywords.includes(light));
        if (matchedData) mockData = matchedData;

        btn.disabled = true;
        btn.classList.add('opacity-50');
        text.innerText = "Agent 架构运算中...";
        loader.classList.remove('hidden');
        idle.classList.add('hidden');
        resultContainer.classList.add('hidden');
        resultContainer.classList.remove('opacity-100');
        terminal.classList.remove('hidden');
        termContent.innerHTML = '';

        const logs = [
            `> [System] Receiving user intent: [${subj}] + [${light}]`,
            `> [Agent] Initializing Midjourney Prompt Engineering Module...`,
            `> [Agent] Expanding base semantics into cinematic descriptors...`,
            `> [Agent] Applying lighting constraints: Volumetric, Ray traced...`,
            `> [API] Pushing prompt payload to MJ v6.0 engine...`,
            `> [Render] Generating... 25%... 65%... 100%`,
            `> [System] Image upscaled and ready.`
        ];

        let delay = 0;
        logs.forEach((log, index) => {
            setTimeout(() => {
                let color = 'text-green-500';
                if (log.includes('[Agent]')) color = 'text-purple-400';
                if (log.includes('[API]')) color = 'text-cyan-400';
                termContent.insertAdjacentHTML('beforeend', `<div class="${color} animate-[slideUpIn_0.2s_forwards]">> ${log}</div>`);

                if (index === logs.length - 1) {
                    setTimeout(() => {
                        terminal.classList.add('hidden');
                        document.getElementById('sandbox-img').src = mockData.resultImg;
                        document.getElementById('sandbox-final-prompt').innerText = mockData.prompt;
                        resultContainer.classList.remove('hidden');
                        setTimeout(() => { resultContainer.classList.add('opacity-100'); }, 50);
                        btn.disabled = false;
                        btn.classList.remove('opacity-50');
                        text.innerText = "一键接入渲染引擎";
                        loader.classList.add('hidden');
                    }, 800);
                }
            }, delay);
            delay += 400 + Math.random() * 300;
        });
    },
    toggleCs: function (state) {
        const panel = document.getElementById('cs-panel'); const frame = document.getElementById('cs-frame'); const loader = document.getElementById('cs-loader');
        if (!panel || !frame || !loader) return;
        isCsOpen = typeof state === 'boolean' ? state : !isCsOpen;
        if (isCsOpen) {
            panel.classList.add('open'); panel.classList.remove('hidden');
            if (!frame.src || frame.src === window.location.href) {
                const url = SITE_CONFIG_DATA.agents && SITE_CONFIG_DATA.agents.floatingCs;
                if (url && !url.includes('YOUR_')) {
                    loader.classList.remove('hidden');
                    frame.src = url;
                    frame.onload = function () { loader.classList.add('hidden'); };
                } else {
                    loader.innerHTML = '<div class="text-xs text-slate-500 text-center px-8 leading-relaxed"><span class="text-2xl block mb-2">🔌</span>智能客服端点未接入<br/>请配置 Dify / n8n URL</div>';
                }
            }
        } else { panel.classList.remove('open'); setTimeout(() => { if (!isCsOpen) panel.classList.add('hidden'); }, 400); }
    },
    showSolution: function (id) {
        if (!SITE_CONFIG_DATA.demands) return;
        const d = SITE_CONFIG_DATA.demands.find(x => x.id === id);
        const content = document.getElementById('dash-sol-content'); const placeholder = document.getElementById('dash-sol-placeholder'); const terminal = document.getElementById('dash-sol-terminal');
        if (!content || !placeholder || !terminal || !d) return;

        placeholder.style.display = 'none'; content.classList.remove('hidden');
        if (document.getElementById('dash-sol-title')) document.getElementById('dash-sol-title').innerText = d.title;
        if (document.getElementById('dash-sol-req')) document.getElementById('dash-sol-req').innerText = `"${d.req}"`;
        if (document.getElementById('dash-sol-roi')) document.getElementById('dash-sol-roi').innerText = d.roi;

        logTimeouts.forEach(clearTimeout); logTimeouts = []; terminal.innerHTML = '';

        const logs = [
            `[${new Date().toISOString()}] Initiating AIMSZN Neural Engine...`,
            `[INFO] Target Protocol: ${d.title}`,
            '[System] Agent Swarm awakened. Analyzing intent...'
        ].concat(d.workflow).concat([
            '[Audit] Safety & Alignment check passed.',
            `[SUCCESS] Workflow executed. Delivered Value: ${d.roi}.`
        ]);

        let delay = 0;
        logs.forEach((log, index) => {
            const timeout = setTimeout(() => {
                let colorClass = 'text-green-400/90';
                if (log.includes('🧠') || log.includes('🔍')) colorClass = 'text-purple-400';
                if (log.includes('✍️') || log.includes('🎨') || log.includes('💻')) colorClass = 'text-cyan-400 font-bold';
                if (log.includes('📲') || log.includes('📨') || log.includes('🚀')) colorClass = 'text-pink-400 font-bold';
                if (log.includes('Audit')) colorClass = 'text-amber-400';
                if (log.includes('SUCCESS')) colorClass = 'text-green-500 font-black';

                let finalLog = log;
                if (index > 2 && index < logs.length - 2) {
                    finalLog = `<span class="text-slate-500 mr-2">>></span>${log}`;
                } else {
                    finalLog = `➤ ${log}`;
                }

                terminal.insertAdjacentHTML('beforeend', `<span class="${colorClass} block mb-2 opacity-0 animate-[slideUpIn_0.2s_forwards]">${finalLog}</span>`);
                terminal.scrollTop = terminal.scrollHeight;
            }, delay);
            logTimeouts.push(timeout);
            delay += Math.random() * 600 + 400;
        });
    },
    calculateROI: function () {
        const empInput = document.getElementById('roi-emp');
        const salInput = document.getElementById('roi-sal');
        if (!empInput || !salInput) return;

        const emp = parseInt(empInput.value);
        const sal = parseInt(salInput.value);

        // 动态获取当前选中的行业倍数
        const activeInd = document.querySelector('#roi-industry .ind-btn.active');
        const multiplier = activeInd ? parseFloat(activeInd.getAttribute('data-multiplier')) : 1.5;

        const yearlyCost = emp * sal * 12;
        // AI 提效带来的净省成本 = 原成本 * (1 - 1/效率因子)
        const savings = Math.floor(yearlyCost * (1 - 1 / multiplier));

        if (document.getElementById('val-emp')) document.getElementById('val-emp').innerText = emp;
        if (document.getElementById('val-sal')) document.getElementById('val-sal').innerText = sal;
        if (document.getElementById('val-yearly-cost')) document.getElementById('val-yearly-cost').innerText = yearlyCost.toLocaleString();
        if (document.getElementById('val-savings')) document.getElementById('val-savings').innerText = `¥ ${savings.toLocaleString()}`;
    },
    calculateROIC: function () {
        const count = document.getElementById('roi-c-count') ? document.getElementById('roi-c-count').value : 5;
        const cCost = document.getElementById('roi-c-cost') ? document.getElementById('roi-c-cost').value : 200;
        const traditionalCost = count * cCost * 30;
        if (document.getElementById('val-c-count')) document.getElementById('val-c-count').innerText = count;
        if (document.getElementById('val-c-cost')) document.getElementById('val-c-cost').innerText = cCost;
        if (document.getElementById('val-c-monthly-cost')) document.getElementById('val-c-monthly-cost').innerText = `¥${traditionalCost.toLocaleString()}`;
        const aiCost = traditionalCost > 0 ? Math.max(899, Math.floor(899 + traditionalCost * 0.02)) : 0;
        if (document.getElementById('val-c-savings')) document.getElementById('val-c-savings').innerText = `¥${aiCost.toLocaleString()}`;
    },
    handleGeneralContact: async function (e) {
        e.preventDefault();

        const name = document.getElementById('contact-name').value;
        const contact = document.getElementById('contact-contact').value;
        const selectEl = document.getElementById('contact-type');
        const type = selectEl.options[selectEl.selectedIndex].text;
        const desc = document.getElementById('contact-desc').value;

        const btn = document.getElementById('contact-submit-btn');
        const btnText = document.getElementById('contact-btn-text');
        const loader = document.getElementById('contact-btn-loader');
        const msgBox = document.getElementById('contact-msg');

        // Fallback to n8n webhook if site config doesn't have it defined
        const webhookUrl = window.MSZN_GLOBAL_CONFIG?.api?.n8nWebhook || SITE_CONFIG_DATA.api.n8nWebhook || 'http://192.168.1.58:5678/webhook/efficiency-diagnosis';

        if (btn) btn.disabled = true;
        if (btnText) btnText.innerText = "正在提交需求...";
        if (loader) loader.classList.remove('hidden');
        if (msgBox) msgBox.classList.add('hidden');

        try {
            const payload = {
                consultType: '商务合作咨询',
                form_name: name,
                form_contact: contact,
                form_desc: `[${type}] ${desc}`
            };

            let timeoutId;
            const fetchPromise = fetch(webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).catch(() => { });
            const timeoutPromise = new Promise((_, reject) => { timeoutId = setTimeout(() => reject(new Error('TIMEOUT')), 60000); });
            const response = await Promise.race([fetchPromise, timeoutPromise]);
            clearTimeout(timeoutId);

            if (response && response.ok) {
                if (msgBox) {
                    msgBox.innerHTML = "✅ 合作需求已成功提交，AI终端正在处理，主理人将尽快与您联系。";
                    msgBox.className = "text-sm text-center mt-6 font-bold p-4 rounded-xl bg-green-500/20 text-green-400 border border-green-500/30 block";
                    msgBox.classList.remove('hidden');
                    setTimeout(() => msgBox.classList.add('hidden'), 8000);
                }
                e.target.reset();
            } else {
                throw new Error('API Error');
            }
        } catch (error) {
            if (msgBox) {
                msgBox.innerHTML = `⚠️ <b>网络超时或接口异常：</b><br>无法连接至自动化网关，请直接添加主理人微信获取支持。`;
                msgBox.className = "text-sm text-center mt-6 font-bold p-4 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 block";
                msgBox.classList.remove('hidden');
            }
        } finally {
            if (btn) btn.disabled = false;
            if (btnText) btnText.innerText = "发送合作意向";
            if (loader) loader.classList.add('hidden');
        }
    },
    submitToN8n: async function (e) {
        e.preventDefault();

        // 防御 1: 浏览器本地冷却时间 (10分钟)
        const lastSubmitTime = localStorage.getItem('mszn_last_submit_time');
        if (lastSubmitTime && (Date.now() - parseInt(lastSubmitTime)) < 10 * 60 * 1000) {
            alert('您提交得太频繁啦，请休息一下稍后再试！');
            return;
        }

        const form = e.target;

        const name = document.getElementById('diag-name').value.trim();
        const contact = document.getElementById('diag-contact').value.trim();
        const desc = document.getElementById('diag-req').value.trim();

        // 防御 3: 严苛的正则校验 (手机号 11 位 或 标准邮箱)
        const contactRegex = /^1[3-9]\d{9}$|^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!contactRegex.test(contact)) {
            alert('请填写正确的11位手机号码或有效邮箱！');
            return;
        }
        if (desc.length > 500) {
            alert('需求描述过长，最多允许500字。');
            return;
        }

        const btn = document.getElementById('diag-submit-btn');
        const btnText = document.getElementById('diag-btn-text');
        const loader = document.getElementById('diag-btn-loader');
        const msgBox = document.getElementById('diag-msg');
        const webhookUrl = window.MSZN_GLOBAL_CONFIG?.api?.n8nWebhook || SITE_CONFIG_DATA.api.n8nWebhook || 'http://192.168.1.58:5678/webhook/efficiency-diagnosis';

        if (btn) btn.disabled = true;
        if (btnText) btnText.innerText = "连接审计架构中...";
        if (loader) loader.classList.remove('hidden');
        if (msgBox) msgBox.classList.add('hidden');

        let progressContainer = document.getElementById('diag-progress-container');
        if (!progressContainer && msgBox) {
            progressContainer = document.createElement('div');
            progressContainer.id = 'diag-progress-container';
            progressContainer.className = 'w-full mt-5 hidden';
            progressContainer.innerHTML = `
                <div class="bg-slate-800/60 backdrop-blur-md border border-cyan-500/20 rounded-xl p-4 sm:p-5 shadow-[0_0_20px_rgba(6,182,212,0.15)] relative overflow-hidden group">
                    <div class="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 animate-pulse opacity-50"></div>
                    <div class="flex justify-between items-center mb-3.5 relative z-10">
                        <div class="flex items-center gap-3">
                            <div class="relative flex items-center justify-center w-6 h-6">
                                <svg class="animate-spin h-5 w-5 text-cyan-400 absolute" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                            <span id="diag-progress-text" class="text-sm sm:text-base font-semibold text-cyan-200 tracking-wide drop-shadow-md">连接审计架构中...</span>
                        </div>
                        <span id="diag-progress-pct" class="text-base sm:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-fuchsia-400 drop-shadow-sm">0%</span>
                    </div>
                    <div class="w-full h-3 bg-slate-900 rounded-full overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] border border-slate-700/60 relative z-10">
                        <div id="diag-progress-bar" class="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-fuchsia-500 rounded-full transition-all duration-300 ease-out relative" style="width: 0%; box-shadow: 0 0 10px rgba(6,182,212,0.5);">
                            <div class="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            `;
            msgBox.parentNode.insertBefore(progressContainer, msgBox);
        }

        try {
            const consultType = document.getElementById('diag-type') ? document.getElementById('diag-type').value : '申请提效诊断';
            const extraFields = document.getElementById('diag-extra-fields');
            const industry = document.getElementById('diag-industry') ? document.getElementById('diag-industry').value : '';

            let payloadDesc = `【行业】: ${industry || '未填'}\n`;
            let extraData = { form_industry: industry };

            if (extraFields && !extraFields.classList.contains('hidden')) {
                const time = document.getElementById('diag-time') ? document.getElementById('diag-time').value : '';
                const budget = document.getElementById('diag-budget') ? document.getElementById('diag-budget').value : '';

                payloadDesc += `【预约时间】: ${time || '未填'}\n【预算】: ${budget || '未填'}\n`;
                extraData.form_time = time;
                extraData.form_budget = budget;
            }

            payloadDesc += `\n【需求详情】:\n${desc}`;

            const payload = {
                consultType: consultType,
                form_name: name,
                form_contact: contact,
                form_desc: payloadDesc,
                company_website: document.getElementById('diag-website') ? document.getElementById('diag-website').value : '',
                ...extraData
            };

            if (progressContainer) {
                progressContainer.classList.remove('hidden');
                let progress = 0;
                const textPhases = [
                    "初始化神经网络与跨域网关...",
                    "结构化提炼业务原始需求...",
                    "专家大脑深度推理中 (耗时较长)...",
                    "匹配底层自动化架构图谱...",
                    "生成定制化商业提效报告..."
                ];
                let phaseIdx = 0;
                const progText = document.getElementById('diag-progress-text');
                const progPct = document.getElementById('diag-progress-pct');
                const progBar = document.getElementById('diag-progress-bar');

                window.diagProgressInterval = setInterval(() => {
                    progress += (95 - progress) * 0.015; // 渐进至 95%
                    if (progress > 95) progress = 95;
                    if (progBar) progBar.style.width = progress + '%';
                    if (progPct) progPct.innerText = Math.floor(progress) + '%';

                    let newPhase = Math.floor(progress / 20);
                    if (newPhase > 4) newPhase = 4;
                    if (newPhase !== phaseIdx) {
                        phaseIdx = newPhase;
                        if (progText) progText.innerText = textPhases[phaseIdx];
                    }
                }, 500);
            }

            let resultData;
            if (!webhookUrl || webhookUrl.includes('your-n8n-instance.com')) {
                await new Promise(resolve => setTimeout(resolve, 2000));
                resultData = {
                    diagnosis: "经 Agent 模拟分析，您的业务流存在<b>重度人工依赖</b>与<b>数据孤岛</b>双重瓶颈。建议引入 OpenClaw 作为本地数字员工内核，结合 n8n 予以重构。",
                    workflow: [
                        "规划 Agent: 拆解当前业务 SOP 逻辑流",
                        "本地 OpenClaw: 获取沙盒执行权限，接入您的私有数据库/应用",
                        "执行 Agent: 意图抽取与跨系统 API 分发",
                        "审计 Agent: 人类在环 (HITL) 安全拦截，确保输出 100% 可控"
                    ]
                };
            } else {
                let timeoutId;
                const fetchPromise = fetch(webhookUrl, { method: 'POST', headers: { 'Content-Type': 'text/plain', 'x-mszn-token': 'Mszn_2026_Secure_Key!@#' }, body: JSON.stringify(payload) }).catch(() => null);
                // 将全局超时调至 3 分钟 (180000ms)
                const timeoutPromise = new Promise((_, reject) => { timeoutId = setTimeout(() => reject(new Error('TIMEOUT')), 180000); });
                const response = await Promise.race([fetchPromise, timeoutPromise]);
                clearTimeout(timeoutId);

                if (response && response.ok) {
                    // 记录成功提交的时间戳，用于冷却
                    localStorage.setItem('mszn_last_submit_time', Date.now().toString());
                    const jsonRes = await response.json().catch(() => null);
                    if (jsonRes && jsonRes.trace_id && consultType !== '预约一对一咨询') {
                        if (document.getElementById('diag-progress-text')) document.getElementById('diag-progress-text').innerText = "追踪号获取成功，正在查询飞书同步状态...";
                        const statusUrl = webhookUrl.replace('efficiency-diagnosis', 'efficiency-status') + '?trace_id=' + jsonRes.trace_id;

                        let isCompleted = false;
                        let pollAttempts = 0;
                        while (!isCompleted && pollAttempts < 60) {
                            await new Promise(r => setTimeout(r, 3000));
                            pollAttempts++;
                            const statusRes = await fetch(statusUrl, { headers: { 'x-mszn-token': 'Mszn_2026_Secure_Key!@#' } }).catch(() => null);
                            if (statusRes && statusRes.ok) {
                                const statusJson = await statusRes.json().catch(() => null);
                                if (statusJson && statusJson.status === 'completed' && statusJson.result) {
                                    resultData = statusJson.result;
                                    isCompleted = true;
                                }
                            }
                        }
                        if (!isCompleted) throw new Error('POLL_TIMEOUT');
                    } else if (jsonRes && jsonRes.diagnosis) {
                        resultData = jsonRes;
                    } else {
                        resultData = { diagnosis: "需求已接收。主理人将在稍后与您联系。", workflow: [] };
                    }
                } else {
                    throw new Error('API Error');
                }
            }

            if (window.diagProgressInterval) {
                clearInterval(window.diagProgressInterval);
                const progBar = document.getElementById('diag-progress-bar');
                const progPct = document.getElementById('diag-progress-pct');
                const progText = document.getElementById('diag-progress-text');
                if (progBar) progBar.style.width = '100%';
                if (progPct) progPct.innerText = '100%';
                if (progText) progText.innerText = '分析完毕！正在渲染报告...';
                await new Promise(resolve => setTimeout(resolve, 500)); // 动画缓冲
            }
            Handlers.closeDiagnosisInputModal();
            Renderers.renderDiagnosisModal(resultData, consultType);
            form.reset();
        } catch (error) {
            if (window.diagProgressInterval) {
                clearInterval(window.diagProgressInterval);
            }
            if (msgBox) {
                msgBox.innerHTML = `⚠️ <b>网络超时或接口异常：</b><br>无法连接至自动化网关，请检查 n8n 工作流是否已启动或跨域配置是否正确。<br><img src="${SITE_CONFIG_DATA.media.wechatQrCode}" class="w-24 h-24 mx-auto mt-4 rounded-xl shadow-lg border border-slate-700">`;
                msgBox.className = "text-sm text-center mt-6 font-bold p-5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 block";
                msgBox.classList.remove('hidden');
                if (progressContainer) progressContainer.classList.add('hidden');
            }
        } finally {
            if (window.diagProgressInterval) clearInterval(window.diagProgressInterval);
            if (btn) btn.disabled = false;
            const consultType = document.getElementById('diag-type') ? document.getElementById('diag-type').value : '申请提效诊断';
            if (btnText) btnText.innerText = consultType === "申请提效诊断" ? "开始 AI 诊断" : "提交预约申请";
            if (loader) loader.classList.add('hidden');
        }
    },
    subscribeNewsletter: async function (e) {
        e.preventDefault();
        const form = e.target;
        const emailInput = document.getElementById('nl-email');
        const btn = document.getElementById('nl-submit-btn');
        const btnText = document.getElementById('nl-btn-text');
        const loader = document.getElementById('nl-btn-loader');
        const msgBox = document.getElementById('nl-msg');
        const webhookUrl = window.MSZN_GLOBAL_CONFIG?.api?.newsletterWebhook || SITE_CONFIG_DATA.api.newsletterWebhook;

        if (!emailInput || !btn || !emailInput.value) return;

        btn.disabled = true;
        if (btnText) btnText.classList.add('opacity-0');
        if (loader) loader.classList.remove('hidden');
        if (msgBox) msgBox.classList.add('hidden');

        try {
            if (!webhookUrl || webhookUrl.includes('your-n8n-instance.com')) {
                await new Promise(resolve => setTimeout(resolve, 1500));
                if (msgBox) {
                    msgBox.innerHTML = "✅ <b>订阅成功！（演示模式）</b><br><span class='text-xs font-normal opacity-90 block mt-1'>此为模拟演示。真实环境下将触发 Dify/n8n 引擎推送。</span>";
                    msgBox.className = "text-sm mt-5 font-bold p-5 rounded-2xl bg-green-500/20 text-green-400 border border-green-500/30 block shadow-inner";
                    msgBox.classList.remove('hidden');
                }
                form.reset();
            } else {
                await new Promise(resolve => setTimeout(resolve, 1000));
                if (msgBox) {
                    msgBox.innerHTML = "✅ <b>订阅成功！</b><br><span class='text-xs font-normal opacity-90 block mt-1'>感谢订阅，首期工程通讯已在发送路上。</span>";
                    msgBox.className = "text-sm mt-5 font-bold p-5 rounded-2xl bg-green-500/20 text-green-400 border border-green-500/30 block shadow-inner";
                    msgBox.classList.remove('hidden');
                }
                form.reset();
            }
        } catch (error) {
            if (msgBox) {
                msgBox.innerHTML = "⚠️ <b>请求超时或被拦截：</b><br><span class='text-xs font-normal opacity-90 block mt-1'>无法连接到自动化引擎，请检查网络或跨域设置。</span>";
                msgBox.className = "text-sm mt-5 font-bold p-5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 block shadow-inner";
                msgBox.classList.remove('hidden');
            }
        } finally {
            btn.disabled = false;
            if (btnText) btnText.classList.remove('opacity-0');
            if (loader) loader.classList.add('hidden');
            if (msgBox && msgBox.classList.contains('text-green-400')) {
                setTimeout(() => msgBox.classList.add('hidden'), 6000);
            }
        }
    }
};

// ----------------------------------------------------------------------
// 7. 事件代理绑定
// ----------------------------------------------------------------------
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('fixed') && e.target.classList.contains('inset-0')) {
        Handlers.closeDiagnosisInputModal();
        Handlers.closeDiagnosisResult();
        Handlers.closeAgent();
        Handlers.closeMusic();
        Handlers.closeBlog();
        Handlers.closePolicy();
        Handlers.closeGallery();
        Handlers.closeQRCode();
        return;
    }

    if (e.target.classList.contains('sb-tag')) {
        e.preventDefault();
        Handlers.toggleSandboxTag(e.target);
        return;
    }

    if (e.target.id === 'btn-generate-art' || e.target.closest('#btn-generate-art')) {
        e.preventDefault();
        Handlers.runSandboxGeneration();
        return;
    }

    const target = e.target.closest('[data-action]');
    if (!target) return;

    const action = target.getAttribute('data-action');
    if (action === 'switch-view') { e.preventDefault(); Handlers.switchView(target.getAttribute('data-view-target')); }
    else if (action === 'scroll-contact') { e.preventDefault(); Handlers.scrollToContact(); }
    else if (action === 'open-diagnosis') { e.preventDefault(); Handlers.openDiagnosis(target.getAttribute('data-type') || '申请提效诊断'); }
    else if (action === 'close-diagnosis') { e.preventDefault(); Handlers.closeDiagnosisInputModal(); }
    else if (action === 'close-diagnosis-result') { e.preventDefault(); Handlers.closeDiagnosisResult(); }
    else if (action === 'open-agent') { e.preventDefault(); if (window.WorkspaceUI) { WorkspaceUI.open(target.getAttribute('data-title'), target.getAttribute('data-url-key')); } else { Handlers.openAgent(target.getAttribute('data-title'), target.getAttribute('data-url-key')); } }
    else if (action === 'close-agent') { e.preventDefault(); Handlers.closeAgent(); }
    else if (action === 'toggle-mobile') { e.preventDefault(); Handlers.toggleMobileMenu(target.getAttribute('data-state') === 'true'); }
    else if (action === 'open-music') { e.preventDefault(); Handlers.openMusic(); }
    else if (action === 'close-music') { e.preventDefault(); Handlers.closeMusic(); }
    else if (action === 'toggle-audio') { e.preventDefault(); Handlers.toggleAudio(); }
    else if (action === 'open-blog') { e.preventDefault(); Handlers.openBlog(parseInt(target.getAttribute('data-id'))); }
    else if (action === 'close-blog') { e.preventDefault(); Handlers.closeBlog(); }
    else if (action === 'open-policy') { e.preventDefault(); Handlers.openPolicy(target.getAttribute('data-policy')); }
    else if (action === 'close-policy') { e.preventDefault(); Handlers.closePolicy(); }
    else if (action === 'open-gallery') { e.preventDefault(); Handlers.openGallery(parseInt(target.getAttribute('data-id'))); }
    else if (action === 'close-gallery') { e.preventDefault(); Handlers.closeGallery(); }
    else if (action === 'filter-gallery') { e.preventDefault(); Renderers.renderGallery(target.getAttribute('data-cat')); }
    else if (action === 'filter-blog') { e.preventDefault(); Renderers.renderBlogPosts(target.getAttribute('data-cat')); }
    else if (action === 'filter-dashboard') { e.preventDefault(); Handlers.filterDashboard(target.getAttribute('data-cat')); }
    else if (action === 'toggle-cs') { e.preventDefault(); Handlers.toggleCs(target.getAttribute('data-state') === 'true' ? true : (target.getAttribute('data-state') === 'false' ? false : undefined)); }
    else if (action === 'show-solution') { e.preventDefault(); Handlers.showSolution(parseInt(target.getAttribute('data-id'))); }
    else if (action === 'open-qrcode') { e.preventDefault(); Handlers.openQRCode(target.getAttribute('data-platform')); }
    else if (action === 'close-qrcode') { e.preventDefault(); Handlers.closeQRCode(); }
    else if (action === 'print') { e.preventDefault(); window.print(); }
});

document.addEventListener('input', function (e) {
    if (e.target.id === 'roi-emp' || e.target.id === 'roi-sal') { Handlers.calculateROI(); }
    if (e.target.id === 'roi-c-count' || e.target.id === 'roi-c-cost') { Handlers.calculateROIC(); }
});
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('ind-btn')) {
        document.querySelectorAll('#roi-industry .ind-btn').forEach(b => {
            b.classList.remove('active', 'border-cyan-500/50', 'bg-cyan-500/20', 'text-white');
            b.classList.add('border-slate-700', 'bg-slate-800', 'text-slate-400');
        });
        e.target.classList.remove('border-slate-700', 'bg-slate-800', 'text-slate-400');
        e.target.classList.add('active', 'border-cyan-500/50', 'bg-cyan-500/20', 'text-white');
        Handlers.calculateROI();
    }
});

const contactForm = document.getElementById('contact-form');
if (contactForm) contactForm.addEventListener('submit', Handlers.handleGeneralContact);

const diagForm = document.getElementById('diagnosis-form');
if (diagForm) diagForm.addEventListener('submit', Handlers.submitToN8n);

const nlForm = document.getElementById('newsletter-form');
if (nlForm) nlForm.addEventListener('submit', Handlers.subscribeNewsletter);

try { if (window.top !== window.self) console.log("Sandbox mode isolated."); } catch (e) { }

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('copy', e => {
    const selectedText = window.getSelection().toString();
    if (selectedText) {
        const brandName = SITE_CONFIG_DATA && SITE_CONFIG_DATA.base ? SITE_CONFIG_DATA.base.brand : "麻升智能工作室";
        e.clipboardData.setData('text/plain', `${selectedText}\n\n(本文档内容受 ${brandName} 版权及系统防御协议保护，严禁未经授权的商用转载或模型投喂。)`);
        e.preventDefault();
    }
});

// ----------------------------------------------------------------------
// 8. 启动系统引擎
// ----------------------------------------------------------------------
async function bootstrap() {
    try {
        SITE_CONFIG_DATA = await fetchSystemConfig();

        const watermarkContainer = document.getElementById('security-watermark');
        if (watermarkContainer && SITE_CONFIG_DATA.base) {
            const canvas = document.createElement('canvas');
            canvas.width = 300; canvas.height = 200;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
                ctx.font = '13px "Inter", monospace';
                ctx.rotate(-20 * Math.PI / 180);
                ctx.fillText(`${SITE_CONFIG_DATA.base.brand} ${SITE_CONFIG_DATA.base.brandEn}`, 10, 120);
                watermarkContainer.style.backgroundImage = `url(${canvas.toDataURL('image/png')})`;
            }
        }

        Renderers.renderBlueprints();
        Renderers.renderCBlueprints();
        Renderers.renderDailyAgents();
        Renderers.renderResources();
        Renderers.renderDigitalEmployees();
        Renderers.renderHomeContent();
        Renderers.renderBlogFilters();
        Renderers.renderBlogPosts('全部');
        Renderers.renderFounderAndSecurity();
        Renderers.renderGallery();
        Renderers.renderFAQs();
        Renderers.renderGuarantees();

        const b = SITE_CONFIG_DATA.base;
        if (b) {
            document.querySelectorAll('.brand-name-zh').forEach(el => el.innerText = b.brand || '');
            document.querySelectorAll('.brand-name-en').forEach(el => el.innerText = b.brandEn || '');
            document.querySelectorAll('.global-logo-img').forEach(el => {
                if (b.logo) {
                    el.src = b.logo;
                    el.onerror = function () {
                        el.onerror = null;
                        el.src = 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=100&auto=format&fit=crop';
                    };
                }
            });
            const emailEl = document.getElementById('footer-email'); if (emailEl) emailEl.innerText = b.email || '';
            const mailtoLink = document.getElementById('footer-mailto'); if (mailtoLink) mailtoLink.href = b.email ? `mailto:${b.email}` : '#';
            const yearEl = document.getElementById('footer-year'); if (yearEl) yearEl.innerText = b.copyrightYear || '2026';
        }

        document.querySelectorAll('.global-qrcode-img').forEach(el => {
            if (SITE_CONFIG_DATA.media && SITE_CONFIG_DATA.media.wechatQrCode) {
                el.src = SITE_CONFIG_DATA.media.wechatQrCode;
                el.onerror = function () {
                    el.onerror = null;
                    el.src = 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=200&auto=format&fit=crop';
                };
            }
        });

        const vidB = document.getElementById('video-masheng'); const containerVidB = document.getElementById('container-video-b');
        if (SITE_CONFIG_DATA.media && SITE_CONFIG_DATA.media.videoB_Url && vidB && containerVidB) {
            vidB.src = SITE_CONFIG_DATA.media.videoB_Url; vidB.poster = SITE_CONFIG_DATA.media.videoB_Poster; containerVidB.classList.remove('hidden');
        }

        const vidC = document.getElementById('video-moying'); const containerVidC = document.getElementById('container-video-c');
        if (SITE_CONFIG_DATA.media && SITE_CONFIG_DATA.media.videoC_Url && vidC && containerVidC) {
            vidC.src = SITE_CONFIG_DATA.media.videoC_Url; vidC.poster = SITE_CONFIG_DATA.media.videoC_Poster; containerVidC.classList.remove('hidden');
        }

        const audioMain = document.getElementById('audioEl');
        if (audioMain && SITE_CONFIG_DATA.media) {
            audioMain.src = SITE_CONFIG_DATA.media.demoAudio;
            audioMain.addEventListener('timeupdate', function () {
                if (!this.duration) return;
                const progress = document.getElementById('timeProgress');
                if (progress) progress.style.width = `${(this.currentTime / this.duration) * 100}%`;
                const current = document.getElementById('timeCurrent');
                if (current) {
                    const mins = Math.floor(this.currentTime / 60).toString().padStart(2, '0');
                    const secs = Math.floor(this.currentTime % 60).toString().padStart(2, '0');
                    current.innerText = `${mins}:${secs}`;
                }
            });
            audioMain.addEventListener('ended', () => { isAudioPlaying = true; Handlers.toggleAudio(); });
        }

        const demandList = document.getElementById('demand-list');
        if (demandList && SITE_CONFIG_DATA.demands) {
            demandList.innerHTML = SITE_CONFIG_DATA.demands.map(d => `
                <div data-action="show-solution" data-id="${d.id}" class="p-5 rounded-2xl cursor-pointer hover:bg-slate-800 transition-all border-l-2 ${d.type === 'b' ? 'border-l-cyan-500' : 'border-l-pink-500'} bg-slate-900/50 border border-slate-800 hover:-translate-y-1 shadow-md">
                    <div class="flex justify-between mb-2">
                        <span class="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full ${d.type === 'b' ? 'bg-cyan-500' : 'bg-pink-500'}"></span>${d.label}</span>
                        <span class="text-[10px] text-slate-500 font-mono bg-slate-950 px-2 py-0.5 rounded">${d.time}</span>
                    </div>
                    <h5 class="text-sm font-bold text-white line-clamp-1">${d.title}</h5>
                </div>
            `).join('');
        }

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); });
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));

        setTimeout(() => {
            const aiBox = document.getElementById('ai-response-box');
            const typingPrompt = document.getElementById('typing-prompt');
            if (aiBox && typingPrompt) {
                aiBox.style.display = 'flex';
                typingPrompt.classList.remove('typing-cursor');
            }
        }, 3000);

        if (SITE_CONFIG_DATA.demands && SITE_CONFIG_DATA.demands.length > 0) {
            setTimeout(() => Handlers.showSolution(SITE_CONFIG_DATA.demands[0].id), 500);
        }
    } catch (e) {
        triggerErrorBoundary(e);
    }
}

await bootstrap();
});
