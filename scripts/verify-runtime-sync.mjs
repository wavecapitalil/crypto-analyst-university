import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const [beforeDir,afterDir]=process.argv.slice(2);
if(!beforeDir||!afterDir){
  console.error('usage: node scripts/verify-runtime-sync.mjs <committed-app> <built-app>');
  process.exit(2);
}
function list(dir,base=dir,out=[]){
  for(const name of fs.readdirSync(dir)){
    const p=path.join(dir,name);
    const st=fs.statSync(p);
    if(st.isDirectory())list(p,base,out);
    else if(name.endsWith('.js'))out.push(path.relative(base,p));
  }
  return out.sort();
}
function canonical(file){
  const source=fs.readFileSync(file,'utf8');
  const ast=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.JS);
  return ts.createPrinter({newLine:ts.NewLineKind.LineFeed,removeComments:false}).printFile(ast).trim();
}
const before=new Set(list(beforeDir));
const after=new Set(list(afterDir));
const all=[...new Set([...before,...after])].sort();
const diff=[];
for(const rel of all){
  if(!before.has(rel)||!after.has(rel)){diff.push(`${rel}: file set differs`);continue}
  if(canonical(path.join(beforeDir,rel))!==canonical(path.join(afterDir,rel)))diff.push(`${rel}: compiled runtime differs from committed runtime`);
}
if(diff.length){
  console.error('Runtime drift detected. Run npm run build and commit the generated app/ output.');
  console.error(diff.join('\n'));
  process.exit(1);
}
console.log(`Runtime sync OK: ${all.length} JS files`);
