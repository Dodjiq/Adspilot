// ============================================
// SCRAPIFY SERVICE - API CALLS
// ============================================

/**
 * Scrape un produit Shopify via l'Edge Function (avec fallback direct)
 */
export async function scrapeShopifyProduct(url, supabase) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('Non authentifié');
    }

    // Essayer d'abord l'Edge Function
    try {
      const edgeFunctionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/scrape-shopify-product`;
      const response = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          return data;
        }
      }
    } catch (edgeError) {
      console.warn('Edge Function non disponible, utilisation du fallback direct:', edgeError);
    }

    // Fallback : scraping direct côté client
    console.log('Utilisation du scraping direct (fallback)');
    return await scrapeShopifyProductDirect(url, supabase);

  } catch (error) {
    console.error('Scraping error:', error);
    throw error;
  }
}

/**
 * Scrape direct via l'API JSON publique de Shopify (fallback)
 */
async function scrapeShopifyProductDirect(url, supabase) {
  try {
    // Extraire le domaine et le handle du produit
    const urlObj = new URL(url);
    const shopDomain = urlObj.hostname;
    const pathParts = urlObj.pathname.split('/');
    const productIndex = pathParts.indexOf('products');
    
    if (productIndex === -1 || !pathParts[productIndex + 1]) {
      throw new Error('URL de produit Shopify invalide');
    }

    const productHandle = pathParts[productIndex + 1].split('?')[0];
    const jsonUrl = `https://${shopDomain}/products/${productHandle}.json`;

    // Récupérer le JSON du produit
    const response = await fetch(jsonUrl);
    
    if (!response.ok) {
      throw new Error(`Impossible de récupérer le produit (${response.status})`);
    }

    const data = await response.json();
    const product = data.product;

    // Normaliser les données
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
      tags: product.tags || [],
      status: 'active',
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
        inventory_quantity: v.inventory_quantity || 0,
        weight: v.weight,
        weight_unit: v.weight_unit || 'kg',
        taxable: true,
        requires_shipping: true,
      })),
      options: product.options || [],
      images: product.images.map(img => ({
        id: img.id,
        position: img.position,
        alt: img.alt,
        width: img.width,
        height: img.height,
        src: img.src,
        variant_ids: img.variant_ids || [],
        selected: true,
      })),
      is_edited: false,
      edited_fields: [],
    };

    // Sauvegarder dans Supabase
    const { data: { user } } = await supabase.auth.getUser();
    const { data: savedProduct, error: saveError } = await supabase
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
      console.error('Erreur sauvegarde:', saveError);
      throw new Error('Impossible de sauvegarder le produit');
    }

    return {
      success: true,
      product: scrapedProduct,
      record_id: savedProduct.id,
    };

  } catch (error) {
    console.error('Direct scraping error:', error);
    throw error;
  }
}

/**
 * Récupère les boutiques Shopify connectées de l'utilisateur
 */
export async function getConnectedStores(supabase) {
  const { data, error } = await supabase
    .from('shopify_stores')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Récupère l'historique des produits scrapés
 */
export async function getScrapedProducts(supabase, filters = {}) {
  let query = supabase
    .from('scraped_products')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  if (filters.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;
  
  if (error) throw error;
  return data || [];
}

/**
 * Met à jour un produit scrapé
 */
export async function updateScrapedProduct(supabase, recordId, updates) {
  const { data, error } = await supabase
    .from('scraped_products')
    .update(updates)
    .eq('id', recordId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Supprime un produit scrapé
 */
export async function deleteScrapedProduct(supabase, recordId) {
  const { error } = await supabase
    .from('scraped_products')
    .delete()
    .eq('id', recordId);

  if (error) throw error;
}

/**
 * Publie un produit sur Shopify
 */
export async function publishToShopify(supabase, recordId, shopId, productData) {
  try {
    // Récupérer les credentials de la boutique
    const { data: store, error: storeError } = await supabase
      .from('shopify_stores')
      .select('*')
      .eq('id', shopId)
      .single();

    if (storeError || !store) {
      throw new Error('Boutique non trouvée');
    }

    // Préparer les données pour l'API Shopify
    const shopifyProduct = {
      product: {
        title: productData.title,
        body_html: productData.body_html,
        vendor: productData.vendor || '',
        product_type: productData.product_type || '',
        tags: productData.tags?.join(',') || '',
        status: productData.status || 'draft',
        variants: productData.variants.map(v => ({
          price: v.price,
          compare_at_price: v.compare_at_price,
          sku: v.sku,
          inventory_quantity: v.inventory_quantity || 0,
          option1: v.option1,
          option2: v.option2,
          option3: v.option3,
          weight: v.weight,
          weight_unit: v.weight_unit || 'kg',
          taxable: v.taxable !== false,
          requires_shipping: v.requires_shipping !== false,
        })),
        options: productData.options || [],
        images: productData.images
          .filter(img => img.selected !== false)
          .map(img => ({
            src: img.src,
            alt: img.alt,
            position: img.position,
          })),
      },
    };

    // Appeler l'API Shopify Admin
    const response = await fetch(
      `https://${store.shop_domain}/admin/api/2024-01/products.json`,
      {
        method: 'POST',
        headers: {
          'X-Shopify-Access-Token': store.access_token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shopifyProduct),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors || 'Erreur lors de la publication');
    }

    const result = await response.json();
    const createdProduct = result.product;

    // Mettre à jour le record dans Supabase
    await supabase
      .from('scraped_products')
      .update({
        status: 'published',
        published_to_shop_id: shopId,
        published_product_id: String(createdProduct.id),
        published_at: new Date().toISOString(),
      })
      .eq('id', recordId);

    return {
      success: true,
      product_id: String(createdProduct.id),
      admin_url: `https://${store.shop_domain}/admin/products/${createdProduct.id}`,
    };
  } catch (error) {
    // Enregistrer l'erreur
    await supabase
      .from('scraped_products')
      .update({
        status: 'failed',
        error_message: error.message,
      })
      .eq('id', recordId);

    throw error;
  }
}

/**
 * Initie le flux OAuth Shopify
 */
export function initiateShopifyOAuth(shopDomain) {
  const clientId = process.env.NEXT_PUBLIC_SHOPIFY_CLIENT_ID;
  const redirectUri = `${window.location.origin}/api/shopify/callback`;
  const scopes = 'write_products,read_products,write_inventory,read_inventory';
  const nonce = Math.random().toString(36).substring(7);

  // Stocker le nonce pour vérification
  sessionStorage.setItem('shopify_oauth_nonce', nonce);

  const authUrl = `https://${shopDomain}/admin/oauth/authorize?` +
    `client_id=${clientId}&` +
    `scope=${scopes}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `state=${nonce}`;

  window.location.href = authUrl;
}

/**
 * Déconnecte une boutique Shopify
 */
export async function disconnectShopifyStore(supabase, storeId) {
  const { error } = await supabase
    .from('shopify_stores')
    .update({ is_active: false })
    .eq('id', storeId);

  if (error) throw error;
}

/**
 * Récupère les paramètres Scrapify de l'utilisateur
 */
export async function getScrapifySettings(supabase) {
  const { data, error } = await supabase
    .from('scrapify_settings')
    .select('*')
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows
    throw error;
  }

  // Retourner les settings par défaut si aucun n'existe
  return data || {
    auto_select_all_images: true,
    default_product_status: 'draft',
    preserve_vendor: false,
    preserve_tags: true,
  };
}

/**
 * Met à jour les paramètres Scrapify
 */
export async function updateScrapifySettings(supabase, settings) {
  const { data, error } = await supabase
    .from('scrapify_settings')
    .upsert(settings)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Récupère les statistiques Scrapify
 */
export async function getScrapifyStats(supabase) {
  const { data, error } = await supabase
    .rpc('get_scrapify_stats', {
      p_user_id: (await supabase.auth.getUser()).data.user?.id,
    });

  if (error) throw error;
  return data?.[0] || {
    total_scraped: 0,
    total_published: 0,
    total_failed: 0,
    total_edited: 0,
    connected_stores: 0,
  };
}
