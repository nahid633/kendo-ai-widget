(function () {
  if (window.__chatbotLoaded) return;
  window.__chatbotLoaded = true;

  // Locate this <script> tag
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

  // Base URL (folder containing embed.js)
  const baseUrl = me.src.substring(0, me.src.lastIndexOf('/'));

  // Load your app styles from /
  const appStyles = document.createElement('link');
  appStyles.rel = 'stylesheet';
  appStyles.href = `${baseUrl}/styles.css`;
  document.head.appendChild(appStyles);

  // Helper to load ESM scripts
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

  // Load Angular bundles from
  Promise.all([
    loadModule(`${baseUrl}/polyfills.js`),
    loadModule(`${baseUrl}/main.js`)
  ]).then(() => {
    // Create a fixed host container
    const host = document.createElement('div');
    host.style.position = 'fixed';
    host.style.zIndex = '2147483000';
    if (cfg.position.includes('bottom')) host.style.bottom = '16px';
    if (cfg.position.includes('top')) host.style.top = '16px';
    if (cfg.position.includes('right')) host.style.right = '16px';
    if (cfg.position.includes('left')) host.style.left = '16px';

    // Mount your Angular Element
    const widget = document.createElement('chatbot-widget');
    if (cfg.apiBase) widget.setAttribute('api-base', cfg.apiBase);
    widget.setAttribute('theme', cfg.theme);
    widget.setAttribute('locale', cfg.locale);

    host.appendChild(widget);
    document.body.appendChild(host);
  }).catch(err => {
    console.error('Chatbot failed to load:', err);
  });
})();
