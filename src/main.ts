import {render,bindInteractions} from './app.js'; import {onRouteChange} from './router/router.js';
bindInteractions(); onRouteChange(()=>void render()); void render();
