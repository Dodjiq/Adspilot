'use client';

import { useState, useEffect, useRef } from 'react';
import { Target, Plus, Play, Pause, Trash2, Edit, TrendingUp, DollarSign, Eye, MousePointerClick, Calendar, AlertCircle, Check, X, Facebook, Video as VideoIcon, Settings, ChevronRight, ChevronLeft, ChevronDown, Upload, Globe, Users, Crosshair, Zap, ShoppingCart, MessageSquare, Heart, Smartphone, Copy } from 'lucide-react';

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = {
  card:   { background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, padding:20 },
  modal:  { background:'#13131b', border:'1px solid rgba(255,255,255,0.1)', borderRadius:16, padding:28, maxWidth:680, width:'100%', maxHeight:'90vh', overflowY:'auto' },
  field:  { background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:8, padding:'10px 14px', color:'#fff', width:'100%', fontSize:14, outline:'none', boxSizing:'border-box', colorScheme:'dark' },
  label:  { fontSize:13, fontWeight:500, color:'rgba(255,255,255,0.75)', display:'block', marginBottom:6 },
  muted:  { fontSize:12, color:'rgba(255,255,255,0.35)', marginTop:5 },
  grid2:  { display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 },
  row:    { display:'flex', alignItems:'center', gap:10 },
  col:    { display:'flex', flexDirection:'column', gap:14 },
};

// ─── BTN ──────────────────────────────────────────────────────────────────────
const BTN = ({ children, onClick, color='default', size='md', disabled=false, style={} }) => {
  const sz = { sm:'6px 12px', md:'9px 18px', lg:'11px 22px' };
  const cols = {
    default: { background:'rgba(255,255,255,0.07)', color:'#fff', border:'1px solid rgba(255,255,255,0.18)' },
    brand:   { background:'#7c3aed', color:'#fff', border:'1px solid #7c3aed' },
    red:     { background:'rgba(239,68,68,0.12)', color:'#f87171', border:'1px solid rgba(239,68,68,0.3)' },
    green:   { background:'rgba(34,197,94,0.12)', color:'#4ade80', border:'1px solid rgba(34,197,94,0.3)' },
    ghost:   { background:'transparent', color:'rgba(255,255,255,0.6)', border:'1px solid transparent' },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ ...cols[color]||cols.default, padding:sz[size], borderRadius:8, fontSize:13, fontWeight:500, cursor:disabled?'not-allowed':'pointer', opacity:disabled?0.45:1, display:'inline-flex', alignItems:'center', gap:6, transition:'all 0.15s', whiteSpace:'nowrap', ...style }}
      onMouseEnter={e => !disabled && (e.currentTarget.style.filter='brightness(1.15)')}
      onMouseLeave={e => !disabled && (e.currentTarget.style.filter='')}
    >{children}</button>
  );
};

// ─── Checkbox ─────────────────────────────────────────────────────────────────
const CB = ({ checked, onChange, label }) => (
  <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', userSelect:'none' }}>
    <div onClick={onChange} style={{ width:18, height:18, borderRadius:4, border:`2px solid ${checked?'#7c3aed':'rgba(255,255,255,0.25)'}`, background:checked?'#7c3aed':'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, cursor:'pointer' }}>
      {checked && <Check style={{ width:11, height:11, color:'#fff' }} />}
    </div>
    <span style={{ fontSize:13, color:'rgba(255,255,255,0.8)' }}>{label}</span>
  </label>
);

// ─── Toggle ───────────────────────────────────────────────────────────────────
const Toggle = ({ on, onChange, label }) => (
  <label style={{ display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer' }}>
    <span style={{ fontSize:13, color:'rgba(255,255,255,0.8)' }}>{label}</span>
    <div onClick={onChange} style={{ width:36, height:20, borderRadius:10, background:on?'#7c3aed':'rgba(255,255,255,0.15)', position:'relative', cursor:'pointer', transition:'background 0.2s' }}>
      <div style={{ position:'absolute', top:2, left:on?'18px':'2px', width:16, height:16, borderRadius:'50%', background:'#fff', transition:'left 0.2s' }} />
    </div>
  </label>
);

// ─── Option card ──────────────────────────────────────────────────────────────
const OptionCard = ({ selected, onClick, icon, title, desc }) => (
  <div onClick={onClick} style={{ border:`2px solid ${selected?'#7c3aed':'rgba(255,255,255,0.1)'}`, background:selected?'rgba(124,58,237,0.12)':'rgba(255,255,255,0.03)', borderRadius:10, padding:'12px 14px', cursor:'pointer', transition:'all 0.15s' }}>
    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
      <span style={{ fontSize:20 }}>{icon}</span>
      <div>
        <p style={{ color:'#fff', fontWeight:600, fontSize:13, margin:0 }}>{title}</p>
        {desc && <p style={{ color:'rgba(255,255,255,0.45)', fontSize:11, margin:'2px 0 0' }}>{desc}</p>}
      </div>
      {selected && <Check style={{ width:16, height:16, color:'#7c3aed', marginLeft:'auto', flexShrink:0 }} />}
    </div>
  </div>
);

// ─── Dropdown ────────────────────────────────────────────────────────────────
const Dropdown = ({ value, onChange, options, style={} }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const close = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    if (open) document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);
  const selected = options.find(o => String(o.value) === String(value));
  const trigger = { background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:8, padding:'10px 14px', color:'#fff', fontSize:14, cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', userSelect:'none', width:'100%', transition:'border-color 0.15s, background 0.15s', boxSizing:'border-box' };
  return (
    <div ref={ref} style={{ position:'relative', ...style }}>
      <div onClick={()=>setOpen(p=>!p)} style={trigger}
        onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.1)';e.currentTarget.style.borderColor='rgba(255,255,255,0.28)';}}
        onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.06)';e.currentTarget.style.borderColor='rgba(255,255,255,0.15)';}}>
        <span style={{color:selected?'#fff':'rgba(255,255,255,0.4)'}}>{selected?.label ?? ''}</span>
        <ChevronDown style={{width:14,height:14,color:'rgba(255,255,255,0.45)',flexShrink:0,transform:open?'rotate(180deg)':'none',transition:'transform 0.15s'}} />
      </div>
      {open && (
        <div style={{position:'absolute',top:'calc(100% + 4px)',left:0,right:0,background:'#13131b',border:'1px solid rgba(255,255,255,0.12)',borderRadius:8,zIndex:300,overflow:'hidden',boxShadow:'0 8px 32px rgba(0,0,0,0.6)'}}>
          {options.map(opt=>(
            <div key={opt.value} onClick={()=>{onChange(opt.value);setOpen(false);}}
              style={{padding:'9px 14px',cursor:'pointer',fontSize:13,color:String(opt.value)===String(value)?'#c4b5fd':'rgba(255,255,255,0.85)',background:String(opt.value)===String(value)?'rgba(124,58,237,0.2)':'transparent',transition:'background 0.1s'}}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(124,58,237,0.28)';e.currentTarget.style.color='#fff';}}
              onMouseLeave={e=>{e.currentTarget.style.background=String(opt.value)===String(value)?'rgba(124,58,237,0.2)':'transparent';e.currentTarget.style.color=String(opt.value)===String(value)?'#c4b5fd':'rgba(255,255,255,0.85)';}}>
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Badge ────────────────────────────────────────────────────────────────────
const Badge = ({ label, style }) => (
  <span style={{ padding:'2px 10px', borderRadius:999, fontSize:11, fontWeight:600, display:'inline-flex', alignItems:'center', ...style }}>{label}</span>
);

// ─── Data ─────────────────────────────────────────────────────────────────────
const MOCK_CAMPAIGNS = [
  {
    id:'camp_1', name:'Lancement Produit Skincare', status:'active', platform:'facebook',
    budget:5000, spent:3200, impressions:450000, clicks:12500, conversions:340, ctr:2.78, cpc:0.26, roas:4.2,
    startDate:'2024-03-01', endDate:'2024-03-31', objective:'conversions',
    adsets:[
      { id:'as_1', name:'Femmes 25-44 — Mode & Beauté', status:'active', budget:2500, spent:1800, location:'Sénégal, CI', ageMin:25, ageMax:44, gender:'female', impressions:280000, clicks:7800, conversions:210,
        ads:[
          { id:'ad_1_1', name:'Visuel Robe Rouge — Image', format:'image', status:'active', cta:'Acheter maintenant', impressions:160000, clicks:4600, ctr:2.88 },
          { id:'ad_1_2', name:'Présentation Collection — Vidéo', format:'video', status:'active', cta:'En savoir plus', impressions:120000, clicks:3200, ctr:2.67 },
        ]
      },
      { id:'as_2', name:'Retargeting Visiteurs Site', status:'paused', budget:1500, spent:980, location:'Sénégal, CI', ageMin:18, ageMax:65, gender:'all', impressions:170000, clicks:4700, conversions:130,
        ads:[
          { id:'ad_2_1', name:'Offre -20% Panier Abandonné', format:'carousel', status:'active', cta:'Acheter maintenant', impressions:170000, clicks:4700, ctr:2.76 },
        ]
      },
    ]
  },
  {
    id:'camp_2', name:'Awareness Marque - Q1', status:'active', platform:'instagram',
    budget:3000, spent:2800, impressions:890000, clicks:8900, conversions:180, ctr:1.0, cpc:0.31, roas:2.8,
    startDate:'2024-03-10', endDate:'2024-04-10', objective:'reach',
    adsets:[
      { id:'as_3', name:'Audience Large 18-35', status:'active', budget:3000, spent:2800, location:'France, Belgique', ageMin:18, ageMax:35, gender:'all', impressions:890000, clicks:8900, conversions:180,
        ads:[
          { id:'ad_3_1', name:'Brand Story — Reels', format:'video', status:'active', cta:'En savoir plus', impressions:890000, clicks:8900, ctr:1.0 },
        ]
      },
    ]
  },
  {
    id:'camp_3', name:'Promo Flash Weekend', status:'paused', platform:'tiktok',
    budget:2000, spent:1200, impressions:320000, clicks:6400, conversions:95, ctr:2.0, cpc:0.19, roas:3.5,
    startDate:'2024-03-15', endDate:'2024-03-17', objective:'traffic',
    adsets:[
      { id:'as_4', name:'Audience TikTok 18-24', status:'paused', budget:2000, spent:1200, location:'Afrique Subsaharienne', ageMin:18, ageMax:24, gender:'all', impressions:320000, clicks:6400, conversions:95,
        ads:[
          { id:'ad_4_1', name:'UGC Promo Flash', format:'video', status:'paused', cta:'Acheter maintenant', impressions:320000, clicks:6400, ctr:2.0 },
        ]
      },
    ]
  },
  {
    id:'camp_4', name:'Retargeting Panier Abandonné', status:'active', platform:'facebook',
    budget:1500, spent:890, impressions:125000, clicks:3750, conversions:210, ctr:3.0, cpc:0.24, roas:5.8,
    startDate:'2024-03-20', endDate:'2024-04-20', objective:'conversions',
    adsets:[
      { id:'as_5', name:'Visiteurs -7j sans achat', status:'active', budget:1500, spent:890, location:'Sénégal', ageMin:18, ageMax:65, gender:'all', impressions:125000, clicks:3750, conversions:210,
        ads:[
          { id:'ad_5_1', name:'Rappel Panier — Carousel', format:'carousel', status:'active', cta:'Acheter maintenant', impressions:125000, clicks:3750, ctr:3.0 },
        ]
      },
    ]
  },
];

// ─── Objectives per platform ───────────────────────────────────────────────
const META_OBJECTIVES = [
  { id:'awareness',  icon:'👁️',  title:'Notoriété',      desc:'Montrer vos pubs au plus grand nombre' },
  { id:'traffic',    icon:'🚗',  title:'Trafic',          desc:'Envoyer des personnes vers votre site / app' },
  { id:'engagement', icon:'💬',  title:'Interactions',    desc:'Likes, commentaires, partages, messages' },
  { id:'leads',      icon:'📋',  title:'Prospects',       desc:'Formulaire instantané ou appel' },
  { id:'app',        icon:'📱',  title:'Promotion d\'app', desc:'Téléchargements ou utilisation de l\'app' },
  { id:'sales',      icon:'🛒',  title:'Ventes',          desc:'Achats sur votre site, boutique ou app' },
];
const TIKTOK_OBJECTIVES = [
  { id:'reach',        icon:'👁️',  title:'Portée',              desc:'Diffuser à un maximum d\'utilisateurs' },
  { id:'traffic',      icon:'🚗',  title:'Trafic',               desc:'Diriger vers votre site ou app' },
  { id:'app_installs', icon:'📱',  title:'Installations d\'app', desc:'Encourager les téléchargements' },
  { id:'video_views',  icon:'▶️',  title:'Vues vidéo',           desc:'Maximiser les lectures de vos vidéos' },
  { id:'community',    icon:'👥',  title:'Interactions compte',  desc:'Followers, visites de profil' },
  { id:'leads',        icon:'📋',  title:'Génération de leads',  desc:'Formulaire natif dans TikTok' },
  { id:'conversions',  icon:'🛒',  title:'Conversions site web', desc:'Actions de valeur sur votre site' },
];
const META_PLACEMENTS = ['Facebook Feed','Instagram Feed','Facebook Stories','Instagram Stories','Instagram Reels','Facebook Reels','Messenger','Audience Network'];
const TIKTOK_PLACEMENTS = ['TikTok (For You Page)','TikTok Search','Global App Bundle','Pangle'];
const META_CTA = ['Acheter maintenant','En savoir plus','S\'inscrire','Réserver maintenant','Télécharger','Obtenir un devis','Nous contacter','S\'abonner','Voir plus','Postuler maintenant'];
const TIKTOK_CTA = ['Acheter maintenant','En savoir plus','S\'inscrire','Réserver maintenant','Télécharger','Nous contacter','S\'abonner','Voir plus'];

const CONV_CONFIG = {
  website:   { urlLabel:'URL de destination *',               urlPlaceholder:'https://votresite.com/page-de-destination', ctas: META_CTA },
  app:       { urlLabel:'Lien App Store / Google Play *',      urlPlaceholder:'https://apps.apple.com/app/...',              ctas: ['Télécharger','Installer maintenant','S\'inscrire','En savoir plus'] },
  messenger: { urlLabel:'Message d\'accueil (optionnel)',      urlPlaceholder:'Bonjour ! Comment puis-je vous aider ?',      ctas: ['Envoyer un message','Démarrer une conversation','En savoir plus'] },
  whatsapp:  { urlLabel:'Numéro WhatsApp (avec indicatif) *',  urlPlaceholder:'Ex : +33 6 00 00 00 00',                      ctas: ['Envoyer un message','Nous contacter','En savoir plus'] },
  calls:     { urlLabel:'Numéro de téléphone *',               urlPlaceholder:'Ex : +33 6 00 00 00 00',                      ctas: ['Appeler maintenant','Nous contacter'] },
  instagram: { urlLabel:'Lien du profil Instagram (optionnel)',urlPlaceholder:'https://instagram.com/votreprofil',           ctas: ['Suivre','En savoir plus','Voir le profil'] },
};

// ─── Wizard Step components ─────────────────────────────────────────────────

function WizardStep1({ w, set }) {
  const isMeta = w.platform !== 'tiktok';
  const objectives = isMeta ? META_OBJECTIVES : TIKTOK_OBJECTIVES;
  return (
    <div style={S.col}>
      {/* Platform */}
      <div>
        <label style={S.label}>Réseau publicitaire</label>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
          {[['facebook','🔵','Facebook'],['instagram','🟣','Instagram'],['tiktok','⚫','TikTok']].map(([v,ico,lbl]) => (
            <OptionCard key={v} selected={w.platform===v} onClick={()=>set('platform',v)} icon={ico} title={lbl} />
          ))}
        </div>
      </div>

      {/* Buying type — Meta only */}
      {isMeta && (
        <div>
          <label style={S.label}>Type d'achat</label>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <OptionCard selected={w.buyingType==='auction'} onClick={()=>set('buyingType','auction')} icon="🏷️" title="Enchères" desc="Flexibilité max, budget quotidien ou total" />
            <OptionCard selected={w.buyingType==='reservation'} onClick={()=>set('buyingType','reservation')} icon="📅" title="Réservation" desc="CPM garanti, fréquence contrôlée" />
          </div>
        </div>
      )}

      {/* Objective */}
      <div>
        <label style={S.label}>Objectif de campagne</label>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
          {objectives.map(o => (
            <OptionCard key={o.id} selected={w.objective===o.id} onClick={()=>set('objective',o.id)} icon={o.icon} title={o.title} desc={o.desc} />
          ))}
        </div>
      </div>

      {/* Campaign name */}
      <div>
        <label style={S.label}>Nom de la campagne *</label>
        <input style={S.field} placeholder="Ex: Lancement Produit Printemps 2025" value={w.name} onChange={e=>set('name',e.target.value)} />
      </div>

      {/* Special category — Meta only */}
      {isMeta && (
        <div>
          <label style={S.label}>Catégorie d'annonce spéciale</label>
          <Dropdown value={w.specialCategory} onChange={v=>set('specialCategory',v)}
            options={[{value:'',label:'Aucune'},{value:'credit',label:'Crédit'},{value:'employment',label:'Emploi'},{value:'housing',label:'Logement'},{value:'social',label:'Questions sociales, élections ou politique'}]}
          />
          <p style={S.muted}>Requis si la pub concerne crédit, emploi, logement ou politique</p>
        </div>
      )}

      {/* A/B test toggle */}
      <Toggle on={w.abTest} onChange={()=>set('abTest',!w.abTest)} label="Activer le test A/B (comparer variantes de créatifs, audiences ou placements)" />

      {/* TikTok campaign budget */}
      {!isMeta && (
        <div>
          <label style={S.label}>Budget de campagne</label>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:10 }}>
            {[['daily','Quotidien'],['lifetime','Total'],['nolimit','Sans limite']].map(([v,lbl])=>(
              <OptionCard key={v} selected={w.campBudgetType===v} onClick={()=>set('campBudgetType',v)} icon="" title={lbl} />
            ))}
          </div>
          {w.campBudgetType !== 'nolimit' && (
            <input type="number" style={S.field} placeholder="Budget minimum $20" value={w.campBudget} onChange={e=>set('campBudget',e.target.value)} />
          )}
        </div>
      )}
    </div>
  );
}

function WizardStep2({ w, set }) {
  const isMeta = w.platform !== 'tiktok';
  const togglePlace = (p) => {
    const key = isMeta ? 'metaPlacements' : 'tiktokPlacements';
    const cur = w[key] || [];
    set(key, cur.includes(p) ? cur.filter(x=>x!==p) : [...cur, p]);
  };
  const toggleAge = (a) => {
    const cur = w.ages || [];
    set('ages', cur.includes(a) ? cur.filter(x=>x!==a) : [...cur, a]);
  };

  return (
    <div style={S.col}>
      {isMeta ? (
        <>
          {/* Conversion location */}
          <div>
            <label style={S.label}>Lieu de conversion</label>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
              {[['website','🌐','Site web'],['app','📱','Application'],['messenger','💬','Messenger'],['whatsapp','📞','WhatsApp'],['calls','📲','Appels'],['instagram','📸','Profil Instagram']].map(([v,ico,lbl])=>(
                <OptionCard key={v} selected={w.convLocation===v} onClick={()=>{ set('convLocation',v); set('convContact',''); }} icon={ico} title={lbl} />
              ))}
            </div>
          </div>

          {/* Contact field — appears immediately when a contact-based location is selected */}
          {w.convLocation === 'whatsapp' && (
            <div>
              <label style={S.label}>Numéro WhatsApp *</label>
              <input
                style={S.field}
                type="tel"
                placeholder="Ex : +221 77 000 00 00"
                value={w.convContact}
                onChange={e=>set('convContact',e.target.value)}
              />
              <p style={S.muted}>Incluez l'indicatif pays (+221 Sénégal, +225 CI, +33 France…)</p>
            </div>
          )}
          {w.convLocation === 'calls' && (
            <div>
              <label style={S.label}>Numéro de téléphone *</label>
              <input
                style={S.field}
                type="tel"
                placeholder="Ex : +33 6 00 00 00 00"
                value={w.convContact}
                onChange={e=>set('convContact',e.target.value)}
              />
              <p style={S.muted}>Incluez l'indicatif pays (+221 Sénégal, +225 CI, +33 France…)</p>
            </div>
          )}
          {w.convLocation === 'messenger' && (
            <div>
              <label style={S.label}>Message d'accueil Messenger (optionnel)</label>
              <input
                style={S.field}
                placeholder="Bonjour ! Comment puis-je vous aider ?"
                value={w.convContact}
                onChange={e=>set('convContact',e.target.value)}
              />
              <p style={S.muted}>Ce texte sera pré-rempli quand l'utilisateur clique sur votre pub</p>
            </div>
          )}

          {/* Audience */}
          <div>
            <label style={S.label}>Pays / Zone géographique</label>
            <input style={S.field} placeholder="Ex: Sénégal, Côte d'Ivoire, France..." value={w.location} onChange={e=>set('location',e.target.value)} />
          </div>

          <div style={S.grid2}>
            <div>
              <label style={S.label}>Âge minimum</label>
              <Dropdown value={w.ageMin} onChange={v=>set('ageMin',v)}
                options={[18,21,25,30,35,40,45,50,55,60,65].map(a=>({value:a,label:`${a} ans`}))}
              />
            </div>
            <div>
              <label style={S.label}>Âge maximum</label>
              <Dropdown value={w.ageMax} onChange={v=>set('ageMax',v)}
                options={[...[24,30,35,40,45,50,55,60,65].map(a=>({value:a,label:`${a} ans`})),{value:'65+',label:'65+ ans'}]}
              />
            </div>
          </div>

          <div>
            <label style={S.label}>Genre</label>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
              {[['all','⚥','Tous'],['male','♂️','Hommes'],['female','♀️','Femmes']].map(([v,ico,lbl])=>(
                <OptionCard key={v} selected={w.gender===v} onClick={()=>set('gender',v)} icon={ico} title={lbl} />
              ))}
            </div>
          </div>

          <div>
            <label style={S.label}>Ciblage détaillé (intérêts, comportements)</label>
            <input style={S.field} placeholder="Ex: Mode, Beauté, E-commerce, Sport..." value={w.interests} onChange={e=>set('interests',e.target.value)} />
            <p style={S.muted}>Entrez des centres d'intérêt séparés par des virgules</p>
          </div>

          {/* Budget & Schedule */}
          <div style={{ borderTop:'1px solid rgba(255,255,255,0.08)', paddingTop:14 }}>
            <label style={{ ...S.label, marginBottom:10, fontSize:14, fontWeight:600, color:'#fff' }}>Budget & Planning (Ensemble de publicités)</label>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
              <OptionCard selected={w.budgetType==='daily'} onClick={()=>set('budgetType','daily')} icon="📅" title="Budget quotidien" desc="Dépense max par jour" />
              <OptionCard selected={w.budgetType==='lifetime'} onClick={()=>set('budgetType','lifetime')} icon="📆" title="Budget total" desc="Dépense max sur toute la durée" />
            </div>
            <input type="number" style={{ ...S.field, marginBottom:10 }} placeholder="Montant (€)" value={w.budget} onChange={e=>set('budget',e.target.value)} />
            <div style={S.grid2}>
              <div>
                <label style={S.label}>Date de début</label>
                <input type="date" style={S.field} value={w.startDate} onChange={e=>set('startDate',e.target.value)} />
              </div>
              <div>
                <label style={S.label}>Date de fin</label>
                <input type="date" style={S.field} value={w.endDate} onChange={e=>set('endDate',e.target.value)} />
              </div>
            </div>
          </div>

          {/* Placements */}
          <div>
            <label style={S.label}>Emplacements publicitaires</label>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
              <OptionCard selected={w.autoPlacement} onClick={()=>set('autoPlacement',true)} icon="⚡" title="Automatique (recommandé)" desc="Meta optimise pour les meilleurs résultats" />
              <OptionCard selected={!w.autoPlacement} onClick={()=>set('autoPlacement',false)} icon="🎯" title="Manuel" desc="Choisir les emplacements manuellement" />
            </div>
            {!w.autoPlacement && (
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
                {META_PLACEMENTS.map(p=>(
                  <CB key={p} checked={(w.metaPlacements||[]).includes(p)} onChange={()=>togglePlace(p)} label={p} />
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* TikTok Placements */}
          <div>
            <label style={S.label}>Emplacements</label>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
              <OptionCard selected={w.autoPlacement} onClick={()=>set('autoPlacement',true)} icon="⚡" title="Automatique" desc="TikTok optimise la diffusion" />
              <OptionCard selected={!w.autoPlacement} onClick={()=>set('autoPlacement',false)} icon="🎯" title="Manuel" desc="Choisir les emplacements" />
            </div>
            {!w.autoPlacement && (
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
                {TIKTOK_PLACEMENTS.map(p=>(
                  <CB key={p} checked={(w.tiktokPlacements||[]).includes(p)} onChange={()=>togglePlace(p)} label={p} />
                ))}
              </div>
            )}
          </div>

          {/* Targeting */}
          <div>
            <label style={S.label}>Pays / Zone géographique</label>
            <input style={S.field} placeholder="Ex: Sénégal, Côte d'Ivoire, France..." value={w.location} onChange={e=>set('location',e.target.value)} />
          </div>

          <div>
            <label style={{ ...S.label, marginBottom:8 }}>Tranches d'âge</label>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {['13-17','18-24','25-34','35-44','45-54','55+'].map(a=>(
                <CB key={a} checked={(w.ages||[]).includes(a)} onChange={()=>toggleAge(a)} label={a} />
              ))}
            </div>
          </div>

          <div>
            <label style={S.label}>Genre</label>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
              {[['all','⚥','Tous'],['male','♂️','Hommes'],['female','♀️','Femmes']].map(([v,ico,lbl])=>(
                <OptionCard key={v} selected={w.gender===v} onClick={()=>set('gender',v)} icon={ico} title={lbl} />
              ))}
            </div>
          </div>

          <div>
            <label style={S.label}>Intérêts & comportements</label>
            <input style={S.field} placeholder="Ex: Mode, Gaming, Beauté, Voyage..." value={w.interests} onChange={e=>set('interests',e.target.value)} />
          </div>

          <div>
            <label style={S.label}>Système d'exploitation</label>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
              {[['all','📱','Tous'],['ios','🍎','iOS'],['android','🤖','Android']].map(([v,ico,lbl])=>(
                <OptionCard key={v} selected={w.deviceOs===v} onClick={()=>set('deviceOs',v)} icon={ico} title={lbl} />
              ))}
            </div>
          </div>

          {/* Budget & Schedule */}
          <div style={{ borderTop:'1px solid rgba(255,255,255,0.08)', paddingTop:14 }}>
            <label style={{ ...S.label, marginBottom:10, fontSize:14, fontWeight:600, color:'#fff' }}>Budget & Planning (Groupe d'annonces)</label>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
              <OptionCard selected={w.budgetType==='daily'} onClick={()=>set('budgetType','daily')} icon="📅" title="Budget quotidien" desc="Min. 20$ par jour" />
              <OptionCard selected={w.budgetType==='lifetime'} onClick={()=>set('budgetType','lifetime')} icon="📆" title="Budget total" desc="Min. 20$ au total" />
            </div>
            <input type="number" style={{ ...S.field, marginBottom:10 }} placeholder="Montant (min. 20$)" value={w.budget} onChange={e=>set('budget',e.target.value)} />
            <div style={S.grid2}>
              <div>
                <label style={S.label}>Date de début</label>
                <input type="date" style={S.field} value={w.startDate} onChange={e=>set('startDate',e.target.value)} />
              </div>
              <div>
                <label style={S.label}>Date de fin (optionnel)</label>
                <input type="date" style={S.field} value={w.endDate} onChange={e=>set('endDate',e.target.value)} />
              </div>
            </div>
            <div style={{ marginTop:10 }}>
              <Toggle on={w.dayparting} onChange={()=>set('dayparting',!w.dayparting)} label="Diffusion par créneaux horaires (Dayparting)" />
            </div>
          </div>

          {/* Bidding */}
          <div>
            <label style={S.label}>Stratégie d'enchères</label>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              <OptionCard selected={w.bidStrategy==='lowest'} onClick={()=>set('bidStrategy','lowest')} icon="⚡" title="Coût le plus bas" desc="TikTok optimise automatiquement" />
              <OptionCard selected={w.bidStrategy==='cap'} onClick={()=>set('bidStrategy','cap')} icon="🎯" title="Plafond d'enchère" desc="Fixer un CPA / CPM max manuellement" />
            </div>
            {w.bidStrategy==='cap' && (
              <input type="number" style={{ ...S.field, marginTop:8 }} placeholder="Enchère max ($)" value={w.bidCap} onChange={e=>set('bidCap',e.target.value)} />
            )}
          </div>
        </>
      )}
    </div>
  );
}

function WizardStep3({ w, set }) {
  const isMeta = w.platform !== 'tiktok';
  const convCfg = isMeta ? (CONV_CONFIG[w.convLocation] || CONV_CONFIG.website) : null;
  const ctaList = isMeta ? convCfg.ctas : TIKTOK_CTA;
  const formats = isMeta
    ? [['image','🖼️','Image unique'],['video','🎬','Vidéo unique'],['carousel','🔄','Carrousel'],['collection','📦','Collection']]
    : [['video','🎬','Vidéo unique'],['spark','⚡','Spark Ad (boost post existant)'],['carousel','🔄','Carrousel'],['image','🖼️','Image']];

  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const accept = isMeta
    ? (w.adFormat === 'video' ? 'video/mp4,video/quicktime,video/webm' : w.adFormat === 'image' || w.adFormat === 'collection' ? 'image/jpeg,image/png,image/gif,image/webp' : 'image/jpeg,image/png,image/gif,image/webp,video/mp4,video/quicktime')
    : 'video/mp4,video/quicktime,video/webm';

  const handleFile = (file) => {
    if (!file) return;
    if (mediaPreview) URL.revokeObjectURL(mediaPreview);
    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
  };

  const removeFile = () => {
    if (mediaPreview) URL.revokeObjectURL(mediaPreview);
    setMediaFile(null);
    setMediaPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const fmtSize = (b) => b > 1048576 ? `${(b/1048576).toFixed(1)} Mo` : `${(b/1024).toFixed(0)} Ko`;
  const isVideoFile = mediaFile?.type?.startsWith('video/');

  return (
    <div style={S.col}>
      {/* Format */}
      <div>
        <label style={S.label}>Format de la publicité</label>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
          {formats.map(([v,ico,lbl])=>(
            <OptionCard key={v} selected={w.adFormat===v} onClick={()=>{ set('adFormat',v); removeFile(); }} icon={ico} title={lbl} />
          ))}
        </div>
      </div>

      {/* Media upload */}
      <div>
        <label style={S.label}>{isMeta ? (w.adFormat==='video'?'Vidéo':'Image / Visuel') : 'Vidéo TikTok'}</label>

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          style={{ display:'none' }}
          onChange={e => handleFile(e.target.files?.[0])}
        />

        {!mediaFile ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files?.[0]); }}
            style={{
              border: `2px dashed ${dragOver ? 'rgba(124,58,237,0.6)' : 'rgba(255,255,255,0.15)'}`,
              borderRadius: 10,
              padding: 32,
              textAlign: 'center',
              cursor: 'pointer',
              background: dragOver ? 'rgba(124,58,237,0.08)' : 'rgba(255,255,255,0.02)',
              transition: 'border-color 0.15s, background 0.15s',
            }}
          >
            <Upload style={{ width:28, height:28, color: dragOver ? '#a78bfa' : 'rgba(255,255,255,0.35)', margin:'0 auto 10px', transition:'color 0.15s' }} />
            <p style={{ color:'rgba(255,255,255,0.7)', fontSize:13, margin:'0 0 4px', fontWeight:500 }}>
              Glissez votre fichier ici ou <span style={{ color:'#a78bfa', textDecoration:'underline' }}>cliquez pour importer</span>
            </p>
            <p style={S.muted}>
              {isMeta
                ? w.adFormat === 'video' ? 'MP4, MOV, WebM — max. 4 Go' : w.adFormat === 'image' || w.adFormat === 'collection' ? 'JPG, PNG, GIF, WebP — max. 30 Mo' : 'JPG, PNG, GIF, MP4, MOV — max. 4 Go'
                : 'MP4, MOV — Vertical 9:16, min. 5s, max. 60s'}
            </p>
            <p style={S.muted}>Ratio recommandé : {isMeta ? '1:1 ou 9:16' : '9:16'}</p>
          </div>
        ) : (
          <div style={{ borderRadius:10, overflow:'hidden', border:'1px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.03)' }}>
            {/* Preview */}
            <div style={{ position:'relative', background:'#0a0a14', minHeight:180, display:'flex', alignItems:'center', justifyContent:'center' }}>
              {isVideoFile ? (
                <video
                  src={mediaPreview}
                  controls
                  style={{ maxWidth:'100%', maxHeight:260, borderRadius:6, display:'block' }}
                />
              ) : (
                <img
                  src={mediaPreview}
                  alt="preview"
                  style={{ maxWidth:'100%', maxHeight:260, objectFit:'contain', display:'block', borderRadius:6 }}
                />
              )}
              <button
                type="button"
                onClick={removeFile}
                style={{ position:'absolute', top:8, right:8, background:'rgba(0,0,0,0.7)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:6, padding:'4px 8px', color:'#fff', fontSize:11, cursor:'pointer', display:'flex', alignItems:'center', gap:4 }}
              >
                <X style={{ width:12, height:12 }} /> Supprimer
              </button>
            </div>
            {/* File info */}
            <div style={{ padding:'10px 14px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, minWidth:0 }}>
                <span style={{ fontSize:18 }}>{isVideoFile ? '🎬' : '🖼️'}</span>
                <div style={{ minWidth:0 }}>
                  <p style={{ color:'rgba(255,255,255,0.85)', fontSize:13, fontWeight:500, margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{mediaFile.name}</p>
                  <p style={S.muted}>{fmtSize(mediaFile.size)} • {mediaFile.type}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{ flexShrink:0, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:6, padding:'5px 10px', color:'rgba(255,255,255,0.7)', fontSize:12, cursor:'pointer' }}
              >
                Changer
              </button>
            </div>
          </div>
        )}
      </div>

      {/* TikTok Display name */}
      {!isMeta && (
        <div>
          <label style={S.label}>Nom d'affichage (marque)</label>
          <input style={S.field} placeholder="Votre nom de marque" value={w.displayName} onChange={e=>set('displayName',e.target.value)} />
        </div>
      )}

      {/* Primary text */}
      <div>
        <label style={S.label}>{isMeta ? 'Texte principal (Primary text)' : 'Légende (Caption)'}</label>
        <textarea style={{ ...S.field, minHeight:80, resize:'vertical' }}
          placeholder={isMeta ? "Décrivez votre offre de façon convaincante..." : "Texte accrocheur, max 150 caractères #hashtag"}
          value={w.caption} onChange={e=>set('caption',e.target.value)} maxLength={isMeta?undefined:150}
        />
        {!isMeta && <p style={S.muted}>{(w.caption||'').length}/150 caractères</p>}
      </div>

      {/* Meta only fields */}
      {isMeta && (
        <>
          <div>
            <label style={S.label}>Titre (Headline)</label>
            <input style={S.field} placeholder="Titre court et accrocheur" value={w.headline} onChange={e=>set('headline',e.target.value)} />
          </div>
          <div>
            <label style={S.label}>Description (optionnel)</label>
            <input style={S.field} placeholder="Informations complémentaires" value={w.description} onChange={e=>set('description',e.target.value)} />
          </div>
          <div>
            <label style={S.label}>Lien affiché (optionnel)</label>
            <input style={S.field} placeholder="Ex: votresite.com/promo" value={w.displayUrl} onChange={e=>set('displayUrl',e.target.value)} />
          </div>
        </>
      )}

      {/* URL de destination — masqué pour whatsapp / calls / messenger (géré en étape 2) */}
      {(!isMeta || !['whatsapp','calls','messenger'].includes(w.convLocation)) && (
        <div>
          <label style={S.label}>{isMeta ? convCfg.urlLabel : 'URL de destination *'}</label>
          <input
            style={S.field}
            placeholder={isMeta ? convCfg.urlPlaceholder : 'https://votresite.com/page-de-destination'}
            value={w.destUrl}
            onChange={e=>set('destUrl',e.target.value)}
          />
          {isMeta && w.convLocation === 'app' && (
            <p style={S.muted}>Lien direct vers votre app sur l'App Store ou Google Play</p>
          )}
        </div>
      )}
      {/* Rappel contact saisi en étape 2 */}
      {isMeta && ['whatsapp','calls','messenger'].includes(w.convLocation) && w.convContact && (
        <div style={{ background:'rgba(124,58,237,0.1)', border:'1px solid rgba(124,58,237,0.25)', borderRadius:8, padding:'10px 14px', display:'flex', alignItems:'center', gap:8 }}>
          <Check style={{ width:14, height:14, color:'#a78bfa', flexShrink:0 }} />
          <span style={{ fontSize:13, color:'rgba(255,255,255,0.75)' }}>
            {w.convLocation === 'whatsapp' ? 'WhatsApp' : w.convLocation === 'calls' ? 'Téléphone' : 'Message'} : <strong style={{ color:'#fff' }}>{w.convContact}</strong>
          </span>
        </div>
      )}

      {/* CTA button */}
      <div>
        <label style={S.label}>Bouton d'appel à l'action (CTA)</label>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:6 }}>
          {ctaList.map(c=>(
            <OptionCard key={c} selected={w.cta===c} onClick={()=>set('cta',c)} icon="" title={c} />
          ))}
        </div>
      </div>

      {/* TikTok toggles */}
      {!isMeta && (
        <div style={{ display:'flex', flexDirection:'column', gap:10, padding:14, background:'rgba(255,255,255,0.03)', borderRadius:10, border:'1px solid rgba(255,255,255,0.08)' }}>
          <Toggle on={w.allowComments!==false} onChange={()=>set('allowComments',!(w.allowComments!==false))} label="Autoriser les commentaires" />
          <Toggle on={!!w.allowDownload} onChange={()=>set('allowDownload',!w.allowDownload)} label="Autoriser le téléchargement de la vidéo" />
          <Toggle on={!!w.allowSharing} onChange={()=>set('allowSharing',!w.allowSharing)} label="Autoriser le partage de la vidéo" />
        </div>
      )}

      {/* TikTok Pixel */}
      {!isMeta && (
        <div>
          <label style={S.label}>TikTok Pixel ID (optionnel)</label>
          <input style={S.field} placeholder="Ex: XXXXXXXXXXXXXX" value={w.pixelId} onChange={e=>set('pixelId',e.target.value)} />
          <p style={S.muted}>Pour tracker les conversions sur votre site web</p>
        </div>
      )}
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function CampagnesView({ supabase, user }) {
  const [campaigns, setCampaigns] = useState(MOCK_CAMPAIGNS);
  const [activeTab, setActiveTab] = useState('all');
  const [showWizard, setShowWizard] = useState(false);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [metaConnected, setMetaConnected] = useState(false);
  const [tiktokConnected, setTiktokConnected] = useState(false);
  const [metaToken, setMetaToken] = useState('');
  const [tiktokToken, setTiktokToken] = useState('');
  const [expandedCamps, setExpandedCamps] = useState(new Set(['camp_1']));
  const [expandedAdsets, setExpandedAdsets] = useState(new Set());
  const [editingCampId, setEditingCampId] = useState(null);
  const [editingAdsetId, setEditingAdsetId] = useState(null);
  const [editingAdId, setEditingAdId] = useState(null);
  const toggleExpandCamp = (id) => setExpandedCamps(p => { const s=new Set(p); s.has(id)?s.delete(id):s.add(id); return s; });
  const toggleExpandAdset = (id) => setExpandedAdsets(p => { const s=new Set(p); s.has(id)?s.delete(id):s.add(id); return s; });

  const defaultWizard = { platform:'facebook', buyingType:'auction', objective:'sales', name:'', specialCategory:'', abTest:false, campBudgetType:'daily', campBudget:'', convLocation:'website', convContact:'', location:'', ageMin:18, ageMax:'65+', gender:'all', interests:'', autoPlacement:true, metaPlacements:[], tiktokPlacements:[], budgetType:'daily', budget:'', startDate:'', endDate:'', dayparting:false, bidStrategy:'lowest', bidCap:'', deviceOs:'all', ages:[], adFormat:'video', caption:'', headline:'', description:'', displayUrl:'', destUrl:'', cta:'Acheter maintenant', displayName:'', allowComments:true, allowDownload:false, allowSharing:false, pixelId:'' };
  const [w, setW] = useState(defaultWizard);
  const set = (k, v) => setW(p => ({ ...p, [k]: v }));

  const fmtNum = (n) => n >= 1e6 ? `${(n/1e6).toFixed(1)}M` : n >= 1e3 ? `${(n/1e3).toFixed(1)}K` : String(n);
  const fmtCur = (n) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n);
  const filteredCampaigns = campaigns.filter(c => activeTab === 'all' || c.status === activeTab);
  const totals = campaigns.reduce((a,c) => ({ budget:a.budget+c.budget, spent:a.spent+c.spent, impressions:a.impressions+c.impressions, clicks:a.clicks+c.clicks, conversions:a.conversions+c.conversions }), { budget:0, spent:0, impressions:0, clicks:0, conversions:0 });

  // ── Campaign CRUD ──
  const toggleStatus  = (id) => setCampaigns(p => p.map(c => c.id===id ? { ...c, status:c.status==='active'?'paused':'active' } : c));
  const deleteCamp   = (id) => { if (confirm('Supprimer cette campagne ?')) setCampaigns(p=>p.filter(c=>c.id!==id)); };
  const duplicateCamp = (id) => {
    const src = campaigns.find(c => c.id === id);
    if (!src) return;
    const copy = { ...src, id:`camp_${Date.now()}`, name:`${src.name} (Copie)`, status:'paused', spent:0, adsets:(src.adsets||[]).map(as=>({...as,id:`as_${Date.now()}_${Math.random().toString(36).slice(2)}`,ads:(as.ads||[]).map(ad=>({...ad,id:`ad_${Date.now()}_${Math.random().toString(36).slice(2)}`}))})) };
    setCampaigns(p => { const idx=p.findIndex(c=>c.id===id); const next=[...p]; next.splice(idx+1,0,copy); return next; });
  };
  const editCamp = (id) => {
    const camp = campaigns.find(c => c.id === id);
    if (!camp) return;
    const firstAdset = (camp.adsets||[])[0];
    const firstAd = firstAdset ? (firstAdset.ads||[])[0] : null;
    setW({
      platform: camp.platform || 'facebook',
      buyingType: 'auction',
      objective: camp.objective || 'sales',
      name: camp.name || '',
      specialCategory: '',
      abTest: false,
      campBudgetType: 'daily',
      campBudget: '',
      convLocation: 'website',
      convContact: '',
      location: firstAdset?.location || '',
      ageMin: firstAdset?.ageMin || 18,
      ageMax: firstAdset?.ageMax || '65+',
      gender: firstAdset?.gender || 'all',
      interests: '',
      autoPlacement: true,
      metaPlacements: [],
      tiktokPlacements: [],
      budgetType: 'daily',
      budget: String(firstAdset?.budget || camp.budget || ''),
      startDate: camp.startDate || '',
      endDate: camp.endDate || '',
      dayparting: false,
      bidStrategy: 'lowest',
      bidCap: '',
      deviceOs: 'all',
      ages: [],
      adFormat: firstAd?.format || 'video',
      caption: '',
      headline: firstAd?.name || '',
      description: '',
      displayUrl: '',
      destUrl: '',
      cta: firstAd?.cta || 'Acheter maintenant',
      displayName: '',
      allowComments: true,
      allowDownload: false,
      allowSharing: false,
      pixelId: ''
    });
    setEditingCampId(id);
    setShowWizard(true);
    setWizardStep(1);
  };
  const editAdset = (campId, asId) => {
    const camp = campaigns.find(c => c.id === campId);
    if (!camp) return;
    const adset = (camp.adsets||[]).find(as => as.id === asId);
    if (!adset) return;
    const firstAd = (adset.ads||[])[0];
    setW({
      platform: camp.platform || 'facebook',
      buyingType: 'auction',
      objective: camp.objective || 'sales',
      name: camp.name || '',
      specialCategory: '',
      abTest: false,
      campBudgetType: 'daily',
      campBudget: '',
      convLocation: 'website',
      convContact: '',
      location: adset.location || '',
      ageMin: adset.ageMin || 18,
      ageMax: adset.ageMax || '65+',
      gender: adset.gender || 'all',
      interests: '',
      autoPlacement: true,
      metaPlacements: [],
      tiktokPlacements: [],
      budgetType: 'daily',
      budget: String(adset.budget || ''),
      startDate: camp.startDate || '',
      endDate: camp.endDate || '',
      dayparting: false,
      bidStrategy: 'lowest',
      bidCap: '',
      deviceOs: 'all',
      ages: [],
      adFormat: firstAd?.format || 'video',
      caption: '',
      headline: firstAd?.name || '',
      description: '',
      displayUrl: '',
      destUrl: '',
      cta: firstAd?.cta || 'Acheter maintenant',
      displayName: '',
      allowComments: true,
      allowDownload: false,
      allowSharing: false,
      pixelId: ''
    });
    setEditingCampId(campId);
    setEditingAdsetId(asId);
    setShowWizard(true);
    setWizardStep(2);
  };
  const editAd = (campId, asId, adId) => {
    const camp = campaigns.find(c => c.id === campId);
    if (!camp) return;
    const adset = (camp.adsets||[]).find(as => as.id === asId);
    if (!adset) return;
    const ad = (adset.ads||[]).find(a => a.id === adId);
    if (!ad) return;
    setW({
      platform: camp.platform || 'facebook',
      buyingType: 'auction',
      objective: camp.objective || 'sales',
      name: camp.name || '',
      specialCategory: '',
      abTest: false,
      campBudgetType: 'daily',
      campBudget: '',
      convLocation: 'website',
      convContact: '',
      location: adset.location || '',
      ageMin: adset.ageMin || 18,
      ageMax: adset.ageMax || '65+',
      gender: adset.gender || 'all',
      interests: '',
      autoPlacement: true,
      metaPlacements: [],
      tiktokPlacements: [],
      budgetType: 'daily',
      budget: String(adset.budget || ''),
      startDate: camp.startDate || '',
      endDate: camp.endDate || '',
      dayparting: false,
      bidStrategy: 'lowest',
      bidCap: '',
      deviceOs: 'all',
      ages: [],
      adFormat: ad.format || 'video',
      caption: '',
      headline: ad.name || '',
      description: '',
      displayUrl: '',
      destUrl: '',
      cta: ad.cta || 'Acheter maintenant',
      displayName: '',
      allowComments: true,
      allowDownload: false,
      allowSharing: false,
      pixelId: ''
    });
    setEditingCampId(campId);
    setEditingAdsetId(asId);
    setEditingAdId(adId);
    setShowWizard(true);
    setWizardStep(3);
  };

  // ── AdSet CRUD ──
  const addAdset = (campId, adsetData) => setCampaigns(p=>p.map(c=>c.id===campId?{...c,adsets:[...(c.adsets||[]),adsetData]}:c));
  const toggleAdsetStatus = (campId, asId) => setCampaigns(p=>p.map(c=>c.id===campId?{...c,adsets:(c.adsets||[]).map(as=>as.id===asId?{...as,status:as.status==='active'?'paused':'active'}:as)}:c));
  const deleteAdset = (campId, asId) => { if(confirm('Supprimer cet ensemble ?')) setCampaigns(p=>p.map(c=>c.id===campId?{...c,adsets:(c.adsets||[]).filter(as=>as.id!==asId)}:c)); };
  const duplicateAdset = (campId, asId) => setCampaigns(p=>p.map(c=>{ if(c.id!==campId) return c; const src=c.adsets.find(a=>a.id===asId); if(!src) return c; const copy={...src,id:`as_${Date.now()}`,name:`${src.name} (Copie)`,status:'paused',ads:(src.ads||[]).map(ad=>({...ad,id:`ad_${Date.now()}_${Math.random().toString(36).slice(2)}`}))}; const idx=c.adsets.findIndex(a=>a.id===asId); const next=[...c.adsets]; next.splice(idx+1,0,copy); return {...c,adsets:next}; }));

  // ── Ad CRUD ──
  const addAd = (campId, asId, adData) => setCampaigns(p=>p.map(c=>c.id===campId?{...c,adsets:(c.adsets||[]).map(as=>as.id===asId?{...as,ads:[...(as.ads||[]),adData]}:as)}:c));
  const toggleAdStatus = (campId, asId, adId) => setCampaigns(p=>p.map(c=>c.id===campId?{...c,adsets:(c.adsets||[]).map(as=>as.id===asId?{...as,ads:(as.ads||[]).map(ad=>ad.id===adId?{...ad,status:ad.status==='active'?'paused':'active'}:ad)}:as)}:c));
  const deleteAd = (campId, asId, adId) => { if(confirm('Supprimer cette annonce ?')) setCampaigns(p=>p.map(c=>c.id===campId?{...c,adsets:(c.adsets||[]).map(as=>as.id===asId?{...as,ads:(as.ads||[]).filter(ad=>ad.id!==adId)}:as)}:c)); };
  const duplicateAd = (campId, asId, adId) => setCampaigns(p=>p.map(c=>{ if(c.id!==campId) return c; return {...c,adsets:(c.adsets||[]).map(as=>{ if(as.id!==asId) return as; const src=as.ads.find(a=>a.id===adId); if(!src) return as; const copy={...src,id:`ad_${Date.now()}`,name:`${src.name} (Copie)`}; const idx=as.ads.findIndex(a=>a.id===adId); const next=[...as.ads]; next.splice(idx+1,0,copy); return {...as,ads:next}; })}; }));

  const launchCampaign = () => {
    if (editingAdId) {
      // Mode édition annonce : mettre à jour uniquement l'annonce
      setCampaigns(p => p.map(c => {
        if (c.id !== editingCampId) return c;
        return {
          ...c,
          adsets: (c.adsets||[]).map(as => {
            if (as.id !== editingAdsetId) return as;
            return {
              ...as,
              ads: (as.ads||[]).map(ad => {
                if (ad.id !== editingAdId) return ad;
                return {
                  ...ad,
                  name: w.headline || w.caption || ad.name,
                  format: w.adFormat,
                  cta: w.cta
                };
              })
            };
          })
        };
      }));
      setEditingCampId(null);
      setEditingAdsetId(null);
      setEditingAdId(null);
    } else if (editingAdsetId) {
      // Mode édition ensemble : mettre à jour l'ensemble et sa première annonce
      setCampaigns(p => p.map(c => {
        if (c.id !== editingCampId) return c;
        return {
          ...c,
          adsets: (c.adsets||[]).map(as => {
            if (as.id !== editingAdsetId) return as;
            return {
              ...as,
              location: w.location || as.location,
              ageMin: w.ageMin,
              ageMax: w.ageMax,
              gender: w.gender,
              budget: Number(w.budget) || as.budget,
              ads: (as.ads||[]).map((ad, adIdx) => {
                if (adIdx === 0) {
                  return {
                    ...ad,
                    name: w.headline || w.caption || ad.name,
                    format: w.adFormat,
                    cta: w.cta
                  };
                }
                return ad;
              })
            };
          })
        };
      }));
      setEditingCampId(null);
      setEditingAdsetId(null);
    } else if (editingCampId) {
      // Mode édition campagne : mettre à jour la campagne, premier ensemble et première annonce
      setCampaigns(p => p.map(c => {
        if (c.id !== editingCampId) return c;
        return {
          ...c,
          name: w.name || c.name,
          platform: w.platform,
          objective: w.objective,
          budget: Number(w.budget) || c.budget,
          startDate: w.startDate || c.startDate,
          endDate: w.endDate || c.endDate,
          adsets: (c.adsets||[]).map((as, idx) => {
            if (idx === 0) {
              return {
                ...as,
                name: `Ensemble 1 — ${w.location||as.location||'Audience principale'}`,
                location: w.location || as.location,
                ageMin: w.ageMin,
                ageMax: w.ageMax,
                gender: w.gender,
                budget: Number(w.budget) || as.budget,
                ads: (as.ads||[]).map((ad, adIdx) => {
                  if (adIdx === 0) {
                    return {
                      ...ad,
                      name: w.headline || w.caption || ad.name,
                      format: w.adFormat,
                      cta: w.cta
                    };
                  }
                  return ad;
                })
              };
            }
            return as;
          })
        };
      }));
      setEditingCampId(null);
    } else {
      // Mode création : nouvelle campagne
      const id = `camp_${Date.now()}`;
      const asId = `as_${Date.now()}_1`;
      const adId = `ad_${Date.now()}_1`;
      const newCamp = {
        id, name:w.name||'Nouvelle campagne', status:'active', platform:w.platform,
        budget:Number(w.budget)||0, spent:0, impressions:0, clicks:0, conversions:0, ctr:0, cpc:0, roas:0,
        startDate:w.startDate||new Date().toISOString().slice(0,10), endDate:w.endDate||'', objective:w.objective,
        adsets:[{
          id:asId, name:`Ensemble 1 — ${w.location||'Audience principale'}`, status:'active',
          budget:Number(w.budget)||0, spent:0, location:w.location||'', ageMin:w.ageMin, ageMax:w.ageMax,
          gender:w.gender, impressions:0, clicks:0, conversions:0,
          ads:[{ id:adId, name:w.headline||w.caption||'Annonce 1', format:w.adFormat, status:'active', cta:w.cta, impressions:0, clicks:0, ctr:0 }]
        }]
      };
      setCampaigns(p=>[...p, newCamp]);
      setExpandedCamps(p=>{ const s=new Set(p); s.add(id); return s; });
      setExpandedAdsets(p=>{ const s=new Set(p); s.add(asId); return s; });
    }
    setShowWizard(false); setWizardStep(1); setW(defaultWizard);
  };

  const saveConnections = () => {
    if (metaToken.trim()) setMetaConnected(true);
    if (tiktokToken.trim()) setTiktokConnected(true);
    setShowConnectionModal(false);
  };

  const tabSt = (v) => ({ padding:'8px 16px', borderRadius:8, border:'none', cursor:'pointer', fontWeight:500, fontSize:14, transition:'all 0.2s', background:activeTab===v?'rgba(124,58,237,0.25)':'transparent', color:activeTab===v?'#fff':'rgba(255,255,255,0.6)' });
  const platBadge = { facebook:{background:'rgba(59,130,246,0.2)',color:'#60a5fa',border:'1px solid rgba(59,130,246,0.3)'}, instagram:{background:'rgba(236,72,153,0.2)',color:'#f472b6',border:'1px solid rgba(236,72,153,0.3)'}, tiktok:{background:'rgba(168,85,247,0.2)',color:'#c084fc',border:'1px solid rgba(168,85,247,0.3)'} };
  const statBadge = { active:{background:'rgba(34,197,94,0.2)',color:'#4ade80',border:'1px solid rgba(34,197,94,0.3)'}, paused:{background:'rgba(234,179,8,0.2)',color:'#facc15',border:'1px solid rgba(234,179,8,0.3)'} };
  const bge = (label, style) => <span style={{ ...style, padding:'2px 10px', borderRadius:999, fontSize:11, fontWeight:600, display:'inline-flex', alignItems:'center' }}>{label}</span>;

  const STEP_LABELS = ['📢 1. Campagne','🎯 2. Ensemble de publicités','🖼️ 3. Annonce / Créatif'];

  return (
    <div style={{ minHeight:'100vh', padding:24 }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
          <div>
            <h1 style={{ fontSize:26, fontWeight:700, color:'#fff', display:'flex', alignItems:'center', gap:10, margin:0 }}>
              <Target style={{ width:28, height:28, color:'#7c3aed' }} /> Campagnes Publicitaires
            </h1>
            <p style={{ color:'rgba(255,255,255,0.5)', marginTop:4, fontSize:14 }}>Structure réelle Meta Ads Manager & TikTok Ads Manager</p>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <BTN onClick={() => setShowConnectionModal(true)}>
              <Settings style={{ width:15, height:15 }} /> Connexions API
            </BTN>
            <BTN color="brand" onClick={() => { setShowWizard(true); setWizardStep(1); setW(defaultWizard); }}>
              <Plus style={{ width:15, height:15 }} /> Nouvelle Campagne
            </BTN>
          </div>
        </div>

        {/* Alert banner */}
        {(!metaConnected || !tiktokConnected) && (
          <div style={{ background:'rgba(234,179,8,0.08)', border:'1px solid rgba(234,179,8,0.25)', borderRadius:10, padding:'10px 16px', marginBottom:20, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:8 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <AlertCircle style={{ width:16, height:16, color:'#facc15', flexShrink:0 }} />
              <span style={{ color:'#facc15', fontSize:13 }}>
                {!metaConnected && '• Meta non connecté  '}{!tiktokConnected && '• TikTok non connecté'}
              </span>
            </div>
            <BTN size="sm" onClick={() => setShowConnectionModal(true)}>Connecter mes comptes</BTN>
          </div>
        )}

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:12, marginBottom:24 }}>
          {[['Budget Total',fmtCur(totals.budget),<DollarSign style={{width:18,height:18,color:'#60a5fa'}}/>,'rgba(59,130,246,0.15)'],['Dépensé',fmtCur(totals.spent),<TrendingUp style={{width:18,height:18,color:'#4ade80'}}/>,'rgba(34,197,94,0.15)'],['Impressions',fmtNum(totals.impressions),<Eye style={{width:18,height:18,color:'#c084fc'}}/>,'rgba(168,85,247,0.15)'],['Clics',fmtNum(totals.clicks),<MousePointerClick style={{width:18,height:18,color:'#facc15'}}/>,'rgba(234,179,8,0.15)'],['Conversions',fmtNum(totals.conversions),<Check style={{width:18,height:18,color:'#4ade80'}}/>,'rgba(34,197,94,0.15)']].map(([l,v,ico,bg],i)=>(
            <div key={i} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, padding:16, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div><p style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginBottom:4 }}>{l}</p><p style={{ fontSize:18, fontWeight:700, color:'#fff' }}>{v}</p></div>
              <div style={{ width:38, height:38, borderRadius:10, background:bg, display:'flex', alignItems:'center', justifyContent:'center' }}>{ico}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:4, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, padding:4, marginBottom:20, width:'fit-content' }}>
          {[['all',`Toutes (${campaigns.length})`],['active',`Actives (${campaigns.filter(c=>c.status==='active').length})`],['paused',`En pause (${campaigns.filter(c=>c.status==='paused').length})`]].map(([v,lbl])=>(
            <button key={v} onClick={()=>setActiveTab(v)} style={tabSt(v)}>{lbl}</button>
          ))}
        </div>

        {/* Campaign cards — hierarchical */}
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {filteredCampaigns.length===0 ? (
            <div style={{ ...S.card, padding:48, textAlign:'center' }}>
              <Target style={{ width:48, height:48, color:'rgba(255,255,255,0.2)', margin:'0 auto 12px' }} />
              <p style={{ color:'rgba(255,255,255,0.5)' }}>Aucune campagne — cliquez sur « Nouvelle Campagne »</p>
            </div>
          ) : filteredCampaigns.map(camp=>{
            const isExpanded = expandedCamps.has(camp.id);
            const adsetCount = (camp.adsets||[]).length;
            const adCount = (camp.adsets||[]).reduce((s,as)=>s+(as.ads||[]).length,0);
            return (
            <div key={camp.id} style={S.card}>
              {/* ── Campaign header ── */}
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:12 }}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:10, flex:1, minWidth:0 }}>
                  <button onClick={()=>toggleExpandCamp(camp.id)} style={{ background:'none',border:'none',cursor:'pointer',padding:0,color:'rgba(255,255,255,0.5)',marginTop:2,flexShrink:0 }}>
                    <ChevronRight style={{ width:16,height:16,transition:'transform 0.2s',transform:isExpanded?'rotate(90deg)':'none' }} />
                  </button>
                  <div style={{ minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:3 }}>
                      <h3 style={{ fontSize:15, fontWeight:600, color:'#fff', margin:0 }}>{camp.name}</h3>
                      {bge(camp.status==='active'?'Active':'En pause', statBadge[camp.status]||statBadge.paused)}
                      {bge(camp.platform.charAt(0).toUpperCase()+camp.platform.slice(1), platBadge[camp.platform])}
                    </div>
                    <div style={{ display:'flex', gap:14, fontSize:11, color:'rgba(255,255,255,0.4)', flexWrap:'wrap' }}>
                      <span style={{ display:'flex',alignItems:'center',gap:4 }}><Calendar style={{width:10,height:10}}/>{new Date(camp.startDate).toLocaleDateString('fr-FR')}{camp.endDate&&` → ${new Date(camp.endDate).toLocaleDateString('fr-FR')}`}</span>
                      <span>Objectif : {camp.objective}</span>
                      <span style={{color:'rgba(124,58,237,0.8)'}}>🎯 {adsetCount} ensemble{adsetCount!==1?'s':''} · 🖼️ {adCount} annonce{adCount!==1?'s':''}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display:'flex', gap:5, flexShrink:0 }}>
                  <BTN size="sm" color={camp.status==='active'?'default':'green'} onClick={()=>toggleStatus(camp.id)}>
                    {camp.status==='active'?<><Pause style={{width:11,height:11}}/>Pause</>:<><Play style={{width:11,height:11}}/>Activer</>}
                  </BTN>
                  <BTN size="sm" onClick={()=>duplicateCamp(camp.id)} title="Dupliquer la campagne"><Copy style={{width:11,height:11}}/></BTN>
                  <BTN size="sm" onClick={()=>editCamp(camp.id)} title="Modifier la campagne"><Edit style={{width:11,height:11}}/></BTN>
                  <BTN size="sm" color="red" onClick={()=>deleteCamp(camp.id)} title="Supprimer"><Trash2 style={{width:11,height:11}}/></BTN>
                </div>
              </div>

              {/* ── Campaign stats ── */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:8, marginBottom: isExpanded?14:0 }}>
                {[['Budget',fmtCur(camp.budget),'rgba(255,255,255,0.4)'],['Dépensé',fmtCur(camp.spent),'#fff'],['Impressions',fmtNum(camp.impressions),'#fff'],['Clics',fmtNum(camp.clicks),'#fff'],['Conversions',camp.conversions,'#fff'],['ROAS',`${camp.roas}x`,'#4ade80']].map(([l,v,c])=>(
                  <div key={l}><p style={{fontSize:10,color:'rgba(255,255,255,0.4)',marginBottom:2}}>{l}</p><p style={{fontSize:12,fontWeight:600,color:c}}>{v}</p></div>
                ))}
              </div>

              {/* ── Ad Sets (expanded) ── */}
              {isExpanded && (
                <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:12 }}>
                  {(camp.adsets||[]).length === 0 && (
                    <p style={{ color:'rgba(255,255,255,0.35)', fontSize:13, margin:'0 0 10px 28px' }}>Aucun ensemble — ajoutez-en un ci-dessous</p>
                  )}
                  {(camp.adsets||[]).map(as=>{
                    const asExpanded = expandedAdsets.has(as.id);
                    return (
                    <div key={as.id} style={{ marginLeft:20, marginBottom:8, background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10 }}>
                      {/* AdSet header */}
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8, flex:1, minWidth:0 }}>
                          <button onClick={()=>toggleExpandAdset(as.id)} style={{ background:'none',border:'none',cursor:'pointer',padding:0,color:'rgba(255,255,255,0.4)',flexShrink:0 }}>
                            <ChevronRight style={{width:14,height:14,transition:'transform 0.2s',transform:asExpanded?'rotate(90deg)':'none'}}/>
                          </button>
                          <div style={{ width:8,height:8,borderRadius:'50%',background:as.status==='active'?'#4ade80':'#facc15',flexShrink:0 }} />
                          <div style={{ minWidth:0 }}>
                            <p style={{ fontSize:13, fontWeight:600, color:'#fff', margin:0 }}>{as.name}</p>
                            <p style={{ fontSize:11, color:'rgba(255,255,255,0.4)', margin:'2px 0 0' }}>{as.location} · {as.ageMin}-{as.ageMax} ans · {fmtCur(as.spent||0)}/{fmtCur(as.budget||0)} · {(as.ads||[]).length} annonce{(as.ads||[]).length!==1?'s':''}</p>
                          </div>
                        </div>
                        <div style={{ display:'flex', gap:4, flexShrink:0 }}>
                          <BTN size="sm" color={as.status==='active'?'default':'green'} onClick={()=>toggleAdsetStatus(camp.id,as.id)}>
                            {as.status==='active'?<><Pause style={{width:10,height:10}}/>Pause</>:<><Play style={{width:10,height:10}}/>Activer</>}
                          </BTN>
                          <BTN size="sm" onClick={()=>duplicateAdset(camp.id,as.id)} title="Dupliquer l'ensemble"><Copy style={{width:10,height:10}}/></BTN>
                          <BTN size="sm" onClick={()=>editAdset(camp.id,as.id)} title="Modifier l'ensemble"><Edit style={{width:10,height:10}}/></BTN>
                          <BTN size="sm" color="red" onClick={()=>deleteAdset(camp.id,as.id)} title="Supprimer l'ensemble"><Trash2 style={{width:10,height:10}}/></BTN>
                        </div>
                      </div>

                      {/* Ads (expanded) */}
                      {asExpanded && (
                        <div style={{ borderTop:'1px solid rgba(255,255,255,0.05)', padding:'8px 14px 10px' }}>
                          {(as.ads||[]).length===0 && (
                            <p style={{ color:'rgba(255,255,255,0.3)', fontSize:12, margin:'0 0 8px 22px' }}>Aucune annonce</p>
                          )}
                          {(as.ads||[]).map(ad=>(
                            <div key={ad.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'7px 10px', marginLeft:22, marginBottom:4, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:8 }}>
                              <div style={{ width:6,height:6,borderRadius:'50%',background:ad.status==='active'?'#4ade80':'#facc15',flexShrink:0 }} />
                              <span style={{ fontSize:13, color:'#fff', fontWeight:500, flex:1, minWidth:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{ad.name}</span>
                              <span style={{ fontSize:11, color:'rgba(255,255,255,0.4)', flexShrink:0 }}>{ad.format}</span>
                              <span style={{ fontSize:11, color:'rgba(255,255,255,0.4)', flexShrink:0 }}>{fmtNum(ad.impressions||0)} imp.</span>
                              <span style={{ fontSize:11, color:'rgba(255,255,255,0.4)', flexShrink:0 }}>{fmtNum(ad.clicks||0)} clics</span>
                              <span style={{ fontSize:11, color:'#a78bfa', flexShrink:0 }}>CTR {ad.ctr||0}%</span>
                              <div style={{ display:'flex', gap:3 }}>
                                <BTN size="sm" color={ad.status==='active'?'default':'green'} onClick={()=>toggleAdStatus(camp.id,as.id,ad.id)}>
                                  {ad.status==='active'?<Pause style={{width:9,height:9}}/>:<Play style={{width:9,height:9}}/>}
                                </BTN>
                                <BTN size="sm" onClick={()=>duplicateAd(camp.id,as.id,ad.id)} title="Dupliquer"><Copy style={{width:9,height:9}}/></BTN>
                                <BTN size="sm" onClick={()=>editAd(camp.id,as.id,ad.id)} title="Modifier"><Edit style={{width:9,height:9}}/></BTN>
                                <BTN size="sm" color="red" onClick={()=>deleteAd(camp.id,as.id,ad.id)} title="Supprimer"><Trash2 style={{width:9,height:9}}/></BTN>
                              </div>
                            </div>
                          ))}
                          <BTN size="sm" color="ghost" style={{ marginLeft:22, marginTop:4 }}
                            onClick={()=>addAd(camp.id,as.id,{id:`ad_${Date.now()}`,name:'Nouvelle annonce',format:'image',status:'active',cta:'Acheter maintenant',impressions:0,clicks:0,ctr:0})}>
                            <Plus style={{width:11,height:11}}/> Nouvelle annonce
                          </BTN>
                        </div>
                      )}
                    </div>
                    );
                  })}

                  {/* Add adset button */}
                  <BTN size="sm" color="ghost" style={{ marginLeft:20, marginTop:4 }}
                    onClick={()=>{ const id=`as_${Date.now()}`; addAdset(camp.id,{id,name:'Nouvel ensemble',status:'active',budget:0,spent:0,location:'',ageMin:18,ageMax:'65+',gender:'all',impressions:0,clicks:0,conversions:0,ads:[]}); setExpandedAdsets(p=>{const s=new Set(p);s.add(id);return s;}); toggleExpandCamp(camp.id); if(!expandedCamps.has(camp.id)) toggleExpandCamp(camp.id); }}>
                    <Plus style={{width:11,height:11}}/> Nouvel ensemble de publicités
                  </BTN>
                </div>
              )}
            </div>
            );
          })}
        </div>

        {/* ─── WIZARD MODAL ─────────────────────────────────────────────────── */}
        {showWizard && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:50, padding:16 }}>
            <div style={{ ...S.modal, maxWidth:720 }}>

              {/* Header */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
                <div>
                  <h2 style={{ fontSize:18, fontWeight:700, color:'#fff', margin:'0 0 4px' }}>{editingCampId ? 'Modifier la campagne' : 'Créer une campagne'}</h2>
                  <p style={{ fontSize:12, color:'rgba(255,255,255,0.45)', margin:0 }}>
                    {w.platform==='tiktok' ? 'TikTok Ads Manager' : 'Meta Ads Manager'} — Structure officielle
                  </p>
                </div>
                <button onClick={()=>{ setShowWizard(false); setEditingCampId(null); setEditingAdsetId(null); setEditingAdId(null); setW(defaultWizard); }} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.5)', cursor:'pointer', fontSize:22, lineHeight:1 }}>×</button>
              </div>

              {/* Progress steps */}
              <div style={{ display:'flex', alignItems:'center', gap:0, marginBottom:24 }}>
                {STEP_LABELS.map((lbl, i) => {
                  const n = i+1;
                  const done = wizardStep > n;
                  const active = wizardStep === n;
                  return (
                    <div key={n} style={{ display:'flex', alignItems:'center', flex: i<2?1:'none' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <div style={{ width:26, height:26, borderRadius:'50%', background:done?'#7c3aed':active?'#7c3aed':'rgba(255,255,255,0.1)', border:`2px solid ${done||active?'#7c3aed':'rgba(255,255,255,0.2)'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                          {done ? <Check style={{width:13,height:13,color:'#fff'}}/> : <span style={{ fontSize:12, fontWeight:700, color:active?'#fff':'rgba(255,255,255,0.4)' }}>{n}</span>}
                        </div>
                        <span style={{ fontSize:12, fontWeight:active?600:400, color:active?'#fff':done?'rgba(255,255,255,0.6)':'rgba(255,255,255,0.35)', whiteSpace:'nowrap' }}>{lbl}</span>
                      </div>
                      {i<2 && <div style={{ flex:1, height:1, background:done?'#7c3aed':'rgba(255,255,255,0.1)', margin:'0 10px' }} />}
                    </div>
                  );
                })}
              </div>

              {/* Step content */}
              <div style={{ marginBottom:24 }}>
                {wizardStep===1 && <WizardStep1 w={w} set={set} />}
                {wizardStep===2 && <WizardStep2 w={w} set={set} />}
                {wizardStep===3 && <WizardStep3 w={w} set={set} />}
              </div>

              {/* Footer nav */}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:16, borderTop:'1px solid rgba(255,255,255,0.08)' }}>
                <BTN onClick={wizardStep===1?()=>setShowWizard(false):()=>setWizardStep(s=>s-1)}>
                  <ChevronLeft style={{width:15,height:15}}/> {wizardStep===1?'Annuler':'Retour'}
                </BTN>
                <span style={{ fontSize:12, color:'rgba(255,255,255,0.35)' }}>Étape {wizardStep} / 3</span>
                {wizardStep<3
                  ? <BTN color="brand" disabled={wizardStep===1 && !w.name} onClick={()=>setWizardStep(s=>s+1)}>
                      Suivant <ChevronRight style={{width:15,height:15}}/>
                    </BTN>
                  : <BTN color="brand" disabled={!w.destUrl} onClick={launchCampaign}>
                      <Zap style={{width:15,height:15}}/> Lancer la campagne
                    </BTN>
                }
              </div>
            </div>
          </div>
        )}

        {/* ─── CONNECTION MODAL ──────────────────────────────────────────────── */}
        {showConnectionModal && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:50, padding:16 }}>
            <div style={S.modal}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
                <h2 style={{ fontSize:18, fontWeight:700, color:'#fff', display:'flex', alignItems:'center', gap:8, margin:0 }}>
                  <Settings style={{width:18,height:18,color:'#7c3aed'}}/> Connexions Publicitaires
                </h2>
                <button onClick={()=>setShowConnectionModal(false)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.5)', cursor:'pointer', fontSize:22, lineHeight:1 }}>×</button>
              </div>
              <div style={S.col}>
                {/* Meta */}
                <div style={{ background:'rgba(59,130,246,0.07)', border:'1px solid rgba(59,130,246,0.2)', borderRadius:12, padding:16 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                    <div style={{ width:36, height:36, borderRadius:8, background:'rgba(59,130,246,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Facebook style={{width:20,height:20,color:'#60a5fa'}}/>
                    </div>
                    <div style={{ flex:1 }}>
                      <p style={{ color:'#fff', fontWeight:600, margin:0 }}>Meta (Facebook & Instagram)</p>
                      <p style={{ color:'rgba(255,255,255,0.4)', fontSize:12, margin:0 }}>Accès à la Meta Ads API v20+</p>
                    </div>
                    {metaConnected && <Badge label="Connecté" style={{ background:'rgba(34,197,94,0.2)', color:'#4ade80', border:'1px solid rgba(34,197,94,0.3)' }}/>}
                  </div>
                  <label style={S.label}>Access Token (User Token ou System User Token)</label>
                  <input type="password" style={S.field} placeholder="EAAxxxxxxxxxxxxxxxx..." value={metaToken} onChange={e=>setMetaToken(e.target.value)} />
                  <p style={S.muted}>Obtenez votre token sur <a href="https://developers.facebook.com/tools/explorer" target="_blank" rel="noreferrer" style={{ color:'#60a5fa' }}>developers.facebook.com/tools/explorer</a></p>
                </div>
                {/* TikTok */}
                <div style={{ background:'rgba(168,85,247,0.07)', border:'1px solid rgba(168,85,247,0.2)', borderRadius:12, padding:16 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                    <div style={{ width:36, height:36, borderRadius:8, background:'rgba(168,85,247,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <VideoIcon style={{width:20,height:20,color:'#c084fc'}}/>
                    </div>
                    <div style={{ flex:1 }}>
                      <p style={{ color:'#fff', fontWeight:600, margin:0 }}>TikTok Ads Manager</p>
                      <p style={{ color:'rgba(255,255,255,0.4)', fontSize:12, margin:0 }}>Accès à la TikTok Marketing API</p>
                    </div>
                    {tiktokConnected && <Badge label="Connecté" style={{ background:'rgba(34,197,94,0.2)', color:'#4ade80', border:'1px solid rgba(34,197,94,0.3)' }}/>}
                  </div>
                  <label style={S.label}>Access Token (TikTok Marketing API)</label>
                  <input type="password" style={S.field} placeholder="act.xxxxxxxxxxxxxxxx..." value={tiktokToken} onChange={e=>setTiktokToken(e.target.value)} />
                  <p style={S.muted}>Obtenez votre token sur <a href="https://ads.tiktok.com/marketing_api/apps" target="_blank" rel="noreferrer" style={{ color:'#c084fc' }}>ads.tiktok.com/marketing_api/apps</a></p>
                </div>
                <div style={{ display:'flex', justifyContent:'flex-end', gap:10, paddingTop:12, borderTop:'1px solid rgba(255,255,255,0.08)' }}>
                  <BTN onClick={()=>setShowConnectionModal(false)}>Annuler</BTN>
                  <BTN color="brand" onClick={saveConnections}><Check style={{width:14,height:14}}/> Enregistrer</BTN>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
