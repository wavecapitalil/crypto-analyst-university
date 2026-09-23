export function currentRoute() { const raw = (location.hash || '#/home').replace(/^#\/?/, ''); const parts = raw.split('/').filter(Boolean); return { parts: parts.length ? parts : ['home'], path: '/' + (parts.length ? parts.join('/') : 'home') }; }
export function go(path) { location.hash = '#/' + path.replace(/^\//, ''); }
export function onRouteChange(fn) { addEventListener('hashchange', fn); }
