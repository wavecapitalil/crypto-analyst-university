import { render, bindInteractions } from './app.js';
import { onRouteChange } from './router/router.js';
import { authStore } from './features/auth/authStore.js';
import { enableProgressAutoSync, syncProgressNow } from './features/auth/progressSync.js';
bindInteractions();
onRouteChange(() => void render());
authStore.subscribe(() => void render());
async function bootstrap() {
    await authStore.init();
    enableProgressAutoSync();
    if (authStore.session)
        await syncProgressNow();
    await render();
}
void bootstrap();
