// ============================================
// SUPABASE EDGE FUNCTION: SCRAPE SHOPIFY PRODUCT
// ============================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScrapeRequest {
  url: string;
}

interface ShopifyProductJSON {
  product: {
    id: number;
    title: string;
    body_html: string;
    vendor: string;
    product_type: string;
    handle: string;
    tags: string[];
    variants: Array<{
      id: number;
      title: string;
      price: string;
      compare_at_price: string | null;
      sku: string;
      position: number;
      option1: string | null;
      option2: string | null;
      option3: string | null;
      inventory_quantity: number;
      weight: number;
      weight_unit: string;
    }>;
    options: Array<{
      id: number;
      name: string;
      position: number;
      values: string[];
    }>;
    images: Array<{
      id: number;
      position: number;
      alt: string | null;
      width: number;
      height: number;
      src: string;
      variant_ids: number[];
    }>;
  };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Vérifier l'authentification
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Parser la requête
    const { url }: ScrapeRequest = await req.json();
    
    if (!url) {
      throw new Error('URL is required');
    }

    // Extraire le domaine et le handle du produit
    const urlObj = new URL(url);
    const shopDomain = urlObj.hostname;
    const pathParts = urlObj.pathname.split('/');
    const productIndex = pathParts.indexOf('products');
    
    if (productIndex === -1 || !pathParts[productIndex + 1]) {
      throw new Error('Invalid Shopify product URL');
    }

    const productHandle = pathParts[productIndex + 1].split('?')[0];

    // Construire l'URL JSON
    let jsonUrl = `https://${shopDomain}/products/${productHandle}.json`;
    
    console.log(`Fetching product from: ${jsonUrl}`);

    // Tenter de récupérer le JSON
    const response = await fetch(jsonUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.status} ${response.statusText}`);
    }

    const data: ShopifyProductJSON = await response.json();
    const product = data.product;

    // Normaliser les données au format ScrapedProduct
    const scrapedProduct = {
      scraped_at: new Date().toISOString(),
      source_url: url,
      source_shop_domain: shopDomain,
      id: product.id,
      title: product.title,
      body_html: product.body_html,
      vendor: product.vendor,
      product_type: product.product_type,
      handle: product.handle,
      tags: product.tags,
      status: 'active' as const,
      variants: product.variants.map(v => ({
        id: v.id,
        title: v.title,
        price: v.price,
        compare_at_price: v.compare_at_price,
        sku: v.sku,
        position: v.position,
        option1: v.option1,
        option2: v.option2,
        option3: v.option3,
        inventory_quantity: v.inventory_quantity,
        weight: v.weight,
        weight_unit: v.weight_unit as any,
        taxable: true,
        requires_shipping: true,
      })),
      options: product.options,
      images: product.images.map(img => ({
        id: img.id,
        position: img.position,
        alt: img.alt,
        width: img.width,
        height: img.height,
        src: img.src,
        variant_ids: img.variant_ids,
        selected: true, // Par défaut toutes sélectionnées
      })),
      is_edited: false,
      edited_fields: [],
    };

    // Sauvegarder dans Supabase
    const { data: savedProduct, error: saveError } = await supabaseClient
      .from('scraped_products')
      .insert({
        user_id: user.id,
        product_data: scrapedProduct,
        status: 'scraped',
        source_url: url,
        source_shop_domain: shopDomain,
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving product:', saveError);
      throw new Error('Failed to save scraped product');
    }

    return new Response(
      JSON.stringify({
        success: true,
        product: scrapedProduct,
        record_id: savedProduct.id,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Scraping error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
