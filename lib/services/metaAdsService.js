/**
 * META (FACEBOOK) AD LIBRARY API SERVICE
 * Documentation: https://www.facebook.com/ads/library/api
 */

const META_AD_LIBRARY_API = 'https://graph.facebook.com/v19.0/ads_archive';

/**
 * @typedef {Object} MetaAdSearchParams
 * @property {string} searchTerm - Mot-clé de recherche
 * @property {string} adReachedCountries - Code pays (ex: 'FR', 'SN', 'CI')
 * @property {string} [adActiveStatus] - 'ACTIVE', 'INACTIVE', 'ALL'
 * @property {number} [limit] - Nombre de résultats (max 500)
 * @property {string} [after] - Cursor pour pagination
 */

/**
 * Recherche des publicités dans la Meta Ad Library
 * @param {MetaAdSearchParams} params
 * @param {string} accessToken - User's Meta access token
 * @returns {Promise<Object>}
 */
export async function searchMetaAds(params, accessToken) {
  const {
    searchTerm,
    adReachedCountries = 'ALL',
    adActiveStatus = 'ACTIVE',
    limit = 50,
    after = null
  } = params;

  const queryParams = new URLSearchParams({
    access_token: accessToken,
    search_terms: searchTerm,
    ad_reached_countries: adReachedCountries,
    ad_active_status: adActiveStatus,
    ad_type: 'POLITICAL_AND_ISSUE_ADS,HOUSING_ADS,EMPLOYMENT_ADS,CREDIT_ADS,ALL',
    fields: [
      'id',
      'ad_creation_time',
      'ad_creative_bodies',
      'ad_creative_link_captions',
      'ad_creative_link_descriptions',
      'ad_creative_link_titles',
      'ad_delivery_start_time',
      'ad_delivery_stop_time',
      'ad_snapshot_url',
      'age_country_gender_reach_breakdown',
      'beneficiary_payers',
      'bylines',
      'currency',
      'delivery_by_region',
      'demographic_distribution',
      'estimated_audience_size',
      'impressions',
      'languages',
      'page_id',
      'page_name',
      'publisher_platforms',
      'spend',
      'target_ages',
      'target_gender',
      'target_locations'
    ].join(','),
    limit: limit.toString()
  });

  if (after) {
    queryParams.append('after', after);
  }

  const url = `${META_AD_LIBRARY_API}?${queryParams.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Meta API request failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Meta Ads API Error:', error);
    throw error;
  }
}

/**
 * Récupère les détails d'une publicité spécifique
 * @param {string} adId
 * @param {string} accessToken
 * @returns {Promise<Object>}
 */
export async function getMetaAdDetails(adId, accessToken) {
  const url = `https://graph.facebook.com/v19.0/${adId}?access_token=${accessToken}&fields=id,ad_snapshot_url,page_name,ad_creative_bodies`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch ad details');
    return await response.json();
  } catch (error) {
    console.error('Meta Ad Details Error:', error);
    throw error;
  }
}

/**
 * Normalise une publicité Meta vers le format unifié
 * @param {Object} metaAd - Raw Meta ad object
 * @returns {Object} Unified ad object
 */
export function mapMetaAdToUnified(metaAd) {
  // Extraction des données créatives
  const creativeBody = metaAd.ad_creative_bodies?.[0] || '';
  const linkTitle = metaAd.ad_creative_link_titles?.[0] || '';
  const linkDescription = metaAd.ad_creative_link_descriptions?.[0] || '';
  
  // Combine le texte
  const copyText = [creativeBody, linkTitle, linkDescription]
    .filter(Boolean)
    .join(' | ');

  // Extraction des dépenses
  const spendData = metaAd.spend || {};
  const spendMin = spendData.lower_bound || 0;
  const spendMax = spendData.upper_bound || 0;

  // Extraction des impressions
  const impressionsData = metaAd.impressions || {};
  const impressionsMin = impressionsData.lower_bound || 0;
  const impressionsMax = impressionsData.upper_bound || 0;

  // Détermination du type de créatif
  let creativeType = 'image';
  if (metaAd.ad_snapshot_url?.includes('video')) {
    creativeType = 'video';
  } else if (metaAd.ad_creative_bodies?.length > 1) {
    creativeType = 'carousel';
  }

  // Détermination du réseau (Facebook ou Instagram)
  const platforms = metaAd.publisher_platforms || [];
  const network = platforms.includes('instagram') ? 'instagram' : 'facebook';

  return {
    // Identifiants
    id: metaAd.id,
    network: network,
    ad_id: metaAd.id,
    
    // Informations de marque
    brand_name: metaAd.page_name || 'Unknown',
    page_name: metaAd.page_name || '',
    page_id: metaAd.page_id || '',
    
    // Créatif
    ad_creative_url: metaAd.ad_snapshot_url || '',
    ad_creative_type: creativeType,
    thumbnail_url: metaAd.ad_snapshot_url || '',
    copy_text: copyText,
    
    // CTA
    cta_type: metaAd.ad_creative_link_captions?.[0] || 'Learn More',
    cta_text: metaAd.ad_creative_link_captions?.[0] || '',
    destination_url: metaAd.link_url || metaAd.ad_snapshot_url || '',
    
    // Performance estimates
    spend_estimate_min: spendMin,
    spend_estimate_max: spendMax,
    impressions_estimate_min: impressionsMin,
    impressions_estimate_max: impressionsMax,
    currency: metaAd.currency || 'USD',
    
    // Dates
    started_running_at: metaAd.ad_delivery_start_time || metaAd.ad_creation_time,
    stopped_running_at: metaAd.ad_delivery_stop_time || null,
    is_active: !metaAd.ad_delivery_stop_time,
    
    // Targeting (optionnel)
    target_ages: metaAd.target_ages || '',
    target_gender: metaAd.target_gender || '',
    target_locations: metaAd.target_locations || [],
    
    // Raw data pour debug
    raw_data: metaAd
  };
}

/**
 * Batch mapping de plusieurs ads Meta
 * @param {Array} metaAds
 * @returns {Array}
 */
export function mapMetaAdsToUnified(metaAds) {
  return metaAds.map(mapMetaAdToUnified);
}

/**
 * Valide un access token Meta
 * @param {string} accessToken
 * @returns {Promise<boolean>}
 */
export async function validateMetaToken(accessToken) {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v19.0/me?access_token=${accessToken}`
    );
    return response.ok;
  } catch {
    return false;
  }
}
