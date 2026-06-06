// ============================================
// 麻升智能工作室 - 全局配置中心
// 从 data/config.json 加载，供其他模块使用
// ============================================

(async function () {
    try {
        const resp = await fetch('data/config.json');
        window.MSZN_GLOBAL_CONFIG = await resp.json();
    } catch (e) {
        console.warn('[Config] 加载 config.json 失败，使用降级空配置', e);
        window.MSZN_GLOBAL_CONFIG = { base: {}, media: {}, api: {}, difyChatbot: {}, agents: {} };
    }
})();
