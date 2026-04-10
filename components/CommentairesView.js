'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Heart, Reply, Trash2, TrendingUp, AlertCircle, Check, ThumbsUp, ThumbsDown, Search, ChevronDown } from 'lucide-react';

// ─── Shared style tokens ──────────────────────────────────────────────────────
const S = {
  card:  { background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, padding:20 },
  modal: { background:'#13131b', border:'1px solid rgba(255,255,255,0.1)', borderRadius:16, padding:28, maxWidth:560, width:'100%' },
  field: { background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:8, padding:'9px 14px', color:'#fff', width:'100%', fontSize:14, outline:'none', boxSizing:'border-box', colorScheme:'dark' },
  label: { fontSize:13, fontWeight:500, color:'rgba(255,255,255,0.7)', display:'block', marginBottom:6 },
};

const BTN = ({ children, onClick, color='default', size='md', disabled=false }) => {
  const sz = { sm:'5px 12px', md:'8px 16px', lg:'10px 22px' };
  const cols = {
    default:     { background:'rgba(255,255,255,0.07)', color:'#fff', border:'1px solid rgba(255,255,255,0.18)' },
    brand:       { background:'#7c3aed', color:'#fff', border:'1px solid #7c3aed' },
    red:         { background:'rgba(239,68,68,0.12)', color:'#f87171', border:'1px solid rgba(239,68,68,0.3)' },
    green:       { background:'rgba(34,197,94,0.12)', color:'#4ade80', border:'1px solid rgba(34,197,94,0.3)' },
  };
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ ...cols[color]||cols.default, padding:sz[size], borderRadius:8, fontSize:13, fontWeight:500, cursor:disabled?'not-allowed':'pointer', opacity:disabled?0.45:1, display:'inline-flex', alignItems:'center', gap:6, transition:'all 0.15s', whiteSpace:'nowrap' }}
      onMouseEnter={e=>!disabled&&(e.currentTarget.style.filter='brightness(1.15)')}
      onMouseLeave={e=>!disabled&&(e.currentTarget.style.filter='')}
    >{children}</button>
  );
};

const platStyle = { facebook:{background:'rgba(59,130,246,0.18)',color:'#60a5fa',border:'1px solid rgba(59,130,246,0.3)'}, instagram:{background:'rgba(236,72,153,0.18)',color:'#f472b6',border:'1px solid rgba(236,72,153,0.3)'}, tiktok:{background:'rgba(168,85,247,0.18)',color:'#c084fc',border:'1px solid rgba(168,85,247,0.3)'} };
const sentStyle = { positive:{background:'rgba(34,197,94,0.15)',color:'#4ade80',border:'1px solid rgba(34,197,94,0.3)'}, negative:{background:'rgba(239,68,68,0.15)',color:'#f87171',border:'1px solid rgba(239,68,68,0.3)'}, neutral:{background:'rgba(156,163,175,0.15)',color:'#9ca3af',border:'1px solid rgba(156,163,175,0.3)'} };
const Chip = ({ label, style, icon }) => <span style={{ padding:'2px 10px', borderRadius:999, fontSize:11, fontWeight:600, display:'inline-flex', alignItems:'center', gap:4, ...style }}>{icon}{label}</span>;

const Dropdown = ({ value, onChange, options, style={} }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const close = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    if (open) document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);
  const selected = options.find(o => String(o.value) === String(value));
  const trigger = { background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:8, padding:'9px 14px', color:'#fff', fontSize:14, cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', userSelect:'none', transition:'border-color 0.15s, background 0.15s', boxSizing:'border-box', width:'100%' };
  return (
    <div ref={ref} style={{ position:'relative', ...style }}>
      <div onClick={()=>setOpen(p=>!p)} style={trigger}
        onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.1)';e.currentTarget.style.borderColor='rgba(255,255,255,0.28)';}}
        onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.06)';e.currentTarget.style.borderColor='rgba(255,255,255,0.15)';}}>        <span style={{color:selected?'#fff':'rgba(255,255,255,0.4)'}}>{selected?.label??''}</span>
        <ChevronDown style={{width:14,height:14,color:'rgba(255,255,255,0.45)',flexShrink:0,transform:open?'rotate(180deg)':'none',transition:'transform 0.15s'}} />
      </div>
      {open && (
        <div style={{position:'absolute',top:'calc(100% + 4px)',left:0,right:0,background:'#13131b',border:'1px solid rgba(255,255,255,0.12)',borderRadius:8,zIndex:300,overflow:'hidden',boxShadow:'0 8px 32px rgba(0,0,0,0.6)'}}>
          {options.map(opt=>(
            <div key={opt.value} onClick={()=>{onChange(opt.value);setOpen(false);}}
              style={{padding:'9px 14px',cursor:'pointer',fontSize:13,color:String(opt.value)===String(value)?'#c4b5fd':'rgba(255,255,255,0.85)',background:String(opt.value)===String(value)?'rgba(124,58,237,0.2)':'transparent',transition:'background 0.1s'}}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(124,58,237,0.28)';e.currentTarget.style.color='#fff';}}
              onMouseLeave={e=>{e.currentTarget.style.background=String(opt.value)===String(value)?'rgba(124,58,237,0.2)':'transparent';e.currentTarget.style.color=String(opt.value)===String(value)?'#c4b5fd':'rgba(255,255,255,0.85)';}}
            >{opt.label}</div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_COMMENTS = [
  { id:'com_1', author:'Aminata Diallo',  avatar:'https://i.pravatar.cc/150?img=1',  platform:'facebook',  adName:'Lancement Produit Skincare',      content:'Produit incroyable ! Ma peau n\'a jamais été aussi douce. Je recommande à 100% 🌟', sentiment:'positive', timestamp:'2024-03-25T14:30:00Z', likes:12, hasReplied:false },
  { id:'com_2', author:'Moussa Koné',     avatar:'https://i.pravatar.cc/150?img=2',  platform:'instagram', adName:'Awareness Marque - Q1',            content:'Livraison trop longue, j\'ai attendu 2 semaines 😤',                                  sentiment:'negative', timestamp:'2024-03-25T12:15:00Z', likes:3,  hasReplied:true  },
  { id:'com_3', author:'Fatou Sow',       avatar:'https://i.pravatar.cc/150?img=3',  platform:'tiktok',    adName:'Promo Flash Weekend',              content:'C\'est quoi le prix exactement ? Le lien ne fonctionne pas',                         sentiment:'neutral',  timestamp:'2024-03-25T10:45:00Z', likes:1,  hasReplied:false },
  { id:'com_4', author:'Ibrahima Ndiaye', avatar:'https://i.pravatar.cc/150?img=4',  platform:'facebook',  adName:'Retargeting Panier Abandonné',     content:'Excellent service client ! Problème résolu en 24h. Merci 🙏',                        sentiment:'positive', timestamp:'2024-03-24T18:20:00Z', likes:8,  hasReplied:true  },
  { id:'com_5', author:'Aïcha Touré',     avatar:'https://i.pravatar.cc/150?img=5',  platform:'instagram', adName:'Lancement Produit Skincare',      content:'Livraison rapide à Dakar. Produit conforme à la description 👍',                     sentiment:'positive', timestamp:'2024-03-24T16:00:00Z', likes:15, hasReplied:false },
  { id:'com_6', author:'Ousmane Ba',      avatar:'https://i.pravatar.cc/150?img=6',  platform:'tiktok',    adName:'Promo Flash Weekend',              content:'Arnaque ! J\'ai payé mais rien reçu 😡',                                             sentiment:'negative', timestamp:'2024-03-24T14:30:00Z', likes:0,  hasReplied:false },
  { id:'com_7', author:'Mariam Cissé',    avatar:'https://i.pravatar.cc/150?img=7',  platform:'facebook',  adName:'Awareness Marque - Q1',            content:'Vous livrez en Côte d\'Ivoire ?',                                                    sentiment:'neutral',  timestamp:'2024-03-24T11:15:00Z', likes:2,  hasReplied:true  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmtTime = (ts) => {
  const d = Math.floor((Date.now() - new Date(ts)) / 86400000);
  const h = Math.floor((Date.now() - new Date(ts)) / 3600000);
  const m = Math.floor((Date.now() - new Date(ts)) / 60000);
  if (d >= 1) return `Il y a ${d}j`; if (h >= 1) return `Il y a ${h}h`; return `Il y a ${m}min`;
};

// ─── Main component ───────────────────────────────────────────────────────────
export default function CommentairesView({ supabase, user }) {
  const [comments, setComments]             = useState(MOCK_COMMENTS);
  const [activeTab, setActiveTab]           = useState('all');
  const [search, setSearch]                 = useState('');
  const [filterSent, setFilterSent]         = useState('all');
  const [filterPlat, setFilterPlat]         = useState('all');
  const [replyModal, setReplyModal]         = useState(null);
  const [replyText, setReplyText]           = useState('');

  const stats = {
    total:     comments.length,
    unreplied: comments.filter(c => !c.hasReplied).length,
    positive:  comments.filter(c => c.sentiment === 'positive').length,
    negative:  comments.filter(c => c.sentiment === 'negative').length,
  };

  const filtered = comments.filter(c => {
    if (activeTab === 'unreplied' && c.hasReplied) return false;
    if (activeTab === 'positive'  && c.sentiment !== 'positive') return false;
    if (activeTab === 'negative'  && c.sentiment !== 'negative') return false;
    if (filterSent !== 'all' && c.sentiment !== filterSent) return false;
    if (filterPlat !== 'all' && c.platform  !== filterPlat) return false;
    if (search && !c.content.toLowerCase().includes(search.toLowerCase()) && !c.author.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const submitReply = () => {
    if (!replyText.trim()) return;
    setComments(p => p.map(c => c.id === replyModal.id ? { ...c, hasReplied:true } : c));
    setReplyModal(null); setReplyText('');
  };

  const tabSt = (v) => ({ padding:'7px 14px', borderRadius:8, border:'none', cursor:'pointer', fontSize:13, fontWeight:500, transition:'all 0.15s', background:activeTab===v?'rgba(124,58,237,0.25)':'transparent', color:activeTab===v?'#fff':'rgba(255,255,255,0.55)' });

  return (
    <div style={{ minHeight:'100vh', padding:24 }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom:24 }}>
          <h1 style={{ fontSize:26, fontWeight:700, color:'#fff', display:'flex', alignItems:'center', gap:10, margin:0 }}>
            <MessageSquare style={{ width:28, height:28, color:'#7c3aed' }} /> Gestion des Commentaires
          </h1>
          <p style={{ color:'rgba(255,255,255,0.5)', marginTop:4, fontSize:14 }}>Répondez et gérez les commentaires sur vos publicités</p>
        </div>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:12, marginBottom:24 }}>
          {[
            ['Total',           stats.total,     <MessageSquare style={{width:18,height:18,color:'#60a5fa'}}/>, 'rgba(59,130,246,0.15)',  '#fff'    ],
            ['Sans réponse',    stats.unreplied, <AlertCircle   style={{width:18,height:18,color:'#facc15'}}/>, 'rgba(234,179,8,0.15)',   '#facc15' ],
            ['Positifs',        stats.positive,  <ThumbsUp      style={{width:18,height:18,color:'#4ade80'}}/>, 'rgba(34,197,94,0.15)',   '#4ade80' ],
            ['Négatifs',        stats.negative,  <ThumbsDown    style={{width:18,height:18,color:'#f87171'}}/>, 'rgba(239,68,68,0.15)',   '#f87171' ],
            ['Tps de réponse',  '2h 15min',      <TrendingUp    style={{width:18,height:18,color:'#c084fc'}}/>, 'rgba(168,85,247,0.15)',  '#fff'    ],
          ].map(([label, val, ico, bg, col], i) => (
            <div key={i} style={{ ...S.card, padding:16, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div>
                <p style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginBottom:4 }}>{label}</p>
                <p style={{ fontSize:20, fontWeight:700, color:col }}>{val}</p>
              </div>
              <div style={{ width:38, height:38, borderRadius:10, background:bg, display:'flex', alignItems:'center', justifyContent:'center' }}>{ico}</div>
            </div>
          ))}
        </div>

        {/* Filters row */}
        <div style={{ ...S.card, display:'flex', alignItems:'center', gap:12, marginBottom:20, flexWrap:'wrap' }}>
          <div style={{ position:'relative', flex:'1 1 200px', minWidth:180 }}>
            <Search style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', width:15, height:15, color:'rgba(255,255,255,0.4)', pointerEvents:'none' }} />
            <input style={{ ...S.field, paddingLeft:32 }} placeholder="Rechercher..." value={search} onChange={e=>setSearch(e.target.value)} />
          </div>
          <Dropdown value={filterSent} onChange={setFilterSent} style={{minWidth:160}}
            options={[{value:'all',label:'Tous sentiments'},{value:'positive',label:'Positifs'},{value:'negative',label:'Négatifs'},{value:'neutral',label:'Neutres'}]}
          />
          <Dropdown value={filterPlat} onChange={setFilterPlat} style={{minWidth:160}}
            options={[{value:'all',label:'Toutes plateformes'},{value:'facebook',label:'Facebook'},{value:'instagram',label:'Instagram'},{value:'tiktok',label:'TikTok'}]}
          />
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:4, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, padding:4, marginBottom:20, width:'fit-content' }}>
          {[['all',`Tous (${comments.length})`],['unreplied',`Sans réponse (${stats.unreplied})`],['positive',`Positifs (${stats.positive})`],['negative',`Négatifs (${stats.negative})`]].map(([v,lbl])=>(
            <button key={v} onClick={()=>setActiveTab(v)} style={tabSt(v)}>{lbl}</button>
          ))}
        </div>

        {/* Comment cards */}
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {filtered.length === 0 ? (
            <div style={{ ...S.card, padding:48, textAlign:'center' }}>
              <MessageSquare style={{ width:40, height:40, color:'rgba(255,255,255,0.2)', margin:'0 auto 12px' }} />
              <p style={{ color:'rgba(255,255,255,0.5)' }}>Aucun commentaire trouvé</p>
            </div>
          ) : filtered.map(c => (
            <div key={c.id} style={S.card}>
              <div style={{ display:'flex', gap:14 }}>
                <img src={c.avatar} alt={c.author} style={{ width:44, height:44, borderRadius:'50%', flexShrink:0 }} />
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:4 }}>
                    <span style={{ fontWeight:600, color:'#fff', fontSize:14 }}>{c.author}</span>
                    <Chip label={c.platform.charAt(0).toUpperCase()+c.platform.slice(1)} style={platStyle[c.platform]} />
                    <Chip
                      label={c.sentiment==='positive'?'Positif':c.sentiment==='negative'?'Négatif':'Neutre'}
                      style={sentStyle[c.sentiment]}
                      icon={c.sentiment==='positive'?<ThumbsUp style={{width:10,height:10}}/>:c.sentiment==='negative'?<ThumbsDown style={{width:10,height:10}}/>:null}
                    />
                    {c.hasReplied && <Chip label="Répondu" style={{ background:'rgba(34,197,94,0.15)', color:'#4ade80', border:'1px solid rgba(34,197,94,0.3)' }} icon={<Check style={{width:10,height:10}}/>} />}
                  </div>
                  <p style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginBottom:8 }}>Sur "{c.adName}" · {fmtTime(c.timestamp)}</p>
                  <p style={{ color:'rgba(255,255,255,0.88)', fontSize:14, marginBottom:12, lineHeight:1.5 }}>{c.content}</p>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <span style={{ fontSize:12, color:'rgba(255,255,255,0.4)', display:'flex', alignItems:'center', gap:4 }}>
                      <Heart style={{width:13,height:13}}/>{c.likes}
                    </span>
                    <BTN size="sm" onClick={()=>{ setReplyModal(c); setReplyText(''); }}>
                      <Reply style={{width:12,height:12}}/> Répondre
                    </BTN>
                    <BTN size="sm" color="red" onClick={()=>{ if(confirm('Masquer ce commentaire ?')) setComments(p=>p.filter(x=>x.id!==c.id)); }}>
                      <Trash2 style={{width:12,height:12}}/> Masquer
                    </BTN>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reply modal */}
        {replyModal && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:50, padding:16 }}>
            <div style={S.modal}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                <h2 style={{ fontSize:16, fontWeight:700, color:'#fff', display:'flex', alignItems:'center', gap:8, margin:0 }}>
                  <Reply style={{width:18,height:18,color:'#7c3aed'}}/> Répondre à {replyModal.author}
                </h2>
                <button onClick={()=>setReplyModal(null)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.5)', cursor:'pointer', fontSize:22, lineHeight:1 }}>×</button>
              </div>
              <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:8, padding:12, marginBottom:14 }}>
                <p style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginBottom:6 }}>Commentaire original</p>
                <p style={{ color:'rgba(255,255,255,0.85)', fontSize:14 }}>{replyModal.content}</p>
              </div>
              <label style={S.label}>Votre réponse</label>
              <textarea
                value={replyText} onChange={e=>setReplyText(e.target.value)}
                placeholder="Écrivez votre réponse..."
                rows={4}
                style={{ ...S.field, minHeight:100, resize:'vertical', marginBottom:16 }}
              />
              <div style={{ display:'flex', justifyContent:'flex-end', gap:10, paddingTop:14, borderTop:'1px solid rgba(255,255,255,0.08)' }}>
                <BTN onClick={()=>setReplyModal(null)}>Annuler</BTN>
                <BTN color="brand" disabled={!replyText.trim()} onClick={submitReply}>
                  <Send style={{width:14,height:14}}/> Envoyer
                </BTN>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
