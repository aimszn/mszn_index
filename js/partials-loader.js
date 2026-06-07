// ============================================
// 麻升智能工作室 - Partial HTML 加载器
// 在 DOMContentLoaded 前注入所有 HTML 片段
// ============================================

(function () {
    // 需要加载的 partial 映射：placeholder ID → 文件路径
    const PARTIALS = {
        'partial-nav':       'partials/nav.txt',
        'partial-home':      'partials/home/home.txt',
        'partial-masheng':   'partials/masheng/masheng.txt',
        'partial-moying':    'partials/moying/moying.txt',
        'partial-cases':     'partials/cases.txt',
        'partial-solutions': 'partials/solutions.txt',
        'partial-arsenal':   'partials/arsenal.txt',
        'partial-blog':      'partials/blog.txt',
        'partial-dashboard': 'partials/dashboard.txt',
        'partial-trust':     'partials/trust.txt',
        'partial-contact':   'partials/contact.txt',
        'partial-footer':    'partials/footer.txt',
        'partial-modals':    'partials/modals.txt',
    };

    let loadPromise = null;
    function loadPartials() {
        if (loadPromise) return loadPromise;
        const entries = Object.entries(PARTIALS);
        const promises = entries.map(async ([id, path]) => {
            const el = document.getElementById(id);
            if (!el) return;
            try {
                const url = `${path}?v=${Date.now()}`;
                const resp = await fetch(url);
                if (!resp.ok) throw new Error(`${resp.status} ${resp.statusText}`);
                el.innerHTML = await resp.text();
            } catch (e) {
                console.warn(`[PartialsLoader] 加载失败: ${path}`, e);
            }
        });
        loadPromise = Promise.all(promises);
        return loadPromise;
    }

    // 暴露为全局函数，供 app.js 在 DOMContentLoaded 前调用
    window.loadPartials = loadPartials;
})();
