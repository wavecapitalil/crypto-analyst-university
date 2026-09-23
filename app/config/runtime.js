let configPromise = null;
export function getRuntimeConfig() {
    return configPromise ??= fetch('./config/runtime.json', { cache: 'no-store' }).then(async r => {
        if (!r.ok)
            throw new Error('Failed to load runtime config');
        const x = await r.json();
        return { supabaseUrl: String(x.supabaseUrl || '').replace(/\/$/, ''), supabaseAnonKey: String(x.supabaseAnonKey || '') };
    });
}
export async function backendConfigured() { const c = await getRuntimeConfig(); return !!(c.supabaseUrl && c.supabaseAnonKey); }
