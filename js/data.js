// ============================================
// 麻升智能工作室 - CMS 内容数据
// 从 data/*.json 异步加载，组装为 LOCAL_CMS_DATA
// ============================================

(async function () {
    // 并行加载所有 JSON 数据文件
    const files = {
        profile:      'data/profile.json',
        policies:     'data/policies.json',
        manifesto:    'data/manifesto.json',
        metrics:      'data/metrics.json',
        painPoints:   'data/pain-points.json',
        guarantees:   'data/guarantees.json',
        blueprints:   'data/blueprints.json',
        cBlueprints:  'data/c-blueprints.json',
        resources:    'data/resources.json',
        dailyAgents:  'data/daily-agents.json',
        digitalEmployees: 'data/digital-employees.json',
        pricing:      'data/pricing.json',
        faqs:         'data/faqs.json',
        testimonials: 'data/testimonials.json',
        blogs:        'data/blogs.json',
        demands:      'data/demands.json',
        sandboxMocks: 'data/sandbox-mocks.json',
        gallery:      'data/gallery.json',
        dashboard:    'data/dashboard.json',
    };

    const results = {};
    await Promise.all(Object.entries(files).map(async ([key, path]) => {
        try {
            const resp = await fetch(path);
            results[key] = await resp.json();
        } catch (e) {
            console.warn(`[Data] 加载失败: ${path}`, e);
            results[key] = Array.isArray(results[key]) ? [] : {};
        }
    }));

    // 等待 config 加载完成
    while (!window.MSZN_GLOBAL_CONFIG || !window.MSZN_GLOBAL_CONFIG.base) {
        await new Promise(r => setTimeout(r, 10));
    }
    const cfg = window.MSZN_GLOBAL_CONFIG;

    // 组装 LOCAL_CMS_DATA
    const data = {
        base: cfg.base,
        founder: results.profile.founder,
        security: results.profile.security,
        media: cfg.media,
        api: cfg.api,
        agents: cfg.agents,
        policies: results.policies,
        content: {
            manifesto: results.manifesto,
            metrics: results.metrics,
            painPoints: results.painPoints,
            guarantees: results.guarantees,
            blueprints: results.blueprints,
            cBlueprints: results.cBlueprints,
            resources: results.resources,
            dailyAgents: results.dailyAgents,
            digitalEmployees: results.digitalEmployees,
            pricing: results.pricing,
            faqs: results.faqs,
            testimonials: results.testimonials,
        },
        blogs: results.blogs,
        demands: results.demands,
        sandboxMocks: results.sandboxMocks,
        gallery: results.gallery,
    };

    window.LOCAL_CMS_DATA = data;
    window.DASHBOARD_DATA = results.dashboard;
})();
