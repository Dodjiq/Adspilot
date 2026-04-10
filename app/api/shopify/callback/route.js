import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ============================================
// SHOPIFY OAUTH CALLBACK HANDLER
// ============================================

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const shop = searchParams.get('shop');
  const state = searchParams.get('state');
  const hmac = searchParams.get('hmac');

  // Validation basique
  if (!code || !shop) {
    return NextResponse.redirect(
      new URL('/scrapify?error=missing_params', request.url)
    );
  }

  // TODO: Vérifier le HMAC pour sécurité (optionnel mais recommandé)
  // const isValid = verifyShopifyHmac(searchParams, process.env.SHOPIFY_CLIENT_SECRET);
  // if (!isValid) {
  //   return NextResponse.redirect(new URL('/scrapify?error=invalid_hmac', request.url));
  // }

  try {
    // Échanger le code contre un access token
    const tokenResponse = await fetch(
      `https://${shop}/admin/oauth/access_token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: process.env.NEXT_PUBLIC_SHOPIFY_CLIENT_ID,
          client_secret: process.env.SHOPIFY_CLIENT_SECRET,
          code,
        }),
      }
    );

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const tokenData = await tokenResponse.json();
    const { access_token, scope } = tokenData;

    // Récupérer les infos de la boutique
    const shopInfoResponse = await fetch(
      `https://${shop}/admin/api/2024-01/shop.json`,
      {
        headers: {
          'X-Shopify-Access-Token': access_token,
        },
      }
    );

    let shopInfo = { name: shop, email: '', owner: '' };
    if (shopInfoResponse.ok) {
      const shopData = await shopInfoResponse.json();
      shopInfo = {
        name: shopData.shop?.name || shop,
        email: shopData.shop?.email || '',
        owner: shopData.shop?.shop_owner || '',
      };
    }

    // Récupérer l'utilisateur connecté depuis le cookie de session
    const supabase = getSupabaseAdmin();
    
    // Note: Dans un vrai scénario, il faudrait passer le user_id via le state parameter
    // Pour simplifier, on va essayer de récupérer depuis les cookies
    const cookieHeader = request.headers.get('cookie');
    let userId = null;

    if (cookieHeader) {
      // Essayer d'extraire le token de session Supabase
      const cookies = Object.fromEntries(
        cookieHeader.split('; ').map(c => c.split('='))
      );
      
      // Chercher le cookie de session Supabase
      const sessionCookie = Object.entries(cookies).find(([key]) => 
        key.includes('supabase')
      );

      if (sessionCookie) {
        try {
          const sessionData = JSON.parse(decodeURIComponent(sessionCookie[1]));
          userId = sessionData?.user?.id;
        } catch (e) {
          console.error('Failed to parse session:', e);
        }
      }
    }

    // Si on n'a pas pu récupérer l'user_id, rediriger avec erreur
    if (!userId) {
      // Alternative: stocker temporairement et demander à l'utilisateur de se reconnecter
      return NextResponse.redirect(
        new URL('/scrapify?error=session_expired', request.url)
      );
    }

    // Sauvegarder la boutique dans Supabase
    const { error: insertError } = await supabase
      .from('shopify_stores')
      .upsert({
        user_id: userId,
        shop_domain: shop,
        shop_name: shopInfo.name,
        shop_email: shopInfo.email,
        shop_owner: shopInfo.owner,
        access_token: access_token, // TODO: Chiffrer avec pgcrypto
        scope: scope,
        is_active: true,
        last_sync_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,shop_domain',
      });

    if (insertError) {
      console.error('Error saving store:', insertError);
      throw insertError;
    }

    // Rediriger vers Scrapify avec succès
    return NextResponse.redirect(
      new URL('/scrapify?success=store_connected', request.url)
    );

  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(
      new URL(`/scrapify?error=${encodeURIComponent(error.message)}`, request.url)
    );
  }
}

// ============================================
// HELPER: Verify Shopify HMAC (sécurité)
// ============================================
function verifyShopifyHmac(searchParams, secret) {
  const crypto = require('crypto');
  
  const hmac = searchParams.get('hmac');
  const params = {};
  
  for (const [key, value] of searchParams.entries()) {
    if (key !== 'hmac' && key !== 'signature') {
      params[key] = value;
    }
  }
  
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  
  const hash = crypto
    .createHmac('sha256', secret)
    .update(sortedParams)
    .digest('hex');
  
  return hash === hmac;
}
