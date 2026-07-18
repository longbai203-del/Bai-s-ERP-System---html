// core/module-loader.js
// ?????

export async function loadModule(modulePath, childPath) {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    mainContent.innerHTML = '<div class="loading"><div class="spinner"></div><span>???...</span></div>';

    const fullPath = 'modules/' + modulePath + '/' + childPath;

    try {
        const response = await fetch(fullPath);
        if (!response.ok) throw new Error('?????: ' + fullPath);
        let html = await response.text();
        const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        if (bodyMatch) {
            html = bodyMatch[1];
        }
        mainContent.innerHTML = html;
        console.log('? ??????:', fullPath);
    } catch (error) {
        mainContent.innerHTML = '<div style="padding:60px;text-align:center;color:#ef4444;"><h2>?? ????</h2><p style="color:#94a3b8;">' + error.message + '</p></div>';
        console.error('? ????:', error);
    }
}
