import type {StudentProfile,StudentSession} from '../../types/auth.js';
import {backendConfigured} from '../../config/runtime.js';
import {fetchProfile,refreshSession,signIn,signOut,signUp} from '../../services/supabase.js';

const KEY='wave_crypto_uni_student_session_v1';
type Listener=()=>void;
class AuthStore{
  session:StudentSession|null=null;
  profile:StudentProfile|null=null;
  configured=false;
  busy=false;
  message='';
  error='';
  private listeners=new Set<Listener>();

  subscribe(fn:Listener){this.listeners.add(fn);return()=>this.listeners.delete(fn)}
  private emit(){for(const fn of this.listeners)fn()}
  private persist(){try{this.session?localStorage.setItem(KEY,JSON.stringify(this.session)):localStorage.removeItem(KEY)}catch{}}
  private setSession(s:StudentSession|null){this.session=s;this.persist();this.emit()}
  async init(){
    this.configured=await backendConfigured();
    if(!this.configured){this.emit();return}
    try{
      const raw=localStorage.getItem(KEY);
      if(raw)this.session=JSON.parse(raw);
    }catch{}
    if(this.session&&this.session.expiresAt-Date.now()<60_000){
      try{const next=await refreshSession(this.session.refreshToken);if(next)this.session=next;else this.session=null}catch{this.session=null}
      this.persist();
    }
    if(this.session){try{this.profile=await fetchProfile(this.session)}catch{}}
    this.emit();
  }
  async login(email:string,password:string){
    this.busy=true;this.error='';this.message='';this.emit();
    try{
      const s=await signIn(email.trim(),password);
      if(!s)throw new Error('Login did not return a session');
      this.setSession(s);
      this.profile=await fetchProfile(s);
      this.message='התחברת בהצלחה.';
    }catch(e){this.error=e instanceof Error?e.message:'Login failed'}
    finally{this.busy=false;this.emit()}
  }
  async signup(email:string,password:string,fullName:string){
    this.busy=true;this.error='';this.message='';this.emit();
    try{
      const result=await signUp(email.trim(),password,fullName.trim());
      if(result.session){
        this.setSession(result.session);
        this.profile=await fetchProfile(result.session);
        this.message='החשבון נוצר והתחברת.';
      }else{
        this.message='החשבון נוצר. בדוק את המייל לאימות לפני ההתחברות.';
      }
    }catch(e){this.error=e instanceof Error?e.message:'Signup failed'}
    finally{this.busy=false;this.emit()}
  }
  async logout(){
    const s=this.session;
    this.busy=true;this.error='';this.emit();
    try{if(s)await signOut(s.accessToken)}catch{}
    this.session=null;this.profile=null;this.message='התנתקת.';this.busy=false;this.persist();this.emit();
  }
  async ensureSession(){
    if(!this.session)return null;
    if(this.session.expiresAt-Date.now()>=60_000)return this.session;
    try{
      const next=await refreshSession(this.session.refreshToken);
      this.setSession(next);
      return next;
    }catch{
      this.session=null;this.profile=null;this.persist();this.emit();return null;
    }
  }
}
export const authStore=new AuthStore();
