"use client";
import { useEffect, useMemo, useState } from "react";
import Fuse from "fuse.js";

type Doc = { slug: string; title: string; text: string };

export default function SearchClient() {
  const [q, setQ] = useState("");
  const [docs, setDocs] = useState<Doc[]>([]);
  const [hits, setHits] = useState<{item: Doc; score?: number}[]>([]);

  useEffect(() => {
    fetch("/manual-index.json").then(r => r.json()).then(setDocs).catch(()=>{});
  }, []);

  const fuse = useMemo(() => {
    return new Fuse(docs, { keys: ["title","text"], includeScore: true, minMatchCharLength: 2, threshold: 0.35 });
  }, [docs]);

  useEffect(() => {
    if (!q.trim()) { setHits([]); return; }
    setHits(fuse.search(q).slice(0, 20));
  }, [q, fuse]);

  return (
    <div style={{margin:"12px 0 20px", display:"grid", gap:8}}>
      <div style={{display:"flex", gap:8}}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search the manual…" className="manual-input" />
        <button onClick={()=>setQ("")} className="btn">Clear</button>
      </div>
      {q && (
        <div style={{border:"1px solid #eee", borderRadius:12, background:"#fff"}}>
          {hits.length === 0 ? (
            <div style={{padding:12, color:"#666"}}>No results.</div>
          ) : hits.map(({item, score}) => (
            <a key={item.slug} href={`/manual/${item.slug}`} style={{display:"block", padding:"12px 14px", color:"#111", textDecoration:"none", borderTop:"1px solid #f2f2f2"}}>
              <div style={{fontWeight:600}}>{item.title}</div>
              <div style={{color:"#666", fontSize:13, marginTop:4, whiteSpace:"nowrap", textOverflow:"ellipsis", overflow:"hidden"}}>
                {item.text.slice(0, 160)}…
              </div>
            </a>
          ))}
        </div>
      )}
      <style jsx>{`
        .manual-input { height:36px; padding:6px 10px; border:1px solid #ddd; border-radius:8px; width:100%; }
        .btn { border:1px solid #ddd; border-radius:999px; padding:8px 12px; background:#fff; }
      `}</style>
    </div>
  );
}
