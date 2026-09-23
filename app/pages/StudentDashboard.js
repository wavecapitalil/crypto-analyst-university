import { authStore } from '../features/auth/authStore.js';
import { syncState } from '../features/auth/progressSync.js';
import { getManifest } from '../data/repository.js';
import { academyPct, firstIncompleteLevel, globalStats } from '../features/learning/mastery.js';
import { progressBar, safe } from '../utils/html.js';
export async function studentDashboard() {
    if (!authStore.configured)
        return `<div class="section"><h1>My Dashboard</h1><div class="callout amber">מערכת הדאשבורד מוכנה, אבל נדרש backend מחובר כדי ליצור חשבונות אמיתיים ולסנכרן בין מכשירים.</div><button class="btn" data-route="account">Student Account</button></div>`;
    if (!authStore.session)
        return `<div class="section"><h1>My Dashboard</h1><div class="callout">יש להתחבר כדי לפתוח את הדאשבורד האישי.</div><button class="btn green" data-route="account">הרשמה / התחברות</button></div>`;
    const m = await getManifest();
    const g = globalStats(m);
    const next = firstIncompleteLevel(m);
    const name = authStore.profile?.fullName || authStore.session.user.fullName || authStore.session.user.email;
    const academyRows = m.academies.map((a) => { const p = academyPct(m, a[2]); return `<div class="skill"><b>Academy ${safe(a[0])} — ${safe(a[1])}</b><div class="small">${p}%</div><div class="skillbar"><i style="width:${p}%"></i></div></div>`; }).join('');
    const syncLabel = syncState.error ? `Sync error: ${safe(syncState.error)}` : syncState.lastSync ? `סונכרן ${new Date(syncState.lastSync).toLocaleString()}` : 'מוכן לסנכרון';
    return `<div class="hero"><div class="eyebrow">STUDENT DASHBOARD</div><h1>שלום, ${safe(name)}</h1><p>${safe(authStore.session.user.email)} · ${syncLabel}</p>
    ${progressBar(g.pct)}
    <div class="grid kpis">
      <div class="kpi"><b>${g.pct}%</b><div class="small">התקדמות כוללת</div></div>
      <div class="kpi"><b>${g.done}/${g.topics}</b><div class="small">Topics Mastered</div></div>
      <div class="kpi"><b>${g.passed}/${g.exams}</b><div class="small">Chapter Exams Passed</div></div>
      <div class="kpi"><b>${g.checkdone}/${g.checks}</b><div class="small">Checkpoints</div></div>
    </div>
    <div class="actions"><button class="btn green" data-route="${next === null ? 'curriculum' : `level/${next}`}">המשך לימודים</button><button class="btn" data-action="cloud-sync">סנכרן עכשיו</button><button class="btn alt" data-route="account">הגדרות חשבון</button></div>
  </div>
  <div class="section"><h2>Academy Progress</h2><div class="skillgrid">${academyRows}</div></div>
  <div class="section"><h2>מה נשמר בחשבון</h2><p>Checkpoints, ציוני Topics, מבחני פרקים, הערות, Practice Lab והמסך האחרון שבו למדת. מנגנון הסנכרון משווה timestamps ולא דורס התקדמות חדשה יותר בשקט.</p></div>`;
}
