import { NextResponse } from 'next/server';
import { generateAuthUrl, validateShopDomain } from '@/lib/shopify';
import { createClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function POST(request) {
  try {
    const { shopUrl } = await request.json();

    if (!shopUrl) {
      return NextResponse.json(
        { error: 'Shop URL is required' },
        { status: 400 }
      );
    }

    const shop = validateShopDomain(shopUrl);
    
    if (!shop) {
      return NextResponse.json(
        { error: 'Invalid shop domain. Use format: myshop.myshopify.com' },
        { status: 400 }
      );
    }

    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const supabase = getSupabaseAdmin();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    const state = `${user.id}:${Date.now()}:${Math.random().toString(36).substring(7)}`;
    
    const { error: stateError } = await supabase
      .from('oauth_states')
      .insert({
        state,
        user_id: user.id,
        shop_domain: shop,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      });

    if (stateError) {
      console.error('Error storing OAuth state:', stateError);
    }

    const authUrl = generateAuthUrl(shop, state);

    return NextResponse.json({
      success: true,
      authUrl,
      shop,
    });

  } catch (error) {
    console.error('Shopify auth error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate Shopify authentication' },
      { status: 500 }
    );
  }
}
