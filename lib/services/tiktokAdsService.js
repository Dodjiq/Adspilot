/**
 * TIKTOK COMMERCIAL CONTENT API SERVICE
 * Documentation: https://developers.tiktok.com/doc/commercial-content-api-get-started
 */

const TIKTOK_COMMERCIAL_API = 'https://business-api.tiktok.com/open_api/v1.3';

/**
 * @typedef {Object} TikTokAdSearchParams
 * @property {string} keyword - Mot-clé de recherche
 * @property {string} [country_code] - Code pays (ex: 'FR', 'US')
 * @property {number} [page] - Page number
 * @property {number} [page_size] - Results per page (max 100)
 */

/**
 * Recherche des publicités TikTok via Commercial Content API
 * @param {TikTokAdSearchParams} params
 * @param {string} accessToken - User's TikTok access token
 * @returns {Promise<Object>}
 */
export async function searchTikTokAds(params, accessToken) {
  const {
    keyword,
    country_code = 'US',
    page = 1,
    page_size = 20
  } = params;

  // Note: TikTok Commercial Content API structure
  // L'endpoint exact peut varier selon la version de l'API
  const url = `${TIKTOK_COMMERCIAL_API}/creative/search/`;

  const requestBody = {
    keyword: keyword,
    filters: {
      country_code: country_code,
      is_active: true
    },
    page: page,
    page_size: page_size
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Token': accessToken
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'TikTok API request failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('TikTok Ads API Error:', error);
    throw error;
  }
}

/**
 * Récupère les détails d'une publicité TikTok spécifique
 * @param {string} adId
 * @param {string} accessToken
 * @returns {Promise<Object>}
 */
export async function getTikTokAdDetails(adId, accessToken) {
  const url = `${TIKTOK_COMMERCIAL_API}/creative/get/`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Token': accessToken
      },
      body: JSON.stringify({
        creative_id: adId
      })
    });

    if (!response.ok) throw new Error('Failed to fetch TikTok ad details');
    return await response.json();
  } catch (error) {
    console.error('TikTok Ad Details Error:', error);
    throw error;
  }
}

/**
 * Normalise une publicité TikTok vers le format unifié
 * @param {Object} tiktokAd - Raw TikTok ad object
 * @returns {Object} Unified ad object
 */
export function mapTikTokAdToUnified(tiktokAd) {
  // TikTok structure (peut varier selon l'API version)
  const creative = tiktokAd.creative_info || tiktokAd;
  const video = creative.video_info || {};
  const text = creative.ad_text || creative.text || '';

  // Extraction des métriques
  const metrics = tiktokAd.metrics || {};
  const spend = metrics.spend || 0;
  const impressions = metrics.impressions || 0;

  return {
    // Identifiants
    id: creative.creative_id || creative.id,
    network: 'tiktok',
    ad_id: creative.creative_id || creative.id,
    
    // Informations de marque
    brand_name: creative.advertiser_name || creative.brand_name || 'Unknown',
    page_name: creative.advertiser_name || '',
    page_id: creative.advertiser_id || '',
    
    // Créatif
    ad_creative_url: video.video_url || video.cover_image_url || '',
    ad_creative_type: video.video_url ? 'video' : 'image',
    thumbnail_url: video.cover_image_url || video.video_url || '',
    copy_text: text,
    
    // CTA
    cta_type: creative.call_to_action || 'Learn More',
    cta_text: creative.call_to_action_text || creative.call_to_action || '',
    destination_url: creative.landing_page_url || creative.click_url || '',
    
    // Performance estimates
    spend_estimate_min: Math.floor(spend * 0.8),
    spend_estimate_max: Math.ceil(spend * 1.2),
    impressions_estimate_min: Math.floor(impressions * 0.8),
    impressions_estimate_max: Math.ceil(impressions * 1.2),
    currency: 'USD',
    
    // Dates
    started_running_at: creative.create_time || creative.start_time,
    stopped_running_at: creative.end_time || null,
    is_active: creative.status === 'ACTIVE' || !creative.end_time,
    
    // Targeting (si disponible)
    target_ages: creative.age_groups?.join(', ') || '',
    target_gender: creative.gender || '',
    target_locations: creative.locations || [],
    
    // Raw data pour debug
    raw_data: tiktokAd
  };
}

/**
 * Batch mapping de plusieurs ads TikTok
 * @param {Array} tiktokAds
 * @returns {Array}
 */
export function mapTikTokAdsToUnified(tiktokAds) {
  return tiktokAds.map(mapTikTokAdToUnified);
}

/**
 * Valide un access token TikTok
 * @param {string} accessToken
 * @returns {Promise<boolean>}
 */
export async function validateTikTokToken(accessToken) {
  try {
    const response = await fetch(
      `${TIKTOK_COMMERCIAL_API}/oauth2/userinfo/`,
      {
        headers: {
          'Access-Token': accessToken
        }
      }
    );
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Récupère les trending hashtags TikTok (bonus feature)
 * @param {string} accessToken
 * @param {string} country_code
 * @returns {Promise<Array>}
 */
export async function getTrendingHashtags(accessToken, country_code = 'US') {
  const url = `${TIKTOK_COMMERCIAL_API}/trending/hashtag/`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Token': accessToken
      },
      body: JSON.stringify({
        country_code: country_code,
        limit: 20
      })
    });

    if (!response.ok) return [];
    const data = await response.json();
    return data.data?.hashtags || [];
  } catch (error) {
    console.error('TikTok Trending Hashtags Error:', error);
    return [];
  }
}
