import { authStore } from '../features/auth/authStore.js';
import { safe } from '../utils/html.js';
export function navbar() {
    const account = authStore.session
        ? `<button class="nav green" data-route="student">👤 ${safe(authStore.profile?.fullName || authStore.session.user.fullName || 'My Dashboard')}</button>`
        : '<button class="nav" data-route="account">Student Account</button>';
    return `<div class="top"><div class="brand">WAVE CAPITAL</div><button class="nav" data-route="home">Command Center</button><button class="nav green" data-action="continue-learning">המשך לימודים</button><button class="nav" data-route="curriculum">מפת הקורס</button><button class="nav" data-route="exams">Exams</button><button class="nav" data-route="cases">Practice Lab</button><button class="nav" data-route="tools">Analyst Tools</button><button class="nav" data-route="sources">מקורות</button><button class="nav" data-route="canon">Research Canon</button><button class="nav" data-route="qa">QA</button>${account}<input id="nav-search" class="search" placeholder="חפש נושא, ratio, sector..."></div>`;
}
