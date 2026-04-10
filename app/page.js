'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import {
  LayoutDashboard, FolderOpen, ShoppingBag, BarChart2, Search, Video,
  Settings, Zap, Bell, Heart, Check, X, ChevronDown, Filter, ExternalLink,
  Loader2, Mail, Lock, User, ArrowRight, TrendingUp, DollarSign,
  ShoppingCart, LogOut, CreditCard, Sparkles, Clock, Eye, EyeOff, Store,
  CheckCircle2, Circle, Palette, AlertCircle, Plus, ChevronRight, ChevronLeft,
  Globe, Layers, Shield, Users, Star, MessageSquare, MousePointerClick,
  Target, Image, Repeat, ChevronUp, Menu, Play, Facebook, Link2, Info,
  Trophy, Rocket, LifeBuoy, Send, Paperclip, MoreVertical, Tag, Package
} from 'lucide-react';
import AdScoutView from '@/components/AdScoutView';
import CampagnesView from '@/components/CampagnesView';
import CommentairesView from '@/components/CommentairesView';
import ScrapifyView from '@/components/ScrapifyView';
import { Dropdown } from '@/components/ui/Dropdown';

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
  { icon: FolderOpen, label: 'Campagnes', path: '#/campaigns' },
  { icon: ShoppingBag, label: 'Ma Boutique', path: '#/my-store' },
  { icon: BarChart2, label: 'Analytics', path: '#/analytics', badge: 'PRO' },
  { icon: Sparkles, label: 'Insights', path: '#/insights', badge: 'PRO' },
  { icon: Image, label: 'Créatifs', path: '#/creatives', badge: 'PRO' },
  { icon: MessageSquare, label: 'Commentaires', path: '#/comments' },
  { icon: LifeBuoy, label: 'Support', path: '#/support' },
];

const TOOLS_ITEMS = [
  { icon: FolderOpen, label: 'AfriVault', path: '#/afrivault', badge: 'PRO', count: 523 },
  { icon: Search, label: 'AdScout', path: '#/adscout' },
  { icon: Package, label: 'Scrapify', path: '#/scrapify' },
  { icon: Play, label: 'Guides', path: '#/guides' },
];

const SPECIAL_ITEMS = [
  { icon: Video, label: 'UGC à 1€', path: '#/ugc', highlight: true, soon: true },
];

const LANDING_FEATURES = [
  { icon: Palette, title: 'Templates AfriVault', desc: '+500 templates publicitaires optimisés pour le marché africain. Beauté, mode, food, électronique.' },
  { icon: Store, title: 'Connexion Shopify', desc: 'Connecte ta boutique en un clic. On récupère tes produits automatiquement.' },
  { icon: Rocket, title: 'Lancement de campagnes Meta', desc: 'Crée et lance tes campagnes Facebook/Instagram directement depuis AdsPilot. Plus besoin du Gestionnaire de Publicités.' },
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
            <div className="w-8 h-8 rounded-lg bg-[#5A5AFB]/15 flex items-center justify-center">
              <User className="w-4 h-4 text-[#5A5AFB]" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-white">Profil</div>
              <div className="text-xs text-gray-500">Gérer ton compte</div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-[#5A5AFB] transition-colors" />
          </Link>

          <div className="h-px bg-white/[0.06]" />

          <Link
            href="#/settings/billing"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-all group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-[#5A5AFB]/15 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-[#5A5AFB]" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-white">Abonnement</div>
              <div className="text-xs text-gray-500">9,99€/mois</div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-[#5A5AFB] transition-colors" />
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
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#5A5AFB] to-[#9C5DFF] flex items-center justify-center text-white font-semibold text-sm shrink-0">
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
// NOTIFICATION CENTER
// ============================================
function NotificationCenter({ session, navigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [ticketNotifications, setTicketNotifications] = useState([]);
  const menuRef = useRef(null);

  // Fetch ticket notifications
  useEffect(() => {
    if (!session) return;
    
    const fetchTicketNotifications = async () => {
      try {
        const response = await fetch('/api/tickets', {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        });
        const data = await response.json();
        
        if (data.tickets) {
          // Filter tickets with unread messages
          const unreadTickets = data.tickets.filter(t => t.unread_by_user > 0);
          
          const ticketNotifs = unreadTickets.map(ticket => ({
            id: `ticket-${ticket.id}`,
            type: 'ticket',
            ticketId: ticket.id,
            title: 'Nouveau message',
            message: `Ticket #${ticket.id.slice(0, 8)} - ${ticket.title}`,
            time: formatTimeAgo(ticket.updated_at),
            unread: true
          }));
          
          setTicketNotifications(ticketNotifs);
        }
      } catch (error) {
        console.error('Error fetching ticket notifications:', error);
      }
    };

    fetchTicketNotifications();
    // Refresh every 30 seconds
    const interval = setInterval(fetchTicketNotifications, 30000);
    return () => clearInterval(interval);
  }, [session]);

  // Combine all notifications
  const allNotifications = [...ticketNotifications, ...notifications];
  const unreadCount = allNotifications.filter(n => n.unread).length;

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
    setTicketNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const handleNotificationClick = (notif) => {
    // Marquer comme lu
    if (notif.type === 'ticket') {
      setTicketNotifications(prev => prev.map(n =>
        n.id === notif.id ? { ...n, unread: false } : n
      ));
      // Redirect to ticket detail
      if (navigate) {
        navigate(`#/support/tickets/${notif.ticketId}`);
      } else {
        window.location.hash = `#/support/tickets/${notif.ticketId}`;
      }
    } else {
      setNotifications(prev => prev.map(n =>
        n.id === notif.id ? { ...n, unread: false } : n
      ));
    }
    setIsOpen(false);
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const viewAllNotifications = () => {
    console.log('View all notifications');
    setIsOpen(false);
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
            {allNotifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Aucune notification</p>
              </div>
            ) : (
              allNotifications.map(notif => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/[0.04] cursor-pointer ${
                    notif.unread ? 'bg-white/[0.02]' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      notif.type === 'ticket' ? 'bg-[#5A5AFB]/15 text-[#5A5AFB]' :
                      notif.type === 'success' ? 'bg-green-500/15 text-green-400' :
                      notif.type === 'warning' ? 'bg-amber-500/15 text-amber-400' :
                      'bg-blue-500/15 text-blue-400'
                    }`}>
                      {notif.type === 'ticket' ? <MessageSquare className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-medium text-white">{notif.title}</p>
                        {notif.unread && <span className="w-2 h-2 rounded-full bg-brand" />}
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-2">{notif.message}</p>
                      <p className="text-xs text-gray-600 mt-1">{notif.time}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {allNotifications.length > 0 && (
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
function Sidebar({ currentPath, user, onLogout, session }) {
  const [collapsed, setCollapsed] = useState(false);
  const [unreadTicketsCount, setUnreadTicketsCount] = useState(0);

  // Fetch unread tickets count
  useEffect(() => {
    if (!session) return;
    
    const fetchUnreadCount = async () => {
      try {
        const response = await fetch('/api/tickets', {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        });
        const data = await response.json();
        
        if (data.tickets) {
          const unreadCount = data.tickets.reduce((sum, ticket) => sum + (ticket.unread_by_user || 0), 0);
          setUnreadTicketsCount(unreadCount);
        }
      } catch (error) {
        console.error('Error fetching unread tickets count:', error);
      }
    };

    fetchUnreadCount();
    // Refresh every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [session]);
  
  const NavItem = ({ item, isActive }) => {
    const isDisabled = item.soon && !item.highlight;
    const isSupportItem = item.path === '#/support';
    const displayCount = isSupportItem && unreadTicketsCount > 0 ? unreadTicketsCount : item.count;
    
    return (
      <Link
        href={isDisabled ? undefined : item.path}
        onClick={isDisabled ? (e) => e.preventDefault() : undefined}
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group relative',
          isActive
            ? 'bg-[#5A5AFB]/15 text-[#5A5AFB]'
            : item.highlight
            ? 'bg-gradient-to-r from-[#5A5AFB] to-[#9C5DFF] text-white hover:opacity-90 cursor-pointer'
            : isDisabled
            ? 'text-gray-600 cursor-not-allowed'
            : 'text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer'
        )}
      >
        <item.icon className="w-[18px] h-[18px] shrink-0" />
        <span className="text-[13px] font-medium flex-1">{item.label}</span>
        {item.badge === 'PRO' && (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#5A5AFB]/20 text-[#5A5AFB]">PRO</span>
        )}
        {item.soon && !item.highlight && (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-400">SOON</span>
        )}
        {displayCount && (
          <span className={cn(
            "px-1.5 py-0.5 rounded text-[10px] font-medium",
            isSupportItem && unreadTicketsCount > 0
              ? "bg-red-500 text-white"
              : "bg-white/10 text-gray-300"
          )}>{displayCount}</span>
        )}
      </Link>
    );
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-[200px] flex flex-col z-50 font-onest transition-colors duration-200" style={{ backgroundColor: '#0A0A0F', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Logo */}
      <div className="px-4 h-16 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="#/dashboard" className="flex items-center gap-2.5 cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#5A5AFB] to-[#9C5DFF] flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-[15px] font-syne">AdsPilot</span>
        </Link>
        <button className="w-7 h-7 rounded-md flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
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
          <p className="px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Outils</p>
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
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="#/settings" className={cn(
          'flex items-center gap-3 px-4 py-3 transition-colors cursor-pointer',
          currentPath?.startsWith('#/settings') ? 'text-[#5A5AFB]' : 'text-gray-400 hover:text-white'
        )}>
          <div className="relative">
            <Globe className="w-[18px] h-[18px]" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500 border-2" style={{ borderColor: '#0A0A0F' }} />
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
function TopNav({ title, subtitle, showDatePicker = false, session, navigate }) {
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
      <header className="sticky top-0 z-40 backdrop-blur-xl transition-colors duration-200" style={{ backgroundColor: 'rgba(10,10,15,0.95)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white font-syne">{title}</h1>
          {subtitle && <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3">
          {/* Notification Center */}
          <NotificationCenter session={session} navigate={navigate} />
          {showDatePicker && (
            <>
              {/* Period Selector */}
              <div className="inline-flex items-center bg-white/5 rounded-lg border border-white/10 p-0.5">
                {periods.map(p => (
                  <button
                    key={p}
                    onClick={() => setSelectedPeriod(p)}
                    className={cn(
                      'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                      selectedPeriod === p
                        ? 'bg-[#5A5AFB] text-white shadow-sm'
                        : 'text-gray-400 hover:text-white'
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
              {/* Date Range */}
              <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-400 hover:text-white hover:border-white/20 transition-colors">
                <Clock className="w-4 h-4" />
                <span>{dateRange || 'Chargement...'}</span>
              </button>
              {/* Location */}
              <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-400 hover:text-white hover:border-white/20 transition-colors">
                <Globe className="w-4 h-4" />
                <span className="capitalize">{location}</span>
              </button>
            </>
          )}
          {/* Refresh */}
          <button onClick={() => window.location.reload()} className="inline-flex w-9 h-9 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-colors">
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
function DashboardLayout({ children, user, currentPath, onLogout, session, navigate }) {
  const pageConfigs = {
    '#/dashboard': { title: 'Dashboard', subtitle: 'Vue d\'ensemble de tes performances publicitaires', showDatePicker: true },
    '#/afrivault': { title: 'AfriVault', subtitle: 'Parcours les templates gagnants', showDatePicker: false },
    '#/my-store': { title: 'Ma Boutique', subtitle: 'Gère ta connexion Shopify', showDatePicker: false },
    '#/settings': { title: 'Paramètres', subtitle: 'Gère ton profil et tes préférences', showDatePicker: false },
    '#/settings/billing': { title: 'Abonnement', subtitle: 'Gère ton plan AdsPilot', showDatePicker: false },
    '#/analytics': { title: 'Analytics', subtitle: 'Suis tes performances', showDatePicker: true },
    '#/adscout': { title: 'AdScout', subtitle: 'Espionne les pubs des concurrents', showDatePicker: false },
    '#/scrapify': { title: 'Scrapify', subtitle: 'Importe des produits Shopify concurrents', showDatePicker: false },
    '#/ugc': { title: 'UGC Studio', subtitle: 'Crée du contenu UGC', showDatePicker: false },
    '#/campaigns': { title: 'Campagnes', subtitle: 'Gère tes campagnes publicitaires', showDatePicker: true },
    '#/insights': { title: 'Insights', subtitle: 'Recommandations IA', showDatePicker: false },
    '#/creatives': { title: 'Créatifs', subtitle: 'Ta bibliothèque de pubs', showDatePicker: false },
    '#/comments': { title: 'Commentaires', subtitle: 'Gère les commentaires de tes pubs', showDatePicker: false },
    '#/guides': { title: 'Guides', subtitle: 'Apprends à scaler tes pubs', showDatePicker: false },
    '#/support': { title: 'Support', subtitle: 'Mes tickets de support', showDatePicker: false },
    '#/admin/tickets': { title: 'Gestion des Tickets', subtitle: 'Gérer tous les tickets de support', showDatePicker: false },
  };
  const config = pageConfigs[currentPath] || pageConfigs['#/dashboard'];
  
  return (
    <div className="min-h-screen font-onest transition-colors duration-200" style={{ backgroundColor: '#070B14' }}>
      <Sidebar currentPath={currentPath} user={user} onLogout={onLogout} session={session} />
      <div className="ml-[200px]">
        <TopNav title={config.title} subtitle={config.subtitle} showDatePicker={config.showDatePicker} session={session} navigate={navigate} />
        <main className="p-6 animate-fade-in">
          <div className="max-w-[1280px] mx-auto">
            {children}
          </div>
        </main>
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

  const steps = [
    { num: '01', icon: Store, title: 'Connecte ta boutique', desc: 'Lie ta boutique Shopify en un clic. Import automatique de tes produits.' },
    { num: '02', icon: Layers, title: 'Choisis ton template', desc: 'Parcours +500 templates AfriVault optimisés pour le marché africain.' },
    { num: '03', icon: Rocket, title: 'Lance ta campagne Meta', desc: 'Crée et lance ta campagne Facebook/Instagram directement depuis AdsPilot. Budget, ciblage, tout est géré en un seul endroit.' },
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

  // Scroll reveal effect
  useEffect(() => {
    // Wait for DOM to be ready
    const timer = setTimeout(() => {
      const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      }, observerOptions);

      const revealElements = document.querySelectorAll('.scroll-reveal');
      console.log('Scroll reveal elements found:', revealElements.length);
      revealElements.forEach(el => observer.observe(el));

      return () => {
        revealElements.forEach(el => observer.unobserve(el));
      };
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen font-onest bg-grid" style={{ backgroundColor: '#070B14' }}>
      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-50 pt-5 pb-5">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="bg-white/[0.08] backdrop-blur-xl border border-white/[0.1] rounded-full px-6 py-3 flex items-center justify-between shadow-lg">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#5A5AFB] to-[#9C5DFF] flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-syne font-bold text-lg">AdsPilot</span>
            </div>

            {/* Navigation centrale */}
            <nav className="hidden md:flex items-center gap-8">
              <button
                onClick={() => document.getElementById('fonctionnalites')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-300 hover:text-white text-sm font-medium transition-colors cursor-pointer"
              >
                Fonctionnalités
              </button>
              <button
                onClick={() => document.getElementById('tarifs')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-300 hover:text-white text-sm font-medium transition-colors cursor-pointer"
              >
                Tarifs
              </button>
              <button
                onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-300 hover:text-white text-sm font-medium transition-colors cursor-pointer"
              >
                FAQ
              </button>
            </nav>

            {/* CTA Buttons */}
            <div className="flex items-center gap-2">
              <a
                href="#/login"
                className="px-5 py-2 rounded-full border border-white/20 text-white text-sm font-medium hover:bg-white/5 transition-all"
              >
                Se connecter
              </a>
              <a
                href="#/register"
                className="px-5 py-2 rounded-full bg-gradient-to-r from-[#5A5AFB] to-[#9C5DFF] text-white text-sm font-semibold hover:opacity-90 transition-all flex items-center gap-1.5"
              >
                Essai gratuit
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-[#5A5AFB]/[0.06] blur-[150px] pointer-events-none" />
        <div className="max-w-[1280px] mx-auto px-6 pt-16 pb-12 md:pt-20 md:pb-16">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="animate-fadeInUp">
              <h1
                className="font-syne font-bold text-white leading-[1.1] tracking-tight break-words max-w-[34rem]"
                style={{ fontSize: 'clamp(32px, 4.3vw, 48px)' }}
              >
                Crée des pubs qui{' '}
                <span className="bg-gradient-to-r from-[#5A5AFB] to-[#9C5DFF] bg-clip-text text-transparent">convertissent</span>
                {' '}pour le marché africain.
              </h1>
              <p className="text-gray-400 mt-6 text-[15px] leading-relaxed max-w-[440px] opacity-0 animate-fadeInUp animation-delay-200">
                +500 templates optimisés, connexion Shopify, lancement de campagnes Meta intégré — crée et lance tes pubs Facebook/Instagram en 5 minutes, sans quitter AdsPilot.
              </p>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 opacity-0 animate-fadeInUp animation-delay-300">
                {['+500 templates', 'Lancement campagnes Meta', 'Connexion Shopify', 'Setup 5 min'].map(f => (
                  <span key={f} className="flex items-center gap-2 text-sm text-gray-400">
                    <Check className="w-3.5 h-3.5 text-[#5A5AFB]" />{f}
                  </span>
                ))}
              </div>
              <a href="#/register" className="hidden md:inline-flex items-center gap-2 mt-10 px-7 py-3 rounded-lg bg-gradient-to-r from-[#5A5AFB] to-[#9C5DFF] text-white text-sm font-medium hover:opacity-90 transition-all opacity-0 animate-fadeInUp animation-delay-400">
                Démarrer gratuitement <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            {/* Right card */}
            <div className="relative opacity-0 animate-fadeInUp animation-delay-200">
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
      <div className="max-w-[1280px] mx-auto px-6 pb-8">
        <div className="flex items-center justify-center opacity-0 animate-fadeIn animation-delay-500">
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
      <div className="border-t border-b border-white/[0.04] py-8">
        <div className="max-w-[1280px] mx-auto overflow-hidden relative">
          {/* Gradient overlays for fade effect - horizontal (larger) */}
          <div className="absolute left-0 top-0 bottom-0 w-48 bg-gradient-to-r from-[#070B14] via-[#070B14]/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-48 bg-gradient-to-l from-[#070B14] via-[#070B14]/80 to-transparent z-10 pointer-events-none" />

          <div className="flex items-center gap-8 opacity-30 animate-scroll whitespace-nowrap">
            {/* Duplicate logos for infinite scroll effect */}
            {[...Array(3)].map((_, groupIndex) => (
              <div key={groupIndex} className="flex items-center gap-8 shrink-0">
                {['Shopify', 'Canva', 'Meta Ads', 'Instagram', 'Facebook', 'WhatsApp', 'TikTok'].map((n, i) => (
                  <span key={`${groupIndex}-${i}`} className="text-white font-syne font-semibold text-base shrink-0">{n}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== STEPS ===== */}
      <section className="py-12 scroll-reveal">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-start">
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
      <section className="py-12 scroll-reveal">
        <div className="max-w-[1280px] mx-auto px-6">
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
      <section id="fonctionnalites" className="py-12 scroll-reveal">
        <div className="max-w-[1280px] mx-auto px-6">
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
            <div className="relative h-[600px] overflow-hidden rounded-2xl">
              {/* Gradient overlays for fade effect - vertical */}
              <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-[#070B14] to-transparent z-10 pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#070B14] to-transparent z-10 pointer-events-none" />

              {/* Scrolling container - vertical */}
              <div className="grid grid-cols-2 gap-3 animate-scroll-vertical">
                {/* Duplicate templates for seamless infinite scroll */}
                {[...MOCK_TEMPLATES, ...MOCK_TEMPLATES, ...MOCK_TEMPLATES].map((t, index) => (
                  <div
                    key={`${t.id}-${index}`}
                    className="relative group rounded-xl overflow-hidden border border-white/[0.06] hover:border-[#5A5AFB]/30 transition-all"
                  >
                    {/* Image with hover overlay */}
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={t.preview_url}
                        alt={t.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <p className="text-white text-sm font-medium">{t.description}</p>
                      </div>
                    </div>

                    {/* Card footer */}
                    <div className="p-2.5 bg-white/[0.02] group-hover:bg-white/[0.04] transition-colors">
                      <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded', NICHE_CONFIG[t.niche]?.bg, NICHE_CONFIG[t.niche]?.text)}>
                        {NICHE_CONFIG[t.niche]?.label}
                      </span>
                      <p className="text-white text-xs mt-1 truncate">{t.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CAMPAIGN LAUNCH FEATURE ===== */}
      <section className="py-12 scroll-reveal">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative h-[500px] rounded-2xl overflow-hidden border border-white/[0.08] bg-gradient-to-br from-[#5A5AFB]/10 to-[#9C5DFF]/5 p-8 flex items-center justify-center">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#5A5AFB] to-[#9C5DFF] flex items-center justify-center">
                  <Rocket className="w-10 h-10 text-white" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span>Campagne configurée</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span>Budget défini: 50€/jour</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span>Audience ciblée: 25-45 ans</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span>Créatif sélectionné</span>
                  </div>
                </div>
                <button className="mt-6 px-8 py-3 rounded-lg bg-gradient-to-r from-[#5A5AFB] to-[#9C5DFF] text-white text-sm font-semibold hover:opacity-90 transition-all flex items-center gap-2 mx-auto">
                  <Rocket className="w-4 h-4" />
                  Lancer la campagne
                </button>
              </div>
            </div>
            <div>
              <p className="text-[#5A5AFB] text-xs font-semibold uppercase tracking-[0.15em]">Lancement de campagnes</p>
              <h2
                className="font-syne font-bold text-white mt-4 leading-[1.15] tracking-tight break-words max-w-[34rem]"
                style={{ fontSize: 'clamp(24px, 3.2vw, 36px)' }}
              >
                Lance tes campagnes Meta{' '}
                <span className="bg-gradient-to-r from-[#5A5AFB] to-[#9C5DFF] bg-clip-text text-transparent">directement depuis AdsPilot</span>
              </h2>
              <p className="text-gray-500 mt-5 text-[15px] leading-relaxed max-w-sm">
                Plus besoin de jongler entre plusieurs outils. Crée, configure et lance tes campagnes Facebook et Instagram en quelques clics, tout depuis ton dashboard AdsPilot.
              </p>
              <div className="mt-8 space-y-3">
                {[
                  'Configuration campagne en 2 minutes',
                  'Ciblage audience simplifié',
                  'Gestion budget et enchères',
                  'Lancement direct sur Meta',
                  'Suivi performances en temps réel'
                ].map(f => (
                  <div key={f} className="flex items-center gap-2.5">
                    <Check className="w-3.5 h-3.5 text-[#5A5AFB] shrink-0" />
                    <span className="text-gray-400 text-sm">{f}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-4 rounded-xl bg-[#5A5AFB]/5 border border-[#5A5AFB]/20">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-[#5A5AFB] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white text-sm font-medium mb-1">Tout-en-un</p>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      Fini le Gestionnaire de Publicités Meta complexe. AdsPilot simplifie tout le processus pour que tu puisses te concentrer sur tes ventes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== COMPARISON ===== */}
      <section className="py-12 scroll-reveal">
        <div className="max-w-[900px] mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-[#5A5AFB] text-xs font-semibold uppercase tracking-[0.15em]">Comparaison</p>
            <h2
              className="font-syne font-bold text-white mt-4 tracking-tight break-words mx-auto"
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
      <section className="py-12 scroll-reveal">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-[#5A5AFB] text-xs font-semibold uppercase tracking-[0.15em]">Témoignages</p>
            <h2
              className="font-syne font-bold text-white mt-4 tracking-tight break-words mx-auto"
              style={{ fontSize: 'clamp(24px, 3.2vw, 36px)' }}
            >
              Ils nous font{' '}
              <span className="bg-gradient-to-r from-[#5A5AFB] to-[#9C5DFF] bg-clip-text text-transparent">confiance</span>
            </h2>
          </div>

          <div className="relative overflow-hidden">
            {/* Gradient overlays for fade effect - horizontal */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#070B14] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#070B14] to-transparent z-10 pointer-events-none" />

            {/* Scrolling container - horizontal with 2 rows */}
            <div className="flex flex-col gap-4">
              {/* Row 1 */}
              <div className="flex gap-4 animate-scroll-testimonials">
                {[...testimonials.filter((_, i) => i % 2 === 0), ...testimonials.filter((_, i) => i % 2 === 0), ...testimonials.filter((_, i) => i % 2 === 0)].map((t, index) => (
                  <div
                    key={`row1-${t.name}-${index}`}
                    className="shrink-0 w-[450px] p-6 rounded-xl border border-white/[0.06] bg-white/[0.01] hover:border-[#5A5AFB]/20 hover:bg-white/[0.02] transition-all"
                  >
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

              {/* Row 2 */}
              <div className="flex gap-4 animate-scroll-testimonials-reverse">
                {[...testimonials.filter((_, i) => i % 2 === 1), ...testimonials.filter((_, i) => i % 2 === 1), ...testimonials.filter((_, i) => i % 2 === 1)].map((t, index) => (
                  <div
                    key={`row2-${t.name}-${index}`}
                    className="shrink-0 w-[450px] p-6 rounded-xl border border-white/[0.06] bg-white/[0.01] hover:border-[#5A5AFB]/20 hover:bg-white/[0.02] transition-all"
                  >
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
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="tarifs" className="py-16 scroll-reveal">
        <div className="max-w-[1000px] mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-[#5A5AFB] text-xs font-semibold uppercase tracking-[0.15em]">Tarifs</p>
            <h2
              className="font-syne font-bold text-white mt-4 tracking-tight break-words mx-auto"
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
      <section id="faq" className="py-12 scroll-reveal">
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
      <section className="py-8 relative overflow-hidden">
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
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#5A5AFB] to-[#9C5DFF] flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-white font-syne font-bold">AdsPilot</span>
          </div>
          <div className="flex items-center gap-5 text-xs text-gray-600">
            <a href="#/terms" className="hover:text-gray-400 transition-colors">Conditions</a>
            <a href="#/privacy" className="hover:text-gray-400 transition-colors">Confidentialité</a>
            <a href="#/contact" className="hover:text-gray-400 transition-colors">Contact</a>
          </div>
          <p className="text-gray-700 text-xs">© 2025 AdsPilot</p>
        </div>
      </footer>
    </div>
  );
}

// ============================================
// TERMS OF SERVICE PAGE
// ============================================
function TermsPage() {
  return (
    <div className="min-h-screen font-onest bg-grid" style={{ backgroundColor: '#070B14' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 pt-5 pb-5">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="bg-white/[0.08] backdrop-blur-xl border border-white/[0.1] rounded-full px-6 py-3 flex items-center justify-between shadow-lg">
            <a href="#/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#5A5AFB] to-[#9C5DFF] flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-syne font-bold text-lg">AdsPilot</span>
            </a>
            <a href="#/" className="text-gray-400 hover:text-white text-sm transition-colors">← Retour</a>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-[900px] mx-auto px-6 py-16">
        <h1 className="font-syne font-bold text-white text-4xl mb-8">Conditions Générales d'Utilisation</h1>
        
        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-white font-semibold text-xl mb-4">1. Acceptation des conditions</h2>
            <p>En accédant et en utilisant AdsPilot, vous acceptez d'être lié par ces conditions générales d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-xl mb-4">2. Description du service</h2>
            <p>AdsPilot est une plateforme SaaS qui permet aux e-commerçants de créer et gérer des campagnes publicitaires Meta (Facebook/Instagram) avec des templates optimisés pour le marché africain.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-xl mb-4">3. Compte utilisateur</h2>
            <p>Vous êtes responsable de maintenir la confidentialité de votre compte et mot de passe. Vous acceptez de nous notifier immédiatement de toute utilisation non autorisée de votre compte.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-xl mb-4">4. Utilisation du service</h2>
            <p>Vous vous engagez à utiliser AdsPilot uniquement à des fins légales et conformément à toutes les lois applicables. Vous ne devez pas :</p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
              <li>Utiliser le service pour des activités frauduleuses ou illégales</li>
              <li>Partager votre compte avec des tiers</li>
              <li>Tenter de contourner les mesures de sécurité</li>
              <li>Utiliser le service pour envoyer du spam ou du contenu malveillant</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-xl mb-4">5. Propriété intellectuelle</h2>
            <p>Tous les templates, designs et contenus fournis par AdsPilot restent notre propriété intellectuelle. Vous disposez d'une licence d'utilisation limitée pour créer vos campagnes publicitaires.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-xl mb-4">6. Paiements et abonnements</h2>
            <p>Les frais d'abonnement sont facturés mensuellement ou annuellement selon votre choix. Vous pouvez annuler votre abonnement à tout moment depuis votre tableau de bord.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-xl mb-4">7. Limitation de responsabilité</h2>
            <p>AdsPilot est fourni "tel quel". Nous ne garantissons pas que le service sera ininterrompu ou exempt d'erreurs. Nous ne sommes pas responsables des pertes ou dommages résultant de l'utilisation de notre service.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-xl mb-4">8. Modifications</h2>
            <p>Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications seront effectives dès leur publication sur cette page.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-xl mb-4">9. Contact</h2>
            <p>Pour toute question concernant ces conditions, contactez-nous à : <a href="#/contact" className="text-[#5A5AFB] hover:underline">contact@adspilot.com</a></p>
          </section>

          <p className="text-gray-500 text-sm mt-12">Dernière mise à jour : 10 avril 2026</p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// PRIVACY POLICY PAGE
// ============================================
function PrivacyPage() {
  return (
    <div className="min-h-screen font-onest bg-grid" style={{ backgroundColor: '#070B14' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 pt-5 pb-5">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="bg-white/[0.08] backdrop-blur-xl border border-white/[0.1] rounded-full px-6 py-3 flex items-center justify-between shadow-lg">
            <a href="#/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#5A5AFB] to-[#9C5DFF] flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-syne font-bold text-lg">AdsPilot</span>
            </a>
            <a href="#/" className="text-gray-400 hover:text-white text-sm transition-colors">← Retour</a>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-[900px] mx-auto px-6 py-16">
        <h1 className="font-syne font-bold text-white text-4xl mb-8">Politique de Confidentialité</h1>
        
        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-white font-semibold text-xl mb-4">1. Collecte des données</h2>
            <p>Nous collectons les informations suivantes lorsque vous utilisez AdsPilot :</p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
              <li>Informations de compte (nom, email, mot de passe)</li>
              <li>Informations de paiement (traitées par Stripe)</li>
              <li>Données d'utilisation (templates utilisés, campagnes créées)</li>
              <li>Données de connexion Shopify et Meta (tokens d'accès)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-xl mb-4">2. Utilisation des données</h2>
            <p>Nous utilisons vos données pour :</p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
              <li>Fournir et améliorer nos services</li>
              <li>Gérer votre compte et vos abonnements</li>
              <li>Vous envoyer des notifications importantes</li>
              <li>Analyser l'utilisation de la plateforme</li>
              <li>Assurer la sécurité de nos services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-xl mb-4">3. Partage des données</h2>
            <p>Nous ne vendons jamais vos données personnelles. Nous partageons vos données uniquement avec :</p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
              <li>Shopify (pour la connexion de votre boutique)</li>
              <li>Meta (pour la création de campagnes publicitaires)</li>
              <li>Stripe (pour le traitement des paiements)</li>
              <li>Supabase (notre hébergeur de base de données)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-xl mb-4">4. Sécurité</h2>
            <p>Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données :</p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
              <li>Chiffrement SSL/TLS pour toutes les communications</li>
              <li>Tokens d'accès stockés de manière sécurisée</li>
              <li>Authentification sécurisée avec Supabase</li>
              <li>Sauvegardes régulières</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold text-xl mb-4">5. Vos droits</h2>
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
              <li>Droit d'accès à vos données</li>
              <li>Droit de rectification</li>
              <li>Droit à l'effacement</li>
              <li>Droit à la portabilité</li>
              <li>Droit d'opposition</li>
            </ul>
            <p className="mt-4">Pour exercer ces droits, contactez-nous à : <a href="#/contact" className="text-[#5A5AFB] hover:underline">privacy@adspilot.com</a></p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-xl mb-4">6. Cookies</h2>
            <p>Nous utilisons des cookies essentiels pour le fonctionnement du service (authentification, préférences). Vous pouvez désactiver les cookies dans votre navigateur, mais cela peut affecter certaines fonctionnalités.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-xl mb-4">7. Conservation des données</h2>
            <p>Nous conservons vos données tant que votre compte est actif. Après suppression de votre compte, vos données sont supprimées dans un délai de 30 jours.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold text-xl mb-4">8. Modifications</h2>
            <p>Nous pouvons modifier cette politique de confidentialité à tout moment. Les modifications seront publiées sur cette page avec une nouvelle date de mise à jour.</p>
          </section>

          <p className="text-gray-500 text-sm mt-12">Dernière mise à jour : 10 avril 2026</p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// CONTACT PAGE
// ============================================
function ContactPage({ showToast }) {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    
    // Simulate sending
    setTimeout(() => {
      showToast('Message envoyé ! Nous vous répondrons sous 24h.', 'success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSending(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen font-onest bg-grid" style={{ backgroundColor: '#070B14' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 pt-5 pb-5 bg-[#070B14]/80 backdrop-blur-xl">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="bg-white/[0.12] backdrop-blur-xl border border-white/[0.15] rounded-full px-6 py-3 flex items-center justify-between shadow-lg">
            <a href="#/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#5A5AFB] to-[#9C5DFF] flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-syne font-bold text-lg">AdsPilot</span>
            </a>
            <a href="#/" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">← Retour</a>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-[900px] mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="font-syne font-bold text-white text-5xl mb-4">Contactez-nous</h1>
          <p className="text-gray-300 text-xl">Une question ? Un problème ? Notre équipe est là pour vous aider.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-[#12121A] border border-white/[0.12] rounded-2xl p-6 hover:border-[#5A5AFB]/30 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5A5AFB] to-[#9C5DFF] flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">Email</h3>
                  <p className="text-gray-300 text-sm font-medium">support@adspilot.com</p>
                  <p className="text-gray-400 text-xs mt-1">Réponse sous 24h</p>
                </div>
              </div>
            </div>

            <div className="bg-[#12121A] border border-white/[0.12] rounded-2xl p-6 hover:border-[#5A5AFB]/30 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5A5AFB] to-[#9C5DFF] flex items-center justify-center shrink-0">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">Support</h3>
                  <p className="text-gray-300 text-sm font-medium">Chat en direct disponible</p>
                  <p className="text-gray-400 text-xs mt-1">Lun-Ven 9h-18h GMT</p>
                </div>
              </div>
            </div>

            <div className="bg-[#12121A] border border-white/[0.12] rounded-2xl p-6 hover:border-[#5A5AFB]/30 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5A5AFB] to-[#9C5DFF] flex items-center justify-center shrink-0">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">Réseaux sociaux</h3>
                  <div className="flex gap-3 mt-2">
                    <a href="#" className="text-gray-300 hover:text-[#5A5AFB] font-medium transition-colors">Twitter</a>
                    <a href="#" className="text-gray-300 hover:text-[#5A5AFB] font-medium transition-colors">LinkedIn</a>
                    <a href="#" className="text-gray-300 hover:text-[#5A5AFB] font-medium transition-colors">Instagram</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="bg-[#12121A] border border-white/[0.12] rounded-2xl p-8 space-y-5">
            <div>
              <label className="text-white text-sm font-semibold mb-2 block">Nom</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/[0.08] border border-white/[0.15] text-white placeholder:text-gray-400 focus:border-[#5A5AFB] focus:outline-none focus:ring-2 focus:ring-[#5A5AFB]/20 transition-all"
                placeholder="Votre nom"
              />
            </div>

            <div>
              <label className="text-white text-sm font-semibold mb-2 block">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/[0.08] border border-white/[0.15] text-white placeholder:text-gray-400 focus:border-[#5A5AFB] focus:outline-none focus:ring-2 focus:ring-[#5A5AFB]/20 transition-all"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label className="text-white text-sm font-semibold mb-2 block">Sujet</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/[0.08] border border-white/[0.15] text-white placeholder:text-gray-400 focus:border-[#5A5AFB] focus:outline-none focus:ring-2 focus:ring-[#5A5AFB]/20 transition-all"
                placeholder="De quoi s'agit-il ?"
              />
            </div>

            <div>
              <label className="text-white text-sm font-semibold mb-2 block">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={5}
                className="w-full px-4 py-3 rounded-lg bg-white/[0.08] border border-white/[0.15] text-white placeholder:text-gray-400 focus:border-[#5A5AFB] focus:outline-none focus:ring-2 focus:ring-[#5A5AFB]/20 transition-all resize-none"
                placeholder="Décrivez votre demande..."
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full py-3.5 rounded-lg bg-gradient-to-r from-[#5A5AFB] to-[#9C5DFF] text-white font-semibold hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#5A5AFB]/25"
            >
              {sending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Envoyer le message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
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
  const [showPassword, setShowPassword] = useState(false);

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

  const handleOAuth = async (provider) => {
    if (provider === 'tiktok') { showToast('Connexion TikTok bientôt disponible', 'info'); return; }
    if (!supabase) { showToast('Supabase non configuré', 'error'); return; }
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: typeof window !== 'undefined' ? window.location.origin : '' }
    });
    if (error) showToast(error.message, 'error');
  };

  return (
    <div className="min-h-screen flex bg-grid" style={{ backgroundColor: '#070B14' }}>
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 lg:px-16 xl:px-24">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-12">
            <a href="#/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5A5AFB] to-[#9C5DFF] flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-xl font-syne">AdsPilot</span>
            </a>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2 font-syne">
            Bon retour parmi nous 👋
          </h1>
          <p className="text-gray-400 mb-8">
            Connecte-toi pour retrouver tes contenus et continuer à créer.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="dodjiq@gmail.com"
                required
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#5A5AFB] focus:ring-2 focus:ring-[#5A5AFB]/20 text-sm transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">Mot de passe</label>
                <a href="#/forgot-password" className="text-sm text-[#5A5AFB] hover:text-[#9C5DFF] transition-colors">
                  Mot de passe oublié ?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••••"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#5A5AFB] focus:ring-2 focus:ring-[#5A5AFB]/20 text-sm transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-lg bg-gradient-to-r from-[#5A5AFB] to-[#9C5DFF] text-white font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#5A5AFB]/25"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-gray-500 text-xs uppercase tracking-wider">ou continuer avec</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          {/* Social auth buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button type="button" onClick={() => handleOAuth('google')}
              className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all group">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors font-medium">Google</span>
            </button>

            <button type="button" onClick={() => handleOAuth('facebook')}
              className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-[#1877F2]/20 hover:border-[#1877F2]/40 transition-all group">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors font-medium">Facebook</span>
            </button>

            <button type="button" onClick={() => handleOAuth('tiktok')}
              className="relative flex items-center justify-center gap-2 py-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all group">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.04a8.16 8.16 0 004.77 1.52V7.12a4.85 4.85 0 01-1-.43z"/>
              </svg>
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors font-medium">TikTok</span>
              <span className="absolute -top-1.5 -right-1.5 text-[9px] bg-amber-500 text-black font-bold px-1 rounded-full leading-4">bientôt</span>
            </button>
          </div>

          <p className="text-center text-sm text-gray-400 mt-6">
            Nouveau sur AdsPilot ? <a href="#/register" className="text-[#5A5AFB] hover:text-[#9C5DFF] font-semibold transition-colors">Créer un compte</a>
          </p>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12 my-[15px] rounded-l-[2.5rem] bg-grid" style={{ backgroundColor: '#070B14' }}>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#5A5AFB]/20 via-[#7B6BFF]/10 to-[#9C5DFF]/20"></div>
        {/* Decorative circles */}
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-[#9C5DFF] opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-[#5A5AFB] opacity-15 blur-3xl"></div>
        
        {/* Content */}
        <div className="relative z-10 max-w-lg">
          <h2 className="text-4xl font-bold text-white mb-4 font-syne leading-tight">
            Tes campagnes Meta t'attendent
          </h2>
          <p className="text-white/90 text-lg mb-8 leading-relaxed">
            Reprends le contrôle de tes pubs et continue à générer des résultats.
          </p>

          {/* Testimonials Carousel */}
          <div className="relative overflow-hidden">
            <div className="flex gap-3 animate-scroll-testimonials">
              {[
                { name: "Amadou K.", role: "E-commerce Mode", quote: "AdsPilot a transformé mes campagnes. +250% de ROI en 2 mois !", avatar: "AK" },
                { name: "Fatou D.", role: "Boutique Cosmétiques", quote: "Interface simple, résultats incroyables. Je recommande à 100% !", avatar: "FD" },
                { name: "Ibrahim S.", role: "Sneakers Store", quote: "Mes pubs n'ont jamais été aussi performantes. Merci AdsPilot !", avatar: "IS" },
                { name: "Aïcha M.", role: "Bijoux Artisanaux", quote: "Le meilleur outil pour scaler mes campagnes Meta en Afrique.", avatar: "AM" }
              ].map((testimonial, index) => (
                <div key={index} className="shrink-0 w-[320px] bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl">
                  <div className="flex items-start gap-2.5 mb-2.5">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#5A5AFB] to-[#9C5DFF] flex items-center justify-center shrink-0">
                      <span className="text-white text-xs font-bold">{testimonial.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-xs">{testimonial.name}</h3>
                      <p className="text-gray-500 text-[10px]">{testimonial.role}</p>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 text-xs leading-relaxed">"{testimonial.quote}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
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
  const [showPassword, setShowPassword] = useState(false);

  // Password validation
  const passwordValidation = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const handleOAuth = async (provider) => {
    if (provider === 'tiktok') { showToast('Inscription TikTok bientôt disponible', 'info'); return; }
    if (!supabase) { showToast('Supabase non configuré', 'error'); return; }
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: typeof window !== 'undefined' ? window.location.origin : '' }
    });
    if (error) showToast(error.message, 'error');
  };

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
    <div className="min-h-screen flex bg-grid" style={{ backgroundColor: '#070B14' }}>
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 lg:px-16 xl:px-24">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-6">
            <a href="#/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5A5AFB] to-[#9C5DFF] flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-xl font-syne">AdsPilot</span>
            </a>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2 font-syne">
            Commence gratuitement
          </h1>
          <p className="text-gray-400 mb-5">
            Rejoins +500 e-commerçants qui transforment leurs pubs en opportunités.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nom complet</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Jean Dupont"
                required
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#5A5AFB] focus:ring-2 focus:ring-[#5A5AFB]/20 text-sm transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ton@email.com"
                required
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#5A5AFB] focus:ring-2 focus:ring-[#5A5AFB]/20 text-sm transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 6 caractères"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-[#5A5AFB] focus:ring-2 focus:ring-[#5A5AFB]/20 text-sm transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>
              <div className="mt-2">
                <p className="text-xs font-medium text-gray-400 mb-2">Exigences du mot de passe :</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <Check className={cn("w-3.5 h-3.5", passwordValidation.minLength ? "text-green-600" : "text-gray-600")} />
                    <span className={cn("text-xs", passwordValidation.minLength ? "text-green-600" : "text-gray-500")}>8+ caractères</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className={cn("w-3.5 h-3.5", passwordValidation.hasUpperCase ? "text-green-600" : "text-gray-600")} />
                    <span className={cn("text-xs", passwordValidation.hasUpperCase ? "text-green-600" : "text-gray-500")}>Majuscule</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className={cn("w-3.5 h-3.5", passwordValidation.hasLowerCase ? "text-green-600" : "text-gray-600")} />
                    <span className={cn("text-xs", passwordValidation.hasLowerCase ? "text-green-600" : "text-gray-500")}>Minuscule</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className={cn("w-3.5 h-3.5", passwordValidation.hasNumber ? "text-green-600" : "text-gray-600")} />
                    <span className={cn("text-xs", passwordValidation.hasNumber ? "text-green-600" : "text-gray-500")}>Chiffre</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className={cn("w-3.5 h-3.5", passwordValidation.hasSymbol ? "text-green-600" : "text-gray-600")} />
                    <span className={cn("text-xs", passwordValidation.hasSymbol ? "text-green-600" : "text-gray-500")}>Symbole</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-lg bg-gradient-to-r from-[#5A5AFB] to-[#9C5DFF] text-white font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#5A5AFB]/25"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {loading ? 'Création...' : 'Créer mon compte'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-gray-500 text-xs uppercase tracking-wider">ou continuer avec</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          {/* Social auth buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button type="button" onClick={() => handleOAuth('google')}
              className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all group">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors font-medium">Google</span>
            </button>

            <button type="button" onClick={() => handleOAuth('facebook')}
              className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-[#1877F2]/20 hover:border-[#1877F2]/40 transition-all group">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors font-medium">Facebook</span>
            </button>

            <button type="button" onClick={() => handleOAuth('tiktok')}
              className="relative flex items-center justify-center gap-2 py-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all group">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.04a8.16 8.16 0 004.77 1.52V7.12a4.85 4.85 0 01-1-.43z"/>
              </svg>
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors font-medium">TikTok</span>
              <span className="absolute -top-1.5 -right-1.5 text-[9px] bg-amber-500 text-black font-bold px-1 rounded-full leading-4">bientôt</span>
            </button>
          </div>

          <p className="text-center text-sm text-gray-400 mt-6">
            Déjà un compte ? <a href="#/login" className="text-[#5A5AFB] hover:text-[#9C5DFF] font-semibold transition-colors">Se connecter</a>
          </p>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12 my-[15px] rounded-l-[2.5rem] bg-grid" style={{ backgroundColor: '#070B14' }}>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#5A5AFB]/20 via-[#7B6BFF]/10 to-[#9C5DFF]/20"></div>
        {/* Decorative circles */}
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-[#9C5DFF] opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-[#5A5AFB] opacity-15 blur-3xl"></div>
        
        {/* Content */}
        <div className="relative z-10 max-w-lg">
          <h2 className="text-4xl font-bold text-white mb-4 font-syne leading-tight">
            Transforme tes pubs en machines à cash.
          </h2>
          <p className="text-white/90 text-lg mb-8 leading-relaxed">
            Rejoins des centaines d'e-commerçants africains qui utilisent AdsPilot pour scaler leurs campagnes Meta.
          </p>

          {/* Features List */}
          <div className="space-y-3">
            {[
              { icon: Target, text: 'Créatifs gagnants testés en Afrique' },
              { icon: TrendingUp, text: 'Analytics en temps réel' },
              { icon: Sparkles, text: 'Insights IA pour optimiser tes pubs' },
              { icon: Rocket, text: 'Lancement de campagnes en 1 clic' }
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/15 transition-all">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <feature.icon className="w-4 h-4 text-white" />
                </div>
                <p className="text-white text-sm font-medium">{feature.text}</p>
              </div>
            ))}
          </div>

          {/* Social Proof */}
          <div className="mt-8 flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-white to-gray-200 border-2 border-[#5A5AFB] flex items-center justify-center text-sm font-bold text-[#5A5AFB]">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <div className="text-white/90 text-sm">
              <p className="font-semibold">+500 utilisateurs actifs</p>
              <p className="text-white/70">Rejoins la communauté</p>
            </div>
          </div>
        </div>
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
// SHOPIFY CONNECTION CARD COMPONENT
// ============================================
function ShopifyConnectionCard({ session, showToast }) {
  const [shopifyStore, setShopifyStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [shopUrl, setShopUrl] = useState('');

  useEffect(() => {
    fetchShopifyStore();
  }, [session]);

  const fetchShopifyStore = async () => {
    try {
      const res = await fetch('/api/store', { headers: apiHeaders(session) });
      if (res.ok) {
        const data = await res.json();
        setShopifyStore(data.store || null);
      }
    } catch (err) {
      console.error('Error fetching Shopify store:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectShopify = async (e) => {
    e.preventDefault();
    if (!shopUrl.trim()) {
      showToast('Entre l\'URL de ta boutique Shopify', 'error');
      return;
    }

    setConnecting(true);
    try {
      const res = await fetch('/api/shopify/auth', {
        method: 'POST',
        headers: apiHeaders(session),
        body: JSON.stringify({ shopUrl: shopUrl.trim() })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.authUrl) {
          window.location.href = data.authUrl;
        }
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Failed to initiate Shopify connection');
      }
    } catch (err) {
      showToast(err.message || 'Erreur lors de la connexion à Shopify', 'error');
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Es-tu sûr de vouloir déconnecter ta boutique Shopify ?')) return;

    try {
      const res = await fetch('/api/store/disconnect', {
        method: 'POST',
        headers: apiHeaders(session)
      });

      if (res.ok) {
        setShopifyStore(null);
        showToast('Boutique Shopify déconnectée avec succès', 'success');
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

  if (shopifyStore) {
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
          <div className="w-10 h-10 rounded-xl bg-[#96BF48] flex items-center justify-center shrink-0">
            <Store className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-semibold text-white">Boutique Shopify connectée</h3>
              <CheckCircle2 className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-xs text-gray-400 mb-2">
              {shopifyStore.shop_name || shopifyStore.shop_domain}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Link2 className="w-3 h-3" />
              <span>{shopifyStore.shop_domain}</span>
            </div>
            {shopifyStore.products_count > 0 && (
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <Package className="w-3 h-3" />
                <span>{shopifyStore.products_count} produits synchronisés</span>
              </div>
            )}
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
            onClick={fetchShopifyStore}
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
        <div className="w-10 h-10 rounded-xl bg-[#96BF48]/20 flex items-center justify-center shrink-0">
          <Store className="w-5 h-5 text-[#96BF48]" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-white mb-1">Connecter ta boutique Shopify</h3>
          <p className="text-xs text-gray-400 mb-3">
            Synchronise ta boutique Shopify pour importer tes produits et créer des publicités automatiquement.
          </p>
          <ul className="space-y-2 mb-4">
            {[
              'Importer tes produits automatiquement',
              'Créer des pubs à partir de ton catalogue',
              'Synchronisation en temps réel',
              'Détection automatique de la devise'
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
          Tu seras redirigé vers Shopify pour autoriser l'accès. Assure-toi d'être admin de ta boutique.
        </p>
      </div>

      <form onSubmit={handleConnectShopify} className="space-y-3">
        <input
          type="text"
          value={shopUrl}
          onChange={(e) => setShopUrl(e.target.value)}
          placeholder="ma-boutique.myshopify.com"
          className="w-full px-4 py-2.5 rounded-lg bg-[#1A1A26] border border-white/10 text-white text-sm placeholder:text-gray-500 focus:border-brand focus:outline-none transition-all"
        />
        <button
          type="submit"
          disabled={connecting}
          className="w-full py-3 rounded-xl bg-[#96BF48] text-white font-semibold text-sm hover:bg-[#7FA73C] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {connecting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Connexion en cours...
            </>
          ) : (
            <>
              <Store className="w-4 h-4" />
              Connecter ma boutique Shopify
            </>
          )}
        </button>
      </form>
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
              <Dropdown
                value={businessNiche}
                onChange={setBusinessNiche}
                placeholder="Sélectionner une niche"
                options={[
                  { value: 'beaute', label: 'Beauté' },
                  { value: 'mode', label: 'Mode' },
                  { value: 'food', label: 'Food' },
                  { value: 'electronique', label: 'Électronique' },
                  { value: 'maison', label: 'Maison' },
                  { value: 'sante', label: 'Santé' },
                ]}
              />
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

      {/* Connexions Section */}
      <div className="bg-[#12121A] rounded-2xl border border-white/[0.08] p-6">
        <h2 className="text-white font-semibold mb-6 flex items-center gap-2">
          <Globe className="w-5 h-5 text-brand" />
          Connexions
        </h2>
        
        <div className="space-y-6">
          {/* Meta Connection */}
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
              <Facebook className="w-4 h-4" />
              Meta Ads (Facebook & Instagram)
            </h3>
            <MetaConnectionCard session={session} showToast={showToast} />
          </div>

          {/* Divider */}
          <div className="border-t border-white/[0.06]" />

          {/* Shopify Connection */}
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
              <Store className="w-4 h-4" />
              Shopify
            </h3>
            <ShopifyConnectionCard session={session} showToast={showToast} />
          </div>
        </div>
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
      <AdminSidebar activeTab={activeTab} user={user} onLogout={onLogout} session={session} />

      {/* Admin Content */}
      <div className="flex-1 ml-[240px]">
        <AdminHeader user={user} />
        <div className="p-8">
          {activeTab === 'dashboard' && <AdminDashboard session={session} showToast={showToast} />}
          {activeTab === 'tickets' && <AdminTickets session={session} showToast={showToast} />}
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
function AdminSidebar({ activeTab, user, onLogout, session }) {
  const [unreadTicketsCount, setUnreadTicketsCount] = useState(0);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tickets', label: 'Tickets Support', icon: LifeBuoy, badge: unreadTicketsCount },
    { id: 'templates', label: 'Templates', icon: Palette },
    { id: 'announcements', label: 'Annonces', icon: Bell },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'subscriptions', label: 'Abonnements', icon: CreditCard },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  // Fetch unread tickets count for admin
  useEffect(() => {
    if (!session) return;

    const fetchUnreadCount = async () => {
      try {
        const response = await fetch('/api/admin/tickets', {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        });
        const data = await response.json();

        if (data.tickets) {
          const unreadCount = data.tickets.reduce((sum, ticket) => sum + (ticket.unread_by_admin || 0), 0);
          setUnreadTicketsCount(unreadCount);
        }
      } catch (error) {
        console.error('Error fetching unread tickets count:', error);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [session]);

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
              {item.badge > 0 && (
                <span className="ml-auto px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-semibold">
                  {item.badge}
                </span>
              )}
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

// Admin Tickets
function AdminTickets({ session, showToast }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [sending, setSending] = useState(false);

  const statuses = {
    all: { label: 'Tous', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
    open: { label: 'Ouvert', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    in_progress: { label: 'En cours', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    resolved: { label: 'Résolu', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
    closed: { label: 'Fermé', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' }
  };

  const priorities = {
    all: { label: 'Toutes', color: 'text-gray-400' },
    low: { label: 'Basse', color: 'text-gray-400' },
    normal: { label: 'Normale', color: 'text-blue-400' },
    high: { label: 'Haute', color: 'text-orange-400' },
    urgent: { label: 'Urgente', color: 'text-red-400' }
  };

  const categories = {
    general: 'Question générale',
    technical: 'Problème technique',
    billing: 'Facturation',
    feature: 'Demande de fonctionnalité'
  };

  useEffect(() => {
    const fetchAllTickets = async () => {
      try {
        const response = await fetch('/api/admin/tickets', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });
        const data = await response.json();
        if (data.tickets) {
          setTickets(data.tickets);
        } else if (data.error) {
          showToast(data.error, 'error');
        }
      } catch (error) {
        console.error('Error fetching admin tickets:', error);
        showToast('Erreur lors du chargement des tickets', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchAllTickets();
  }, [session]);

  const handleTicketSelect = async (ticket) => {
    setSelectedTicket(ticket);
    setLoadingMessages(true);
    
    // Charger les messages du ticket
    try {
      const response = await fetch(`/api/tickets/${ticket.id}/messages`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });
      const data = await response.json();
      
      if (data.messages) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      showToast('Erreur lors du chargement des messages', 'error');
    } finally {
      setLoadingMessages(false);
    }
    
    // Marquer comme lu
    if (ticket.unread_by_admin > 0) {
      try {
        await fetch(`/api/tickets/${ticket.id}/read`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        });
        
        setTickets(tickets.map(t => 
          t.id === ticket.id ? { ...t, unread_by_admin: 0 } : t
        ));
      } catch (error) {
        console.error('Error marking as read:', error);
      }
    }
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      const response = await fetch(`/api/tickets/${ticketId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setTickets(tickets.map(t => t.id === ticketId ? { ...t, status: newStatus, updated_at: new Date().toISOString() } : t));
        if (selectedTicket?.id === ticketId) {
          setSelectedTicket({ ...selectedTicket, status: newStatus });
        }
        showToast('Statut mis à jour', 'success');
      } else {
        showToast(data.error || 'Erreur lors de la mise à jour', 'error');
      }
    } catch (error) {
      console.error('Error updating ticket status:', error);
      showToast('Erreur lors de la mise à jour', 'error');
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket) return;

    setSending(true);
    try {
      const response = await fetch(`/api/tickets/${selectedTicket.id}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          message: replyMessage,
          is_admin: true 
        })
      });

      const data = await response.json();

      if (data.success && data.message) {
        // Ajouter le message à la liste
        setMessages([...messages, {
          ...data.message,
          author_name: 'Support AdsPilot'
        }]);
        setReplyMessage('');
        showToast('Réponse envoyée !', 'success');
        
        // Mettre à jour le ticket dans la liste
        setTickets(tickets.map(t => 
          t.id === selectedTicket.id 
            ? { ...t, updated_at: new Date().toISOString(), unread_by_user: (t.unread_by_user || 0) + 1 } 
            : t
        ));
      } else {
        showToast(data.error || 'Erreur lors de l\'envoi', 'error');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      showToast('Erreur lors de l\'envoi du message', 'error');
    } finally {
      setSending(false);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    if (filterStatus !== 'all' && ticket.status !== filterStatus) return false;
    if (filterPriority !== 'all' && ticket.priority !== filterPriority) return false;
    return true;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-[#5A5AFB] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-syne">Gestion des Tickets</h1>
          <p className="text-gray-400 text-sm mt-1">Gérez tous les tickets de support utilisateur</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-[#5A5AFB]/50"
          >
            {Object.entries(statuses).map(([key, value]) => (
              <option key={key} value={key}>{value.label}</option>
            ))}
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-[#5A5AFB]/50"
          >
            {Object.entries(priorities).map(([key, value]) => (
              <option key={key} value={key}>{value.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total', count: tickets.length, color: 'from-gray-500 to-gray-600' },
          { label: 'Ouverts', count: tickets.filter(t => t.status === 'open').length, color: 'from-blue-500 to-blue-600' },
          { label: 'En cours', count: tickets.filter(t => t.status === 'in_progress').length, color: 'from-amber-500 to-amber-600' },
          { label: 'Résolus', count: tickets.filter(t => t.status === 'resolved').length, color: 'from-green-500 to-green-600' }
        ].map(stat => (
          <div key={stat.label} className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4">
            <p className="text-gray-400 text-xs mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
              {stat.count}
            </p>
          </div>
        ))}
      </div>

      {/* Liste des tickets */}
      <div className="grid grid-cols-2 gap-6">
        {/* Colonne gauche - Liste */}
        <div className="space-y-3">
          {filteredTickets.length === 0 ? (
            <div className="text-center py-16 bg-white/[0.02] border border-white/[0.06] rounded-xl">
              <LifeBuoy className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-sm">Aucun ticket trouvé</p>
            </div>
          ) : (
            filteredTickets.map(ticket => {
              const statusInfo = statuses[ticket.status];
              const priorityInfo = priorities[ticket.priority];

              return (
                <div
                  key={ticket.id}
                  onClick={() => handleTicketSelect(ticket)}
                  className={`bg-white/[0.03] border rounded-xl p-4 hover:border-white/[0.15] transition-all cursor-pointer relative ${
                    selectedTicket?.id === ticket.id ? 'border-[#5A5AFB]' : 'border-white/[0.08]'
                  }`}
                >
                  {ticket.unread_by_admin > 0 && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center border-2 border-[#0F0F14] z-10">
                      <span className="text-white text-xs font-bold">{ticket.unread_by_admin}</span>
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-sm mb-1 truncate">{ticket.title}</h3>
                      <p className="text-gray-500 text-xs">{ticket.user_name} • {ticket.user_email}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-md border text-xs font-medium shrink-0 ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className={priorityInfo.color}>
                      {priorityInfo.label}
                    </span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-400">{categories[ticket.category]}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-400">{formatDate(ticket.updated_at)}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Colonne droite - Détails */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 sticky top-6">
          {selectedTicket ? (
            <div className="space-y-6">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-2 font-syne">{selectedTicket.title}</h2>
                    <p className="text-gray-400 text-sm">{selectedTicket.user_name} • {selectedTicket.user_email}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className={`px-3 py-1.5 rounded-lg border text-sm font-medium ${statuses[selectedTicket.status].color}`}>
                    {statuses[selectedTicket.status].label}
                  </span>
                  <span className={`text-sm ${priorities[selectedTicket.priority].color}`}>
                    Priorité: {priorities[selectedTicket.priority].label}
                  </span>
                </div>

                <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                  <p className="text-gray-300 text-sm leading-relaxed">{selectedTicket.description}</p>
                </div>
              </div>

              {/* Actions */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Changer le statut</label>
                <div className="flex gap-2">
                  {Object.entries(statuses).filter(([key]) => key !== 'all').map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => handleStatusChange(selectedTicket.id, key)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                        selectedTicket.status === key
                          ? value.color
                          : 'border-white/[0.1] text-gray-400 hover:text-white hover:border-white/[0.2]'
                      }`}
                    >
                      {value.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conversation */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Conversation</label>
                <div className="space-y-4 max-h-[400px] overflow-y-auto p-4 bg-white/[0.02] border border-white/[0.06] rounded-lg">
                  {loadingMessages ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 text-[#5A5AFB] animate-spin" />
                    </div>
                  ) : messages.length === 0 ? (
                    <p className="text-center text-gray-500 text-sm py-8">Aucun message pour le moment</p>
                  ) : (
                    messages.map((msg) => (
                      <div key={msg.id} className={`flex gap-3 ${msg.is_admin ? 'flex-row' : 'flex-row-reverse'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          msg.is_admin 
                            ? 'bg-[#5A5AFB]/20 text-[#5A5AFB]' 
                            : 'bg-gradient-to-br from-[#5A5AFB] to-[#9C5DFF] text-white'
                        }`}>
                          {msg.is_admin ? (
                            <LifeBuoy className="w-4 h-4" />
                          ) : (
                            <span className="text-xs font-semibold">
                              {msg.author_name?.[0]?.toUpperCase() || 'U'}
                            </span>
                          )}
                        </div>
                        
                        <div className={`flex-1 ${msg.is_admin ? 'text-left' : 'text-right'}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-medium ${msg.is_admin ? 'text-[#5A5AFB]' : 'text-white'}`}>
                              {msg.is_admin ? 'Support AdsPilot' : msg.author_name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(msg.created_at).toLocaleDateString('fr-FR', { 
                                day: 'numeric', 
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <div className={`inline-block max-w-[85%] p-3 rounded-xl text-sm ${
                            msg.is_admin 
                              ? 'bg-white/[0.05] border border-white/[0.1] text-gray-300' 
                              : 'bg-gradient-to-r from-[#5A5AFB] to-[#9C5DFF] text-white'
                          }`}>
                            {msg.message}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Répondre */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Répondre au ticket</label>
                <form onSubmit={handleSendReply} className="space-y-3">
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Écrivez votre réponse..."
                    rows={4}
                    disabled={sending}
                    className="w-full px-4 py-3 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white placeholder-gray-500 focus:outline-none focus:border-[#5A5AFB]/50 text-sm resize-none"
                  />
                  <button
                    type="submit"
                    disabled={sending || !replyMessage.trim()}
                    className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#5A5AFB] to-[#9C5DFF] text-white text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {sending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    Envoyer la réponse
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-sm">Sélectionnez un ticket pour voir les détails</p>
            </div>
          )}
        </div>
      </div>
    </div>
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    niche: 'beaute',
    format: 'carre',
    preview_url: '',
    canva_template_id: '',
    tags: '',
    is_premium: false
  });

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
    try {
      const res = await fetch(`/api/admin/templates/${templateId}`, {
        method: 'DELETE',
        headers: apiHeaders(session)
      });

      if (res.ok) {
        showToast('Template supprimé', 'success');
        fetchTemplates();
        setShowDeleteConfirm(null);
      } else {
        showToast('Erreur lors de la suppression', 'error');
      }
    } catch (err) {
      showToast('Erreur lors de la suppression', 'error');
    }
  };

  const handleOpenEdit = (template) => {
    if (template.id) {
      // Mode édition
      setFormData({
        title: template.title || '',
        description: template.description || '',
        niche: template.niche || 'beaute',
        format: template.format || 'carre',
        preview_url: template.preview_url || '',
        canva_template_id: template.canva_template_id || '',
        tags: template.tags?.join(', ') || '',
        is_premium: template.is_premium || false
      });
    } else {
      // Mode création
      setFormData({
        title: '',
        description: '',
        niche: 'beaute',
        format: 'carre',
        preview_url: '',
        canva_template_id: '',
        tags: '',
        is_premium: false
      });
    }
    setEditingTemplate(template);
  };

  const handleSaveTemplate = async (e) => {
    e.preventDefault();
    
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      };

      const url = editingTemplate?.id 
        ? `/api/admin/templates/${editingTemplate.id}`
        : '/api/admin/templates';
      
      const method = editingTemplate?.id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          ...apiHeaders(session),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showToast(editingTemplate?.id ? 'Template modifié' : 'Template créé', 'success');
        setEditingTemplate(null);
        fetchTemplates();
      } else {
        const data = await res.json();
        showToast(data.error || 'Erreur lors de la sauvegarde', 'error');
      }
    } catch (err) {
      showToast('Erreur lors de la sauvegarde', 'error');
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
          onClick={() => handleOpenEdit({})}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#5A5AFB] to-[#9C5DFF] text-white font-semibold hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer"
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
              <button onClick={() => handleOpenEdit(template)} className="flex-1 px-3 py-2 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 transition-all text-sm cursor-pointer">
                Modifier
              </button>
              <button onClick={() => setShowDeleteConfirm(template)} className="px-3 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all text-sm cursor-pointer">
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Edit/Create Template */}
      {editingTemplate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#12121A] border border-white/[0.1] rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingTemplate.id ? 'Modifier le template' : 'Nouveau template'}
              </h3>
              <button onClick={() => setEditingTemplate(null)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTemplate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Titre</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                    className="w-full px-4 py-2.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white placeholder-gray-500 focus:outline-none focus:border-[#5A5AFB]/50 text-sm"
                    placeholder="Ex: Glow naturel"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white placeholder-gray-500 focus:outline-none focus:border-[#5A5AFB]/50 text-sm resize-none"
                    placeholder="Description du template"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Niche</label>
                  <div className="relative">
                    <select
                      value={formData.niche}
                      onChange={(e) => setFormData({...formData, niche: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white focus:outline-none focus:border-[#5A5AFB]/50 focus:ring-2 focus:ring-[#5A5AFB]/20 text-sm appearance-none cursor-pointer hover:bg-white/[0.08] transition-all"
                      style={{ colorScheme: 'dark' }}
                    >
                      <option value="beaute">💄 Beauté</option>
                      <option value="mode">👗 Mode</option>
                      <option value="food">🍔 Food</option>
                      <option value="electronique">📱 Électronique</option>
                      <option value="maison">🏠 Maison</option>
                      <option value="sante">❤️ Santé</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Format</label>
                  <div className="relative">
                    <select
                      value={formData.format}
                      onChange={(e) => setFormData({...formData, format: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white focus:outline-none focus:border-[#5A5AFB]/50 focus:ring-2 focus:ring-[#5A5AFB]/20 text-sm appearance-none cursor-pointer hover:bg-white/[0.08] transition-all"
                      style={{ colorScheme: 'dark' }}
                    >
                      <option value="carre">■ Carré 1:1</option>
                      <option value="story">📱 Story 9:16</option>
                      <option value="landscape">📺 Paysage 16:9</option>
                      <option value="ugc">🎥 UGC</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">URL de l'image preview</label>
                  <input
                    type="url"
                    value={formData.preview_url}
                    onChange={(e) => setFormData({...formData, preview_url: e.target.value})}
                    required
                    className="w-full px-4 py-2.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white placeholder-gray-500 focus:outline-none focus:border-[#5A5AFB]/50 text-sm"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">ID Template Canva</label>
                  <input
                    type="text"
                    value={formData.canva_template_id}
                    onChange={(e) => setFormData({...formData, canva_template_id: e.target.value})}
                    required
                    className="w-full px-4 py-2.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white placeholder-gray-500 focus:outline-none focus:border-[#5A5AFB]/50 text-sm"
                    placeholder="mock_canva_001"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tags (séparés par des virgules)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white placeholder-gray-500 focus:outline-none focus:border-[#5A5AFB]/50 text-sm"
                    placeholder="testimonial, skincare, glow"
                  />
                </div>

                <div className="col-span-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_premium}
                      onChange={(e) => setFormData({...formData, is_premium: e.target.checked})}
                      className="w-5 h-5 rounded border-white/20 bg-white/5 text-[#5A5AFB] focus:ring-[#5A5AFB] focus:ring-offset-0"
                    />
                    <span className="text-sm text-gray-300">Template Premium</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setEditingTemplate(null)}
                  className="px-4 py-2.5 rounded-lg border border-white/20 text-white text-sm font-medium hover:bg-white/5 transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#5A5AFB] to-[#9C5DFF] text-white text-sm font-semibold hover:opacity-90 transition-all"
                >
                  {editingTemplate.id ? 'Enregistrer' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#12121A] border border-white/[0.1] rounded-2xl p-6 max-w-md w-full">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-white text-center mb-2">Supprimer le template ?</h3>
            <p className="text-gray-400 text-center text-sm mb-6">
              Êtes-vous sûr de vouloir supprimer <strong className="text-white">{showDeleteConfirm.title}</strong> ? Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-white/20 text-white text-sm font-medium hover:bg-white/5 transition-all"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm.id)}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-all"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
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

  const handleBlockUser = async (userId, currentlyBlocked) => {
    const action = currentlyBlocked ? 'unblock' : 'block';
    const confirmMsg = currentlyBlocked 
      ? 'Êtes-vous sûr de vouloir débloquer cet utilisateur ?' 
      : 'Êtes-vous sûr de vouloir bloquer cet utilisateur ? Il ne pourra plus se connecter.';
    
    if (!confirm(confirmMsg)) return;

    try {
      const res = await fetch(`/api/admin/users/${userId}/${action}`, {
        method: 'PUT',
        headers: apiHeaders(session)
      });
      if (res.ok) {
        showToast(`Utilisateur ${currentlyBlocked ? 'débloqué' : 'bloqué'} avec succès`, 'success');
        fetchUsers();
      } else {
        const d = await res.json();
        showToast(d.error || 'Erreur lors de l\'opération', 'error');
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
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      user.banned 
                        ? "bg-red-500/20 text-red-400" 
                        : "bg-green-500/20 text-green-400"
                    )}>
                      {user.banned ? 'Bloqué' : 'Actif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Dropdown
                        value={user.role || 'user'}
                        onChange={(val) => handleUpdateRole(user.id, val)}
                        options={[
                          { value: 'user', label: 'Standard' },
                          { value: 'pro', label: 'Plan Pro' },
                          { value: 'admin', label: 'Administrateur' },
                        ]}
                        style={{ minWidth: 150 }}
                      />
                      <button
                        onClick={() => handleBlockUser(user.id, user.banned)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                          user.banned
                            ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                            : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                        )}
                      >
                        {user.banned ? 'Débloquer' : 'Bloquer'}
                      </button>
                    </div>
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
// SUPPORT PAGE - TICKETS
// ============================================
function SupportPage({ user, session, showToast }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'general',
    priority: 'normal',
    description: ''
  });

  const categories = [
    { value: 'general', label: 'Question générale', icon: MessageSquare },
    { value: 'technical', label: 'Problème technique', icon: AlertCircle },
    { value: 'billing', label: 'Facturation', icon: CreditCard },
    { value: 'feature', label: 'Demande de fonctionnalité', icon: Sparkles }
  ];

  const priorities = [
    { value: 'low', label: 'Basse', color: 'text-gray-400' },
    { value: 'normal', label: 'Normale', color: 'text-blue-400' },
    { value: 'high', label: 'Haute', color: 'text-orange-400' },
    { value: 'urgent', label: 'Urgente', color: 'text-red-400' }
  ];

  const statuses = {
    open: { label: 'Ouvert', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    in_progress: { label: 'En cours', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    resolved: { label: 'Résolu', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
    closed: { label: 'Fermé', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' }
  };

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch('/api/tickets', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });
        const data = await response.json();
        if (data.tickets) {
          setTickets(data.tickets);
        }
      } catch (error) {
        console.error('Error fetching tickets:', error);
        showToast('Erreur lors du chargement des tickets', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [session]);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success && data.ticket) {
        setTickets([data.ticket, ...tickets]);
        setFormData({ title: '', category: 'general', priority: 'normal', description: '' });
        setShowCreateForm(false);
        showToast('Ticket créé avec succès !', 'success');
      } else {
        showToast(data.error || 'Erreur lors de la création du ticket', 'error');
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      showToast('Erreur lors de la création du ticket', 'error');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.icon : MessageSquare;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-[#5A5AFB] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec bouton créer */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white font-syne">Mes Tickets</h2>
          <p className="text-gray-400 text-sm mt-1">Gérez vos demandes de support</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#5A5AFB] to-[#9C5DFF] text-white text-sm font-semibold hover:opacity-90 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nouveau ticket
        </button>
      </div>

      {/* Formulaire de création */}
      {showCreateForm && (
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 font-syne">Créer un ticket</h3>
          <form onSubmit={handleCreateTicket} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Titre</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Décrivez brièvement votre problème"
                required
                className="w-full px-4 py-2.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white placeholder-gray-500 focus:outline-none focus:border-[#5A5AFB]/50 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Catégorie</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white focus:outline-none focus:border-[#5A5AFB]/50 text-sm"
                  style={{ colorScheme: 'dark' }}
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value} className="bg-[#1A1A26] text-white">{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Priorité</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white focus:outline-none focus:border-[#5A5AFB]/50 text-sm"
                  style={{ colorScheme: 'dark' }}
                >
                  {priorities.map(p => (
                    <option key={p.value} value={p.value} className="bg-[#1A1A26] text-white">{p.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Décrivez votre problème en détail..."
                required
                rows={4}
                className="w-full px-4 py-2.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white placeholder-gray-500 focus:outline-none focus:border-[#5A5AFB]/50 text-sm resize-none"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2.5 rounded-lg border border-white/20 text-white text-sm font-medium hover:bg-white/5 transition-all"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#5A5AFB] to-[#9C5DFF] text-white text-sm font-semibold hover:opacity-90 transition-all"
              >
                Créer le ticket
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des tickets */}
      {tickets.length === 0 ? (
        <div className="text-center py-16 bg-white/[0.02] border border-white/[0.06] rounded-xl">
          <LifeBuoy className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Aucun ticket</h3>
          <p className="text-gray-400 text-sm mb-6">Vous n'avez pas encore créé de ticket de support</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#5A5AFB] to-[#9C5DFF] text-white text-sm font-semibold hover:opacity-90 transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Créer mon premier ticket
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map(ticket => {
            const CategoryIcon = getCategoryIcon(ticket.category);
            const statusInfo = statuses[ticket.status];
            const priorityInfo = priorities.find(p => p.value === ticket.priority);

            return (
              <div
                key={ticket.id}
                className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5 hover:border-white/[0.15] transition-all cursor-pointer group"
                onClick={() => window.location.hash = `#/support/${ticket.id}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-[#5A5AFB]/10 flex items-center justify-center shrink-0">
                      <CategoryIcon className="w-5 h-5 text-[#5A5AFB]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold mb-1 group-hover:text-[#5A5AFB] transition-colors">
                        {ticket.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className={`px-2 py-1 rounded-md border ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                        <span className={`${priorityInfo.color}`}>
                          Priorité: {priorityInfo.label}
                        </span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-400">
                          {categories.find(c => c.value === ticket.category)?.label}
                        </span>
                        {ticket.messages_count > 0 && (
                          <>
                            <span className="text-gray-500">•</span>
                            <span className="text-gray-400 flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" />
                              {ticket.messages_count}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {ticket.unread_by_user > 0 && (
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-[#5A5AFB] flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{ticket.unread_by_user}</span>
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#0F0F14]"></div>
                      </div>
                    )}
                    <div className="text-right shrink-0">
                      <p className="text-xs text-gray-500">Mis à jour</p>
                      <p className="text-xs text-gray-400">{formatDate(ticket.updated_at)}</p>
                    </div>
                  </div>
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
// TICKET DETAIL PAGE
// ============================================
function TicketDetailPage({ user, session, showToast, ticketId }) {
  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  const statuses = {
    open: { label: 'Ouvert', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    in_progress: { label: 'En cours', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    resolved: { label: 'Résolu', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
    closed: { label: 'Fermé', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' }
  };

  const priorities = {
    low: { label: 'Basse', color: 'text-gray-400' },
    normal: { label: 'Normale', color: 'text-blue-400' },
    high: { label: 'Haute', color: 'text-orange-400' },
    urgent: { label: 'Urgente', color: 'text-red-400' }
  };

  const categories = {
    general: 'Question générale',
    technical: 'Problème technique',
    billing: 'Facturation',
    feature: 'Demande de fonctionnalité'
  };

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const [ticketRes, messagesRes] = await Promise.all([
          fetch('/api/tickets', {
            headers: { 'Authorization': `Bearer ${session.access_token}` }
          }),
          fetch(`/api/tickets/${ticketId}/messages`, {
            headers: { 'Authorization': `Bearer ${session.access_token}` }
          })
        ]);

        const ticketData = await ticketRes.json();
        const messagesData = await messagesRes.json();

        const foundTicket = ticketData.tickets?.find(t => t.id === ticketId);
        
        if (foundTicket) {
          setTicket(foundTicket);
          
          if (foundTicket.unread_by_user > 0) {
            fetch(`/api/tickets/${ticketId}/read`, {
              method: 'PUT',
              headers: { 'Authorization': `Bearer ${session.access_token}` }
            }).catch(err => console.error('Error marking as read:', err));
          }
        }

        if (messagesData.messages) {
          const formattedMessages = messagesData.messages.map(msg => ({
            ...msg,
            author_name: msg.is_admin ? 'Support AdsPilot' : (user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Vous')
          }));
          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error('Error fetching ticket details:', error);
        showToast('Erreur lors du chargement du ticket', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchTicketDetails();
  }, [ticketId, session, user]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      const response = await fetch(`/api/tickets/${ticketId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: newMessage })
      });

      const data = await response.json();

      if (data.success && data.message) {
        const formattedMessage = {
          ...data.message,
          author_name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Vous'
        };
        setMessages([...messages, formattedMessage]);
        setNewMessage('');
        showToast('Message envoyé !', 'success');
      } else {
        showToast(data.error || 'Erreur lors de l\'envoi du message', 'error');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      showToast('Erreur lors de l\'envoi du message', 'error');
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-[#5A5AFB] animate-spin" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-16">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Ticket introuvable</h3>
        <p className="text-gray-400 text-sm mb-6">Ce ticket n'existe pas ou a été supprimé</p>
        <button
          onClick={() => window.location.hash = '#/support'}
          className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#5A5AFB] to-[#9C5DFF] text-white text-sm font-semibold hover:opacity-90 transition-all"
        >
          Retour aux tickets
        </button>
      </div>
    );
  }

  const statusInfo = statuses[ticket.status];
  const priorityInfo = priorities[ticket.priority];

  return (
    <div className="space-y-6">
      {/* Bouton retour */}
      <button
        onClick={() => window.location.hash = '#/support'}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
      >
        <ChevronLeft className="w-4 h-4" />
        Retour aux tickets
      </button>

      {/* En-tête du ticket */}
      <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white mb-3 font-syne">{ticket.title}</h1>
            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-3 py-1.5 rounded-lg border text-sm font-medium ${statusInfo.color}`}>
                {statusInfo.label}
              </span>
              <span className={`text-sm ${priorityInfo.color}`}>
                Priorité: {priorityInfo.label}
              </span>
              <span className="text-sm text-gray-400">
                {categories[ticket.category]}
              </span>
            </div>
          </div>
          <div className="text-right text-sm">
            <p className="text-gray-500">Créé le</p>
            <p className="text-gray-300">{formatDate(ticket.created_at)}</p>
          </div>
        </div>

        {ticket.status === 'resolved' && (
          <div className="mt-4 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-green-400 font-medium text-sm">Ticket résolu</p>
                <p className="text-gray-400 text-xs mt-1">Ce ticket a été marqué comme résolu. Si votre problème persiste, vous pouvez rouvrir le ticket.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-6 font-syne">Conversation</h2>
        
        <div className="space-y-6 mb-6">
          {messages.map((msg, index) => (
            <div key={msg.id} className={`flex gap-4 ${msg.is_admin ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                msg.is_admin 
                  ? 'bg-[#5A5AFB]/20 text-[#5A5AFB]' 
                  : 'bg-gradient-to-br from-[#5A5AFB] to-[#9C5DFF] text-white'
              }`}>
                {msg.is_admin ? (
                  <LifeBuoy className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-semibold">
                    {msg.author_name?.[0]?.toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              
              <div className={`flex-1 ${msg.is_admin ? 'text-left' : 'text-right'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-sm font-medium ${msg.is_admin ? 'text-[#5A5AFB]' : 'text-white'}`}>
                    {msg.author_name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(msg.created_at)}
                  </span>
                </div>
                <div className={`inline-block max-w-[80%] p-4 rounded-xl ${
                  msg.is_admin 
                    ? 'bg-white/[0.05] border border-white/[0.1] text-gray-300' 
                    : 'bg-gradient-to-r from-[#5A5AFB]/20 to-[#9C5DFF]/20 border border-[#5A5AFB]/30 text-white'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Formulaire de réponse */}
        {ticket.status !== 'closed' && (
          <form onSubmit={handleSendMessage} className="border-t border-white/[0.08] pt-6">
            <div className="flex gap-3">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Écrivez votre message..."
                rows={3}
                disabled={sending}
                className="flex-1 px-4 py-3 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white placeholder-gray-500 focus:outline-none focus:border-[#5A5AFB]/50 text-sm resize-none"
              />
              <button
                type="submit"
                disabled={sending || !newMessage.trim()}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#5A5AFB] to-[#9C5DFF] text-white text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 self-end"
              >
                {sending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Envoyer
              </button>
            </div>
          </form>
        )}

        {ticket.status === 'closed' && (
          <div className="border-t border-white/[0.08] pt-6">
            <div className="p-4 rounded-lg bg-gray-500/10 border border-gray-500/20 text-center">
              <p className="text-gray-400 text-sm">Ce ticket est fermé. Vous ne pouvez plus envoyer de messages.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// ANALYTICS PAGE (Placeholder)
// ============================================
function AnalyticsPage({ showToast }) {
  return <ComingSoonPage title="Analytics" icon={BarChart2} showToast={showToast} />;
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

export default function App() {
  const { currentPath, navigate } = useHashRouter();
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
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
    let timeoutId = null;

    // Timeout de sécurité : force le chargement à se terminer après 5 secondes
    timeoutId = setTimeout(() => {
      if (isMounted && loading) {
        console.warn('Supabase auth timeout - forcing loading to false');
        setLoading(false);
      }
    }, 5000);

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
        console.error('Supabase auth error:', e);
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
      if (timeoutId) clearTimeout(timeoutId);
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
    return <><LandingPage /><ToastContainer toasts={toasts} onDismiss={dismissToast} /><Analytics /><SpeedInsights /></>;
  }
  if (currentPath === '#/login') {
    if (user) { navigate('#/dashboard'); return null; }
    return <><LoginPage onLogin={handleLogin} showToast={showToast} /><ToastContainer toasts={toasts} onDismiss={dismissToast} /><Analytics /><SpeedInsights /></>;
  }
  if (currentPath === '#/register') {
    if (user) { navigate('#/dashboard'); return null; }
    return <><RegisterPage onRegister={handleLogin} showToast={showToast} /><ToastContainer toasts={toasts} onDismiss={dismissToast} /><Analytics /><SpeedInsights /></>;
  }
  if (currentPath === '#/terms') {
    return <><TermsPage /><ToastContainer toasts={toasts} onDismiss={dismissToast} /><Analytics /><SpeedInsights /></>;
  }
  if (currentPath === '#/privacy') {
    return <><PrivacyPage /><ToastContainer toasts={toasts} onDismiss={dismissToast} /><Analytics /><SpeedInsights /></>;
  }
  if (currentPath === '#/contact') {
    return <><ContactPage showToast={showToast} /><ToastContainer toasts={toasts} onDismiss={dismissToast} /><Analytics /><SpeedInsights /></>;
  }

  // Protected routes
  if (!user) {
    navigate('#/login');
    return null;
  }

  const pageProps = { user, session, showToast, navigate };

  // Check if admin route
  if (currentPath && currentPath.startsWith('#/admin-pro')) {
    return (
      <>
        <AdminPanel currentPath={currentPath} user={user} session={session} showToast={showToast} onLogout={handleLogout} />
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
        <Analytics />
        <SpeedInsights />
      </>
    );
  }

  const pageContent = (() => {
    // Gestion des routes dynamiques pour les tickets
    if (currentPath?.startsWith('#/support/')) {
      const ticketId = currentPath.split('/')[2];
      return <TicketDetailPage {...pageProps} ticketId={ticketId} />;
    }

    switch (currentPath) {
      case '#/dashboard': return <DashboardPage {...pageProps} />;
      case '#/afrivault': return <AfriVaultPage {...pageProps} />;
      case '#/adscout': return <AdScoutView supabase={supabase} user={user} />;
      case '#/scrapify': return <ScrapifyView supabase={supabase} user={user} />;
      case '#/campaigns': return <CampagnesView supabase={supabase} user={user} />;
      case '#/comments': return <CommentairesView supabase={supabase} user={user} />;
      case '#/creatives': return <CreativesPage {...pageProps} />;
      case '#/guides': return <GuidesPage {...pageProps} />;
      case '#/my-store': return <MyStorePage {...pageProps} />;
      case '#/analytics': return <AnalyticsPage {...pageProps} />;
      case '#/settings': return <SettingsPage {...pageProps} />;
      case '#/settings/billing': return <BillingPage {...pageProps} />;
      case '#/ugc': return <ComingSoonPage title="UGC à 1€" icon={Video} showToast={showToast} />;
      case '#/insights': return <ComingSoonPage title="Insights" icon={Sparkles} showToast={showToast} />;
      case '#/support': return <SupportPage {...pageProps} />;
      default: return <DashboardPage {...pageProps} />;
    }
  })();

  return (
    <>
      <DashboardLayout currentPath={currentPath} user={user} onLogout={handleLogout} session={session} navigate={navigate}>
        {pageContent}
      </DashboardLayout>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      <Analytics />
      <SpeedInsights />
    </>
  );
}
