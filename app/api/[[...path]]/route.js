import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// ============================================
// SUPABASE ADMIN
// ============================================
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

async function getAuthUser(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  try {
    const supabase = getSupabaseAdmin();
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error) return null;
    return user;
  } catch {
    return null;
  }
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

// ============================================
// SEED DATA
// ============================================
const SEED_TEMPLATES = [
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
// HANDLERS
// ============================================

async function handleGetTemplates(request) {
  try {
    const supabase = getSupabaseAdmin();
    const { data: templates, error } = await supabase
      .from('templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // If no templates, auto-seed
    if (!templates || templates.length === 0) {
      const { data: seededTemplates, error: seedError } = await supabase
        .from('templates')
        .insert(SEED_TEMPLATES)
        .select('*');

      return NextResponse.json({
        templates: seedError ? SEED_TEMPLATES : seededTemplates
      }, { headers: corsHeaders() });
    }

    return NextResponse.json({ templates }, { headers: corsHeaders() });
  } catch (err) {
    console.error('Get templates error:', err);
    return NextResponse.json({ templates: SEED_TEMPLATES }, { headers: corsHeaders() });
  }
}

async function handleGetSavedTemplates(request) {
  const user = await getAuthUser(request);
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401, headers: corsHeaders() });

  try {
    const supabase = getSupabaseAdmin();
    const { data: saved, error } = await supabase
      .from('saved_templates')
      .select('*')
      .eq('user_id', user.id)
      .order('saved_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ saved: saved || [] }, { headers: corsHeaders() });
  } catch (err) {
    console.error('Get saved templates error:', err);
    return NextResponse.json({ saved: [] }, { headers: corsHeaders() });
  }
}

async function handleSaveTemplate(request) {
  const user = await getAuthUser(request);
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401, headers: corsHeaders() });

  try {
    const { template_id, action } = await request.json();
    const supabase = getSupabaseAdmin();

    if (action === 'unsave') {
      const { error } = await supabase
        .from('saved_templates')
        .delete()
        .eq('user_id', user.id)
        .eq('template_id', template_id);

      if (error) throw error;
    } else {
      // Upsert - insert if not exists, or do nothing if exists
      const { error } = await supabase
        .from('saved_templates')
        .upsert({
          user_id: user.id,
          template_id,
          saved_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,template_id',
          ignoreDuplicates: false
        });

      if (error) throw error;
    }

    return NextResponse.json({ success: true }, { headers: corsHeaders() });
  } catch (err) {
    console.error('Save template error:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500, headers: corsHeaders() });
  }
}

async function handleSeedTemplates() {
  try {
    const supabase = getSupabaseAdmin();

    // Delete all existing templates
    const { error: deleteError } = await supabase
      .from('templates')
      .delete()
      .neq('id', ''); // Delete all rows

    if (deleteError) throw deleteError;

    // Insert seed templates
    const { data, error: insertError } = await supabase
      .from('templates')
      .insert(SEED_TEMPLATES)
      .select('*');

    if (insertError) throw insertError;

    return NextResponse.json({
      success: true,
      count: data?.length || SEED_TEMPLATES.length
    }, { headers: corsHeaders() });
  } catch (err) {
    console.error('Seed templates error:', err);
    return NextResponse.json({ error: 'Erreur seed' }, { status: 500, headers: corsHeaders() });
  }
}

async function handleShopifyConnect(request) {
  const user = await getAuthUser(request);
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401, headers: corsHeaders() });

  try {
    const { shopUrl } = await request.json();
    let domain = shopUrl.trim().toLowerCase();
    domain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
    if (!domain) return NextResponse.json({ error: 'URL invalide' }, { status: 400, headers: corsHeaders() });

    // Validate by fetching products
    const response = await fetch(`https://${domain}/products.json?limit=6`, {
      headers: { 'User-Agent': 'AdsPilot/1.0' }
    });
    if (!response.ok) throw new Error('Boutique non accessible');
    const data = await response.json();
    const products = (data.products || []).slice(0, 6);

    // Get store currency via HTML meta tag or cart.json
    let currency = 'EUR';
    try {
      // 1. Essayer de récupérer la devise depuis le HTML de la boutique (Tag Meta ou objet Shopify)
      const htmlRes = await fetch(`https://${domain}/`, {
        headers: { 'User-Agent': 'AdsPilot/1.0' }
      });
      if (htmlRes.ok) {
        const html = await htmlRes.text();
        const ogMatch = html.match(/property="og:price:currency"\s+content="([^"]+)"/i);
        const shopifyMatch = html.match(/"active":"([^"]{3})"/i) || html.match(/"currency":"([^"]{3})"/i);
        
        if (ogMatch && ogMatch[1]) {
          currency = ogMatch[1].toUpperCase();
        } else if (shopifyMatch && shopifyMatch[1]) {
          currency = shopifyMatch[1].toUpperCase();
        }
      }
    } catch (e) {
      console.warn('Erreur lecture HTML:', e);
    }

    // 2. Si ça échoue, essayer avec cart.json
    if (currency === 'EUR') {
      try {
        const cartRes = await fetch(`https://${domain}/cart.json`, {
          headers: { 'User-Agent': 'AdsPilot/1.0' }
        });
        if (cartRes.ok) {
          const cartData = await cartRes.json();
          if (cartData.currency) currency = cartData.currency;
        }
      } catch (e) {
        // Ignorer l'erreur et garder la devise
      }
    }

    const store = {
      user_id: user.id,
      shopify_domain: domain,
      shop_name: domain.split('.')[0].replace(/-/g, ' '),
      currency: currency,
      product_count: data.products?.length || 0,
      products: products.map(p => ({
        id: String(p.id),
        title: p.title,
        image: p.images?.[0]?.src || null,
        price: p.variants?.[0]?.price || '0',
      })),
      connected_at: new Date().toISOString(),
      is_active: true,
    };

    const supabase = getSupabaseAdmin();

    // Upsert store (update if exists, insert if not)
    const { data: storeData, error } = await supabase
      .from('stores')
      .upsert(store, {
        onConflict: 'user_id',
        ignoreDuplicates: false
      })
      .select('*')
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, store: storeData }, { headers: corsHeaders() });
  } catch (err) {
    console.error('Shopify connect error:', err);
    return NextResponse.json({
      error: err.message || 'URL invalide ou boutique non accessible'
    }, { status: 400, headers: corsHeaders() });
  }
}

async function handleGetStore(request) {
  const user = await getAuthUser(request);
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401, headers: corsHeaders() });

  try {
    const supabase = getSupabaseAdmin();
    const { data: store, error } = await supabase
      .from('stores')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw error;
    }

    return NextResponse.json({ store: store || null }, { headers: corsHeaders() });
  } catch (err) {
    console.error('Get store error:', err);
    return NextResponse.json({ store: null }, { headers: corsHeaders() });
  }
}

async function handleDisconnectStore(request) {
  const user = await getAuthUser(request);
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401, headers: corsHeaders() });

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from('stores')
      .update({ is_active: false })
      .eq('user_id', user.id);

    if (error) throw error;

    return NextResponse.json({ success: true }, { headers: corsHeaders() });
  } catch (err) {
    console.error('Disconnect store error:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500, headers: corsHeaders() });
  }
}

async function handleGetProfile(request) {
  const user = await getAuthUser(request);
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401, headers: corsHeaders() });

  try {
    const supabase = getSupabaseAdmin();
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw error;
    }

    return NextResponse.json({ profile: profile || null }, { headers: corsHeaders() });
  } catch (err) {
    console.error('Get profile error:', err);
    return NextResponse.json({ profile: null }, { headers: corsHeaders() });
  }
}

async function handleUpdateProfile(request) {
  const user = await getAuthUser(request);
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401, headers: corsHeaders() });

  try {
    const body = await request.json();
    const { full_name, business_name, business_niche } = body;

    const supabase = getSupabaseAdmin();

    const profileData = {
      user_id: user.id,
      full_name: full_name || '',
      business_name: business_name || '',
      business_niche: business_niche || '',
      updated_at: new Date().toISOString(),
    };

    // Upsert profile
    const { error } = await supabase
      .from('profiles')
      .upsert(profileData, {
        onConflict: 'user_id',
        ignoreDuplicates: false
      });

    if (error) throw error;

    return NextResponse.json({ success: true }, { headers: corsHeaders() });
  } catch (err) {
    console.error('Update profile error:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500, headers: corsHeaders() });
  }
}

async function handleHealth() {
  return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() }, { headers: corsHeaders() });
}

// ============================================
// META / FACEBOOK HANDLERS
// ============================================
async function handleGetMetaConnection(request) {
  const user = await getAuthUser(request);
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401, headers: corsHeaders() });

  try {
    const supabase = getSupabaseAdmin();
    const { data: connection, error } = await supabase
      .from('meta_connections')
      .select('id, user_id, meta_user_id, name, email, token_type, expires_in, connected_at, updated_at')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw error;
    }

    return NextResponse.json({ connection: connection || null }, { headers: corsHeaders() });
  } catch (err) {
    console.error('Get meta connection error:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500, headers: corsHeaders() });
  }
}

async function handleInitiateMetaAuth(request) {
  const user = await getAuthUser(request);
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401, headers: corsHeaders() });

  const appId = process.env.META_APP_ID;
  const redirectUri = process.env.META_REDIRECT_URI || `${process.env.NEXT_PUBLIC_BASE_URL}/api/meta/callback`;

  if (!appId) {
    return NextResponse.json({ error: 'Configuration Meta manquante' }, { status: 500, headers: corsHeaders() });
  }

  // Store user state in database for OAuth callback verification
  try {
    const supabase = getSupabaseAdmin();
    const state = uuidv4();

    const { error } = await supabase
      .from('oauth_states')
      .insert({
        state,
        user_id: user.id,
        provider: 'meta',
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 minutes
      });

    if (error) throw error;

    // Facebook OAuth URL with required permissions
    const permissions = [
      'ads_management',
      'ads_read',
      'business_management',
      'pages_show_list',
      'pages_read_engagement'
    ].join(',');

    const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=${permissions}&response_type=code`;

    return NextResponse.json({ authUrl }, { headers: corsHeaders() });
  } catch (err) {
    console.error('Initiate meta auth error:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500, headers: corsHeaders() });
  }
}

async function handleMetaCallback(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/#/settings?error=meta_auth_denied`);
  }

  if (!code || !state) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/#/settings?error=invalid_callback`);
  }

  try {
    const supabase = getSupabaseAdmin();

    // Verify state
    const { data: oauthState, error: stateError } = await supabase
      .from('oauth_states')
      .select('*')
      .eq('state', state)
      .eq('provider', 'meta')
      .single();

    if (stateError || !oauthState || new Date(oauthState.expires_at) < new Date()) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/#/settings?error=invalid_state`);
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.META_APP_ID,
        client_secret: process.env.META_APP_SECRET,
        redirect_uri: process.env.META_REDIRECT_URI || `${process.env.NEXT_PUBLIC_BASE_URL}/api/meta/callback`,
        code
      })
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const tokenData = await tokenResponse.json();

    // Get user info from Meta
    const userInfoResponse = await fetch(`https://graph.facebook.com/v18.0/me?fields=id,name,email&access_token=${tokenData.access_token}`);
    const userInfo = await userInfoResponse.json();

    // Store connection in database
    const { error: upsertError } = await supabase
      .from('meta_connections')
      .upsert({
        user_id: oauthState.user_id,
        meta_user_id: userInfo.id,
        name: userInfo.name,
        email: userInfo.email,
        access_token: tokenData.access_token,
        token_type: tokenData.token_type,
        expires_in: tokenData.expires_in,
        connected_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id',
        ignoreDuplicates: false
      });

    if (upsertError) throw upsertError;

    // Clean up used state
    await supabase
      .from('oauth_states')
      .delete()
      .eq('state', state);

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/#/settings?success=meta_connected`);
  } catch (err) {
    console.error('Meta callback error:', err);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/#/settings?error=connection_failed`);
  }
}

async function handleDeleteMetaConnection(request) {
  const user = await getAuthUser(request);
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401, headers: corsHeaders() });

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from('meta_connections')
      .delete()
      .eq('user_id', user.id);

    if (error) throw error;

    return NextResponse.json({ success: true }, { headers: corsHeaders() });
  } catch (err) {
    console.error('Delete meta connection error:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500, headers: corsHeaders() });
  }
}

// ============================================
// ADMIN API HANDLERS
// ============================================
async function handleAdminStats(request) {
  const user = await getAuthUser(request);
  if (!user || (user.email !== 'dodjiq@gmail.com' && user.user_metadata?.role !== 'admin')) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403, headers: corsHeaders() });
  }

  try {
    const supabase = getSupabaseAdmin();

    // Get stats from admin_stats view
    const { data: stats, error: statsError } = await supabase
      .from('admin_stats')
      .select('*')
      .single();

    if (statsError) throw statsError;

    // Get daily signups
    const { data: dailySignups, error: signupsError } = await supabase
      .from('daily_signups')
      .select('*')
      .order('date', { ascending: false })
      .limit(30);

    // Get active connections (stores + meta connections)
    const { count: activeStores } = await supabase
      .from('stores')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    const { count: metaConnections } = await supabase
      .from('meta_connections')
      .select('*', { count: 'exact', head: true });

    const activeSubscriptions = (activeStores || 0) + (metaConnections || 0);

    // Monthly revenue - placeholder for now (will integrate with Stripe)
    const monthlyRevenue = 0;

    return NextResponse.json({
      totalUsers: stats?.total_users || 0,
      totalTemplates: stats?.total_templates || 0,
      activeSubscriptions,
      proSubscriptions: stats?.pro_subscriptions || 0,
      monthlyRevenue,
      dailySignups: signupsError ? [] : (dailySignups || [])
    }, { headers: corsHeaders() });
  } catch (err) {
    console.error('Admin stats error:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500, headers: corsHeaders() });
  }
}

async function handleAdminGetTemplates(request) {
  const user = await getAuthUser(request);
  if (!user || (user.email !== 'dodjiq@gmail.com' && user.user_metadata?.role !== 'admin')) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403, headers: corsHeaders() });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data: templates, error } = await supabase
      .from('templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      templates: templates || []
    }, { headers: corsHeaders() });
  } catch (err) {
    console.error('Admin get templates error:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500, headers: corsHeaders() });
  }
}

async function handleAdminGetUsers(request) {
  const user = await getAuthUser(request);
  if (!user || (user.email !== 'dodjiq@gmail.com' && user.user_metadata?.role !== 'admin')) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403, headers: corsHeaders() });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data: usersData, error } = await supabase.auth.admin.listUsers();

    if (error) throw error;

    const users = usersData.users.map(u => ({
      id: u.id,
      email: u.email,
      full_name: u.user_metadata?.full_name || u.user_metadata?.name || '-',
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at,
      email_confirmed: !!u.email_confirmed_at,
      role: u.user_metadata?.role || 'user'
    }));

    return NextResponse.json({ users }, { headers: corsHeaders() });
  } catch (err) {
    console.error('Admin get users error:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500, headers: corsHeaders() });
  }
}

async function handleAdminUpdateUserRole(request, userId) {
  const user = await getAuthUser(request);
  if (!user || (user.email !== 'dodjiq@gmail.com' && user.user_metadata?.role !== 'admin')) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403, headers: corsHeaders() });
  }

  try {
    const { role } = await request.json(); // e.g., 'user', 'pro', 'admin'
    const supabase = getSupabaseAdmin();
    
    // Update user metadata in Supabase Auth
    const { data, error } = await supabase.auth.admin.updateUserById(
      userId,
      { user_metadata: { role } }
    );

    if (error) throw error;

    return NextResponse.json({ success: true, user: data.user }, { headers: corsHeaders() });
  } catch (err) {
    console.error('Admin update user role error:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500, headers: corsHeaders() });
  }
}

async function handleAdminDeleteTemplate(request, templateId) {
  const user = await getAuthUser(request);
  if (!user || (user.email !== 'dodjiq@gmail.com' && user.user_metadata?.role !== 'admin')) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403, headers: corsHeaders() });
  }

  try {
    const supabase = getSupabaseAdmin();

    // Delete template (saved_templates will cascade delete automatically)
    const { error } = await supabase
      .from('templates')
      .delete()
      .eq('id', templateId);

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Template non trouvé' }, { status: 404, headers: corsHeaders() });
      }
      throw error;
    }

    return NextResponse.json({ success: true }, { headers: corsHeaders() });
  } catch (err) {
    console.error('Admin delete template error:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500, headers: corsHeaders() });
  }
}

async function handleGetAnnouncements(request) {
  try {
    const supabase = getSupabaseAdmin();
    const { data: ann, error } = await supabase
      .from('admin_notifications')
      .select('message, type')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is no rows
    return NextResponse.json({ announcement: ann || null }, { headers: corsHeaders() });
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500, headers: corsHeaders() });
  }
}

async function handleAdminUpdateAnnouncement(request) {
  const user = await getAuthUser(request);
  if (!user || (user.email !== 'dodjiq@gmail.com' && user.user_metadata?.role !== 'admin')) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403, headers: corsHeaders() });
  }
  try {
    const { message, is_active } = await request.json();
    const supabase = getSupabaseAdmin();

    // Disable any existing active announcements
    await supabase.from('admin_notifications').update({ is_active: false }).eq('is_active', true);

    // Insert new active announcement if provided
    if (is_active && message?.trim()) {
      await supabase.from('admin_notifications').insert([{ message: message.trim(), type: 'info', is_active: true }]);
    }
    
    return NextResponse.json({ success: true }, { headers: corsHeaders() });
  } catch (err) {
    console.error('Admin update announcement error:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500, headers: corsHeaders() });
  }
}

async function handleAdminCreateTemplate(request) {
  const user = await getAuthUser(request);
  if (!user || (user.email !== 'dodjiq@gmail.com' && user.user_metadata?.role !== 'admin')) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403, headers: corsHeaders() });
  }

  try {
    const body = await request.json();
    const { title, description, niche, format, tags, is_premium, preview_url } = body;

    if (!title || !niche || !format) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400, headers: corsHeaders() });
    }

    const newTemplate = {
      id: `t${Date.now()}`,
      title,
      description: description || '',
      niche,
      format,
      canva_template_id: `mock_canva_${Date.now()}`,
      preview_url: preview_url || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=400&fit=crop',
      tags: tags || [],
      is_premium: is_premium || false
    };

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('templates')
      .insert(newTemplate)
      .select('*')
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, template: data }, { headers: corsHeaders() });
  } catch (err) {
    console.error('Admin create template error:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500, headers: corsHeaders() });
  }
}

async function handleAdminUpdateTemplate(request, templateId) {
  const user = await getAuthUser(request);
  if (!user || (user.email !== 'dodjiq@gmail.com' && user.user_metadata?.role !== 'admin')) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403, headers: corsHeaders() });
  }

  try {
    const body = await request.json();
    const { title, description, niche, format, tags, is_premium, preview_url } = body;

    const updateData = {
      updated_at: new Date().toISOString()
    };

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (niche !== undefined) updateData.niche = niche;
    if (format !== undefined) updateData.format = format;
    if (tags !== undefined) updateData.tags = tags;
    if (is_premium !== undefined) updateData.is_premium = is_premium;
    if (preview_url !== undefined) updateData.preview_url = preview_url;

    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from('templates')
      .update(updateData)
      .eq('id', templateId);

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Template non trouvé' }, { status: 404, headers: corsHeaders() });
      }
      throw error;
    }

    return NextResponse.json({ success: true }, { headers: corsHeaders() });
  } catch (err) {
    console.error('Admin update template error:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500, headers: corsHeaders() });
  }
}

// ============================================
// ROUTE HANDLERS
// ============================================
export async function GET(request, context) {
  const params = await context.params;
  const pathSegments = params?.path || [];
  const path = pathSegments.join('/');

  switch (path) {
    case 'public/announcements': return handleGetAnnouncements(request);
    case 'templates': return handleGetTemplates(request);
    case 'templates/saved': return handleGetSavedTemplates(request);
    case 'store': return handleGetStore(request);
    case 'profile': return handleGetProfile(request);
    case 'meta/connection': return handleGetMetaConnection(request);
    case 'meta/callback': return handleMetaCallback(request);
    case 'admin/stats': return handleAdminStats(request);
    case 'admin/templates': return handleAdminGetTemplates(request);
    case 'admin/users': return handleAdminGetUsers(request);
    case 'health': return handleHealth();
    default: return NextResponse.json({ error: 'Route non trouvée' }, { status: 404, headers: corsHeaders() });
  }
}

export async function POST(request, context) {
  const params = await context.params;
  const pathSegments = params?.path || [];
  const path = pathSegments.join('/');

  switch (path) {
    case 'templates/save': return handleSaveTemplate(request);
    case 'templates/seed': return handleSeedTemplates();
    case 'shopify/connect': return handleShopifyConnect(request);
    case 'store/disconnect': return handleDisconnectStore(request);
    case 'profile': return handleUpdateProfile(request);
    case 'meta/auth': return handleInitiateMetaAuth(request);
    case 'admin/templates': return handleAdminCreateTemplate(request);
    default: return NextResponse.json({ error: 'Route non trouvée' }, { status: 404, headers: corsHeaders() });
  }
}

export async function PUT(request, context) {
  const params = await context.params;
  const pathSegments = params?.path || [];
  const path = pathSegments.join('/');

  // Handle admin template updates (PUT /api/admin/templates/:id)
  if (pathSegments[0] === 'admin' && pathSegments[1] === 'templates' && pathSegments[2]) {
    return handleAdminUpdateTemplate(request, pathSegments[2]);
  }

  // Handle admin user role updates (PUT /api/admin/users/:id/role)
  if (pathSegments[0] === 'admin' && pathSegments[1] === 'users' && pathSegments[2] && pathSegments[3] === 'role') {
    return handleAdminUpdateUserRole(request, pathSegments[2]);
  }

  if (path === 'admin/announcements') {
    return handleAdminUpdateAnnouncement(request);
  }

  return NextResponse.json({ error: 'Route non trouvée' }, { status: 404, headers: corsHeaders() });
}

export async function DELETE(request, context) {
  const params = await context.params;
  const pathSegments = params?.path || [];
  const path = pathSegments.join('/');

  // Handle admin template deletion (DELETE /api/admin/templates/:id)
  if (pathSegments[0] === 'admin' && pathSegments[1] === 'templates' && pathSegments[2]) {
    return handleAdminDeleteTemplate(request, pathSegments[2]);
  }

  switch (path) {
    case 'store': return handleDisconnectStore(request);
    case 'meta/connection': return handleDeleteMetaConnection(request);
    default: return NextResponse.json({ error: 'Route non trouvée' }, { status: 404, headers: corsHeaders() });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}
