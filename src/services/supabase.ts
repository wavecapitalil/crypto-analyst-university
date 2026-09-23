import {getRuntimeConfig} from '../config/runtime.js';
import type {ProgressState} from '../types/state.js';
import type {StudentProfile,StudentSession,StudentUser} from '../types/auth.js';

function userFrom(raw:any):StudentUser{
  return{id:String(raw?.id||''),email:String(raw?.email||''),fullName:String(raw?.user_metadata?.full_name||raw?.user_metadata?.name||'')||undefined};
}
function sessionFrom(raw:any):StudentSession|null{
  if(!raw?.access_token||!raw?.refresh_token||!raw?.user)return null;
  return{accessToken:String(raw.access_token),refreshToken:String(raw.refresh_token),expiresAt:Date.now()+Number(raw.expires_in||3600)*1000,user:userFrom(raw.user)};
}
async function request(path:string,init:RequestInit={},accessToken?:string){
  const c=await getRuntimeConfig();
  if(!c.supabaseUrl||!c.supabaseAnonKey)throw new Error('Student accounts backend is not configured');
  const headers=new Headers(init.headers||{});
  headers.set('apikey',c.supabaseAnonKey);
  headers.set('Authorization',`Bearer ${accessToken||c.supabaseAnonKey}`);
  if(init.body&&!headers.has('Content-Type'))headers.set('Content-Type','application/json');
  const r=await fetch(c.supabaseUrl+path,{...init,headers});
  const text=await r.text();
  const data=text?(()=>{try{return JSON.parse(text)}catch{return text}})():null;
  if(!r.ok)throw new Error(String(data?.msg||data?.message||data?.error_description||data?.error||`Backend error ${r.status}`));
  return data;
}
export async function signUp(email:string,password:string,fullName:string){
  const raw=await request('/auth/v1/signup',{method:'POST',body:JSON.stringify({email,password,data:{full_name:fullName}})});
  return{session:sessionFrom(raw),user:raw?.user?userFrom(raw.user):null};
}
export async function signIn(email:string,password:string){return sessionFrom(await request('/auth/v1/token?grant_type=password',{method:'POST',body:JSON.stringify({email,password})}))}
export async function refreshSession(refreshToken:string){return sessionFrom(await request('/auth/v1/token?grant_type=refresh_token',{method:'POST',body:JSON.stringify({refresh_token:refreshToken})}))}
export async function signOut(accessToken:string){await request('/auth/v1/logout',{method:'POST'},accessToken)}
export async function fetchProfile(session:StudentSession):Promise<StudentProfile|null>{
  const rows=await request(`/rest/v1/profiles?select=user_id,full_name,email,role,created_at,updated_at&user_id=eq.${encodeURIComponent(session.user.id)}`,{},session.accessToken);
  const x=Array.isArray(rows)?rows[0]:null;if(!x)return null;
  return{userId:String(x.user_id),fullName:String(x.full_name||''),email:String(x.email||session.user.email),role:String(x.role||'student'),createdAt:x.created_at,updatedAt:x.updated_at};
}
export async function fetchRemoteProgress(session:StudentSession):Promise<{progress:ProgressState;updatedAt:string}|null>{
  const rows=await request(`/rest/v1/student_progress?select=progress,updated_at&user_id=eq.${encodeURIComponent(session.user.id)}`,{},session.accessToken);
  const x=Array.isArray(rows)?rows[0]:null;
  return x?.progress?{progress:x.progress as ProgressState,updatedAt:String(x.updated_at||'')}:null;
}
export async function upsertRemoteProgress(session:StudentSession,progress:ProgressState){
  await request('/rest/v1/student_progress?on_conflict=user_id',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({user_id:session.user.id,progress})},session.accessToken);
}
