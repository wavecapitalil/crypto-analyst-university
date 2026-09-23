import {authStore} from '../features/auth/authStore.js';
import {safe} from '../utils/html.js';

export async function accountPage(){
  if(!authStore.configured){
    return `<div class="section"><h1>Student Account</h1><div class="callout amber"><h3>מערכת החשבונות מוכנה בקוד, אבל סביבת ה-Supabase של האתר עדיין לא הוגדרה.</h3><p>ההתקדמות המקומית ממשיכה לעבוד כרגיל. אחרי חיבור ה-backend, אותו מסך יאפשר הרשמה, התחברות וסנכרון בין מכשירים.</p></div></div>`;
  }
  if(authStore.session){
    const name=authStore.profile?.fullName||authStore.session.user.fullName||'Student';
    return `<div class="section"><h1>Student Account</h1>
      <div class="card"><h2>${safe(name)}</h2><p>${safe(authStore.session.user.email)}</p>
      <div class="actions"><button class="btn green" data-route="student">הדאשבורד שלי</button><button class="btn red" data-action="auth-logout">התנתקות</button></div></div>
      ${authStore.message?`<div class="callout green">${safe(authStore.message)}</div>`:''}
      ${authStore.error?`<div class="callout red">${safe(authStore.error)}</div>`:''}
    </div>`;
  }
  return `<div class="section"><h1>Student Account</h1>
    <p class="muted">חשבון אישי שומר את ההתקדמות, המבחנים, ההערות וה-Practice Lab ומאפשר להמשיך מכל מכשיר.</p>
    ${authStore.message?`<div class="callout green">${safe(authStore.message)}</div>`:''}
    ${authStore.error?`<div class="callout red">${safe(authStore.error)}</div>`:''}
    <div class="lesson-grid">
      <div class="box"><h2>התחברות</h2>
        <label>אימייל</label><input id="login-email" class="search account-input" type="email" autocomplete="email">
        <label>סיסמה</label><input id="login-password" class="search account-input" type="password" autocomplete="current-password">
        <div class="actions"><button class="btn green" data-action="auth-login" ${authStore.busy?'disabled':''}>התחבר</button></div>
      </div>
      <div class="box"><h2>יצירת חשבון</h2>
        <label>שם מלא</label><input id="signup-name" class="search account-input" autocomplete="name">
        <label>אימייל</label><input id="signup-email" class="search account-input" type="email" autocomplete="email">
        <label>סיסמה</label><input id="signup-password" class="search account-input" type="password" minlength="8" autocomplete="new-password">
        <p class="small">לפחות 8 תווים. הסיסמה נשלחת ישירות ל-Supabase Auth ואינה נשמרת בקוד או ב-GitHub.</p>
        <div class="actions"><button class="btn green" data-action="auth-signup" ${authStore.busy?'disabled':''}>צור חשבון</button></div>
      </div>
    </div>
  </div>`;
}
