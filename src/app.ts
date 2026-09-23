import {navbar} from './components/Navbar.js';
import {currentRoute,go} from './router/router.js';
import {getLevel,getManifest} from './data/repository.js';
import {firstIncompleteLevel} from './features/learning/mastery.js';
import {progressStore} from './store/progressStore.js';
import {gradeChapter} from './features/exams/grading.js';
import {evaluateCalculator} from './features/tools/calculators.js';
import {commandCenter} from './pages/CommandCenter.js';
import {curriculum} from './pages/Curriculum.js';
import {levelPage} from './pages/LevelPage.js';
import {topicPage} from './pages/TopicPage.js';
import {examPage} from './pages/ExamPage.js';
import {examsPage} from './pages/Exams.js';
import {practiceLab} from './pages/PracticeLab.js';
import {analystTools} from './pages/AnalystTools.js';
import {sourcesPage} from './pages/Sources.js';
import {canonPage} from './pages/Canon.js';
import {qaPage} from './pages/QA.js';
import {searchPage} from './pages/Search.js';

let renderToken=0;
function root():HTMLElement{
  const el=document.querySelector<HTMLElement>('#app');
  if(!el)throw new Error('Application root #app was not found');
  return el;
}
export async function render(){
  const token=++renderToken;
  const app=root();
  const {parts,path}=currentRoute();
  progressStore.state.lastVisited=path;
  progressStore.save();
  let body='';
  try{
    switch(parts[0]){
      case'home':body=await commandCenter();break;
      case'curriculum':body=await curriculum();break;
      case'level':body=await levelPage(Number(parts[1]));break;
      case'topic':body=await topicPage(Number(parts[1]),Number(parts[2]));break;
      case'exam':body=await examPage(Number(parts[1]));break;
      case'exams':body=await examsPage();break;
      case'cases':body=await practiceLab();break;
      case'tools':body=await analystTools();break;
      case'sources':body=await sourcesPage();break;
      case'canon':body=await canonPage();break;
      case'qa':body=await qaPage();break;
      case'search':body=await searchPage(parts.slice(1).join('/'));break;
      default:body=await commandCenter();
    }
    if(token!==renderToken)return;
    app.innerHTML=navbar()+body;
    window.scrollTo(0,0);
  }catch(e){
    console.error(e);
    if(token!==renderToken)return;
    app.innerHTML=navbar()+'<div class="section callout red"><h2>שגיאת טעינה</h2><p id="render-error-detail"></p></div>';
    const detail=app.querySelector<HTMLElement>('#render-error-detail');
    if(detail)detail.textContent=e instanceof Error?e.message:'Unknown application error';
  }
}
async function continueLearning(){const m=await getManifest();const n=firstIncompleteLevel(m);go(n===null?'curriculum':`level/${n}`)}
function calculate(tool:HTMLElement){
  const id=tool.dataset.tool||'';
  const vars:Record<string,number>={};
  tool.querySelectorAll<HTMLInputElement>('input[data-calc-var]').forEach(x=>vars[x.dataset.calcVar!]=Number(x.value||0));
  const result=evaluateCalculator(id,vars);
  const out=tool.querySelector<HTMLElement>('.result');
  if(!out)return;
  if(!result||!Number.isFinite(result.value)){out.textContent='—';return}
  out.textContent=result.pct?`${(result.value*100).toFixed(2)}%`:result.value.toLocaleString(undefined,{maximumFractionDigits:2});
}
export function bindInteractions(){
  document.addEventListener('click',async e=>{
    const el=(e.target as HTMLElement).closest<HTMLElement>('[data-route],[data-action]');
    if(!el)return;
    const route=el.dataset.route;
    if(route){go(route);return}
    switch(el.dataset.action){
      case'continue-learning':await continueLearning();break;
      case'jump':document.getElementById(el.dataset.target||'')?.scrollIntoView({behavior:'smooth',block:'start'});break;
      case'toggle-rubric':{const box=el.closest('.exam');box?.querySelector('.rubric')?.classList.toggle('show');break}
      case'grade-chapter':{
        const n=Number(el.dataset.level);const level=await getLevel(n);
        const scores=level.topics.map((_,i)=>Number((document.querySelector(`#ce_s_${n}_${i}`) as HTMLInputElement)?.value)||0);
        const answers=level.topics.map((_,i)=>(document.querySelector(`#ce_a_${n}_${i}`) as HTMLTextAreaElement)?.value||'');
        const oral=(document.querySelector(`#oral_${n}`) as HTMLTextAreaElement)?.value||'';
        const g=gradeChapter(level,scores);
        progressStore.setChapter(n,{attempted:true,passed:g.passed,avg:g.avg,scores:g.scores,answers,oral,date:new Date().toISOString()});
        const out=document.querySelector('#gradeOut');if(out)out.innerHTML=` <b class="${g.passed?'ok':'warn'}">${g.avg}% — ${g.passed?'PASSED':'REVIEW REQUIRED'}</b>`;
        break;
      }
      case'export-progress':{
        const a=document.createElement('a');const url=URL.createObjectURL(new Blob([JSON.stringify(progressStore.state,null,2)],{type:'application/json'}));
        a.href=url;a.download='Wave_Capital_University_v11_progress.json';a.click();URL.revokeObjectURL(url);break;
      }
      case'import-progress':{
        const input=document.createElement('input');input.type='file';input.accept='.json';
        input.onchange=()=>{const file=input.files?.[0];if(!file)return;const r=new FileReader();r.onload=()=>{try{progressStore.import(String(r.result));render()}catch{alert('Invalid progress file')}};r.readAsText(file)};input.click();break;
      }
      case'reset-progress':if(confirm('לאפס את כל ההתקדמות?')){progressStore.reset();render()}break;
    }
  });
  document.addEventListener('change',e=>{
    const el=e.target as HTMLInputElement|HTMLTextAreaElement;
    switch(el.dataset.action){
      case'checkpoint':progressStore.setCheck(Number(el.dataset.level),Number(el.dataset.topic),Number(el.dataset.check),(el as HTMLInputElement).checked);render();break;
      case'topic-score':progressStore.setTopicScore(Number(el.dataset.level),Number(el.dataset.topic),Number((el as HTMLInputElement).value));render();break;
      case'note':progressStore.setNote(el.dataset.key||'',el.value);break;
      case'case-answer':progressStore.setCase(el.dataset.case||'',el.value);break;
    }
  });
  document.addEventListener('input',e=>{const target=e.target as HTMLElement;const tool=target.closest<HTMLElement>('.tool[data-tool]');if(tool)calculate(tool)});
  document.addEventListener('keydown',e=>{const t=e.target as HTMLInputElement;if(t.id==='nav-search'&&e.key==='Enter')go('search/'+encodeURIComponent(t.value))});
}
