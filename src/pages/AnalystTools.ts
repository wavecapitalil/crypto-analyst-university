import {TOOL_DEFINITIONS,type CalculatorDefinition} from '../features/tools/calculators.js';

function box(def:CalculatorDefinition){
  return `<div class="tool" data-tool="${def.id}"><h3>${def.title}</h3>${def.fields.map(f=>`<label>${f.label}</label><input data-calc-var="${f.key}" type="number" inputmode="decimal">`).join('')}<div class="result">—</div></div>`;
}
export async function analystTools(){
  return `<div class="section"><h1>Analyst Tools</h1><div class="toolgrid">${TOOL_DEFINITIONS.map(box).join('')}</div></div>`;
}
