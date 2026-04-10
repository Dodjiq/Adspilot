import '@shopify/shopify-api/adapters/node';
import { shopifyApi, LATEST_API_VERSION } from '@shopify/shopify-api';

// ============================================
// SHOPIFY API CONFIGURATION
// ============================================

export const shopify = shopifyApi({
  apiKey: process.env.NEXT_PUBLIC_SHOPIFY_CLIENT_ID,
  apiSecretKey: process.env.SHOPIFY_CLIENT_SECRET,
  scopes: process.env.SHOPIFY_SCOPES?.split(',') || [
    'read_products',
    'read_product_listings',
    'read_inventory',
    'read_orders',
    'read_customers',
    'read_analytics',
  ],
  hostName: process.env.SHOPIFY_APP_URL?.replace('https://', '') || 'adspilot-beta.vercel.app',
  hostScheme: 'https',
  apiVersion: process.env.SHOPIFY_API_VERSION || LATEST_API_VERSION,
  isEmbeddedApp: false,
  isCustomStoreApp: false,
});

// ============================================
// HELPER: Generate OAuth URL
// ============================================
export function generateAuthUrl(shop, state) {
  const authUrl = `https://${shop}/admin/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_SHOPIFY_CLIENT_ID}&scope=${process.env.SHOPIFY_SCOPES}&redirect_uri=${process.env.SHOPIFY_REDIRECT_URI}&state=${state}&grant_options[]=per-user`;
  
  return authUrl;
}

// ============================================
// HELPER: Validate Shop Domain
// ============================================
export function validateShopDomain(shop) {
  if (!shop) return null;
  
  shop = shop.replace(/^https?:\/\//, '');
  shop = shop.replace(/\/$/, '');
  
  if (!shop.includes('.myshopify.com')) {
    if (!shop.includes('.')) {
      shop = `${shop}.myshopify.com`;
    }
  }
  
  const shopRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/;
  if (!shopRegex.test(shop)) {
    return null;
  }
  
  return shop;
}

// ============================================
// HELPER: Verify HMAC (Security)
// ============================================
export function verifyShopifyHmac(query, secret) {
  const crypto = require('crypto');
  
  const { hmac, ...params } = query;
  
  if (!hmac) return false;
  
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

// ============================================
// HELPER: Exchange Code for Access Token
// ============================================
export async function exchangeCodeForToken(shop, code) {
  try {
    const response = await fetch(
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

    if (!response.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const data = await response.json();
    return {
      accessToken: data.access_token,
      scope: data.scope,
    };
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    throw error;
  }
}

// ============================================
// HELPER: Fetch Shop Info
// ============================================
export async function fetchShopInfo(shop, accessToken) {
  try {
    const response = await fetch(
      `https://${shop}/admin/api/${process.env.SHOPIFY_API_VERSION || '2024-01'}/shop.json`,
      {
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch shop info');
    }

    const data = await response.json();
    return data.shop;
  } catch (error) {
    console.error('Error fetching shop info:', error);
    throw error;
  }
}

// ============================================
// HELPER: Fetch Products
// ============================================
export async function fetchShopifyProducts(shop, accessToken, limit = 50) {
  try {
    const response = await fetch(
      `https://${shop}/admin/api/${process.env.SHOPIFY_API_VERSION || '2024-01'}/products.json?limit=${limit}`,
      {
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}
