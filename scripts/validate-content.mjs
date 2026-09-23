import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const read=(p)=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const manifest=read('content/manifest.json');
const sources=read('content/sources.json');
const cases=read('content/cases.json');
const canon=read('content/canon.json');
const fail=[];
const levelIds=new Set();
const sourceIds=new Set(Object.keys(sources));
let topics=0;

if(!Array.isArray(manifest.levels)||manifest.levels.length===0)fail.push('manifest.levels must be a non-empty array');

for(const s of manifest.levels||[]){
  if(!Number.isInteger(s.n)||s.n<0)fail.push(`invalid level id ${s.n}`);
  if(levelIds.has(s.n))fail.push(`duplicate level ${s.n}`);
  levelIds.add(s.n);

  const p=path.join(root,'content/curriculum',`level-${String(s.n).padStart(2,'0')}.json`);
  if(!fs.existsSync(p)){fail.push(`missing ${p}`);continue}
  const l=JSON.parse(fs.readFileSync(p,'utf8'));
  if(l.n!==s.n)fail.push(`level mismatch ${s.n}`);
  if(!Array.isArray(l.topics)||l.topics.length!==s.topicCount)fail.push(`topic count mismatch L${s.n}`);
  topics+=l.topics?.length||0;

  for(const ref of l.source_refs||[])if(!sourceIds.has(ref))fail.push(`unknown source ${ref} in L${s.n}`);
  for(const [i,t] of (l.topics||[]).entries()){
    if(!t.name||!t.deep)fail.push(`invalid topic L${s.n}:${i}`);
    if(!Array.isArray(t.deep?.learning_outcomes)||t.deep.learning_outcomes.length!==5)fail.push(`checkpoints !=5 L${s.n}:${i}`);
    if(!t.deep?.worked_example)fail.push(`worked example missing L${s.n}:${i}`);
    const refs=t.deep?.source_refs||t.deep?.sources||[];
    for(const ref of Array.isArray(refs)?refs:[])if(!sourceIds.has(ref))fail.push(`unknown topic source ${ref} in L${s.n}:${i}`);
  }
}

for(const s of manifest.levels||[])for(const p of s.prereq||[])if(!levelIds.has(p))fail.push(`unknown prerequisite L${p} referenced by L${s.n}`);

if(Number(manifest.meta?.levels)!==manifest.levels.length)fail.push(`meta.levels mismatch: ${manifest.meta?.levels} vs ${manifest.levels.length}`);
if(Number(manifest.meta?.topics)!==topics)fail.push(`meta.topics mismatch: ${manifest.meta?.topics} vs ${topics}`);

for(const [id,s] of Object.entries(sources)){
  if(!s?.title||!s?.type||!s?.url)fail.push(`invalid source ${id}`);
  try{const u=new URL(s.url);if(!['http:','https:'].includes(u.protocol))fail.push(`unsafe source URL ${id}`)}catch{fail.push(`invalid source URL ${id}`)}
}
for(const [group,ids] of Object.entries(canon))for(const id of Array.isArray(ids)?ids:[])if(!sourceIds.has(id))fail.push(`canon ${group} references unknown source ${id}`);

const caseIds=new Set();
for(const [i,c] of (Array.isArray(cases)?cases:[]).entries()){
  if(!c?.id||typeof c.id!=='string')fail.push(`case ${i} missing stable id`);
  else if(caseIds.has(c.id))fail.push(`duplicate case id ${c.id}`);
  else caseIds.add(c.id);
  const qs=c.questions||c.q;
  if(!(c.title||c.t)||!(c.data||c.d)||!Array.isArray(qs)||qs.length<1)fail.push(`invalid case ${c?.id||i}`);
}

if(fail.length){console.error(fail.join('\n'));process.exit(1)}
console.log(`Content OK: ${manifest.levels.length} levels / ${topics} topics / ${caseIds.size} cases / ${sourceIds.size} sources`);
