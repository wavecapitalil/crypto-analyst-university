export function searchLevels(levels, term) { const q = term.trim().toLowerCase(); const out = []; if (!q)
    return out; for (const l of levels) {
    if (`${l.title} ${l.obj}`.toLowerCase().includes(q))
        out.push({ level: l.n, title: l.title, subtitle: l.obj });
    l.topics.forEach((t, i) => { const d = t.deep; const text = `${t.name} ${t.definition} ${d?.mental || ''} ${d?.why || ''}`.toLowerCase(); if (text.includes(q))
        out.push({ level: l.n, topic: i, title: t.name, subtitle: l.title }); });
} return out; }
