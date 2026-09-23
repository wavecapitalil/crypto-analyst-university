import { backendConfigured } from '../../config/runtime.js';
import { fetchProfile, refreshSession, signIn, signOut, signUp } from '../../services/supabase.js';
const KEY = 'wave_crypto_uni_student_session_v1';
class AuthStore {
    session = null;
    profile = null;
    configured = false;
    busy = false;
    message = '';
    error = '';
    listeners = new Set();
    subscribe(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn); }
    emit() { for (const fn of this.listeners)
        fn(); }
    persist() { try {
        this.session ? localStorage.setItem(KEY, JSON.stringify(this.session)) : localStorage.removeItem(KEY);
    }
    catch { } }
    setSession(s) { this.session = s; this.persist(); this.emit(); }
    async init() {
        this.configured = await backendConfigured();
        if (!this.configured) {
            this.emit();
            return;
        }
        try {
            const raw = localStorage.getItem(KEY);
            if (raw)
                this.session = JSON.parse(raw);
        }
        catch { }
        if (this.session && this.session.expiresAt - Date.now() < 60_000) {
            try {
                const next = await refreshSession(this.session.refreshToken);
                if (next)
                    this.session = next;
                else
                    this.session = null;
            }
            catch {
                this.session = null;
            }
            this.persist();
        }
        if (this.session) {
            try {
                this.profile = await fetchProfile(this.session);
            }
            catch { }
        }
        this.emit();
    }
    async login(email, password) {
        this.busy = true;
        this.error = '';
        this.message = '';
        this.emit();
        try {
            const s = await signIn(email.trim(), password);
            if (!s)
                throw new Error('Login did not return a session');
            this.setSession(s);
            this.profile = await fetchProfile(s);
            this.message = 'התחברת בהצלחה.';
        }
        catch (e) {
            this.error = e instanceof Error ? e.message : 'Login failed';
        }
        finally {
            this.busy = false;
            this.emit();
        }
    }
    async signup(email, password, fullName) {
        this.busy = true;
        this.error = '';
        this.message = '';
        this.emit();
        try {
            const result = await signUp(email.trim(), password, fullName.trim());
            if (result.session) {
                this.setSession(result.session);
                this.profile = await fetchProfile(result.session);
                this.message = 'החשבון נוצר והתחברת.';
            }
            else {
                this.message = 'החשבון נוצר. בדוק את המייל לאימות לפני ההתחברות.';
            }
        }
        catch (e) {
            this.error = e instanceof Error ? e.message : 'Signup failed';
        }
        finally {
            this.busy = false;
            this.emit();
        }
    }
    async logout() {
        const s = this.session;
        this.busy = true;
        this.error = '';
        this.emit();
        try {
            if (s)
                await signOut(s.accessToken);
        }
        catch { }
        this.session = null;
        this.profile = null;
        this.message = 'התנתקת.';
        this.busy = false;
        this.persist();
        this.emit();
    }
    async ensureSession() {
        if (!this.session)
            return null;
        if (this.session.expiresAt - Date.now() >= 60_000)
            return this.session;
        try {
            const next = await refreshSession(this.session.refreshToken);
            this.setSession(next);
            return next;
        }
        catch {
            this.session = null;
            this.profile = null;
            this.persist();
            this.emit();
            return null;
        }
    }
}
export const authStore = new AuthStore();
