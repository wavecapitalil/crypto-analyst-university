function n(vars, key) { const v = Number(vars[key]); return Number.isFinite(v) ? v : 0; }
function div(a, b) { return b === 0 ? Number.NaN : a / b; }
export const TOOL_DEFINITIONS = [
    { id: 'vmc', title: 'Volume / Market Cap', fields: [{ key: 'vol', label: 'Screened / Verified Spot Volume' }, { key: 'mc', label: 'Market Cap' }], pct: true, calculate: v => div(n(v, 'vol'), n(v, 'mc')) },
    { id: 'vff', title: 'Volume / Free-Float MC', fields: [{ key: 'volff', label: 'Screened / Verified Spot Volume' }, { key: 'ff', label: 'Free-Float Market Cap' }], pct: true, calculate: v => div(n(v, 'volff'), n(v, 'ff')) },
    { id: 'ulf', title: 'Unlock / Free Float', fields: [{ key: 'ul', label: 'Unlock Value' }, { key: 'fl', label: 'Free Float Value' }], pct: true, calculate: v => div(n(v, 'ul'), n(v, 'fl')) },
    { id: 'dc', title: 'Dilution Coverage', fields: [{ key: 'bb', label: 'Buybacks' }, { key: 'burn', label: 'Burns' }, { key: 'dist', label: 'Distributions' }, { key: 'iss', label: 'New Issuance' }], pct: true, calculate: v => div(n(v, 'bb') + n(v, 'burn') + n(v, 'dist'), n(v, 'iss')) },
    { id: 'tr', title: 'Protocol Take Rate', fields: [{ key: 'rev', label: 'Protocol Revenue' }, { key: 'act', label: 'Economic Activity' }], pct: true, calculate: v => div(n(v, 'rev'), n(v, 'act')) },
    { id: 'fhr', title: 'FDV / Holder Revenue', fields: [{ key: 'fdv', label: 'FDV' }, { key: 'hr', label: 'Annual Holder Revenue' }], pct: false, calculate: v => div(n(v, 'fdv'), n(v, 'hr')) },
    { id: 'ir', title: 'Implied Revenue', fields: [{ key: 'val', label: 'Current Valuation' }, { key: 'mul', label: 'Target Multiple' }], pct: false, calculate: v => div(n(v, 'val'), n(v, 'mul')) },
    { id: 'ftp', title: 'Future Token Price', fields: [{ key: 'fv', label: 'Future Aggregate Value' }, { key: 'fs', label: 'Future Supply' }], pct: false, calculate: v => div(n(v, 'fv'), n(v, 'fs')) }
];
const byId = new Map(TOOL_DEFINITIONS.map(x => [x.id, x]));
export function evaluateCalculator(id, vars) {
    const def = byId.get(id);
    if (!def)
        return null;
    return { value: def.calculate(vars), pct: def.pct };
}
