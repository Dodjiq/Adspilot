'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  LayoutDashboard, FolderOpen, ShoppingBag, BarChart2, Search, Video,
  Settings, Zap, Bell, Heart, Check, X, ChevronDown, Filter, ExternalLink,
  Loader2, Mail, Lock, User, ArrowRight, TrendingUp, DollarSign,
  ShoppingCart, LogOut, CreditCard, Sparkles, Clock, Eye, Store,
  CheckCircle2, Circle, Palette, AlertCircle, Plus, ChevronRight, ChevronLeft,
  Globe, Layers, Shield, Users, Star, MessageSquare, MousePointerClick,
  Target, Image, Repeat, ChevronUp, Menu, Play, Facebook, Link2, Info,
  Trophy, Rocket
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
  { icon: FolderOpen, label: 'Campagnes', path: '#/campaigns', soon: true },
  { icon: ShoppingBag, label: 'Ma Boutique', path: '#/my-store' },
  { icon: BarChart2, label: 'Analytics', path: '#/analytics', badge: 'PRO' },
  { icon: Sparkles, label: 'Insights', path: '#/insights', badge: 'PRO' },
  { icon: Image, label: 'Créatifs', path: '#/creatives', badge: 'PRO' },
  { icon: MessageSquare, label: 'Commentaires', path: '#/comments', soon: true },
];

const TOOLS_ITEMS = [
  { icon: FolderOpen, label: 'AfriVault', path: '#/afrivault', badge: 'PRO', count: 523 },
  { icon: Search, label: 'AdScout', path: '#/adscout', soon: true },
  { icon: Play, label: 'Guides', path: '#/guides' },
];

const SPECIAL_ITEMS = [
  { icon: Video, label: 'UGC à 1€', path: '#/ugc', highlight: true, soon: true },
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
// LINK COMPONENT (for better navigation)
// ============================================
function Link({ href, onClick, children, className, ...props }) {
  const handleClick = (e) => {
    if (href && href.startsWith('#')) {
      e.preventDefault();
      window.location.hash = href;
    }
    if (onClick) onClick(e);
  };

  return (
    <a href={href} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
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
// USER PROFILE MENU COMPONENT
// ============================================
function UserProfileMenu({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="border-t border-white/[0.06] p-3 relative" ref={menuRef}>
      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute bottom-full left-3 right-3 mb-2 bg-[#1A1A26] rounded-xl border border-white/[0.08] shadow-2xl overflow-hidden z-50">
          <Link
            href="#/settings"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-all group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-brand/15 flex items-center justify-center">
              <User className="w-4 h-4 text-brand" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-white">Profil</div>
              <div className="text-xs text-gray-500">Gérer ton compte</div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-brand transition-colors" />
          </Link>

          <div className="h-px bg-white/[0.06]" />

          <Link
            href="#/settings/billing"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-all group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-brand/15 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-brand" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-white">Abonnement</div>
              <div className="text-xs text-gray-500">9,99€/mois</div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-brand transition-colors" />
          </Link>

          <div className="h-px bg-white/[0.06]" />

          <button
            onClick={() => {
              setIsOpen(false);
              onLogout();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 transition-all group text-left cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-red-500/15 flex items-center justify-center">
              <LogOut className="w-4 h-4 text-red-400" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-red-400">Déconnexion</div>
              <div className="text-xs text-gray-500">Se déconnecter du compte</div>
            </div>
          </button>
        </div>
      )}

      {/* User Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all group"
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand to-accent-gold flex items-center justify-center text-white font-semibold text-sm shrink-0">
          {user?.user_metadata?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-sm text-white font-medium truncate">
            {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Utilisateur'}
          </p>
          <p className="text-[11px] text-gray-500 truncate">{user?.email || ''}</p>
        </div>
        <ChevronUp className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
}

// ============================================
// NOTIFICATION CENTER COMPONENT
// ============================================
function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'success', title: 'Campagne lancée', message: 'Ta campagne "Promo Été" est maintenant active', time: 'Il y a 5 min', unread: true },
    { id: 2, type: 'warning', title: 'Budget faible', message: 'Il reste 10€ sur la campagne "Mode Africaine"', time: 'Il y a 1h', unread: true },
    { id: 3, type: 'info', title: 'Nouveau template', message: '5 nouveaux templates disponibles dans AfriVault', time: 'Il y a 2h', unread: false },
  ]);
  const menuRef = useRef(null);

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const handleNotificationClick = (notifId) => {
    // Marquer comme lu
    setNotifications(prev => prev.map(n =>
      n.id === notifId ? { ...n, unread: false } : n
    ));
    // Ici tu peux ajouter la logique pour naviguer vers la page concernée
    console.log('Notification clicked:', notifId);
  };

  const viewAllNotifications = () => {
    // Ici tu peux ajouter la logique pour ouvrir une page dédiée aux notifications
    console.log('View all notifications');
    setIsOpen(false);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-amber-400" />;
      case 'info': return <Info className="w-4 h-4 text-blue-400" />;
      default: return <Bell className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-white/5 transition-all"
      >
        <Bell className="w-5 h-5 text-gray-400" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0F0F14]" />
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-[#1A1A26] rounded-xl border border-white/[0.08] shadow-2xl overflow-hidden z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
            <div>
              <h3 className="text-sm font-semibold text-white">Notifications</h3>
              {unreadCount > 0 && (
                <p className="text-xs text-gray-500">{unreadCount} non lue{unreadCount > 1 ? 's' : ''}</p>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-brand hover:text-brand/80 transition-colors"
              >
                Tout marquer comme lu
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Aucune notification</p>
              </div>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif.id)}
                  className={cn(
                    'px-4 py-3 hover:bg-white/5 transition-all border-b border-white/[0.04] cursor-pointer',
                    notif.unread && 'bg-brand/5'
                  )}
                >
                  <div className="flex gap-3">
                    <div className="mt-0.5">{getIcon(notif.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-white truncate">{notif.title}</p>
                        {notif.unread && (
                          <span className="w-2 h-2 rounded-full bg-brand shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mb-1">{notif.message}</p>
                      <p className="text-xs text-gray-600">{notif.time}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-white/[0.06]">
              <button
                onClick={viewAllNotifications}
                className="w-full text-sm text-brand hover:text-brand/80 transition-colors text-center"
              >
                Voir toutes les notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// SIDEBAR (AdsPilot Style - Expanded)
// ============================================
function Sidebar({ currentPath, user, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  
  const NavItem = ({ item, isActive }) => {
    const isDisabled = item.soon && !item.highlight;
    return (
      <Link
        href={isDisabled ? undefined : item.path}
        onClick={isDisabled ? (e) => e.preventDefault() : undefined}
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group relative',
          isActive
            ? 'bg-brand/15 text-brand'
            : item.highlight
            ? 'bg-brand text-white hover:bg-brand/90 cursor-pointer'
            : isDisabled
            ? 'text-muted-foreground cursor-not-allowed'
            : 'text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer'
        )}
      >
        <item.icon className="w-[18px] h-[18px] shrink-0" />
        <span className="text-[13px] font-medium flex-1">{item.label}</span>
        {item.badge === 'PRO' && (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-brand/20 text-brand">PRO</span>
        )}
        {item.soon && !item.highlight && (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-400">SOON</span>
        )}
        {item.count && (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-secondary text-secondary-foreground">{item.count}</span>
        )}
      </Link>
    );
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-[200px] bg-card border-r border-border flex flex-col z-50 font-onest transition-colors duration-200">
      {/* Logo */}
      <div className="px-4 h-16 flex items-center justify-between border-b border-border">
        <Link href="#/dashboard" className="flex items-center gap-2.5 cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-foreground font-bold text-[15px] font-syne">AdsPilot</span>
        </Link>
        <button className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer">
          <Layers className="w-4 h-4" />
        </button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto py-3 px-2">
        <nav className="space-y-0.5">
          {NAV_ITEMS.map(item => (
            <NavItem key={item.path} item={item} isActive={currentPath === item.path} />
          ))}
        </nav>

        {/* Tools Section */}
        <div className="mt-6">
          <p className="px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Outils</p>
          <nav className="space-y-0.5">
            {TOOLS_ITEMS.map(item => (
              <NavItem key={item.path} item={item} isActive={currentPath === item.path} />
            ))}
          </nav>
        </div>

        {/* Special Items */}
        <div className="mt-4 space-y-0.5">
          {SPECIAL_ITEMS.map(item => (
            <NavItem key={item.path} item={item} isActive={currentPath === item.path} />
          ))}
        </div>
      </div>

      {/* Connections */}
      <div className="border-t border-border">
        <Link href="#/settings" className={cn(
          'flex items-center gap-3 px-4 py-3 transition-colors cursor-pointer',
          currentPath?.startsWith('#/settings') ? 'text-brand' : 'text-muted-foreground hover:text-foreground'
        )}>
          <div className="relative">
            <Globe className="w-[18px] h-[18px]" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500 border-2 border-card" />
          </div>
          <span className="text-[13px]">Connexions</span>
        </Link>
      </div>

      {/* User Profile */}
      <UserProfileMenu user={user} onLogout={onLogout} />
    </aside>
  );
}

// ============================================
// TOP NAV (AdsPilot Style - French)
// ============================================
function TopNav({ title, subtitle, showDatePicker = false }) {
  const [selectedPeriod, setSelectedPeriod] = useState('7J');
  const [dateRange, setDateRange] = useState('');
  const [location, setLocation] = useState('Localisation...');
  const [announcement, setAnnouncement] = useState(null);
  const [hideAnnouncement, setHideAnnouncement] = useState(false);
  const periods = ['AUJOURD\'HUI', '7J', '14J', '30J'];

  const sanitizeAnnouncementHtml = (input) => {
    if (!input || typeof input !== 'string') return '';

    // Disallow scripts entirely.
    let s = input.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');

    // Keep only very basic tags: <b>, </b>, <a ...>, </a>. Strip everything else.
    s = s.replace(/<\/?(?!b\b|\/b\b|a\b|\/a\b)[^>]*>/gi, '');

    // Rewrite <a> tags to keep only a safe href.
    s = s.replace(/<a\b[^>]*>/gi, (tag) => {
      const hrefMatch = tag.match(/href\s*=\s*(['"])(.*?)\1/i);
      const rawHref = hrefMatch ? hrefMatch[2] : '#';
      const href = /^(https?:\/\/|#\/|#)/i.test(rawHref) ? rawHref : '#';
      const safeHref = href.replace(/"/g, '&quot;');
      return `<a href="${safeHref}" target="_blank" rel="noopener noreferrer">`;
    });

    return s;
  };

  useEffect(() => {
    async function loadAnnouncement() {
      try {
        const res = await fetch('/api/public/announcements');
        if (res.ok) {
          const d = await res.json();
          if (d.announcement && d.announcement.message) {
            setAnnouncement(sanitizeAnnouncementHtml(d.announcement.message));
          }
        }
      } catch (e) {}
    }
    loadAnnouncement();
  }, []);

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz && tz.includes('/')) {
        setLocation(tz.split('/')[1].replace(/_/g, ' '));
      } else {
        setLocation('Afrique');
      }
    } catch {
      setLocation('Afrique');
    }
  }, []);

  useEffect(() => {
    const today = new Date();
    const endStr = today.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
    let start = new Date();
    
    if (selectedPeriod === '7J') start.setDate(today.getDate() - 7);
    else if (selectedPeriod === '14J') start.setDate(today.getDate() - 14);
    else if (selectedPeriod === '30J') start.setDate(today.getDate() - 30);
    
    if (selectedPeriod === 'AUJOURD\'HUI') {
      setDateRange(endStr);
    } else {
      const startStr = start.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
      setDateRange(`${startStr} - ${endStr}`);
    }
  }, [selectedPeriod]);

  return (
    <>
      {announcement && !hideAnnouncement && (
        <div className="bg-[#7C3AED] text-white px-4 py-2.5 text-[13px] font-medium flex items-center justify-between text-center relative z-50 shadow-md animate-in slide-in-from-top-2">
          <div className="flex-1 flex justify-center items-center gap-2">
            <Bell className="w-4 h-4 text-white/90 shrink-0" />
            <span dangerouslySetInnerHTML={{ __html: announcement }} />
          </div>
          <button onClick={() => setHideAnnouncement(true)} className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border transition-colors duration-200 supports-[backdrop-filter]:bg-background/60">
        <div className="px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground font-syne">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3">
          {/* Notification Center */}
          <NotificationCenter />
          {showDatePicker && (
            <>
              {/* Period Selector */}
              <div className="inline-flex items-center bg-muted rounded-lg border border-border p-0.5">
                {periods.map(p => (
                  <button
                    key={p}
                    onClick={() => setSelectedPeriod(p)}
                    className={cn(
                      'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                      selectedPeriod === p
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
              {/* Date Range */}
              <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-muted border border-border text-sm text-muted-foreground hover:text-foreground hover:border-input transition-colors">
                <Clock className="w-4 h-4" />
                <span>{dateRange || 'Chargement...'}</span>
              </button>
              {/* Location */}
              <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-muted border border-border text-sm text-muted-foreground hover:text-foreground hover:border-input transition-colors">
                <Globe className="w-4 h-4" />
                <span className="capitalize">{location}</span>
              </button>
            </>
          )}
          {/* Refresh */}
          <button onClick={() => window.location.reload()} className="inline-flex w-9 h-9 items-center justify-center rounded-lg bg-muted border border-border text-muted-foreground hover:text-foreground hover:border-input transition-colors">
            <Repeat className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
    </>
  );
}

// ============================================
// DASHBOARD LAYOUT (AdsPilot Style)
// ============================================
function DashboardLayout({ children, user, currentPath, onLogout }) {
  const pageConfigs = {
    '#/dashboard': { title: 'Dashboard', subtitle: 'Vue d\'ensemble de tes performances publicitaires', showDatePicker: true },
    '#/afrivault': { title: 'AfriVault', subtitle: 'Parcours les templates gagnants', showDatePicker: false },
    '#/my-store': { title: 'Ma Boutique', subtitle: 'Gère ta connexion Shopify', showDatePicker: false },
    '#/settings': { title: 'Paramètres', subtitle: 'Gère ton profil et tes préférences', showDatePicker: false },
    '#/settings/billing': { title: 'Abonnement', subtitle: 'Gère ton plan AdsPilot', showDatePicker: false },
    '#/analytics': { title: 'Analytics', subtitle: 'Suis tes performances', showDatePicker: true },
    '#/adscout': { title: 'AdScout', subtitle: 'Espionne les pubs des concurrents', showDatePicker: false },
    '#/ugc': { title: 'UGC Studio', subtitle: 'Crée du contenu UGC', showDatePicker: false },
    '#/campaigns': { title: 'Campagnes', subtitle: 'Gère tes campagnes publicitaires', showDatePicker: true },
    '#/insights': { title: 'Insights', subtitle: 'Recommandations IA', showDatePicker: false },
    '#/creatives': { title: 'Créatifs', subtitle: 'Ta bibliothèque de pubs', showDatePicker: false },
    '#/comments': { title: 'Commentaires', subtitle: 'Gère les commentaires de tes pubs', showDatePicker: false },
    '#/guides': { title: 'Guides', subtitle: 'Apprends à scaler tes pubs', showDatePicker: false },
  };
  const config = pageConfigs[currentPath] || pageConfigs['#/dashboard'];
  
  return (
    <div className="min-h-screen bg-background font-onest transition-colors duration-200">
      <Sidebar currentPath={currentPath} user={user} onLogout={onLogout} />
      <div className="ml-[200px]">
        <TopNav title={config.title} subtitle={config.subtitle} showDatePicker={config.showDatePicker} />
        <main className="p-6 animate-fade-in">{children}</main>
      </div>
    </div>
  );
}

// ============================================
// LANDING PAGE (Kopy-style — Syne + Onest + Grid)
// ============================================
function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [heroEmail, setHeroEmail] = useState('');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const steps = [
    { num: '01', icon: Store, title: 'Connecte ta boutique', desc: 'Lie ta boutique Shopify en un clic. Import automatique de tes produits.' },
    { num: '02', icon: Layers, title: 'Choisis ton template', desc: 'Parcours +500 templates AfriVault optimisés pour le marché africain.' },
    { num: '03', icon: ExternalLink, title: 'Lance ta publicité', desc: 'Personnalise dans Canva et publie directement sur Meta.' },
  ];

  const stats = [
    { value: '+500', label: 'Templates' },
    { value: '100%', label: 'Marché africain' },
    { value: '5 min', label: 'Setup' },
    { value: '+12', label: 'Niches' },
  ];

  const compFeatures = [
    'Templates optimisés Afrique', 'Édition Canva intégrée', 'Connexion Shopify',
    'Analytics & ROAS', 'Multi-niches', 'Support français', 'Prix abordable', 'Résultats immédiats',
  ];
  const compEE = [true, true, true, true, true, true, true, true];
  const compDIY = [false, false, false, false, false, false, true, false];
  const compAg = [true, false, true, true, false, true, false, true];

  const testimonials = [
    { name: 'Sarah M.', role: 'Boutique beauté — Dakar', quote: 'AdsPilot m\'a permis de lancer mes premières pubs en moins de 10 minutes. Les templates sont parfaitement adaptés.', avatar: 'S', color: 'from-pink-500 to-purple-500' },
    { name: 'Kofi A.', role: 'E-commerce mode — Abidjan', quote: 'Mon ROAS est passé de 1.2x à 2.8x en deux semaines grâce aux templates AfriVault.', avatar: 'K', color: 'from-blue-500 to-cyan-500' },
    { name: 'Amara D.', role: 'Tech store — Lagos', quote: 'La connexion Shopify est magique. Mes produits sont importés et les pubs prêtes en quelques clics.', avatar: 'A', color: 'from-amber-500 to-orange-500' },
    { name: 'Fatou B.', role: 'Cosmétiques bio — Bamako', quote: 'J\'ai doublé mes ventes en un mois. Les templates comprennent vraiment notre marché et notre audience.', avatar: 'F', color: 'from-green-500 to-emerald-500' },
    { name: 'Mohamed K.', role: 'Électronique — Casablanca', quote: 'Interface simple et efficace. Même sans compétence en design, je crée des pubs professionnelles.', avatar: 'M', color: 'from-violet-500 to-purple-500' },
    { name: 'Aisha N.', role: 'Food delivery — Nairobi', quote: 'Les analytics m\'ont aidé à comprendre ce qui marche. Mes campagnes sont maintenant rentables dès le premier jour.', avatar: 'A', color: 'from-rose-500 to-pink-500' },
  ];

  const faqs = [
    { q: "Qu'est-ce qu'AdsPilot ?", a: "AdsPilot est une plateforme SaaS tout-en-un conçue pour les e-commerçants africains. Templates publicitaires, édition Canva, connexion Shopify et analytics — tout réuni." },
    { q: "Ai-je besoin d'expérience en pub ?", a: "Non. Nos templates sont prêts à l'emploi et optimisés pour le marché africain. Choisis, personnalise et publie." },
    { q: 'Quels templates sont disponibles ?', a: "+500 templates dans 12+ niches : beauté, mode, food, électronique, maison, santé. Formats carré, story et paysage." },
    { q: 'Comment connecter Shopify ?', a: "Colle l'URL de ta boutique. On importe automatiquement tes produits avec images et prix." },
    { q: 'Puis-je annuler à tout moment ?', a: "Oui. Pas d'engagement, pas de frais cachés. Annule depuis ton dashboard quand tu veux." },
    { q: "Comment fonctionne Canva ?", a: "Choisis un template, ouvre-le dans Canva, personnalise avec tes images et textes, puis exporte et publie." },
  ];

  const handleHeroSubmit = (e) => {
    e.preventDefault();
    if (heroEmail) window.location.hash = '#/register';
  };

  return (
    <div className="min-h-screen font-onest bg-grid" style={{ backgroundColor: '#070B14' }}>
      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] backdrop-blur-xl" style={{ backgroundColor: 'rgba(7,11,20,0.8)' }}>
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#5A5AFB] to-[#9C5DFF] flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-syne font-bold text-lg">AdsPilot</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="#/login" className="text-gray-400 hover:text-white text-sm transition-colors">Connexion</a>
            <a href="#/register" className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#5A5AFB] to-[#9C5DFF] text-white text-sm font-medium hover:opacity-90 transition-all">
              Démarrer gratuitement
            </a>
          </div>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-[#5A5AFB]/[0.06] blur-[150px] pointer-events-none" />
        <div className="max-w-[1200px] mx-auto px-6 pt-20 pb-14 md:pt-24 md:pb-20">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h1
                className="font-syne font-bold text-white leading-[1.1] tracking-tight break-words max-w-[34rem]"
                style={{ fontSize: 'clamp(32px, 4.3vw, 48px)' }}
              >
                Crée des pubs qui{' '}
                <span className="bg-gradient-to-r from-[#5A5AFB] to-[#9C5DFF] bg-clip-text text-transparent">convertissent</span>
                {' '}pour le marché africain.
              </h1>
              <p className="text-gray-400 mt-6 text-[15px] leading-relaxed max-w-[440px]">
                +500 templates optimisés, édition Canva intégrée, connexion Shopify — lance tes premières pubs Meta en 5 minutes.
              </p>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
                {['+500 templates', 'Édition Canva', 'Connexion Shopify', 'Setup 5 min'].map(f => (
                  <span key={f} className="flex items-center gap-2 text-sm text-gray-400">
                    <Check className="w-3.5 h-3.5 text-[#5A5AFB]" />{f}
                  </span>
                ))}
              </div>
              <a href="#/register" className="hidden md:inline-flex items-center gap-2 mt-10 px-7 py-3 rounded-lg bg-gradient-to-r from-[#5A5AFB] to-[#9C5DFF] text-white text-sm font-medium hover:opacity-90 transition-all">
                Démarrer gratuitement <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            {/* Right card */}
            <div className="relative">
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-7">
                <p className="text-white font-syne font-semibold text-lg mb-1">Commencer</p>
                <p className="text-gray-500 text-sm mb-6">Crée ton compte gratuitement</p>
                <form onSubmit={handleHeroSubmit} className="space-y-3">
                  <input type="email" value={heroEmail} onChange={e => setHeroEmail(e.target.value)} placeholder="Ton adresse email"
                    className="w-full px-4 py-3 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white placeholder-gray-500 focus:outline-none focus:border-[#5A5AFB]/50 text-sm transition-all" />
                  <button type="submit" className="w-full py-3 rounded-lg bg-gradient-to-r from-[#5A5AFB] to-[#9C5DFF] text-white text-sm font-medium hover:opacity-90 transition-all">
                    Essayer gratuitement
                  </button>
                </form>
                <p className="text-xs text-gray-600 text-center mt-4">Pas de carte bancaire requise</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SOCIAL PROOF ===== */}
      <div className="max-w-[1200px] mx-auto px-6 pb-10">
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/[0.06] bg-white/[0.02]">
            <div className="flex -space-x-2">
              {['S', 'K', 'A', 'M'].map((l, i) => (
                <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-[#5A5AFB] to-[#9C5DFF] flex items-center justify-center text-white text-[10px] font-bold border-2 border-[#070B14]">{l}</div>
              ))}
            </div>
            <span className="text-gray-400 text-sm">Utilisé par <span className="text-white font-medium">500+</span> e-commerçants</span>
          </div>
        </div>
      </div>

      {/* ===== LOGOS ===== */}
      <div className="border-t border-b border-white/[0.04] py-10">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-center gap-14 opacity-30 flex-wrap">
          {['Shopify', 'Canva', 'Meta Ads', 'Instagram', 'Facebook'].map(n => (
            <span key={n} className="text-white font-syne font-bold text-lg">{n}</span>
          ))}
        </div>
      </div>

      {/* ===== STEPS ===== */}
      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-20 items-start">
            <div className="md:sticky md:top-32">
              <p className="text-[#5A5AFB] text-xs font-semibold uppercase tracking-[0.15em]">Comment ça marche</p>
              <h2
                className="font-syne font-bold text-white mt-4 leading-[1.15] tracking-tight break-words max-w-[34rem]"
                style={{ fontSize: 'clamp(24px, 3.2vw, 36px)' }}
              >
                Lance une pub en{' '}
                <span className="bg-gradient-to-r from-[#5A5AFB] to-[#9C5DFF] bg-clip-text text-transparent">quelques secondes</span>.
              </h2>
              <p className="text-gray-500 mt-5 text-[15px] leading-relaxed max-w-sm">
                3 étapes suffisent pour créer une publicité optimisée pour ta clientèle africaine.
              </p>
            </div>
            <div className="space-y-4">
              {steps.map(step => (
                <div key={step.num} className="p-6 rounded-xl border border-white/[0.06] hover:border-[#5A5AFB]/20 transition-all bg-white/[0.01]">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#5A5AFB]/10 flex items-center justify-center shrink-0">
                      <step.icon className="w-5 h-5 text-[#5A5AFB]" />
                    </div>
                    <div>
                      <p className="text-[#5A5AFB] text-[11px] font-bold uppercase tracking-wider mb-1">Étape {step.num}</p>
                      <h3 className="text-white font-syne font-semibold mb-1.5">{step.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-14">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map(s => (
              <div key={s.label} className="text-center py-10 rounded-xl border border-white/[0.06] bg-white/[0.01]">
                <div className="font-syne font-bold text-4xl md:text-5xl text-white">{s.value}</div>
                <div className="text-sm text-gray-500 mt-2">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== AFRIVAULT FEATURE ===== */}
      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#5A5AFB] text-xs font-semibold uppercase tracking-[0.15em]">AfriVault</p>
              <h2
                className="font-syne font-bold text-white mt-4 leading-[1.15] tracking-tight break-words max-w-[34rem]"
                style={{ fontSize: 'clamp(24px, 3.2vw, 36px)' }}
              >
                +500 templates pensés pour le{' '}
                <span className="bg-gradient-to-r from-[#5A5AFB] to-[#9C5DFF] bg-clip-text text-transparent">marché africain</span>
              </h2>
              <p className="text-gray-500 mt-5 text-[15px] leading-relaxed max-w-sm">
                Beauté, mode, food, électronique — chaque niche a ses templates optimisés pour maximiser tes conversions.
              </p>
              <div className="mt-8 space-y-3">
                {['12+ niches spécialisées', 'Formats carré, story, paysage', 'Édition Canva en un clic', 'Sauvegarde tes favoris'].map(f => (
                  <div key={f} className="flex items-center gap-2.5">
                    <Check className="w-3.5 h-3.5 text-[#5A5AFB] shrink-0" />
                    <span className="text-gray-400 text-sm">{f}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {MOCK_TEMPLATES.slice(0, 4).map(t => (
                <div key={t.id} className="rounded-xl overflow-hidden border border-white/[0.06] hover:border-[#5A5AFB]/20 transition-all">
                  <img src={t.preview_url} alt={t.title} className="w-full aspect-square object-cover" loading="lazy" />
                  <div className="p-2.5 bg-white/[0.02]">
                    <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded', NICHE_CONFIG[t.niche]?.bg, NICHE_CONFIG[t.niche]?.text)}>{NICHE_CONFIG[t.niche]?.label}</span>
                    <p className="text-white text-xs mt-1 truncate">{t.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== COMPARISON ===== */}
      <section className="py-16">
        <div className="max-w-[900px] mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-[#5A5AFB] text-xs font-semibold uppercase tracking-[0.15em]">Comparaison</p>
            <h2
              className="font-syne font-bold text-white mt-4 tracking-tight break-words max-w-[34rem]"
              style={{ fontSize: 'clamp(24px, 3.2vw, 36px)' }}
            >
              Pourquoi choisir{' '}
              <span className="bg-gradient-to-r from-[#5A5AFB] to-[#9C5DFF] bg-clip-text text-transparent">AdsPilot</span>
            </h2>
          </div>
          <div className="rounded-xl border border-white/[0.06] overflow-hidden">
            <div className="grid grid-cols-4 text-xs font-semibold border-b border-white/[0.06]">
              <div className="p-5 text-gray-500"></div>
              <div className="p-5 text-center text-[#5A5AFB] bg-[#5A5AFB]/[0.05] border-x border-[#5A5AFB]/10">AdsPilot</div>
              <div className="p-5 text-center text-gray-600">DIY</div>
              <div className="p-5 text-center text-gray-600">Agence</div>
            </div>
            {compFeatures.map((f, i) => (
              <div key={f} className={cn("grid grid-cols-4 text-sm", i < compFeatures.length - 1 && "border-b border-white/[0.04]")}>
                <div className="p-4 text-gray-400 text-xs">{f}</div>
                <div className="p-4 flex justify-center bg-[#5A5AFB]/[0.03] border-x border-[#5A5AFB]/5">
                  {compEE[i] ? <CheckCircle2 className="w-4 h-4 text-[#5A5AFB]" /> : <X className="w-4 h-4 text-gray-700" />}
                </div>
                <div className="p-3.5 flex justify-center">
                  {compDIY[i] ? <Check className="w-4 h-4 text-gray-500" /> : <X className="w-4 h-4 text-gray-700" />}
                </div>
                <div className="p-3.5 flex justify-center">
                  {compAg[i] ? <Check className="w-4 h-4 text-gray-500" /> : <X className="w-4 h-4 text-gray-700" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS CAROUSEL ===== */}
      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-[#5A5AFB] text-xs font-semibold uppercase tracking-[0.15em]">Témoignages</p>
            <h2
              className="font-syne font-bold text-white mt-4 tracking-tight break-words max-w-[34rem]"
              style={{ fontSize: 'clamp(24px, 3.2vw, 36px)' }}
            >
              Ils nous font{' '}
              <span className="bg-gradient-to-r from-[#5A5AFB] to-[#9C5DFF] bg-clip-text text-transparent">confiance</span>
            </h2>
          </div>

          <div className="relative">
            {/* Carousel Container */}
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
              >
                {/* Group testimonials in pairs */}
                {Array.from({ length: Math.ceil(testimonials.length / 2) }).map((_, groupIndex) => (
                  <div key={groupIndex} className="min-w-full grid md:grid-cols-2 gap-5 px-1">
                    {testimonials.slice(groupIndex * 2, groupIndex * 2 + 2).map(t => (
                      <div key={t.name} className="p-6 rounded-xl border border-white/[0.06] bg-white/[0.01] hover:border-white/[0.1] transition-all">
                        <div className="flex gap-0.5 mb-4">
                          {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed mb-6">"{t.quote}"</p>
                        <div className="flex items-center gap-3 pt-4 border-t border-white/[0.04]">
                          <div className={cn("w-9 h-9 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold", t.color)}>
                            {t.avatar}
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">{t.name}</p>
                            <p className="text-gray-600 text-xs">{t.role}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-center gap-3 mt-8">
              <button
                onClick={() => setCurrentTestimonial(prev => Math.max(0, prev - 1))}
                disabled={currentTestimonial === 0}
                className="p-2 rounded-lg border border-white/[0.1] bg-white/[0.02] hover:bg-white/[0.05] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>

              {/* Dots Indicator */}
              <div className="flex gap-2">
                {Array.from({ length: Math.ceil(testimonials.length / 2) }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentTestimonial(idx)}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      currentTestimonial === idx
                        ? "w-8 bg-gradient-to-r from-[#5A5AFB] to-[#9C5DFF]"
                        : "w-1.5 bg-white/20 hover:bg-white/30"
                    )}
                  />
                ))}
              </div>

              <button
                onClick={() => setCurrentTestimonial(prev => Math.min(Math.ceil(testimonials.length / 2) - 1, prev + 1))}
                disabled={currentTestimonial === Math.ceil(testimonials.length / 2) - 1}
                className="p-2 rounded-lg border border-white/[0.1] bg-white/[0.02] hover:bg-white/[0.05] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section className="py-16">
        <div className="max-w-[1000px] mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-[#5A5AFB] text-xs font-semibold uppercase tracking-[0.15em]">Tarifs</p>
            <h2
              className="font-syne font-bold text-white mt-4 tracking-tight break-words max-w-[34rem]"
              style={{ fontSize: 'clamp(24px, 3.2vw, 36px)' }}
            >
              Simple et{' '}
              <span className="bg-gradient-to-r from-[#5A5AFB] to-[#9C5DFF] bg-clip-text text-transparent">transparent</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5 items-start">
            {/* Découverte */}
            <div className="p-7 rounded-xl border border-white/[0.06] bg-white/[0.01]">
              <p className="text-gray-500 text-sm font-medium mb-4">Découverte</p>
              <div className="flex items-baseline gap-1 mb-5"><span className="font-syne font-bold text-4xl text-white">0€</span><span className="text-gray-600 text-sm">/mois</span></div>
              <ul className="space-y-2.5 mb-7 text-sm">
                {['10 templates', 'Aperçu AfriVault', 'Connexion Shopify'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-gray-400"><Check className="w-3.5 h-3.5 text-gray-600 shrink-0" />{f}</li>
                ))}
                {['Édition Canva', 'Analytics'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-gray-600"><X className="w-3.5 h-3.5 text-gray-700 shrink-0" />{f}</li>
                ))}
              </ul>
              <a href="#/register" className="block w-full py-2.5 rounded-lg border border-white/[0.08] text-white text-sm text-center hover:bg-white/[0.03] transition-all">
                Commencer
              </a>
            </div>
            {/* Pro */}
            <div className="p-7 rounded-xl border-2 border-[#5A5AFB]/30 relative bg-[#5A5AFB]/[0.04]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-[#5A5AFB] to-[#9C5DFF] text-white text-[11px] font-semibold">Populaire</div>
              <p className="text-[#5A5AFB] text-sm font-medium mb-4 mt-1">Pro</p>
              <div className="flex items-baseline gap-1 mb-5"><span className="font-syne font-bold text-4xl text-white">9,99€</span><span className="text-gray-600 text-sm">/mois</span></div>
              <ul className="space-y-2.5 mb-7 text-sm">
                {['Templates illimités', 'Édition Canva intégrée', 'Connexion Shopify', 'Dashboard analytics', 'Support prioritaire'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-gray-300"><CheckCircle2 className="w-3.5 h-3.5 text-[#5A5AFB] shrink-0" />{f}</li>
                ))}
              </ul>
              <a href="#/register" className="block w-full py-2.5 rounded-lg bg-gradient-to-r from-[#5A5AFB] to-[#9C5DFF] text-white text-sm text-center font-medium hover:opacity-90 transition-all">
                Commencer — 9,99€/mois
              </a>
            </div>
            {/* Business */}
            <div className="p-7 rounded-xl border border-white/[0.06] bg-white/[0.01]">
              <p className="text-gray-500 text-sm font-medium mb-4">Business</p>
              <div className="flex items-baseline gap-1 mb-5"><span className="font-syne font-bold text-4xl text-white">Sur mesure</span></div>
              <ul className="space-y-2.5 mb-7 text-sm">
                {['Tout le plan Pro', 'Templates sur mesure', 'API Canva', 'Account manager', 'Onboarding dédié'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-gray-400"><Check className="w-3.5 h-3.5 text-gray-600 shrink-0" />{f}</li>
                ))}
              </ul>
              <button className="block w-full py-2.5 rounded-lg border border-white/[0.08] text-gray-500 text-sm text-center cursor-not-allowed">
                Bientôt
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-16">
        <div className="max-w-[700px] mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-[#5A5AFB] text-xs font-semibold uppercase tracking-[0.15em]">FAQ</p>
            <h2
              className="font-syne font-bold text-white mt-4 tracking-tight break-words max-w-[34rem]"
              style={{ fontSize: 'clamp(24px, 3.1vw, 32px)' }}
            >
              Questions fréquentes
            </h2>
          </div>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-white/[0.06] rounded-lg overflow-hidden hover:border-white/[0.1] transition-all">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left">
                  <span className="text-white text-sm pr-4">{faq.q}</span>
                  <ChevronDown className={cn("w-4 h-4 text-gray-500 shrink-0 transition-transform duration-200", openFaq === i && "rotate-180")} />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 -mt-1">
                    <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#5A5AFB]/[0.04] blur-[120px] pointer-events-none" />
        <div className="max-w-[600px] mx-auto px-6 text-center relative">
          <h2
            className="font-syne font-bold text-white tracking-tight break-words max-w-[34rem]"
            style={{ fontSize: 'clamp(24px, 3.4vw, 38px)' }}
          >
            Scale tes pubs{' '}
            <span className="bg-gradient-to-r from-[#5A5AFB] to-[#9C5DFF] bg-clip-text text-transparent">dès aujourd'hui</span>
          </h2>
          <div className="flex items-center justify-center gap-5 mt-6 text-xs text-gray-500">
            <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-[#5A5AFB]" /> 5 min setup</span>
            <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-[#5A5AFB]" /> +500 templates</span>
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-[#5A5AFB]" /> Sans engagement</span>
          </div>
          <a href="#/register" className="inline-flex items-center gap-2 mt-8 px-8 py-3.5 rounded-lg bg-gradient-to-r from-[#5A5AFB] to-[#9C5DFF] text-white font-medium hover:opacity-90 transition-all">
            Démarrer gratuitement <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-white/[0.04] py-10">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#5A5AFB] to-[#9C5DFF] flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-white font-syne font-bold">AdsPilot</span>
          </div>
          <div className="flex items-center gap-5 text-xs text-gray-600">
            <a href="#" className="hover:text-gray-400 transition-colors">Conditions</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Contact</a>
          </div>
          <p className="text-gray-700 text-xs">© 2025 AdsPilot</p>
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
            <span className="text-white font-bold text-xl">AdsPilot</span>
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
            <span className="text-white font-bold text-xl">AdsPilot</span>
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
// WELCOME MODAL
// ============================================
function WelcomeModal({ 
  isOpen, 
  onClose, 
  title = "Prêt à lancer votre première pub ?", 
  description = "Tout est en place — lancez votre première campagne et obtenez de vrais résultats très rapidement.", 
  features = [], 
  ctaText = "Lancer gratuitement" 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#1A1A26] border border-white/10 rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
          <X className="w-5 h-5" />
        </button>
        
        <div className="text-center space-y-4 mb-8">
          <div className="w-14 h-14 bg-[#2D2355] rounded-xl flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(124,58,237,0.2)]">
            <Zap className="w-7 h-7 text-[#A78BFA]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
            <p className="text-[14px] text-gray-400 mt-2 px-2">{description}</p>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          {features.map((f, i) => (
            <div key={i} className="flex flex-row items-center gap-4 p-4 rounded-xl bg-[#12121A]/50 border border-white/[0.03]">
              <div className="shrink-0"><f.icon className="w-5 h-5 text-[#A78BFA]" /></div>
              <p className="text-[13px] text-gray-300 leading-snug text-left">{f.text}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 mt-4">
          <button onClick={onClose} className="w-full py-4 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-[15px] font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#7C3AED]/20">
            {ctaText} <ArrowRight className="w-4 h-4" />
          </button>
          <button onClick={onClose} className="text-sm text-gray-400 hover:text-white transition-colors py-1">
            Peut-être plus tard
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// DASHBOARD PAGE (AdsPilot Style - French)
// ============================================
function DashboardPage({ user, session, showToast }) {
  const [store, setStore] = useState(null);
  const [savedCount, setSavedCount] = useState(0);
  const [loadingData, setLoadingData] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('dashboard_welcome_seen');
    if (!seen) {
      const timer = setTimeout(() => setShowWelcome(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCloseWelcome = () => {
    localStorage.setItem('dashboard_welcome_seen', 'true');
    setShowWelcome(false);
  };

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

  const checklist = [
    { icon: Globe, label: 'Compte Meta connecté', done: false, action: 'Connecter', href: '#/settings' },
    { icon: Sparkles, label: 'Première campagne créée', done: false, action: 'Créer', href: '#/campaigns' },
    { icon: Image, label: 'Premier créatif uploadé', done: savedCount > 0, action: 'Uploader', href: '#/afrivault' },
    { icon: DollarSign, label: 'Premiers 10€ dépensés', done: false, action: 'Voir', href: '#/analytics' },
  ];

  return (
    <div className="space-y-6">
      <WelcomeModal 
        isOpen={showWelcome} 
        onClose={handleCloseWelcome}
        title="Prêt à lancer votre première pub ?"
        description="Tout est en place — lancez votre première campagne et obtenez de vrais résultats très rapidement."
        features={[
          { icon: TrendingUp, text: "90% de nos utilisateurs obtiennent de meilleurs résultats qu'avec le Gestionnaire de Publicités seul." },
          { icon: Zap, text: "Prend moins de 5 minutes — notre outil configure tout pour vous." },
          { icon: Users, text: "Aucun risque — lancer une campagne est gratuit, vous ne payez que le budget pub à Meta." }
        ]}
        ctaText="Lancer gratuitement"
      />
      
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* DÉPENSES PUB */}
        <div className="bg-[#12121A] rounded-xl border border-white/[0.06] p-5 hover:border-white/[0.1] transition-all cursor-pointer" onClick={() => window.location.hash = '#/analytics'}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand/15 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-brand" />
            </div>
            <div>
              <p className="text-[11px] text-gray-500 uppercase tracking-wider font-medium">DÉPENSES PUB</p>
              <p className="text-2xl font-bold text-white mt-0.5 font-syne">0,00€</p>
            </div>
          </div>
        </div>
        
        {/* ACHATS */}
        <div className="bg-[#12121A] rounded-xl border border-white/[0.06] p-5 hover:border-white/[0.1] transition-all cursor-pointer" onClick={() => window.location.hash = '#/analytics'}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/15 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-[11px] text-gray-500 uppercase tracking-wider font-medium">ACHATS</p>
              <p className="text-2xl font-bold text-white mt-0.5 font-syne">0</p>
            </div>
          </div>
        </div>

        {/* ROAS */}
        <div className="bg-[#12121A] rounded-xl border border-white/[0.06] p-5 hover:border-white/[0.1] transition-all cursor-pointer" onClick={() => window.location.hash = '#/analytics'}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/15 flex items-center justify-center">
              <Target className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-[11px] text-gray-500 uppercase tracking-wider font-medium">ROAS</p>
              <p className="text-2xl font-bold text-green-400 mt-0.5 font-syne">0.00x</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions + Checklist */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-4">
          {/* Browse Templates */}
          <a href="#/afrivault" className="flex items-center justify-between p-5 rounded-xl bg-[#12121A] border border-white/[0.06] hover:border-brand/30 transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand/15 flex items-center justify-center group-hover:bg-brand/25 transition-colors">
                <Layers className="w-6 h-6 text-brand" />
              </div>
              <div>
                <h3 className="text-white font-semibold font-syne">Parcourir les templates gagnants</h3>
                <p className="text-sm text-gray-500 mt-0.5">Inspire-toi des meilleures pubs</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-brand transition-colors" />
          </a>

          {/* Create Campaign */}
          <a href="#/my-store" className="flex items-center justify-between p-5 rounded-xl bg-[#12121A] border border-white/[0.06] hover:border-brand/30 transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/15 flex items-center justify-center group-hover:bg-purple-500/25 transition-colors">
                <Store className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold font-syne">Connecter ma boutique</h3>
                <p className="text-sm text-gray-500 mt-0.5">Lie ta boutique Shopify en 1 clic</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-brand transition-colors" />
          </a>

          {/* Facebook Account Setup */}
          <div className="p-5 rounded-xl bg-[#12121A] border border-white/[0.06]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-brand" />
                <h3 className="text-white font-semibold font-syne">Configuration Facebook Ads</h3>
              </div>
              <a href="#/guides" className="text-sm text-gray-500 hover:text-brand transition-colors">Tous les guides</a>
            </div>
            <div className="relative aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20 flex items-center justify-center group cursor-pointer">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=450&fit=crop')] bg-cover bg-center opacity-40"></div>
              <div className="relative w-16 h-16 rounded-full bg-brand/80 flex items-center justify-center group-hover:bg-brand transition-colors">
                <Play className="w-7 h-7 text-white ml-1" />
              </div>
            </div>
          </div>
        </div>

        {/* Launch Checklist */}
        <div className="bg-[#12121A] rounded-xl border border-white/[0.06] p-5">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-brand" />
            <h3 className="text-white font-semibold font-syne">Liste de lancement</h3>
          </div>
          <p className="text-sm text-gray-500 mb-5">On te guide pas à pas !</p>
          
          {/* Progress Bar */}
          <div className="h-1 rounded-full bg-white/10 mb-6">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-brand to-purple-500 transition-all duration-500"
              style={{ width: `${(checklist.filter(c => c.done).length / checklist.length) * 100}%` }}
            />
          </div>

          <div className="space-y-3">
            {checklist.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center',
                    item.done ? 'bg-green-500/15' : 'bg-white/5'
                  )}>
                    {item.done 
                      ? <CheckCircle2 className="w-4 h-4 text-green-400" />
                      : <item.icon className="w-4 h-4 text-gray-500" />
                    }
                  </div>
                  <span className={cn(
                    'text-sm',
                    item.done ? 'text-gray-500 line-through' : 'text-gray-300'
                  )}>
                    {item.label}
                  </span>
                </div>
                {!item.done && (
                  <a href={item.href} className="text-sm text-brand hover:text-brand-light font-medium flex items-center gap-1 transition-colors">
                    {item.action} <ChevronRight className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Final CTA */}
          <a href="#/afrivault" className="mt-6 flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-gradient-to-r from-brand to-purple-500 text-white text-sm font-medium hover:opacity-90 transition-all font-syne">
            <Zap className="w-4 h-4" />
            Créer ta première pub
          </a>
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
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const seen = localStorage.getItem('afrivault_welcome_seen');
    if (!seen) {
      const timer = setTimeout(() => setShowWelcome(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCloseWelcome = () => {
    localStorage.setItem('afrivault_welcome_seen', 'true');
    setShowWelcome(false);
  };

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
    if (showFavorites && !savedIds.has(t.id)) return false;
    if (activeNiche !== 'all' && t.niche !== activeNiche) return false;
    if (activeFormat !== 'all' && t.format !== activeFormat) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = t.description.toLowerCase().includes(q);
      const matchTags = t.tags?.some(tag => tag.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTags) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <WelcomeModal 
        isOpen={showWelcome} 
        onClose={handleCloseWelcome}
        title="Bienvenue dans vos Créatifs"
        description="Découvrez et importez les meilleures publicités de votre niche au format Canva."
        features={[
          { icon: Image, text: "Des centaines de templates gagnants prêts à l'emploi et testés." },
          { icon: Heart, text: "Sauvegardez vos favoris pour les retrouver en un clic plus tard." },
          { icon: Zap, text: "Édition en 1 clic sur Canva sans aucune manipulation complexe." }
        ]}
        ctaText="Explorer les créatifs"
      />
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Templates Tabs */}
        <div className="flex items-center bg-[#12121A] rounded-xl p-1 w-fit border border-white/[0.08]">
          <button
            onClick={() => setShowFavorites(false)}
            className={cn(
              "px-5 py-2.5 rounded-lg text-sm font-medium transition-all",
              !showFavorites ? "bg-[#0A0A0F] text-white shadow-md border border-white/[0.05]" : "text-gray-400 hover:text-gray-200"
            )}
          >
            Tous les templates
          </button>
          <button
            onClick={() => setShowFavorites(true)}
            className={cn(
              "px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
              showFavorites ? "bg-[#0A0A0F] text-white shadow-md border border-white/[0.05]" : "text-gray-400 hover:text-gray-200"
            )}
          >
            Templates sauvegardés
            <span className={cn(
               "flex items-center justify-center text-[11px] font-bold rounded-full px-2 py-0.5 min-w-[20px]",
               showFavorites ? "bg-white/10 text-white" : "bg-white/5 text-gray-400"
            )}>
              {savedIds.size}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-medium">
            <Clock className="w-3 h-3" /> Mis à jour : {new Date().toLocaleDateString('fr-FR')}
          </span>
          <span className="text-sm text-gray-500">{filtered.length} template{filtered.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher des templates (titre, tags, description...)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-[#12121A] border border-white/[0.08] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
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
          <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Aucun template trouvé pour ces filtres</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(template => {
            const niche = NICHE_CONFIG[template.niche] || NICHE_CONFIG.beaute;
            const isSaved = savedIds.has(template.id);
            return (
              <div key={template.id} className="group bg-card rounded-2xl border border-border overflow-hidden hover:border-border/50 transition-all hover:shadow-xl hover:shadow-brand/5">
                <div className="aspect-square relative overflow-hidden bg-black/20">
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
                    <span className="text-xs text-muted-foreground">{FORMAT_LABELS[template.format] || template.format}</span>
                  </div>
                  <h3 className="text-sm font-medium text-foreground truncate">{template.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 truncate">{template.description}</p>
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
// GUIDES PAGE
// ============================================
function GuidesPage({ showToast }) {
  const MOCK_GUIDES = [
    {
      id: 1,
      title: 'Configurer son compte Facebook',
      duration: '2 min',
      thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=450&fit=crop'
    },
    {
      id: 2,
      title: 'Comment utiliser AfriVault',
      duration: '1 min',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white font-syne">Nos Tutoriels</h2>
        <p className="text-gray-400 mt-1">Tutoriels vidéo rapides pour bien démarrer</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_GUIDES.map(guide => (
          <div key={guide.id} className="bg-[#12121A] rounded-2xl border border-white/[0.08] overflow-hidden group hover:border-white/[0.15] transition-all cursor-pointer" onClick={() => showToast('Ouverture de la vidéo...', 'info')}>
            <div className="relative aspect-video bg-black/40 overflow-hidden">
              <img src={guide.thumbnail} alt={guide.title} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-[#7C3AED] flex items-center justify-center group-hover:bg-[#6D28D9] transition-colors shadow-lg shadow-[#7C3AED]/20">
                  <Play className="w-6 h-6 text-white ml-1 fill-white" />
                </div>
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-white font-medium text-[15px] mb-2 group-hover:text-[#7C3AED] transition-colors">{guide.title}</h3>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Clock className="w-3.5 h-3.5" />
                {guide.duration}
              </div>
            </div>
          </div>
        ))}
      </div>
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
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('mystore_welcome_seen');
    if (!seen) {
      const timer = setTimeout(() => setShowWelcome(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCloseWelcome = () => {
    localStorage.setItem('mystore_welcome_seen', 'true');
    setShowWelcome(false);
  };

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
      <WelcomeModal 
        isOpen={showWelcome} 
        onClose={handleCloseWelcome}
        title="Bienvenue dans Ma Boutique"
        description="Connectez votre boutique en 1 clic pour accélérer la conception de vos campagnes."
        features={[
          { icon: Store, text: "Synchronisation automatique de votre catalogue et de vos produits." },
          { icon: Globe, text: "Détection automatique de la devise unique pour vos facturations." },
          { icon: Zap, text: "Générez des publicités instantanément à partir de n'importe quel produit." }
        ]}
        ctaText="Gérer ma boutique"
      />
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
              <div key={p.id || i} className="group bg-[#12121A] rounded-2xl border border-white/[0.08] overflow-hidden hover:border-[#7C3AED]/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[#7C3AED]/10 transition-all duration-300">
                <div className="aspect-[4/3] sm:aspect-square relative overflow-hidden bg-black/20">
                  {p.image ? (
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#1A1A26]"><Store className="w-8 h-8 text-gray-600" /></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12121A] via-[#12121A]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                    <button onClick={(e) => { e.stopPropagation(); showToast('Générateur vidéo bientôt disponible !', 'info'); }} className="w-full py-2.5 rounded-xl bg-[#7C3AED]/90 backdrop-blur-sm text-white text-sm font-semibold hover:bg-[#6D28D9] transition-all flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02]">
                      <Zap className="w-4 h-4" /> Créer une pub
                    </button>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-bold text-gray-400 tracking-wider uppercase">Shopify</span>
                    <span className="text-sm font-bold text-white font-syne">{p.price} <span className="text-xs text-gray-500 font-medium">{store.currency || 'EUR'}</span></span>
                  </div>
                  <h4 className="text-[14px] font-medium text-white line-clamp-2 leading-snug group-hover:text-[#7C3AED] transition-colors">{p.title}</h4>
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
// META CONNECTION CARD COMPONENT
// ============================================
function MetaConnectionCard({ session, showToast }) {
  const [metaConnection, setMetaConnection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    fetchMetaConnection();
  }, [session]);

  const fetchMetaConnection = async () => {
    try {
      const res = await fetch('/api/meta/connection', { headers: apiHeaders(session) });
      if (res.ok) {
        const data = await res.json();
        setMetaConnection(data.connection || null);
      }
    } catch (err) {
      console.error('Error fetching Meta connection:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectMeta = async () => {
    setConnecting(true);
    try {
      // Initiate OAuth flow
      const res = await fetch('/api/meta/auth', {
        method: 'POST',
        headers: apiHeaders(session)
      });

      if (res.ok) {
        const data = await res.json();
        if (data.authUrl) {
          // Redirect to Facebook OAuth
          window.location.href = data.authUrl;
        }
      } else {
        throw new Error('Failed to initiate Meta connection');
      }
    } catch (err) {
      showToast('Erreur lors de la connexion à Meta', 'error');
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Es-tu sûr de vouloir déconnecter ton compte Meta ?')) return;

    try {
      const res = await fetch('/api/meta/connection', {
        method: 'DELETE',
        headers: apiHeaders(session)
      });

      if (res.ok) {
        setMetaConnection(null);
        showToast('Compte Meta déconnecté avec succès', 'success');
      } else {
        throw new Error('Failed to disconnect');
      }
    } catch (err) {
      showToast('Erreur lors de la déconnexion', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 text-brand animate-spin" />
      </div>
    );
  }

  if (metaConnection) {
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
          <div className="w-10 h-10 rounded-xl bg-[#1877F2] flex items-center justify-center shrink-0">
            <Facebook className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-semibold text-white">Compte Meta connecté</h3>
              <CheckCircle2 className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-xs text-gray-400 mb-2">
              {metaConnection.name || 'Compte Business Manager'}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Link2 className="w-3 h-3" />
              <span>Connecté le {new Date(metaConnection.connected_at).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleDisconnect}
            className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-all"
          >
            Déconnecter
          </button>
          <button
            onClick={fetchMetaConnection}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-sm font-medium hover:bg-white/10 transition-all"
          >
            Actualiser
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4 p-4 rounded-xl bg-[#1A1A26] border border-white/[0.08]">
        <div className="w-10 h-10 rounded-xl bg-[#1877F2]/20 flex items-center justify-center shrink-0">
          <Facebook className="w-5 h-5 text-[#1877F2]" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-white mb-1">Connecter ton compte Meta</h3>
          <p className="text-xs text-gray-400 mb-3">
            Lie ton compte Meta Ads pour créer et gérer tes campagnes Facebook & Instagram directement depuis AdsPilot.
          </p>
          <ul className="space-y-2 mb-4">
            {[
              'Créer des campagnes automatiquement',
              'Importer tes audiences existantes',
              'Suivre tes performances en temps réel',
              'Accéder à tes pixels et catalogues'
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-xs text-gray-300">
                <Check className="w-3 h-3 text-brand shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
        <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-300">
          Tu seras redirigé vers Meta pour autoriser l'accès. Assure-toi d'être admin de ton Business Manager.
        </p>
      </div>

      <button
        onClick={handleConnectMeta}
        disabled={connecting}
        className="w-full py-3 rounded-xl bg-[#1877F2] text-white font-semibold text-sm hover:bg-[#1664D8] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
      >
        {connecting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Connexion en cours...
          </>
        ) : (
          <>
            <Facebook className="w-4 h-4" />
            Connecter mon compte Meta
          </>
        )}
      </button>
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

      {/* Meta Connection Section */}
      <div className="bg-[#12121A] rounded-2xl border border-white/[0.08] p-6">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-brand" />
          Connexions
        </h2>
        <MetaConnectionCard session={session} showToast={showToast} />
      </div>

      <Link href="#/settings/billing" className="block bg-[#12121A] rounded-2xl border border-white/[0.08] p-6 hover:border-brand/30 transition-all group cursor-pointer">
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
      </Link>
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
            <h2 className="text-white font-semibold text-lg">AdsPilot Pro</h2>
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

      <Link href="#/settings" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">
        ← Retour aux paramètres
      </Link>
    </div>
  );
}

// ============================================
// PRICING PAGE
// ============================================
function PricingPage({ user, session, showToast }) {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      description: 'Pour d\u00e9couvrir et tester la plateforme',
      features: [
        { text: '10 templates AfriVault', included: true },
        { text: '1 boutique connect\u00e9e', included: true },
        { text: 'Connexion Shopify', included: true },
        { text: 'Analytics basiques', included: false },
        { text: 'Insights IA', included: false },
        { text: 'Support prioritaire', included: false },
        { text: 'UGC Studio', included: false },
      ],
      cta: 'Commencer gratuitement',
      popular: false,
      current: true,
    },
    {
      name: 'Pro',
      price: { monthly: 29, yearly: 290 },
      description: 'Pour les e-commer\u00e7ants qui veulent scaler',
      features: [
        { text: 'Templates illimit\u00e9s AfriVault', included: true },
        { text: 'Boutiques illimit\u00e9es', included: true },
        { text: 'Analytics avanc\u00e9s + ROAS', included: true },
        { text: 'Insights IA', included: true },
        { text: 'AdScout (espionne concurrents)', included: true },
        { text: 'Support prioritaire', included: true },
        { text: 'Formation vid\u00e9o', included: true },
      ],
      cta: 'Passer \u00e0 Pro',
      popular: true,
      current: false,
    },
    {
      name: 'Premium',
      price: { monthly: 99, yearly: 990 },
      description: 'Pour les agences et power users',
      features: [
        { text: 'Tout de Pro +', included: true },
        { text: 'UGC Studio (cr\u00e9atifs illimit\u00e9s)', included: true },
        { text: 'Gestion multi-clients', included: true },
        { text: 'White label (ton logo)', included: true },
        { text: 'Formation 1-to-1 personnalis\u00e9e', included: true },
        { text: 'API acc\u00e8s', included: true },
        { text: 'Account manager d\u00e9di\u00e9', included: true },
      ],
      cta: 'Passer \u00e0 Premium',
      popular: false,
      current: false,
    },
  ];

  const handleSubscribe = (planName) => {
    if (planName === 'Free') {
      showToast('Vous \u00eates d\u00e9j\u00e0 sur le plan gratuit !', 'info');
    } else {
      showToast(`L'int\u00e9gration Stripe arrive bient\u00f4t ! En attendant, profitez de l'acc\u00e8s gratuit.`, 'info');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white font-syne">Choisis ton plan</h1>
        <p className="text-gray-400 text-lg">Commence gratuitement. Scale avec Pro. Domine avec Premium.</p>

        {/* Billing Toggle */}
        <div className="inline-flex items-center gap-3 bg-[#12121A] rounded-xl border border-white/[0.08] p-1.5">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={cn(
              'px-6 py-2.5 rounded-lg text-sm font-medium transition-all',
              billingCycle === 'monthly'
                ? 'bg-brand text-white shadow-lg shadow-brand/20'
                : 'text-gray-400 hover:text-white'
            )}
          >
            Mensuel
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={cn(
              'px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
              billingCycle === 'yearly'
                ? 'bg-brand text-white shadow-lg shadow-brand/20'
                : 'text-gray-400 hover:text-white'
            )}
          >
            Annuel
            <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold">
              -20%
            </span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              'relative bg-[#12121A] rounded-2xl border overflow-hidden transition-all hover:shadow-2xl',
              plan.popular
                ? 'border-brand shadow-lg shadow-brand/10'
                : 'border-white/[0.08] hover:border-white/[0.15]'
            )}
          >
            {/* Popular Badge */}
            {plan.popular && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand to-accent-gold" />
            )}
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-brand text-white text-xs font-semibold">
                POPULAIRE
              </div>
            )}

            <div className="p-6 space-y-6">
              {/* Plan Header */}
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-sm text-gray-400">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">
                  {plan.price[billingCycle]}€
                </span>
                <span className="text-gray-400 text-sm">
                  /{billingCycle === 'monthly' ? 'mois' : 'an'}
                </span>
              </div>
              {billingCycle === 'yearly' && plan.price.yearly > 0 && (
                <p className="text-xs text-green-400">
                  Économise {plan.price.monthly * 12 - plan.price.yearly}€ par an
                </p>
              )}

              {/* Features */}
              <div className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    {feature.included ? (
                      <CheckCircle2 className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-5 h-5 text-gray-600 shrink-0 mt-0.5" />
                    )}
                    <span className={cn(
                      'text-sm',
                      feature.included ? 'text-gray-300' : 'text-gray-600'
                    )}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button
                onClick={() => handleSubscribe(plan.name)}
                disabled={plan.current}
                className={cn(
                  'w-full py-3.5 rounded-xl font-semibold text-sm transition-all',
                  plan.current
                    ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                    : plan.popular
                    ? 'bg-brand text-white hover:bg-brand-light shadow-lg shadow-brand/25'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                )}
              >
                {plan.current ? 'Plan actuel' : plan.cta}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="mt-16 max-w-3xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-white text-center mb-8">Questions fréquentes</h2>
        <div className="space-y-4">
          {[
            { q: 'Puis-je changer de plan à tout moment ?', a: 'Oui, tu peux upgrader ou downgrader ton plan à tout moment. Les changements prennent effet immédiatement.' },
            { q: 'Y a-t-il un engagement ?', a: 'Non, aucun engagement. Tu peux annuler ton abonnement quand tu veux depuis ton dashboard.' },
            { q: 'Puis-je essayer Pro gratuitement ?', a: 'Oui ! Tous les nouveaux comptes bénéficient de 7 jours d\'essai gratuit sur le plan Pro.' },
            { q: 'Quels moyens de paiement acceptez-vous ?', a: 'Nous acceptons toutes les cartes bancaires (Visa, Mastercard, Amex) via Stripe.' },
          ].map((faq, idx) => (
            <div key={idx} className="bg-[#12121A] rounded-xl border border-white/[0.08] p-5">
              <h3 className="text-white font-semibold mb-2">{faq.q}</h3>
              <p className="text-sm text-gray-400">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Sales */}
      <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-brand/10 to-accent-gold/10 border border-brand/20 text-center">
        <h3 className="text-2xl font-bold text-white mb-3">Besoin d'un plan personnalisé ?</h3>
        <p className="text-gray-300 mb-6">Tu as une agence ou des besoins spécifiques ? On a des solutions sur mesure.</p>
        <button className="px-8 py-3 rounded-xl bg-brand text-white font-semibold hover:bg-brand-light transition-all">
          Contacte notre équipe
        </button>
      </div>
    </div>
  );
}

// ============================================
// ADMIN PANEL
// ============================================
function AdminPanel({ currentPath, user, session, showToast, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Parse the admin route
  useEffect(() => {
    const path = currentPath.replace('#/admin-pro/', '').replace('#/admin-pro', '');
    setActiveTab(path || 'dashboard');
  }, [currentPath]);

  // Check if user is admin (you can customize this logic)
  const isAdmin = user?.email === 'dodjiq@gmail.com' || user?.user_metadata?.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Accès refusé</h2>
          <p className="text-gray-400 mb-8">Vous n'avez pas les permissions pour accéder à l'espace admin.</p>
          <Link href="#/dashboard" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand text-white font-semibold hover:bg-brand-light transition-all cursor-pointer">
            ← Retour au Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex">
      {/* Admin Sidebar */}
      <AdminSidebar activeTab={activeTab} user={user} onLogout={onLogout} />

      {/* Admin Content */}
      <div className="flex-1 ml-[240px]">
        <AdminHeader user={user} />
        <div className="p-8">
          {activeTab === 'dashboard' && <AdminDashboard session={session} showToast={showToast} />}
          {activeTab === 'templates' && <AdminTemplates session={session} showToast={showToast} />}
          {activeTab === 'announcements' && <AdminAnnouncements session={session} showToast={showToast} />}
          {activeTab === 'users' && <AdminUsers session={session} showToast={showToast} />}
          {activeTab === 'subscriptions' && <AdminSubscriptions session={session} showToast={showToast} />}
          {activeTab === 'settings' && <AdminSettings session={session} showToast={showToast} />}
        </div>
      </div>
    </div>
  );
}

// Admin Sidebar
function AdminSidebar({ activeTab, user, onLogout }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'templates', label: 'Templates', icon: Palette },
    { id: 'announcements', label: 'Annonces', icon: Bell },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'subscriptions', label: 'Abonnements', icon: CreditCard },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-[240px] bg-[#0D0D14] border-r border-white/[0.06] flex flex-col z-50">
      {/* Logo */}
      <div className="px-6 h-16 flex items-center justify-between border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-[15px] font-syne">Admin Pro</span>
        </div>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="space-y-1">
          {menuItems.map(item => (
            <Link
              key={item.id}
              href={`#/admin-pro/${item.id}`}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer',
                activeTab === item.id
                  ? 'bg-brand/15 text-brand'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Back to App + Logout */}
      <div className="border-t border-white/[0.06] p-3 space-y-2">
        <Link
          href="#/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
        >
          <ArrowRight className="w-5 h-5 rotate-180" />
          <span className="text-sm font-medium">Retour à l'app</span>
        </Link>

        <div className="pt-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-3 p-2 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand to-accent-gold flex items-center justify-center text-white font-semibold text-xs">
              {user?.email?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white font-medium truncate">Admin</p>
              <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={onLogout}
              className="w-7 h-7 rounded-md flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

// Admin Header
function AdminHeader({ user }) {
  return (
    <header className="sticky top-0 z-40 bg-[#0A0A0F]/95 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white font-syne">Administration</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gérez votre plateforme AdsPilot</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-brand/15 border border-brand/30 flex items-center gap-2">
            <Shield className="w-4 h-4 text-brand" />
            <span className="text-xs font-semibold text-brand">ADMIN</span>
          </div>
        </div>
      </div>
    </header>
  );
}

// Admin Dashboard
function AdminDashboard({ session }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats', { headers: apiHeaders(session) });
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: 'Utilisateurs totaux', value: stats?.totalUsers || 0, icon: Users, color: 'blue' },
    { label: 'Templates', value: stats?.totalTemplates || 12, icon: Palette, color: 'purple' },
    { label: 'Abonnements actifs', value: stats?.activeSubscriptions || 0, icon: CreditCard, color: 'green' },
    { label: 'Revenus (€)', value: stats?.monthlyRevenue || '0', icon: DollarSign, color: 'yellow' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-[#12121A] rounded-2xl border border-white/[0.08] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center',
                stat.color === 'blue' && 'bg-blue-500/15',
                stat.color === 'purple' && 'bg-purple-500/15',
                stat.color === 'green' && 'bg-green-500/15',
                stat.color === 'yellow' && 'bg-yellow-500/15'
              )}>
                <stat.icon className={cn(
                  'w-6 h-6',
                  stat.color === 'blue' && 'text-blue-400',
                  stat.color === 'purple' && 'text-purple-400',
                  stat.color === 'green' && 'text-green-400',
                  stat.color === 'yellow' && 'text-yellow-400'
                )} />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-[#12121A] rounded-2xl border border-white/[0.08] p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Activité récente</h2>
        <p className="text-gray-400 text-sm">Aucune activité récente pour le moment.</p>
      </div>
    </div>
  );
}

// Admin Templates (continued in next file due to size)
function AdminTemplates({ session, showToast }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTemplate, setEditingTemplate] = useState(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/admin/templates', { headers: apiHeaders(session) });
      if (res.ok) {
        const data = await res.json();
        setTemplates(data.templates);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (templateId) => {
    if (!confirm('Supprimer ce template ?')) return;

    try {
      const res = await fetch(`/api/admin/templates/${templateId}`, {
        method: 'DELETE',
        headers: apiHeaders(session)
      });

      if (res.ok) {
        showToast('Template supprimé', 'success');
        fetchTemplates();
      }
    } catch (err) {
      showToast('Erreur lors de la suppression', 'error');
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-brand animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Gestion des Templates</h2>
        <button
          onClick={() => setEditingTemplate({})}
          className="px-4 py-2 rounded-xl bg-brand text-white font-semibold hover:bg-brand-light transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Nouveau Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map(template => (
          <div key={template.id} className="bg-[#12121A] rounded-2xl border border-white/[0.08] p-4 hover:border-brand/30 transition-all">
            <div className="aspect-square rounded-xl bg-white/5 mb-4 overflow-hidden">
              {template.preview_url && (
                <img src={template.preview_url} alt={template.title} className="w-full h-full object-cover" />
              )}
            </div>
            <h3 className="text-white font-semibold mb-1">{template.title}</h3>
            <p className="text-gray-400 text-sm mb-3">{template.description}</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setEditingTemplate(template)} className="flex-1 px-3 py-2 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 transition-all text-sm cursor-pointer">
                Modifier
              </button>
              <button onClick={() => handleDelete(template.id)} className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all text-sm cursor-pointer">
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Admin Users
function AdminUsers({ session, showToast }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users', { headers: apiHeaders(session) });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: apiHeaders(session),
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        showToast('Rôle mis à jour avec succès', 'success');
        fetchUsers();
      } else {
        const d = await res.json();
        showToast(d.error || 'Erreur lors de la mise à jour', 'error');
      }
    } catch (err) {
      showToast('Erreur serveur', 'error');
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-brand animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Gestion des Utilisateurs</h2>

      <div className="bg-[#12121A] rounded-2xl border border-white/[0.08] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Utilisateur</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Rôle</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Statut</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Inscription</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-accent-gold flex items-center justify-center text-white font-semibold text-sm">
                        {user.email?.[0]?.toUpperCase()}
                      </div>
                      <span className="text-white font-medium">{user.email?.split('@')[0]}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium uppercase",
                      user.role === 'admin' ? "bg-purple-500/20 text-purple-400" :
                      user.role === 'pro' ? "bg-[#7C3AED]/20 text-[#A78BFA]" : "bg-gray-500/20 text-gray-400"
                    )}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
                      Actif
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <select 
                      value={user.role || 'user'} 
                      onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                      className="bg-[#1A1A26] border border-white/[0.08] text-white text-sm rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#7C3AED] transition-all cursor-pointer"
                    >
                      <option value="user">Standard</option>
                      <option value="pro">Plan Pro</option>
                      <option value="admin">Administrateur</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Admin Subscriptions
function AdminSubscriptions({ session }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Gestion des Abonnements</h2>
      <div className="bg-[#12121A] rounded-2xl border border-white/[0.08] p-8 text-center">
        <CreditCard className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">Aucun abonnement actif pour le moment.</p>
        <p className="text-sm text-gray-500 mt-2">Les abonnements apparaîtront ici une fois que Stripe sera configuré.</p>
      </div>
    </div>
  );
}

// Admin Announcements
function AdminAnnouncements({ session, showToast }) {
  const [message, setMessage] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/public/announcements');
        if (res.ok) {
          const d = await res.json();
          if (d.announcement) {
            setMessage(d.announcement.message);
            setIsActive(true);
          }
        }
      } catch (e) {}
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'PUT',
        headers: apiHeaders(session),
        body: JSON.stringify({ message, is_active: isActive })
      });
      if (res.ok) showToast('Annonce mise à jour !', 'success');
      else showToast('Erreur lors de la mise à jour', 'error');
    } catch (e) {
      showToast('Erreur serveur', 'error');
    }
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-brand animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-2xl font-bold text-white">Bannière d'Annonce Globale</h2>
      <div className="bg-[#12121A] rounded-2xl border border-white/[0.08] p-6 lg:p-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Message de l'annonce</label>
            <input 
              type="text" 
              value={message} 
              onChange={e => setMessage(e.target.value)} 
              placeholder="Ex: 🚀 AdsPilot v2.0 est maintenant disponible !" 
              className="w-full px-4 py-3 rounded-xl bg-[#1A1A26] border border-white/[0.08] text-white focus:outline-none focus:border-[#7C3AED] transition-all"
            />
            <p className="text-xs text-gray-500 mt-2">Le texte brut et les balises HTML basiques (&lt;b&gt;, &lt;a&gt;) sont supportés.</p>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#1A1A26] border border-white/[0.05]">
            <div>
              <p className="text-white font-medium">Activer la bannière</p>
              <p className="text-sm text-gray-500">Afficher cette annonce tout en haut de l'interface SaaS pour l'ensemble des utilisateurs actuels.</p>
            </div>
            <button 
              onClick={() => setIsActive(!isActive)}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                isActive ? "bg-[#7C3AED]" : "bg-gray-600"
              )}
            >
              <span className={cn("inline-block h-4 w-4 transform rounded-full bg-white transition-transform", isActive ? "translate-x-6" : "translate-x-1")} />
            </button>
          </div>

          <div className="pt-4 border-t border-white/[0.08] flex justify-end">
            <button 
              onClick={handleSave} 
              disabled={saving}
              className="px-6 py-2.5 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-medium flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-[#7C3AED]/20 active:scale-95"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Diffuser l'annonce
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Admin Settings
function AdminSettings({ session, showToast }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Paramètres Admin</h2>

      <div className="bg-[#12121A] rounded-2xl border border-white/[0.08] p-6">
        <h3 className="text-white font-semibold mb-4">Configuration de la plateforme</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Nom de la plateforme</label>
            <input
              type="text"
              defaultValue="AdsPilot"
              className="w-full px-4 py-3 rounded-xl bg-[#1A1A26] border border-white/[0.08] text-white placeholder-gray-500 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/30 text-sm transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email admin</label>
            <input
              type="email"
              defaultValue="dodjiq@gmail.com"
              className="w-full px-4 py-3 rounded-xl bg-[#1A1A26] border border-white/[0.08] text-white placeholder-gray-500 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/30 text-sm transition-all"
            />
          </div>
          <button
            onClick={() => showToast('Paramètres sauvegardés', 'success')}
            className="px-6 py-3 rounded-xl bg-brand text-white font-semibold hover:bg-brand-light transition-all cursor-pointer"
          >
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// ADSCOUT PAGE
// ============================================
function AdScoutPage({ showToast }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('adscout_welcome_seen');
    if (!seen) {
      const timer = setTimeout(() => setShowWelcome(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCloseWelcome = () => {
    localStorage.setItem('adscout_welcome_seen', 'true');
    setShowWelcome(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      setResults([
        {
          id: 1,
          advertiser: 'Mode Africaine',
          logo: 'M',
          color: 'from-pink-500 to-rose-500',
          copy: 'Découvrez notre nouvelle collection d\'été ! Livraison gratuite ce week-end. 🌟👗 #Mode #Summer',
          image: 'https://images.unsplash.com/photo-1515347619362-71c1bd248740?w=600&h=800&fit=crop',
          likes: '1.2k',
          comments: '34'
        },
        {
          id: 2,
          advertiser: 'Tech Store BKO',
          logo: 'T',
          color: 'from-blue-500 to-cyan-500',
          copy: 'Les nouveaux écouteurs sans fil avec réduction de bruit active. Stock limité ! 🎧🔥',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=800&fit=crop',
          likes: '856',
          comments: '12'
        },
        {
          id: 3,
          advertiser: 'Bio Cosmétiques',
          logo: 'B',
          color: 'from-green-500 to-emerald-500',
          copy: 'Secret de beauté : l\'huile d\'argan 100% pure pour une peau éclatante. 🌿✨',
          image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=800&fit=crop',
          likes: '3.4k',
          comments: '128'
        }
      ]);
      setIsSearching(false);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 mt-4">
      <WelcomeModal 
        isOpen={showWelcome} 
        onClose={handleCloseWelcome}
        title="Bienvenue dans AdScout"
        description="L'outil ultime pour espionner les publicités qui cartonnent chez vos concurrents."
        features={[
          { icon: Search, text: "Recherchez par nom, mot-clé ou niche de façon anonyme." },
          { icon: Filter, text: "Filtrez pour ne trouver que les annonces les plus performantes." },
          { icon: Heart, text: "Sauvegardez les meilleurs créatifs dans votre bibliothèque." }
        ]}
        ctaText="Lancer une recherche"
      />
      {/* Search Header */}
      <div className="bg-[#12121A] rounded-2xl border border-white/[0.08] p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#7C3AED]/10 rounded-full blur-[80px]" />
        
        <div className="relative z-10 max-w-3xl">
          <h2 className="text-3xl font-bold text-white font-syne mb-3">AdScout Explorer</h2>
          <p className="text-gray-400 text-lg mb-8">
            Recherchez et analysez les publicités les plus performantes de vos concurrents.
          </p>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Ex: Cosmétiques naturels, Vêtements d'été..."
                className="w-full pl-12 pr-4 py-4 bg-[#1A1A26] border border-white/[0.08] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#7C3AED]/50 focus:ring-2 focus:ring-[#7C3AED]/20 transition-all text-base shadow-inner"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-8 py-4 bg-[#7C3AED] rounded-xl text-white font-semibold transition-all hover:bg-[#6D28D9] disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-[#7C3AED]/20"
            >
              {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              {isSearching ? 'Recherche...' : 'Rechercher'}
            </button>
          </form>

          {/* Filters quick tags */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="text-sm text-gray-500 mr-2">Filtres populaires :</span>
            {['Beauté', 'Électronique', 'Mode', 'Dropshipping'].map(tag => (
              <button key={tag} onClick={() => { setSearchQuery(tag); setTimeout(() => handleSearch({preventDefault: () => {}}), 100) }} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300 hover:bg-white/10 transition-colors">
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Section */}
      {results.length > 0 && (
        <div className="space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Résultats pour "{searchQuery}"</h3>
            <span className="text-sm text-gray-500">{results.length} publicités trouvées</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map(ad => (
              <div key={ad.id} className="bg-[#12121A] rounded-2xl border border-white/[0.08] overflow-hidden group hover:border-[#7C3AED]/30 transition-all shadow-xl">
                {/* Ad Header */}
                <div className="p-4 flex items-center gap-3 border-b border-white/[0.05]">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${ad.color} flex items-center justify-center text-white font-bold`}>
                    {ad.logo}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium text-sm">{ad.advertiser}</h4>
                    <p className="text-[11px] text-gray-500">Sponsorisé</p>
                  </div>
                  <button className="text-gray-400 hover:text-white"><Eye className="w-4 h-4" /></button>
                </div>
                
                {/* Ad Copy */}
                <div className="p-4 text-[13px] text-gray-300 min-h-[80px]">
                  {ad.copy}
                </div>

                {/* Ad Media */}
                <div className="aspect-[4/5] bg-black/50 relative overflow-hidden">
                  <img src={ad.image} alt="Ad creative" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                    <button onClick={() => showToast('Créatif sauvegardé dans vos favoris !', 'success')} className="px-4 py-2 bg-white/10 border border-white/20 backdrop-blur-md rounded-xl text-white text-sm font-medium flex items-center gap-2 hover:bg-[#7C3AED] hover:border-[#7C3AED] transition-all">
                      <Heart className="w-4 h-4" /> Sauvegarder
                    </button>
                  </div>
                </div>

                {/* Ad Engagement */}
                <div className="p-4 bg-[#1A1A26] flex items-center gap-4 text-xs text-gray-400 border-t border-white/[0.05]">
                  <div className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-gray-500" /> {ad.likes}</div>
                  <div className="flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5 text-gray-500" /> {ad.comments}</div>
                  <div className="ml-auto px-2 py-1 rounded bg-green-500/10 text-green-400 text-[10px] uppercase font-bold tracking-wider">
                    Gagnant
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State when zero results */}
      {results.length === 0 && !isSearching && searchQuery && (
        <div className="py-20 text-center border border-white/[0.08] border-dashed rounded-2xl bg-[#12121A]/50 mt-6">
          <Search className="w-12 h-12 text-gray-500 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-white mb-2">Aucun résultat trouvé</h3>
          <p className="text-gray-400 text-sm max-w-sm mx-auto">Nous n'avons trouvé aucune publicité pour "{searchQuery}". Essayez d'autres mots-clés comme "Beauté" ou "Mode".</p>
        </div>
      )}
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
// ============================================
// CREATIVES PAGE (AdsPilot Style)
// ============================================
function CreativesPage({ navigate, showToast }) {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('creatives_welcome_seen');
    if (!seen) {
      const timer = setTimeout(() => setShowWelcome(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCloseWelcome = () => {
    localStorage.setItem('creatives_welcome_seen', 'true');
    setShowWelcome(false);
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 pt-2">
      <WelcomeModal 
        isOpen={showWelcome} 
        onClose={handleCloseWelcome}
        title="Bienvenue dans Créatifs"
        description="Analysez les performances de vos créations publicitaires en un seul endroit."
        features={[
          { icon: Trophy, text: "Découvrez quelles publicités génèrent le plus de ventes réelles." },
          { icon: BarChart2, text: "Suivez le ROI complet de chaque créatif automatiquement." },
          { icon: Zap, text: "Optimisez vos prochaines campagnes grâce aux données d'AdsPilot." }
        ]}
        ctaText="Découvrir le Leaderboard"
      />

      <div className="space-y-12">
        {/* Promo Banner */}
        <div className="bg-[#1A1A26] rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm border border-transparent hover:border-white/[0.05] transition-all">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#7C3AED]/10 flex items-center justify-center shrink-0 border border-[#7C3AED]/20 shadow-inner">
              <Rocket className="w-6 h-6 text-[#7C3AED]" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-[15px] mb-1">Lancez votre première campagne maintenant</h3>
              <p className="text-[#8B8B9E] text-[13px]">
                90% des personnes qui ont lancé des campagnes sur AdsPilot ont obtenu de meilleurs résultats que d'utiliser Ads Manager seul.
              </p>
            </div>
          </div>
          <button 
            onClick={() => navigate('#/campaigns')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-medium text-[13px] transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-md shadow-[#7C3AED]/20"
          >
            Lancement Gratuit <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Leaderboard Section */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-7 h-7 text-[#7C3AED]" />
            <h2 className="text-[26px] font-bold text-white tracking-tight">Leaderboard créatif</h2>
          </div>
          <p className="text-[#8B8B9E] text-[15px] mb-12">Classez vos créations publicitaires par performance</p>

          {/* Empty State / Connect Meta Box */}
          <div className="flex flex-col items-center justify-center text-center mt-20">
            <div className="w-16 h-16 rounded-2xl bg-[#1A1A26] flex items-center justify-center mb-6 shadow-sm border border-white/[0.05]">
              <Link2 className="w-7 h-7 text-[#7C3AED]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Connectez votre compte Meta</h3>
            <p className="text-[#8B8B9E] text-[14px] max-w-[460px] mx-auto mb-8 leading-relaxed">
              Liez votre compte Meta Ads pour commencer à utiliser cette fonctionnalité. Vous aurez besoin d'un accès à un compte Meta Business.
            </p>
            <button 
              onClick={() => navigate('#/settings')}
              className="w-[320px] py-3.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold text-[14px] transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#7C3AED]/10 active:scale-[0.98]"
            >
              <Link2 className="w-4 h-4" /> Aller Aux Connexions
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
}

// ============================================
// AI CHATBOT (Floating Modal)
// ============================================
function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Bonjour ! Je suis l\'assistant IA d\'AdsPilot. Comment puis-je vous aider aujourd\'hui ?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', text: "Je suis une version de démonstration. Mon moteur est en cours de création par l'équipe AdsPilot !" }]);
    }, 1000);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-[#7C3AED] to-[#A78BFA] text-white rounded-full flex flex-col items-center justify-center shadow-lg shadow-[#7C3AED]/30 transition-all hover:scale-105 active:scale-95 z-[100]",
          isOpen ? "opacity-0 pointer-events-none scale-90" : "opacity-100 scale-100"
        )}
      >
        <Sparkles className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[360px] h-[520px] bg-[#12121A] border border-white/[0.08] rounded-2xl shadow-2xl z-[100] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          <div className="h-16 border-b border-white/[0.08] bg-[#1A1A26] px-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7C3AED] to-purple-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-white font-medium text-sm">AdsPilot IA</h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-gray-400">En ligne</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-transparent to-[#0A0A0F]/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={cn("flex max-w-[85%]", msg.role === 'user' ? "ml-auto" : "mr-auto")}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-[#1A1A26] border border-white/[0.05] flex items-center justify-center shrink-0 mr-2 mt-auto">
                    <Sparkles className="w-3.5 h-3.5 text-[#A78BFA]" />
                  </div>
                )}
                <div className={cn(
                  "px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed",
                  msg.role === 'user' 
                    ? "bg-[#7C3AED] text-white rounded-br-sm" 
                    : "bg-[#1A1A26] border border-white/[0.05] text-gray-200 rounded-bl-sm"
                )}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-white/[0.08] bg-[#1A1A26]">
            <div className="relative flex items-center">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Posez votre question à l'IA..."
                className="w-full pl-4 pr-12 py-3 rounded-xl bg-[#0A0A0F] border border-white/[0.05] text-white text-sm focus:outline-none focus:border-[#7C3AED] transition-all"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim()}
                className="absolute right-2 w-8 h-8 flex items-center justify-center rounded-lg bg-[#7C3AED] text-white disabled:opacity-50 disabled:bg-[#2A2A35] transition-all"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

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
    let isMounted = true;
    let subscription = null;

    async function bootstrapSession() {
      if (!supabase) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const { data: { session: s } } = await supabase.auth.getSession();
        if (!isMounted) return;
        setSession(s);
        setUser(s?.user || null);
      } catch (e) {
        if (!isMounted) return;
        setSession(null);
        setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }

      const { data } = supabase.auth.onAuthStateChange((_event, s) => {
        setSession(s);
        setUser(s?.user || null);
      });
      subscription = data?.subscription ?? null;
    }

    bootstrapSession();
    return () => {
      isMounted = false;
      if (subscription) subscription.unsubscribe();
    };
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

  // Check if admin route
  if (currentPath && currentPath.startsWith('#/admin-pro')) {
    return <AdminPanel currentPath={currentPath} user={user} session={session} showToast={showToast} onLogout={handleLogout} />;
  }

  const pageContent = (() => {
    switch (currentPath) {
      case '#/dashboard': return <DashboardPage {...pageProps} />;
      case '#/afrivault': return <AfriVaultPage {...pageProps} />;
      case '#/creatives': return <CreativesPage {...pageProps} />;
      case '#/guides': return <GuidesPage {...pageProps} />;
      case '#/my-store': return <MyStorePage {...pageProps} />;
      case '#/settings': return <SettingsPage {...pageProps} />;
      case '#/settings/billing': return <BillingPage {...pageProps} />;
      case '#/pricing': return <PricingPage {...pageProps} />;
      case '#/analytics': return <ComingSoonPage title="Analytics" icon={BarChart2} showToast={showToast} />;
      case '#/adscout': return <AdScoutPage {...pageProps} />;
      case '#/ugc': return <ComingSoonPage title="UGC Studio" icon={Video} showToast={showToast} />;
      case '#/campaigns': return <ComingSoonPage title="Campagnes" icon={Target} showToast={showToast} />;
      case '#/insights': return <ComingSoonPage title="Insights" icon={Sparkles} showToast={showToast} />;
      case '#/comments': return <ComingSoonPage title="Commentaires" icon={MessageSquare} showToast={showToast} />;
      default: return <DashboardPage {...pageProps} />;
    }
  })();

  return (
    <>
      <DashboardLayout currentPath={currentPath} user={user} onLogout={handleLogout}>
        {pageContent}
      </DashboardLayout>
      <AIChatbot />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}
