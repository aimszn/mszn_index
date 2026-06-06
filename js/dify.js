// ============================================
// 麻升智能工作室 - Dify AI 助理集成
// 悬浮窗配置、加载、交互
// ============================================
window.difyChatbotConfig = {
    token: window.MSZN_GLOBAL_CONFIG ? window.MSZN_GLOBAL_CONFIG.difyChatbot.token : 'p8rzCN5Yl0JnX2GJ',
    baseUrl: window.MSZN_GLOBAL_CONFIG ? window.MSZN_GLOBAL_CONFIG.difyChatbot.baseUrl : 'https://dify.cursormax.fun',
    inputs: window.MSZN_GLOBAL_CONFIG ? window.MSZN_GLOBAL_CONFIG.difyChatbot.inputs : { current_page: '麻升智能工作室-官网交互终端' }
};

(function() {
    var script = document.createElement('script');
    script.src = (window.MSZN_GLOBAL_CONFIG ? window.MSZN_GLOBAL_CONFIG.difyChatbot.baseUrl : 'https://dify.cursormax.fun') + "/embed.min.js";
    script.id = window.MSZN_GLOBAL_CONFIG ? window.MSZN_GLOBAL_CONFIG.difyChatbot.token : "p8rzCN5Yl0JnX2GJ";
    script.defer = true;
    document.body.appendChild(script);
})();

// 监听用户的交互，打开聊天窗时平滑隐藏引导气泡
document.addEventListener('click', function (e) {
    const isDifyBtn = e.target.closest('#dify-chatbot-bubble-button');
    if (isDifyBtn) {
        const tooltip = document.getElementById('dify-guide-tooltip');
        if (tooltip) tooltip.style.opacity = '0';
    }
});

    // 🔒 Dify 移动端与全屏下滚动锁定与穿透防护 (Prevent background scroll penetration)
(function () {
    function setScrollLock(lock) {
        if (lock) {
            document.body.style.overflow = 'hidden';
            document.body.style.touchAction = 'none';
        } else {
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
        }
    }

    function setupDifyWindowObserver(difyWindow) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
                    const display = window.getComputedStyle(difyWindow).display;
                    const isVisible = display !== 'none' && difyWindow.style.display !== 'none';

                        // We lock background scroll when Dify window is visible/expanded
                    if (isVisible) {
                        setScrollLock(true);
                    } else {
                        setScrollLock(false);
                    }
                }
            });
        });

        observer.observe(difyWindow, {
            attributes: true,
            attributeFilter: ['style', 'class']
        });

            // Run initial check
        const display = window.getComputedStyle(difyWindow).display;
        const isVisible = display !== 'none' && difyWindow.style.display !== 'none';
        if (isVisible) {
            setScrollLock(true);
        }
    }

        // Observe body to detect when the Dify bubble window is dynamically injected
    const bodyObserver = new MutationObserver((mutations, obs) => {
        const difyWindow = document.getElementById('dify-chatbot-bubble-window');
        if (difyWindow) {
            setupDifyWindowObserver(difyWindow);
            obs.disconnect(); // Disconnect once hook is established
        }
    });

    bodyObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
})();

    // Initialize Flatpickr for the booking time
flatpickr("#diag-time", {
    enableTime: true,
    dateFormat: "Y/m/d H:i",
    locale: "zh",
    plugins: [
        new confirmDatePlugin({
            confirmIcon: "",
            confirmText: "确认",
            showAlways: false
        })
    ]
});
