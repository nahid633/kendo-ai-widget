(function () {
    if (window.__spiceChatbotLoaded) return;
    window.__spiceChatbotLoaded = true;

    // Detect the script tag
    const me = document.currentScript || (function () {
        const scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];
    })();

    // Read config from data-* attributes
    const cfg = {
        apiBase: me.dataset.apiBase || '',
        theme: me.dataset.theme || 'default',
        locale: me.dataset.locale || 'en',
        position: me.dataset.position || 'bottom-right'
    };

    // Load Kendo theme CSS if not present
    const KENDO_CSS = 'https://unpkg.com/@progress/kendo-theme-default@latest/dist/all.css';
    if (!document.querySelector(`link[href="${KENDO_CSS}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = KENDO_CSS;
        document.head.appendChild(link);
    }

    // Load your Angular Elements bundle
    const base = '';
    function loadModule(src) {
        return new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.type = 'module';
            s.src = src;
            s.onload = resolve;
            s.onerror = reject;
            document.head.appendChild(s);
        });
    }

    Promise.all([
        loadModule(`${base}/polyfills.js`),
        loadModule(`${base}/main.js`)
    ]).then(() => {
        // Create a container for the widget
        const host = document.createElement('div');
        host.style.position = 'fixed';
        host.style.zIndex = '2147483000';
        if (cfg.position.includes('bottom')) host.style.bottom = '16px';
        if (cfg.position.includes('top')) host.style.top = '16px';
        if (cfg.position.includes('right')) host.style.right = '16px';
        if (cfg.position.includes('left')) host.style.left = '16px';

        // Create the Angular custom element
        const widget = document.createElement('chatbot-widget');
        if (cfg.apiBase) widget.setAttribute('api-base', cfg.apiBase);
        widget.setAttribute('theme', cfg.theme);
        widget.setAttribute('locale', cfg.locale);

        host.appendChild(widget);
        document.body.appendChild(host);
    }).catch(err => {
        console.error('Failed to load Spice Chatbot:', err);
    });
})();

