import { getCases } from '../data/repository.js';
import { progressStore } from '../store/progressStore.js';
import { safe } from '../utils/html.js';
export async function practiceLab() {
    const cases = await getCases();
    return `<div class="section"><h1>Practice Lab</h1><div class="callout amber"><b>זה אזור תרגול.</b> ללימוד חומר חדש השתמש ב"המשך לימודים". Cases נועדו לבדוק reasoning לאחר הלמידה.</div>${cases.map((c, i) => {
        const title = c.title || c.t || '', data = c.data || c.d || '', qs = c.questions || c.q || [], answer = c.answer || c.a || '';
        const key = c.id || String(i);
        const prior = progressStore.state.cases[key] ?? progressStore.state.cases[String(i)] ?? '';
        return `<div class="exam"><h2>${safe(title)}</h2><div class="callout">${safe(data)}</div><ol>${qs.map(x => `<li>${safe(x)}</li>`).join('')}</ol><textarea class="answer" data-action="case-answer" data-case="${safe(key)}">${safe(prior)}</textarea><button class="btn alt" data-action="toggle-rubric">Solution Guide</button><div class="rubric">${safe(answer)}</div></div>`;
    }).join('')}</div>`;
}
