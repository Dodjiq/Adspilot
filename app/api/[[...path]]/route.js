import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// ============================================
// DATABASE
// ============================================
let cachedClient = null;
let cachedDb = null;

async function getDb() {
  if (cachedDb) return cachedDb;
  const client = await MongoClient.connect(process.env.MONGO_URL);
  const db = client.db(process.env.DB_NAME || 'easyecom');
  cachedClient = client;
  cachedDb = db;
  return db;
}

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
    const db = await getDb();
    let templates = await db.collection('templates').find({}).toArray();
    if (!templates.length) {
      // Auto-seed if empty
      await db.collection('templates').insertMany(SEED_TEMPLATES.map(t => ({ ...t, created_at: new Date().toISOString() })));
      templates = SEED_TEMPLATES;
    }
    // Clean MongoDB _id
    templates = templates.map(({ _id, ...rest }) => rest);
    return NextResponse.json({ templates }, { headers: corsHeaders() });
  } catch (err) {
    return NextResponse.json({ templates: SEED_TEMPLATES }, { headers: corsHeaders() });
  }
}

async function handleGetSavedTemplates(request) {
  const user = await getAuthUser(request);
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401, headers: corsHeaders() });
  try {
    const db = await getDb();
    const saved = await db.collection('saved_templates').find({ user_id: user.id }).toArray();
    return NextResponse.json({ saved: saved.map(({ _id, ...rest }) => rest) }, { headers: corsHeaders() });
  } catch (err) {
    return NextResponse.json({ saved: [] }, { headers: corsHeaders() });
  }
}

async function handleSaveTemplate(request) {
  const user = await getAuthUser(request);
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401, headers: corsHeaders() });
  try {
    const { template_id, action } = await request.json();
    const db = await getDb();
    if (action === 'unsave') {
      await db.collection('saved_templates').deleteOne({ user_id: user.id, template_id });
    } else {
      await db.collection('saved_templates').updateOne(
        { user_id: user.id, template_id },
        { $set: { user_id: user.id, template_id, saved_at: new Date().toISOString() } },
        { upsert: true }
      );
    }
    return NextResponse.json({ success: true }, { headers: corsHeaders() });
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500, headers: corsHeaders() });
  }
}

async function handleSeedTemplates() {
  try {
    const db = await getDb();
    await db.collection('templates').deleteMany({});
    await db.collection('templates').insertMany(SEED_TEMPLATES.map(t => ({ ...t, created_at: new Date().toISOString() })));
    return NextResponse.json({ success: true, count: SEED_TEMPLATES.length }, { headers: corsHeaders() });
  } catch (err) {
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
      headers: { 'User-Agent': 'EasyEcom/1.0' }
    });
    if (!response.ok) throw new Error('Boutique non accessible');
    const data = await response.json();
    const products = (data.products || []).slice(0, 6);

    const store = {
      id: uuidv4(),
      user_id: user.id,
      shopify_domain: domain,
      shop_name: domain.split('.')[0].replace(/-/g, ' '),
      currency: 'EUR',
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

    const db = await getDb();
    await db.collection('stores').updateOne(
      { user_id: user.id },
      { $set: store },
      { upsert: true }
    );

    return NextResponse.json({ success: true, store }, { headers: corsHeaders() });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'URL invalide ou boutique non accessible' }, { status: 400, headers: corsHeaders() });
  }
}

async function handleGetStore(request) {
  const user = await getAuthUser(request);
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401, headers: corsHeaders() });
  try {
    const db = await getDb();
    const store = await db.collection('stores').findOne({ user_id: user.id, is_active: true });
    if (!store) return NextResponse.json({ store: null }, { headers: corsHeaders() });
    const { _id, ...storeData } = store;
    return NextResponse.json({ store: storeData }, { headers: corsHeaders() });
  } catch (err) {
    return NextResponse.json({ store: null }, { headers: corsHeaders() });
  }
}

async function handleDisconnectStore(request) {
  const user = await getAuthUser(request);
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401, headers: corsHeaders() });
  try {
    const db = await getDb();
    await db.collection('stores').updateOne(
      { user_id: user.id },
      { $set: { is_active: false } }
    );
    return NextResponse.json({ success: true }, { headers: corsHeaders() });
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500, headers: corsHeaders() });
  }
}

async function handleGetProfile(request) {
  const user = await getAuthUser(request);
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401, headers: corsHeaders() });
  try {
    const db = await getDb();
    const profile = await db.collection('profiles').findOne({ user_id: user.id });
    if (!profile) return NextResponse.json({ profile: null }, { headers: corsHeaders() });
    const { _id, ...profileData } = profile;
    return NextResponse.json({ profile: profileData }, { headers: corsHeaders() });
  } catch (err) {
    return NextResponse.json({ profile: null }, { headers: corsHeaders() });
  }
}

async function handleUpdateProfile(request) {
  const user = await getAuthUser(request);
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401, headers: corsHeaders() });
  try {
    const body = await request.json();
    const { full_name, business_name, business_niche } = body;
    const db = await getDb();
    await db.collection('profiles').updateOne(
      { user_id: user.id },
      {
        $set: {
          user_id: user.id,
          full_name: full_name || '',
          business_name: business_name || '',
          business_niche: business_niche || '',
          updated_at: new Date().toISOString(),
        },
        $setOnInsert: {
          id: uuidv4(),
          created_at: new Date().toISOString(),
        }
      },
      { upsert: true }
    );
    return NextResponse.json({ success: true }, { headers: corsHeaders() });
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500, headers: corsHeaders() });
  }
}

async function handleHealth() {
  return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() }, { headers: corsHeaders() });
}

// ============================================
// ROUTE HANDLERS
// ============================================
export async function GET(request, context) {
  const params = await context.params;
  const pathSegments = params?.path || [];
  const path = pathSegments.join('/');

  switch (path) {
    case 'templates': return handleGetTemplates(request);
    case 'templates/saved': return handleGetSavedTemplates(request);
    case 'store': return handleGetStore(request);
    case 'profile': return handleGetProfile(request);
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
    default: return NextResponse.json({ error: 'Route non trouvée' }, { status: 404, headers: corsHeaders() });
  }
}

export async function DELETE(request, context) {
  const params = await context.params;
  const pathSegments = params?.path || [];
  const path = pathSegments.join('/');

  switch (path) {
    case 'store': return handleDisconnectStore(request);
    default: return NextResponse.json({ error: 'Route non trouvée' }, { status: 404, headers: corsHeaders() });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}
