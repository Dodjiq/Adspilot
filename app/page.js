'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  LayoutDashboard, FolderOpen, ShoppingBag, BarChart2, Search, Video,
  Settings, Zap, Bell, Heart, Check, X, ChevronDown, Filter, ExternalLink,
  Loader2, Mail, Lock, User, ArrowRight, TrendingUp, DollarSign,
  ShoppingCart, LogOut, CreditCard, Sparkles, Clock, Eye, Store,
  CheckCircle2, Circle, Palette, AlertCircle, Plus, ChevronRight,
  Globe, Layers, Shield, Users, Star, MessageSquare, MousePointerClick,
  Target, Image, Repeat, ChevronUp, Menu, Play
} from 'lucide-react';

// ============================================
// SUPABASE CLIENT
// ============================================
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

// ============================================
// CONSTANTS
// ============================================
const NICHE_CONFIG = {
  beaute: { bg: 'bg-pink-500/20', text: 'text-pink-400', border: 'border-pink-500/30', label: 'Beauté' },
  mode: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30', label: 'Mode' },
  food: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30', label: 'Food' },
  electronique: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', label: 'Électronique' },
  maison: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', label: 'Maison' },
  sante: { bg: 'bg-teal-500/20', text: 'text-teal-400', border: 'border-teal-500/30', label: 'Santé' },
};

const FORMAT_LABELS = { carre: 'Carré 1:1', story: 'Story 9:16', landscape: 'Paysage 16:9', ugc: 'UGC' };

const NICHES = [
  { id: 'all', label: 'Tous' },
  { id: 'beaute', label: 'Beauté' },
  { id: 'mode', label: 'Mode' },
  { id: 'food', label: 'Food' },
  { id: 'electronique', label: 'Électronique' },
  { id: 'maison', label: 'Maison' },
];

const FORMATS = [
  { id: 'all', label: 'Tous formats' },
  { id: 'carre', label: 'Carré' },
  { id: 'story', label: 'Story' },
  { id: 'landscape', label: 'Paysage' },
];

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '#/dashboard' },
  { icon: FolderOpen, label: 'AfriVault', path: '#/afrivault' },
  { icon: ShoppingBag, label: 'Ma Boutique', path: '#/my-store' },
  { icon: BarChart2, label: 'Analytics', path: '#/analytics', soon: true },
  { icon: Search, label: 'AdScout', path: '#/adscout', soon: true },
  { icon: Video, label: 'UGC Studio', path: '#/ugc', soon: true },
];

const LANDING_FEATURES = [
  { icon: Palette, title: 'Templates AfriVault', desc: '+500 templates publicitaires optimisés pour le marché africain. Beauté, mode, food, électronique.' },
  { icon: Store, title: 'Connexion Shopify', desc: 'Connecte ta boutique en un clic. On récupère tes produits automatiquement.' },
  { icon: TrendingUp, title: 'Analytics (Bientôt)', desc: 'Suis tes performances, ton ROAS et tes ventes depuis un seul dashboard.' },
];

const MOCK_TEMPLATES = [
  { id: 't1', title: 'Glow naturel', description: 'Template testimonial pour produits éclaircissants', niche: 'beaute', format: 'carre', canva_template_id: 'mock_canva_001', preview_url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop', tags: ['testimonial', 'skincare', 'glow'], is_premium: false },
  { id: 't2', title: 'Avant / Après', description: 'Comparaison résultats avant-après produit beauté', niche: 'beaute', format: 'carre', canva_template_id: 'mock_canva_002', preview_url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=400&fit=crop', tags: ['avant-apres', 'transformation'], is_premium: false },
  { id: 't3', title: 'Flash Sale Mode', description: 'Promotion urgence pour boutique mode africaine', niche: 'mode', format: 'story', canva_template_id: 'mock_canva_003', preview_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', tags: ['promo', 'urgence', 'flash'], is_premium: false },
  { id: 't4', title: 'Nouvelle collection', description: 'Lancement collection avec ambiance premium', niche: 'mode', format: 'landscape', canva_template_id: 'mock_canva_004', preview_url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=400&fit=crop', tags: ['lancement', 'premium', 'collection'], is_premium: true },
  { id: 't5', title: 'Plat du jour', description: 'Template restaurant / livraison food africain', niche: 'food', format: 'carre', canva_template_id: 'mock_canva_005', preview_url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop', tags: ['restaurant', 'livraison'], is_premium: false },
  { id: 't6', title: 'Promotion repas', description: 'Offre spéciale food avec CTA fort', niche: 'food', format: 'story', canva_template_id: 'mock_canva_006', preview_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop', tags: ['promo', 'food', 'offre'], is_premium: false },
  { id: 't7', title: 'Tech Review', description: 'Style unboxing/review pour produits électroniques', niche: 'electronique', format: 'carre', canva_template_id: 'mock_canva_007', preview_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', tags: ['review', 'tech', 'unboxing'], is_premium: false },
  { id: 't8', title: 'Meilleur prix', description: 'Comparaison prix / badge meilleure offre', niche: 'electronique', format: 'landscape', canva_template_id: 'mock_canva_008', preview_url: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop', tags: ['prix', 'promo'], is_premium: true },
  { id: 't9', title: 'Déco maison', description: 'Ambiance lifestyle pour produits maison', niche: 'maison', format: 'carre', canva_template_id: 'mock_canva_009', preview_url: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&h=400&fit=crop', tags: ['lifestyle', 'deco'], is_premium: false },
  { id: 't10', title: '5 étoiles', description: 'Template avis clients / social proof', niche: 'beaute', format: 'story', canva_template_id: 'mock_canva_010', preview_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=400&fit=crop', tags: ['reviews', 'social-proof'], is_premium: false },
  { id: 't11', title: 'Offre limitée', description: 'Urgence FOMO avec compte à rebours visuel', niche: 'mode', format: 'carre', canva_template_id: 'mock_canva_011', preview_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop', tags: ['fomo', 'urgence'], is_premium: false },
  { id: 't12', title: 'Duo produit', description: "Mise en avant d'un bundle / pack de produits", niche: 'beaute', format: 'landscape', canva_template_id: 'mock_canva_012', preview_url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop', tags: ['bundle', 'pack'], is_premium: false },
];

// ============================================
// UTILITY
// ============================================
function cn(...classes) { return classes.filter(Boolean).join(' '); }

function apiHeaders(session) {
  const h = { 'Content-Type': 'application/json' };
  if (session?.access_token) h['Authorization'] = `Bearer ${session.access_token}`;
  return h;
}

// ============================================
// HOOKS
// ============================================
function useHashRouter() {
  const [currentPath, setCurrentPath] = useState('');
  useEffect(() => {
    const update = () => setCurrentPath(window.location.hash || '#/');
    update();
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);
  const navigate = useCallback((path) => { window.location.hash = path; }, []);
  return { currentPath, navigate };
}

// ============================================
// TOAST SYSTEM
// ============================================
function ToastContainer({ toasts, onDismiss }) {
  if (!toasts.length) return null;
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map(t => (
        <div key={t.id} className={cn(
          'px-4 py-3 rounded-xl text-sm font-medium shadow-2xl flex items-center gap-3 animate-slide-in border',
          t.type === 'success' && 'bg-green-500/10 text-green-400 border-green-500/20',
          t.type === 'error' && 'bg-red-500/10 text-red-400 border-red-500/20',
          t.type === 'info' && 'bg-blue-500/10 text-blue-400 border-blue-500/20'
        )}>
          {t.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0" />}
          {t.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0" />}
          {t.type === 'info' && <AlertCircle className="w-4 h-4 shrink-0" />}
          <span className="flex-1">{t.message}</span>
          <button onClick={() => onDismiss(t.id)} className="text-current opacity-50 hover:opacity-100"><X className="w-3.5 h-3.5" /></button>
        </div>
      ))}
    </div>
  );
}

// ============================================
// SIDEBAR
// ============================================
function Sidebar({ currentPath, user, onLogout }) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-16 bg-[#12121A] border-r border-white/[0.08] flex flex-col items-center py-4 z-50">
      <a href="#/dashboard" className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center mb-8 hover:shadow-lg hover:shadow-brand/20 transition-all">
        <Zap className="w-5 h-5 text-white" />
      </a>
      <div className="flex-1 flex flex-col items-center gap-1">
        {NAV_ITEMS.map(item => (
          <a
            key={item.path}
            href={item.soon ? undefined : item.path}
            onClick={item.soon ? (e) => e.preventDefault() : undefined}
            className={cn(
              'relative w-10 h-10 rounded-xl flex items-center justify-center transition-all group',
              currentPath === item.path
                ? 'bg-brand/20 text-brand'
                : item.soon
                ? 'text-gray-600 cursor-not-allowed'
                : 'text-gray-500 hover:text-white hover:bg-white/5'
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.soon && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-amber-400 border-2 border-[#12121A]" />}
            <span className="absolute left-14 px-3 py-1.5 rounded-lg bg-[#1A1A26] border border-white/10 text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl">
              {item.label}{item.soon && ' (Bientôt)'}
            </span>
          </a>
        ))}
      </div>
      <div className="flex flex-col items-center gap-2">
        <a href="#/settings" className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center transition-all group',
          currentPath?.startsWith('#/settings') ? 'bg-brand/20 text-brand' : 'text-gray-500 hover:text-white hover:bg-white/5'
        )}>
          <Settings className="w-5 h-5" />
          <span className="absolute left-14 px-3 py-1.5 rounded-lg bg-[#1A1A26] border border-white/10 text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl">Paramètres</span>
        </a>
        <button onClick={onLogout} className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all group">
          <LogOut className="w-5 h-5" />
          <span className="absolute left-14 px-3 py-1.5 rounded-lg bg-[#1A1A26] border border-white/10 text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl">Déconnexion</span>
        </button>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-accent-gold flex items-center justify-center text-white font-semibold text-sm mt-1">
          {user?.user_metadata?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
        </div>
      </div>
    </aside>
  );
}

// ============================================
// TOP NAV
// ============================================
function TopNav({ title, subtitle }) {
  return (
    <header className="sticky top-0 z-40 bg-[#0A0A0F]/80 backdrop-blur-xl border-b border-white/[0.08] px-6 py-4">
      <h1 className="text-lg font-semibold text-white">{title}</h1>
      {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
    </header>
  );
}

// ============================================
// DASHBOARD LAYOUT
// ============================================
function DashboardLayout({ children, user, currentPath, onLogout }) {
  const titles = {
    '#/dashboard': { title: 'Dashboard', subtitle: `Bienvenue, ${user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'utilisateur'}` },
    '#/afrivault': { title: 'AfriVault — Templates africains', subtitle: null },
    '#/my-store': { title: 'Ma Boutique', subtitle: 'Gère ta connexion Shopify' },
    '#/settings': { title: 'Paramètres', subtitle: 'Gère ton profil et tes préférences' },
    '#/settings/billing': { title: 'Abonnement', subtitle: 'Gère ton plan Easy-Ecom' },
    '#/analytics': { title: 'Analytics', subtitle: null },
    '#/adscout': { title: 'AdScout', subtitle: null },
    '#/ugc': { title: 'UGC Studio', subtitle: null },
  };
  const { title, subtitle } = titles[currentPath] || titles['#/dashboard'];
  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <Sidebar currentPath={currentPath} user={user} onLogout={onLogout} />
      <div className="ml-16">
        <TopNav title={title} subtitle={subtitle} />
        <main className="p-6 animate-fade-in">{children}</main>
      </div>
    </div>
  );
}

// ============================================
// LANDING PAGE (Kopy-style)
// ============================================
function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [heroEmail, setHeroEmail] = useState('');

  const steps = [
    { num: '01', icon: Store, title: 'Connecte ta boutique', desc: 'Lie ta boutique Shopify en un clic. On importe tes produits automatiquement.' },
    { num: '02', icon: Layers, title: 'Choisis ton template', desc: 'Parcours +500 templates AfriVault optimisés pour le marché africain.' },
    { num: '03', icon: ExternalLink, title: 'Lance ta publicité', desc: 'Édite dans Canva, personnalise et publie sur Meta en quelques minutes.' },
  ];

  const stats = [
    { value: '+500', label: 'Templates disponibles', icon: Layers },
    { value: '100%', label: 'Pensé pour l\'Afrique', icon: Globe },
    { value: '5 min', label: 'Pour lancer ta pub', icon: Zap },
    { value: '+12', label: 'Niches couvertes', icon: Target },
  ];

  const compFeatures = [
    'Templates optimisés Afrique', 'Édition Canva intégrée', 'Connexion Shopify automatique',
    'Analytics & suivi ROAS', 'Multi-niches (beauté, mode, food...)', 'Support en français',
    'Prix abordable', 'Résultats immédiats',
  ];
  const compData = [true, true, true, true, true, true, true, true];
  const compManual = [false, false, false, false, false, false, true, false];
  const compAgency = [true, false, true, true, false, true, false, true];

  const testimonials = [
    { name: 'Sarah M.', role: 'Boutique beauté — Dakar', quote: 'Easy-Ecom m\'a permis de lancer mes premières pubs Meta en moins de 10 minutes. Les templates sont parfaitement adaptés à ma clientèle africaine.', avatar: 'S', time: '3 mois', color: 'from-pink-500 to-purple-500' },
    { name: 'Kofi A.', role: 'E-commerce mode — Abidjan', quote: 'Je gagnais des heures chaque semaine grâce aux templates. Mon ROAS est passé de 1.2x à 2.8x dès les deux premières semaines.', avatar: 'K', time: '6 mois', color: 'from-blue-500 to-cyan-500' },
    { name: 'Amara D.', role: 'Tech store — Lagos', quote: 'La connexion Shopify est magique. Mes produits sont importés et les pubs sont prêtes en quelques clics. Simple et terriblement efficace.', avatar: 'A', time: '1 mois', color: 'from-amber-500 to-orange-500' },
  ];

  const faqs = [
    { q: "Qu'est-ce qu'Easy-Ecom exactement ?", a: "Easy-Ecom est une plateforme SaaS tout-en-un conçue pour les e-commerçants africains francophones. Elle combine des templates publicitaires optimisés pour l'Afrique, l'édition Canva intégrée, la connexion Shopify et un dashboard analytics pour scaler vos pubs Meta." },
    { q: "Ai-je besoin d'expérience en publicité ?", a: "Pas du tout ! Easy-Ecom est conçu pour les débutants comme les experts. Nos templates sont prêts à l'emploi et optimisés pour le marché africain. Il suffit de choisir, personnaliser dans Canva et publier." },
    { q: 'Quels types de templates sont disponibles ?', a: "Nous proposons +500 templates dans 12+ niches : beauté, mode, food, électronique, maison, santé et plus. Chaque template est disponible en format carré (1:1), story (9:16) et paysage (16:9)." },
    { q: 'Comment fonctionne la connexion Shopify ?', a: "Il suffit de coller l'URL de ta boutique Shopify. On importe automatiquement tes produits avec images et prix. Tu peux ensuite créer des pubs directement depuis tes produits." },
    { q: 'Puis-je annuler à tout moment ?', a: "Oui, absolument ! Pas d'engagement. Tu peux annuler ton abonnement à tout moment depuis ton dashboard. Aucun frais caché, aucune mauvaise surprise." },
    { q: "Comment fonctionne l'édition dans Canva ?", a: "Quand tu choisis un template AfriVault, tu peux l'ouvrir directement dans Canva pour le personnaliser avec tes propres images, textes et couleurs. Puis tu exportes et publies sur Meta." },
  ];

  const handleHeroSubmit = (e) => {
    e.preventDefault();
    if (heroEmail) window.location.hash = '#/register';
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#070B14' }}>
      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] backdrop-blur-xl" style={{ backgroundColor: 'rgba(7,11,20,0.85)' }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#5A5AFB] to-[#9C5DFF] flex items-center justify-center shadow-lg shadow-[#5A5AFB]/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">Easy-Ecom</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#/login" className="text-gray-400 hover:text-white text-sm font-medium transition-colors hidden sm:block">Connexion</a>
            <a href="#/register" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#5A5AFB] to-[#9C5DFF] text-white text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-[#5A5AFB]/25">
              Essayez-le gratuitement
            </a>
          </div>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-[#5A5AFB]/[0.07] blur-[120px] pointer-events-none" />
        <div className="absolute top-[100px] right-[-200px] w-[400px] h-[400px] rounded-full bg-[#9C5DFF]/[0.05] blur-[100px] pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Left */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-white leading-[1.1] tracking-tight mb-6">
                Crée des publicités qui <span className="bg-gradient-to-r from-[#5A5AFB] to-[#9C5DFF] bg-clip-text text-transparent">convertissent</span> pour le marché africain.
              </h1>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed max-w-lg">
                Templates optimisés, édition Canva, connexion Shopify — tout pour scaler tes pubs Meta en quelques minutes.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  { icon: Layers, text: '+500 templates AfriVault' },
                  { icon: Globe, text: 'Optimisé marché africain' },
                  { icon: Palette, text: 'Édition Canva intégrée' },
                  { icon: Zap, text: 'Résultats en 5 minutes' },
                ].map(f => (
                  <div key={f.text} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#5A5AFB]/20 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-[#5A5AFB]" />
                    </div>
                    <span className="text-gray-300 text-sm font-medium">{f.text}</span>
                  </div>
                ))}
              </div>
              <a href="#/register" className="hidden md:inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#5A5AFB] to-[#9C5DFF] text-white font-semibold hover:opacity-90 transition-all shadow-xl shadow-[#5A5AFB]/25">
                Essayez-le gratuitement <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            {/* Right - Signup Card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#5A5AFB]/10 to-[#9C5DFF]/10 rounded-3xl blur-xl" />
              <div className="relative bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-8">
                <h3 className="text-white font-semibold text-lg mb-1">Commence maintenant</h3>
                <p className="text-gray-400 text-sm mb-6">Lance ta première pub en 5 minutes</p>
                <form onSubmit={handleHeroSubmit} className="space-y-4">
                  <input type="email" value={heroEmail} onChange={e => setHeroEmail(e.target.value)} placeholder="Ton adresse email" required
                    className="w-full px-4 py-3.5 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white placeholder-gray-500 focus:outline-none focus:border-[#5A5AFB]/50 focus:ring-1 focus:ring-[#5A5AFB]/30 text-sm transition-all" />
                  <button type="submit" className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#5A5AFB] to-[#9C5DFF] text-white font-semibold hover:opacity-90 transition-all shadow-lg shadow-[#5A5AFB]/25 flex items-center justify-center gap-2">
                    Essayez-le gratuitement <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
                <p className="text-center text-xs text-gray-500 mt-4">Pas de carte bancaire requise. Annulez quand vous voulez.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SOCIAL PROOF ===== */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/[0.08] bg-white/[0.02]">
            <div className="flex -space-x-2">
              {['S', 'K', 'A', 'M'].map((l, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-[#5A5AFB] to-[#9C5DFF] flex items-center justify-center text-white text-xs font-bold border-2 border-[#070B14]">{l}</div>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span className="text-gray-300 text-sm font-medium">UTILISÉ PAR PLUS DE <span className="text-white font-bold">500+</span> E-COMMERÇANTS AFRICAINS</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== PLATFORM LOGOS ===== */}
      <div className="border-t border-b border-white/[0.06] py-8">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-xs text-gray-500 uppercase tracking-wider mb-6 font-medium">Intégrations compatibles</p>
          <div className="flex items-center justify-center gap-10 md:gap-16 opacity-40 flex-wrap">
            {['Shopify', 'Canva', 'Meta Ads', 'Instagram', 'Facebook', 'TikTok'].map(name => (
              <span key={name} className="text-white font-bold text-lg tracking-tight">{name}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ===== STEPS SECTION ===== */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div className="md:sticky md:top-32">
              <span className="text-[#5A5AFB] text-sm font-semibold uppercase tracking-wider">Comment ça marche</span>
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-white mt-4 leading-[1.15] tracking-tight">
                Lance une nouvelle pub sur ta boutique en <span className="bg-gradient-to-r from-[#5A5AFB] to-[#9C5DFF] bg-clip-text text-transparent">quelques secondes</span> grâce à nos templates.
              </h2>
              <p className="text-gray-400 mt-6 leading-relaxed max-w-md">
                Easy-Ecom s'assure que chaque publicité correspond au style unique de ta marque et au goût de ta clientèle africaine.
              </p>
            </div>
            <div className="space-y-5">
              {steps.map((step, i) => (
                <div key={step.num} className="group relative p-6 rounded-2xl bg-gradient-to-br from-[#5A5AFB]/[0.08] to-[#9C5DFF]/[0.04] border border-[#5A5AFB]/[0.15] hover:border-[#5A5AFB]/30 transition-all">
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5A5AFB] to-[#9C5DFF] flex items-center justify-center shrink-0 shadow-lg shadow-[#5A5AFB]/20">
                      <step.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-[#5A5AFB] text-xs font-bold uppercase tracking-wider mb-1">Étape {step.num}</div>
                      <h3 className="text-white font-semibold text-lg mb-2">{step.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#5A5AFB]/[0.03] to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-white leading-tight tracking-tight">
              Passe de zéro à <span className="bg-gradient-to-r from-[#5A5AFB] to-[#9C5DFF] bg-clip-text text-transparent">prêt à vendre.</span><br />En quelques secondes.
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map(s => (
              <div key={s.label} className="text-center p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-[#5A5AFB]/20 transition-all">
                <div className="w-12 h-12 rounded-xl bg-[#5A5AFB]/10 flex items-center justify-center mx-auto mb-4">
                  <s.icon className="w-6 h-6 text-[#5A5AFB]" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">{s.value}</div>
                <div className="text-sm text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURE HIGHLIGHT ===== */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[#5A5AFB] text-sm font-semibold uppercase tracking-wider">AfriVault</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mt-4 leading-tight tracking-tight">
                +500 templates pub optimisés pour le <span className="bg-gradient-to-r from-[#5A5AFB] to-[#9C5DFF] bg-clip-text text-transparent">marché africain</span>
              </h2>
              <p className="text-gray-400 mt-6 leading-relaxed">
                Beauté, mode, food, électronique, maison — chaque niche a ses propres templates conçus pour maximiser les conversions auprès de ta clientèle.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  { icon: Palette, text: '12+ niches spécialisées pour le marché africain' },
                  { icon: Image, text: 'Formats carré, story et paysage disponibles' },
                  { icon: ExternalLink, text: 'Édition directe dans Canva en un clic' },
                  { icon: Heart, text: 'Sauvegarde tes templates favoris' },
                ].map(f => (
                  <div key={f.text} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#5A5AFB]/10 flex items-center justify-center shrink-0">
                      <f.icon className="w-4 h-4 text-[#5A5AFB]" />
                    </div>
                    <span className="text-gray-300 text-sm">{f.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#5A5AFB]/10 to-[#9C5DFF]/5 rounded-3xl blur-2xl" />
              <div className="relative grid grid-cols-2 gap-3">
                {MOCK_TEMPLATES.slice(0, 4).map(t => (
                  <div key={t.id} className="rounded-xl overflow-hidden border border-white/[0.08] hover:border-[#5A5AFB]/30 transition-all">
                    <img src={t.preview_url} alt={t.title} className="w-full aspect-square object-cover" loading="lazy" />
                    <div className="p-2.5 bg-white/[0.03]">
                      <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded', NICHE_CONFIG[t.niche]?.bg, NICHE_CONFIG[t.niche]?.text)}>{NICHE_CONFIG[t.niche]?.label}</span>
                      <p className="text-white text-xs font-medium mt-1 truncate">{t.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== COMPARISON TABLE ===== */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#5A5AFB]/[0.02] to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 relative">
          <div className="text-center mb-16">
            <span className="text-[#5A5AFB] text-sm font-semibold uppercase tracking-wider">Comparaison</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-4 tracking-tight">
              Comment Easy-Ecom <span className="bg-gradient-to-r from-[#5A5AFB] to-[#9C5DFF] bg-clip-text text-transparent">se démarque</span>
            </h2>
          </div>
          <div className="rounded-2xl border border-white/[0.08] overflow-hidden">
            <div className="grid grid-cols-4 text-center text-sm font-semibold border-b border-white/[0.08]">
              <div className="p-4 text-gray-400 text-left">Fonctionnalité</div>
              <div className="p-4 text-white bg-gradient-to-b from-[#5A5AFB]/20 to-[#5A5AFB]/5 border-x border-[#5A5AFB]/20">
                <span className="text-[#5A5AFB]">Easy-Ecom</span>
              </div>
              <div className="p-4 text-gray-500">Faire soi-même</div>
              <div className="p-4 text-gray-500">Agence</div>
            </div>
            {compFeatures.map((feature, i) => (
              <div key={feature} className={cn("grid grid-cols-4 text-center text-sm items-center", i < compFeatures.length - 1 && "border-b border-white/[0.06]")}>
                <div className="p-4 text-gray-300 text-left text-xs sm:text-sm">{feature}</div>
                <div className="p-4 bg-[#5A5AFB]/[0.05] border-x border-[#5A5AFB]/10">
                  {compData[i] ? <CheckCircle2 className="w-5 h-5 text-[#5A5AFB] mx-auto" /> : <X className="w-5 h-5 text-gray-600 mx-auto" />}
                </div>
                <div className="p-4">
                  {compManual[i] ? <Check className="w-5 h-5 text-gray-500 mx-auto" /> : <X className="w-5 h-5 text-gray-600 mx-auto" />}
                </div>
                <div className="p-4">
                  {compAgency[i] ? <Check className="w-5 h-5 text-gray-500 mx-auto" /> : <X className="w-5 h-5 text-gray-600 mx-auto" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#5A5AFB] text-sm font-semibold uppercase tracking-wider">Témoignages</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-4 tracking-tight">
              Des centaines d'entrepreneurs <span className="bg-gradient-to-r from-[#5A5AFB] to-[#9C5DFF] bg-clip-text text-transparent">nous font confiance</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.name} className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-[#5A5AFB]/20 transition-all">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                  <div className={cn("w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm", t.color)}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{t.name}</div>
                    <div className="text-gray-500 text-xs">{t.role}</div>
                  </div>
                  <div className="ml-auto text-xs text-gray-600">{t.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#5A5AFB]/[0.03] to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 relative">
          <div className="text-center mb-16">
            <span className="text-[#5A5AFB] text-sm font-semibold uppercase tracking-wider">Tarification</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-4 tracking-tight">
              Abordable. <span className="bg-gradient-to-r from-[#5A5AFB] to-[#9C5DFF] bg-clip-text text-transparent">Transparent.</span>
            </h2>
            <p className="text-gray-400 mt-4 max-w-xl mx-auto">Un plan pensé pour les entrepreneurs africains. Pas de frais cachés.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 items-start">
            {/* Starter */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
              <div className="text-gray-400 text-sm font-semibold mb-1">Découverte</div>
              <div className="flex items-baseline gap-1 mb-4"><span className="text-4xl font-bold text-white">0€</span><span className="text-gray-500">/mois</span></div>
              <p className="text-gray-500 text-sm mb-6">Pour découvrir la plateforme</p>
              <ul className="space-y-3 mb-8">
                {['Accès à 10 templates', 'Aperçu AfriVault', 'Connexion Shopify'].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-gray-400"><Check className="w-4 h-4 text-gray-600 shrink-0" />{f}</li>
                ))}
                {['Édition Canva', 'Analytics', 'Support prioritaire'].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-gray-600"><X className="w-4 h-4 text-gray-700 shrink-0" />{f}</li>
                ))}
              </ul>
              <a href="#/register" className="block w-full py-3 rounded-xl border border-white/[0.1] text-white text-sm font-semibold text-center hover:bg-white/5 transition-all">
                Commencer gratuitement
              </a>
            </div>
            {/* Pro - Highlighted */}
            <div className="p-6 rounded-2xl border-2 border-[#5A5AFB]/40 relative bg-gradient-to-b from-[#5A5AFB]/[0.08] to-transparent shadow-xl shadow-[#5A5AFB]/10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#5A5AFB] to-[#9C5DFF] text-white text-xs font-bold">Le plus populaire</div>
              <div className="text-[#5A5AFB] text-sm font-semibold mb-1 mt-2">Pro</div>
              <div className="flex items-baseline gap-1 mb-4"><span className="text-4xl font-bold text-white">9,99€</span><span className="text-gray-500">/mois</span></div>
              <p className="text-gray-400 text-sm mb-6">Tout pour scaler tes pubs</p>
              <ul className="space-y-3 mb-8">
                {['Templates illimités AfriVault', 'Édition Canva intégrée', 'Connexion Shopify', 'Dashboard analytics', 'Multi-niches & formats', 'Support prioritaire'].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-gray-300"><CheckCircle2 className="w-4 h-4 text-[#5A5AFB] shrink-0" />{f}</li>
                ))}
              </ul>
              <a href="#/register" className="block w-full py-3.5 rounded-xl bg-gradient-to-r from-[#5A5AFB] to-[#9C5DFF] text-white text-sm font-semibold text-center hover:opacity-90 transition-all shadow-lg shadow-[#5A5AFB]/25">
                Commencer — 9,99€/mois
              </a>
            </div>
            {/* Business */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
              <div className="text-gray-400 text-sm font-semibold mb-1">Business</div>
              <div className="flex items-baseline gap-1 mb-4"><span className="text-4xl font-bold text-white">Sur mesure</span></div>
              <p className="text-gray-500 text-sm mb-6">Pour les agences & marques</p>
              <ul className="space-y-3 mb-8">
                {['Tout le plan Pro', 'Templates sur mesure', 'Intégration API Canva', 'Analytics avancés', 'Account manager dédié', 'Onboarding personnalisé'].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-gray-400"><Check className="w-4 h-4 text-gray-600 shrink-0" />{f}</li>
                ))}
              </ul>
              <button className="block w-full py-3 rounded-xl border border-white/[0.1] text-white text-sm font-semibold text-center hover:bg-white/5 transition-all opacity-60 cursor-not-allowed">
                Bientôt disponible
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#5A5AFB] text-sm font-semibold uppercase tracking-wider">FAQ</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-4 tracking-tight">
              Vous avez des questions ?<br /><span className="bg-gradient-to-r from-[#5A5AFB] to-[#9C5DFF] bg-clip-text text-transparent">Nous avons les réponses</span>
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-xl border border-white/[0.08] overflow-hidden hover:border-white/[0.12] transition-all">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left">
                  <span className="text-white font-medium text-sm pr-4">{faq.q}</span>
                  <ChevronDown className={cn("w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200", openFaq === i && "rotate-180")} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 -mt-1">
                    <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#5A5AFB]/[0.06] via-[#5A5AFB]/[0.03] to-transparent pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#5A5AFB]/[0.05] blur-[120px] pointer-events-none" />
        <div className="max-w-3xl mx-auto px-6 text-center relative">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight mb-6">
            Commence à scaler tes pubs <span className="bg-gradient-to-r from-[#5A5AFB] to-[#9C5DFF] bg-clip-text text-transparent">dès aujourd'hui</span>
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8 text-sm text-gray-400">
            <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-[#5A5AFB]" /> Setup en 5 minutes</span>
            <span className="flex items-center gap-2"><Layers className="w-4 h-4 text-[#5A5AFB]" /> +500 templates AfriVault</span>
            <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-[#5A5AFB]" /> Annulez à tout moment</span>
          </div>
          <a href="#/register" className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-gradient-to-r from-[#5A5AFB] to-[#9C5DFF] text-white font-bold text-lg hover:opacity-90 transition-all shadow-2xl shadow-[#5A5AFB]/30">
            Essayez-le gratuitement <ArrowRight className="w-5 h-5" />
          </a>
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
            <Shield className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-xs font-semibold">100% SANS RISQUE. ANNULEZ À TOUT MOMENT.</span>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-white/[0.06] py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#5A5AFB] to-[#9C5DFF] flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold text-lg">Easy-Ecom</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-white transition-colors">Conditions</a>
              <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <p className="text-center text-gray-600 text-xs mt-8">© 2025 Easy-Ecom. Le SaaS pub pensé pour l'Afrique.</p>
        </div>
      </footer>
    </div>
  );
}

// ============================================
// LOGIN PAGE
// ============================================
function LoginPage({ onLogin, showToast }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!supabase) { showToast('Supabase non configuré', 'error'); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      showToast('Connexion réussie !', 'success');
      onLogin(data.session);
    } catch (err) {
      showToast(err.message || 'Erreur de connexion', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="#/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl">Easy-Ecom</span>
          </a>
          <h1 className="text-2xl font-bold text-white">Bon retour !</h1>
          <p className="text-gray-400 mt-1">Connecte-toi pour accéder à ton dashboard</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-[#12121A] rounded-2xl border border-white/[0.08] p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ton@email.com" required
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#1A1A26] border border-white/[0.08] text-white placeholder-gray-500 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/30 text-sm transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#1A1A26] border border-white/[0.08] text-white placeholder-gray-500 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/30 text-sm transition-all" />
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3.5 rounded-xl bg-brand text-white font-semibold hover:bg-brand-light disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
          <p className="text-center text-sm text-gray-400">
            Pas encore de compte ? <a href="#/register" className="text-brand hover:text-brand-light font-medium transition-colors">Créer un compte</a>
          </p>
        </form>
      </div>
    </div>
  );
}

// ============================================
// REGISTER PAGE
// ============================================
function RegisterPage({ onRegister, showToast }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!supabase) { showToast('Supabase non configuré', 'error'); return; }
    if (password.length < 6) { showToast('Le mot de passe doit contenir au moins 6 caractères', 'error'); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } }
      });
      if (error) throw error;
      if (data.user && !data.session) {
        showToast('Vérifie ton email pour confirmer ton compte', 'info');
      } else {
        showToast('Compte créé avec succès !', 'success');
        if (data.session) {
          // Create profile in MongoDB
          try {
            await fetch('/api/profile', {
              method: 'POST',
              headers: apiHeaders(data.session),
              body: JSON.stringify({ full_name: name })
            });
          } catch (profileErr) { /* ignore profile creation errors for now */ }
          onRegister(data.session);
        }
      }
    } catch (err) {
      showToast(err.message || 'Erreur lors de la création du compte', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="#/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl">Easy-Ecom</span>
          </a>
          <h1 className="text-2xl font-bold text-white">Créer ton compte</h1>
          <p className="text-gray-400 mt-1">Rejoins +500 e-commerçants africains</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-[#12121A] rounded-2xl border border-white/[0.08] p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Nom complet</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ton nom" required
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#1A1A26] border border-white/[0.08] text-white placeholder-gray-500 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/30 text-sm transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ton@email.com" required
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#1A1A26] border border-white/[0.08] text-white placeholder-gray-500 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/30 text-sm transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 6 caractères" required
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#1A1A26] border border-white/[0.08] text-white placeholder-gray-500 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/30 text-sm transition-all" />
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3.5 rounded-xl bg-brand text-white font-semibold hover:bg-brand-light disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
          <p className="text-center text-sm text-gray-400">
            Déjà un compte ? <a href="#/login" className="text-brand hover:text-brand-light font-medium transition-colors">Se connecter</a>
          </p>
        </form>
      </div>
    </div>
  );
}

// ============================================
// DASHBOARD PAGE
// ============================================
function DashboardPage({ user, session, showToast }) {
  const [store, setStore] = useState(null);
  const [savedCount, setSavedCount] = useState(0);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [storeRes, savedRes] = await Promise.all([
          fetch('/api/store', { headers: apiHeaders(session) }),
          fetch('/api/templates/saved', { headers: apiHeaders(session) })
        ]);
        if (storeRes.ok) { const d = await storeRes.json(); setStore(d.store); }
        if (savedRes.ok) { const d = await savedRes.json(); setSavedCount(d.saved?.length || 0); }
      } catch (err) { /* silent */ }
      setLoadingData(false);
    }
    fetchData();
  }, [session]);

  const stats = [
    { icon: DollarSign, label: 'Ad Spend', value: '—', sub: 'Meta Ads non connecté', color: 'text-brand' },
    { icon: ShoppingCart, label: 'Achats', value: '—', sub: 'Données à venir', color: 'text-accent-gold' },
    { icon: TrendingUp, label: 'ROAS', value: '—', sub: 'Phase 2', color: 'text-green-400' },
  ];

  const checklist = [
    { label: 'Boutique Shopify connectée', done: !!store, action: '#/my-store' },
    { label: 'Premier template sauvegardé', done: savedCount > 0, action: '#/afrivault' },
    { label: 'Abonnement actif', done: false, action: '#/settings/billing' },
    { label: 'Premier design édité dans Canva', done: false },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-[#12121A] rounded-2xl border border-white/[0.08] p-5 hover:border-white/[0.12] transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', s.color === 'text-brand' ? 'bg-brand/15' : s.color === 'text-accent-gold' ? 'bg-amber-500/15' : 'bg-green-500/15')}>
                <s.icon className={cn('w-5 h-5', s.color)} />
              </div>
              <span className="text-sm text-gray-400 font-medium">{s.label}</span>
            </div>
            <div className="text-2xl font-bold text-white">{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-[#12121A] rounded-2xl border border-white/[0.08] p-6">
          <h2 className="text-white font-semibold mb-4">Actions rapides</h2>
          <div className="space-y-3">
            <a href="#/afrivault" className="flex items-center gap-4 p-4 rounded-xl bg-[#1A1A26] hover:bg-[#1A1A26]/80 border border-white/[0.05] hover:border-brand/30 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-brand/15 flex items-center justify-center group-hover:bg-brand/25 transition-colors">
                <FolderOpen className="w-5 h-5 text-brand" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white">Explorer les templates</div>
                <div className="text-xs text-gray-500">+500 templates pour tes pubs</div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-brand transition-colors" />
            </a>
            <a href="#/my-store" className="flex items-center gap-4 p-4 rounded-xl bg-[#1A1A26] hover:bg-[#1A1A26]/80 border border-white/[0.05] hover:border-brand/30 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center group-hover:bg-amber-500/25 transition-colors">
                <Store className="w-5 h-5 text-amber-400" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white">Connecter ta boutique</div>
                <div className="text-xs text-gray-500">Lier ton Shopify en 1 clic</div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-brand transition-colors" />
            </a>
          </div>
        </div>

        {/* Launch Checklist */}
        <div className="bg-[#12121A] rounded-2xl border border-white/[0.08] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Liste de démarrage</h2>
            <span className="text-xs text-gray-500">{checklist.filter(c => c.done).length}/{checklist.length} complété</span>
          </div>
          <div className="space-y-3">
            {checklist.map(item => (
              <div key={item.label} className="flex items-center gap-3">
                {item.done
                  ? <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                  : <Circle className="w-5 h-5 text-gray-600 shrink-0" />}
                <span className={cn('text-sm flex-1', item.done ? 'text-gray-500 line-through' : 'text-gray-300')}>
                  {item.label}
                </span>
                {!item.done && item.action && (
                  <a href={item.action} className="text-xs text-brand hover:text-brand-light font-medium transition-colors">Faire →</a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// AFRIVAULT PAGE
// ============================================
function AfriVaultPage({ user, session, showToast }) {
  const [templates, setTemplates] = useState(MOCK_TEMPLATES);
  const [activeNiche, setActiveNiche] = useState('all');
  const [activeFormat, setActiveFormat] = useState('all');
  const [savedIds, setSavedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [showFormatDrop, setShowFormatDrop] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    async function load() {
      try {
        const [tplRes, savedRes] = await Promise.all([
          fetch('/api/templates'),
          session ? fetch('/api/templates/saved', { headers: apiHeaders(session) }) : Promise.resolve(null)
        ]);
        if (tplRes.ok) { const d = await tplRes.json(); if (d.templates?.length) setTemplates(d.templates); }
        if (savedRes?.ok) { const d = await savedRes.json(); setSavedIds(new Set((d.saved || []).map(s => s.template_id))); }
      } catch (err) { /* use mock data */ }
      setLoading(false);
    }
    load();
  }, [session]);

  useEffect(() => {
    function handleClick(e) { if (dropRef.current && !dropRef.current.contains(e.target)) setShowFormatDrop(false); }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggleSave = async (templateId) => {
    if (!session) { showToast('Connecte-toi pour sauvegarder', 'error'); return; }
    const isSaved = savedIds.has(templateId);
    setSavedIds(prev => { const n = new Set(prev); isSaved ? n.delete(templateId) : n.add(templateId); return n; });
    try {
      await fetch('/api/templates/save', {
        method: 'POST',
        headers: apiHeaders(session),
        body: JSON.stringify({ template_id: templateId, action: isSaved ? 'unsave' : 'save' })
      });
      showToast(isSaved ? 'Template retiré' : 'Template sauvegardé !', 'success');
    } catch (err) {
      setSavedIds(prev => { const n = new Set(prev); isSaved ? n.add(templateId) : n.delete(templateId); return n; });
      showToast('Erreur lors de la sauvegarde', 'error');
    }
  };

  const openCanva = (template) => {
    window.open('https://www.canva.com/design', '_blank');
    showToast('Ouverture de Canva...', 'info');
  };

  const filtered = templates.filter(t => {
    if (activeNiche !== 'all' && t.niche !== activeNiche) return false;
    if (activeFormat !== 'all' && t.format !== activeFormat) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-medium">
            <Clock className="w-3 h-3" /> Mis à jour : {new Date().toLocaleDateString('fr-FR')}
          </span>
          <span className="text-sm text-gray-500">{filtered.length} template{filtered.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center bg-[#12121A] rounded-xl border border-white/[0.08] p-1 gap-0.5 overflow-x-auto">
          {NICHES.map(n => (
            <button key={n.id} onClick={() => setActiveNiche(n.id)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
                activeNiche === n.id ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}>{n.label}</button>
          ))}
        </div>
        <div className="relative" ref={dropRef}>
          <button onClick={() => setShowFormatDrop(!showFormatDrop)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#12121A] border border-white/[0.08] text-sm text-gray-300 hover:border-white/[0.15] transition-all">
            <Filter className="w-4 h-4" />
            {FORMATS.find(f => f.id === activeFormat)?.label}
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          {showFormatDrop && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-[#1A1A26] rounded-xl border border-white/[0.1] shadow-2xl py-1 z-50">
              {FORMATS.map(f => (
                <button key={f.id} onClick={() => { setActiveFormat(f.id); setShowFormatDrop(false); }}
                  className={cn(
                    'w-full text-left px-4 py-2.5 text-sm transition-colors',
                    activeFormat === f.id ? 'text-brand bg-brand/10' : 'text-gray-300 hover:bg-white/5'
                  )}>{f.label}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Template Grid */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-brand animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <FolderOpen className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">Aucun template trouvé pour ces filtres</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(template => {
            const niche = NICHE_CONFIG[template.niche] || NICHE_CONFIG.beaute;
            const isSaved = savedIds.has(template.id);
            return (
              <div key={template.id} className="group bg-[#12121A] rounded-2xl border border-white/[0.08] overflow-hidden hover:border-white/[0.15] transition-all hover:shadow-xl hover:shadow-brand/5">
                <div className="aspect-square relative overflow-hidden">
                  <img src={template.preview_url} alt={template.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <button onClick={() => toggleSave(template.id)}
                      className="p-2.5 rounded-xl bg-black/40 backdrop-blur-sm border border-white/10 hover:bg-black/60 transition-all">
                      <Heart className={cn('w-4 h-4', isSaved ? 'fill-red-500 text-red-500' : 'text-white')} />
                    </button>
                    <button onClick={() => openCanva(template)}
                      className="flex-1 py-2.5 rounded-xl bg-brand/90 backdrop-blur-sm text-white text-sm font-medium hover:bg-brand transition-all flex items-center justify-center gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5" /> Éditer dans Canva
                    </button>
                  </div>
                  {template.is_premium && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 rounded-lg bg-amber-500/20 backdrop-blur-sm text-amber-400 text-xs font-semibold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Pro
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={cn('px-2 py-0.5 rounded-md text-xs font-medium', niche.bg, niche.text)}>{niche.label}</span>
                    <span className="text-xs text-gray-500">{FORMAT_LABELS[template.format] || template.format}</span>
                  </div>
                  <h3 className="text-sm font-medium text-white truncate">{template.title}</h3>
                  <p className="text-xs text-gray-500 mt-1 truncate">{template.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================
// MY STORE PAGE
// ============================================
function MyStorePage({ user, session, showToast }) {
  const [store, setStore] = useState(null);
  const [shopUrl, setShopUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  useEffect(() => {
    async function fetchStore() {
      try {
        const res = await fetch('/api/store', { headers: apiHeaders(session) });
        if (res.ok) { const d = await res.json(); setStore(d.store); }
      } catch (err) { /* no store */ }
      setLoading(false);
    }
    fetchStore();
  }, [session]);

  const connectStore = async (e) => {
    e.preventDefault();
    if (!shopUrl.trim()) { showToast('Entre l\'URL de ta boutique', 'error'); return; }
    setConnecting(true);
    try {
      const res = await fetch('/api/shopify/connect', {
        method: 'POST',
        headers: apiHeaders(session),
        body: JSON.stringify({ shopUrl: shopUrl.trim() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur de connexion');
      setStore(data.store);
      showToast('Boutique connectée avec succès !', 'success');
    } catch (err) {
      showToast(err.message || 'URL invalide ou boutique non accessible', 'error');
    } finally {
      setConnecting(false);
    }
  };

  const disconnectStore = async () => {
    setDisconnecting(true);
    try {
      await fetch('/api/store/disconnect', {
        method: 'POST',
        headers: apiHeaders(session)
      });
      setStore(null);
      showToast('Boutique déconnectée', 'success');
    } catch (err) {
      showToast('Erreur lors de la déconnexion', 'error');
    } finally {
      setDisconnecting(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-brand animate-spin" /></div>;

  if (!store) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="w-20 h-20 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto mb-6">
          <Store className="w-10 h-10 text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Connecte ta boutique Shopify</h2>
        <p className="text-gray-400 mb-8">Colle l'URL de ta boutique. On récupère tes produits automatiquement.</p>
        <form onSubmit={connectStore} className="bg-[#12121A] rounded-2xl border border-white/[0.08] p-6 text-left">
          <label className="block text-sm font-medium text-gray-300 mb-2">URL de ta boutique</label>
          <div className="flex gap-3">
            <input type="text" value={shopUrl} onChange={e => setShopUrl(e.target.value)}
              placeholder="ma-boutique.myshopify.com" 
              className="flex-1 px-4 py-3 rounded-xl bg-[#1A1A26] border border-white/[0.08] text-white placeholder-gray-500 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/30 text-sm transition-all" />
            <button type="submit" disabled={connecting}
              className="px-6 py-3 rounded-xl bg-brand text-white font-semibold text-sm hover:bg-brand-light disabled:opacity-50 transition-all flex items-center gap-2 shrink-0">
              {connecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Connecter
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3">Ex: ma-boutique.myshopify.com ou mon-domaine.com</p>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#12121A] rounded-2xl border border-white/[0.08] p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Store className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">{store.shop_name || store.shopify_domain}</h3>
              <p className="text-sm text-gray-400">{store.shopify_domain}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium">Connecté</span>
            <button onClick={disconnectStore} disabled={disconnecting}
              className="px-4 py-2 rounded-xl border border-red-500/20 text-red-400 text-sm hover:bg-red-500/10 transition-all">
              {disconnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Déconnecter'}
            </button>
          </div>
        </div>
        <div className="text-sm text-gray-400">
          <span className="font-medium text-gray-300">{store.product_count || 0}</span> produits trouvés
        </div>
      </div>

      {store.products?.length > 0 && (
        <div>
          <h3 className="text-white font-semibold mb-4">Derniers produits</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {store.products.slice(0, 6).map((p, i) => (
              <div key={p.id || i} className="bg-[#12121A] rounded-xl border border-white/[0.08] overflow-hidden">
                {p.image && <img src={p.image} alt={p.title} className="w-full h-32 object-cover" />}
                <div className="p-3">
                  <h4 className="text-sm font-medium text-white truncate">{p.title}</h4>
                  <p className="text-xs text-gray-400 mt-1">{p.price} {store.currency || 'EUR'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// SETTINGS PAGE
// ============================================
function SettingsPage({ user, session, showToast }) {
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [businessName, setBusinessName] = useState('');
  const [businessNiche, setBusinessNiche] = useState('');
  const [saving, setSaving] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile', { headers: apiHeaders(session) });
        if (res.ok) {
          const d = await res.json();
          if (d.profile) {
            setFullName(d.profile.full_name || user?.user_metadata?.full_name || '');
            setBusinessName(d.profile.business_name || '');
            setBusinessNiche(d.profile.business_niche || '');
          }
        }
      } catch (err) { /* ignore */ }
      setLoadingProfile(false);
    }
    fetchProfile();
  }, [session]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: apiHeaders(session),
        body: JSON.stringify({ full_name: fullName, business_name: businessName, business_niche: businessNiche })
      });
      if (!res.ok) throw new Error('Erreur');
      showToast('Profil mis à jour !', 'success');
    } catch (err) {
      showToast('Erreur lors de la sauvegarde', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-[#12121A] rounded-2xl border border-white/[0.08] p-6">
        <h2 className="text-white font-semibold mb-6">Profil</h2>
        {loadingProfile ? (
          <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 text-brand animate-spin" /></div>
        ) : (
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nom complet</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#1A1A26] border border-white/[0.08] text-white placeholder-gray-500 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/30 text-sm transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nom de l'entreprise</label>
              <input type="text" value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="Ma Boutique"
                className="w-full px-4 py-3 rounded-xl bg-[#1A1A26] border border-white/[0.08] text-white placeholder-gray-500 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/30 text-sm transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Niche</label>
              <select value={businessNiche} onChange={e => setBusinessNiche(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#1A1A26] border border-white/[0.08] text-white focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/30 text-sm transition-all">
                <option value="">Sélectionner une niche</option>
                <option value="beaute">Beauté</option>
                <option value="mode">Mode</option>
                <option value="food">Food</option>
                <option value="electronique">Électronique</option>
                <option value="maison">Maison</option>
                <option value="sante">Santé</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input type="email" value={user?.email || ''} disabled
                className="w-full px-4 py-3 rounded-xl bg-[#1A1A26]/50 border border-white/[0.05] text-gray-400 text-sm cursor-not-allowed" />
              <p className="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié</p>
            </div>
            <button type="submit" disabled={saving}
              className="px-6 py-3 rounded-xl bg-brand text-white font-semibold text-sm hover:bg-brand-light disabled:opacity-50 transition-all flex items-center gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {saving ? 'Sauvegarde...' : 'Enregistrer'}
            </button>
          </form>
        )}
      </div>

      <a href="#/settings/billing" className="block bg-[#12121A] rounded-2xl border border-white/[0.08] p-6 hover:border-brand/30 transition-all group">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand/15 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-brand" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">Abonnement</div>
              <div className="text-xs text-gray-400">Gère ton plan et ta facturation</div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-brand transition-colors" />
        </div>
      </a>
    </div>
  );
}

// ============================================
// BILLING PAGE
// ============================================
function BillingPage({ user, session, showToast }) {
  const isSubscribed = false; // Will be real when Stripe is connected

  const handleSubscribe = () => {
    showToast('Stripe sera connecté prochainement. Profitez de l\'accès gratuit en attendant !', 'info');
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-[#12121A] rounded-2xl border border-white/[0.08] p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand to-accent-gold" />
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white font-semibold text-lg">Easy-Ecom Pro</h2>
            <p className="text-gray-400 text-sm mt-1">Le plan tout-en-un pour scaler tes pubs</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">9,99€</div>
            <div className="text-sm text-gray-400">/mois</div>
          </div>
        </div>
        <div className="space-y-3 mb-6">
          {[
            'Templates illimités AfriVault',
            'Édition Canva intégrée',
            'Connexion Shopify',
            'Dashboard analytics avancé',
            'Support prioritaire par email'
          ].map(feature => (
            <div key={feature} className="flex items-center gap-3">
              <Check className="w-4 h-4 text-brand shrink-0" />
              <span className="text-sm text-gray-300">{feature}</span>
            </div>
          ))}
        </div>
        {isSubscribed ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium">Actif</span>
              <span className="text-sm text-gray-400">Prochain renouvellement : —</span>
            </div>
            <button className="px-6 py-3 rounded-xl border border-white/10 text-white text-sm font-medium hover:bg-white/5 transition-all">
              Gérer l'abonnement
            </button>
          </div>
        ) : (
          <button onClick={handleSubscribe}
            className="w-full py-3.5 rounded-xl bg-brand text-white font-semibold hover:bg-brand-light transition-all shadow-lg shadow-brand/25 flex items-center justify-center gap-2">
            <CreditCard className="w-4 h-4" /> S'abonner — 9,99€/mois
          </button>
        )}
      </div>

      <a href="#/settings" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
        ← Retour aux paramètres
      </a>
    </div>
  );
}

// ============================================
// COMING SOON PAGE
// ============================================
function ComingSoonPage({ title, icon: Icon, showToast }) {
  const [email, setEmail] = useState('');

  const handleNotify = (e) => {
    e.preventDefault();
    if (email) {
      showToast(`Merci ! Tu seras notifié quand ${title} sera disponible.`, 'success');
      setEmail('');
    }
  };

  return (
    <div className="max-w-md mx-auto text-center py-16">
      <div className="w-20 h-20 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-6">
        {Icon && <Icon className="w-10 h-10 text-amber-400" />}
      </div>
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium mb-4">
        <Clock className="w-3 h-3" /> Bientôt disponible
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
      <p className="text-gray-400 mb-8">Cette fonctionnalité arrive bientôt. Laisse ton email pour être averti.</p>
      <form onSubmit={handleNotify} className="flex gap-3">
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ton@email.com" required
          className="flex-1 px-4 py-3 rounded-xl bg-[#12121A] border border-white/[0.08] text-white placeholder-gray-500 focus:outline-none focus:border-brand/50 text-sm" />
        <button type="submit" className="px-6 py-3 rounded-xl bg-brand text-white font-semibold text-sm hover:bg-brand-light transition-all shrink-0">
          M'avertir
        </button>
      </form>
    </div>
  );
}

// ============================================
// LOADING SCREEN
// ============================================
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center mx-auto mb-4 animate-pulse">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <p className="text-gray-400 text-sm">Chargement...</p>
      </div>
    </div>
  );
}

// ============================================
// MAIN APP
// ============================================
export default function App() {
  const { currentPath, navigate } = useHashRouter();
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user || null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = (newSession) => {
    setSession(newSession);
    setUser(newSession?.user || null);
    navigate('#/dashboard');
  };

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    navigate('#/');
    showToast('Déconnecté', 'info');
  };

  if (loading) return <><LoadingScreen /><ToastContainer toasts={toasts} onDismiss={dismissToast} /></>;

  // Public routes
  if (!currentPath || currentPath === '#/' || currentPath === '#') {
    return <><LandingPage /><ToastContainer toasts={toasts} onDismiss={dismissToast} /></>;
  }
  if (currentPath === '#/login') {
    if (user) { navigate('#/dashboard'); return null; }
    return <><LoginPage onLogin={handleLogin} showToast={showToast} /><ToastContainer toasts={toasts} onDismiss={dismissToast} /></>;
  }
  if (currentPath === '#/register') {
    if (user) { navigate('#/dashboard'); return null; }
    return <><RegisterPage onRegister={handleLogin} showToast={showToast} /><ToastContainer toasts={toasts} onDismiss={dismissToast} /></>;
  }

  // Protected routes
  if (!user) {
    navigate('#/login');
    return null;
  }

  const pageProps = { user, session, showToast, navigate };

  const pageContent = (() => {
    switch (currentPath) {
      case '#/dashboard': return <DashboardPage {...pageProps} />;
      case '#/afrivault': return <AfriVaultPage {...pageProps} />;
      case '#/my-store': return <MyStorePage {...pageProps} />;
      case '#/settings': return <SettingsPage {...pageProps} />;
      case '#/settings/billing': return <BillingPage {...pageProps} />;
      case '#/analytics': return <ComingSoonPage title="Analytics" icon={BarChart2} showToast={showToast} />;
      case '#/adscout': return <ComingSoonPage title="AdScout" icon={Search} showToast={showToast} />;
      case '#/ugc': return <ComingSoonPage title="UGC Studio" icon={Video} showToast={showToast} />;
      default: return <DashboardPage {...pageProps} />;
    }
  })();

  return (
    <>
      <DashboardLayout currentPath={currentPath} user={user} onLogout={handleLogout}>
        {pageContent}
      </DashboardLayout>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}
