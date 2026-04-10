/**
 * UNIFIED ADS SERVICE
 * Orchestrateur pour rechercher des ads sur Meta et TikTok simultanément
 */

import { searchMetaAds, mapMetaAdsToUnified } from './metaAdsService.js';
import { searchTikTokAds, mapTikTokAdsToUnified } from './tiktokAdsService.js';

/**
 * @typedef {Object} UnifiedSearchParams
 * @property {string} keyword - Mot-clé de recherche
 * @property {Array<string>} networks - ['facebook', 'tiktok'] ou ['all']
 * @property {string} [country] - Code pays
 * @property {string} [dateRange] - 'last_7_days', 'last_30_days', 'all'
 * @property {boolean} [activeOnly] - Filtrer uniquement les ads actives
 */

/**
 * Recherche unifiée sur Meta et TikTok
 * @param {UnifiedSearchParams} params
 * @param {Object} userTokens - { metaToken, tiktokToken }
 * @returns {Promise<Object>}
 */
export async function searchAdsUnified(params, userTokens) {
  const {
    keyword,
    networks = ['all'],
    country = 'ALL',
    activeOnly = true
  } = params;

  const { metaToken, tiktokToken } = userTokens;
  const results = {
    ads: [],
    meta: { success: false, count: 0, error: null },
    tiktok: { success: false, count: 0, error: null },
    total: 0
  };

  const promises = [];

  // Recherche Meta (Facebook/Instagram)
  if ((networks.includes('all') || networks.includes('facebook') || networks.includes('instagram')) && metaToken) {
    promises.push(
      searchMetaAds({
        searchTerm: keyword,
        adReachedCountries: country,
        adActiveStatus: activeOnly ? 'ACTIVE' : 'ALL',
        limit: 50
      }, metaToken)
        .then(data => {
          const ads = data.data || [];
          const unifiedAds = mapMetaAdsToUnified(ads);
          results.meta.success = true;
          results.meta.count = unifiedAds.length;
          results.ads.push(...unifiedAds);
        })
        .catch(error => {
          results.meta.error = error.message;
          console.error('Meta search failed:', error);
        })
    );
  }

  // Recherche TikTok
  if ((networks.includes('all') || networks.includes('tiktok')) && tiktokToken) {
    promises.push(
      searchTikTokAds({
        keyword: keyword,
        country_code: country === 'ALL' ? 'US' : country,
        page_size: 50
      }, tiktokToken)
        .then(data => {
          const ads = data.data?.list || data.data || [];
          const unifiedAds = mapTikTokAdsToUnified(ads);
          results.tiktok.success = true;
          results.tiktok.count = unifiedAds.length;
          results.ads.push(...unifiedAds);
        })
        .catch(error => {
          results.tiktok.error = error.message;
          console.error('TikTok search failed:', error);
        })
    );
  }

  // Attendre toutes les recherches
  await Promise.allSettled(promises);

  // Trier par date (plus récentes en premier)
  results.ads.sort((a, b) => {
    const dateA = new Date(a.started_running_at || 0);
    const dateB = new Date(b.started_running_at || 0);
    return dateB - dateA;
  });

  results.total = results.ads.length;

  return results;
}

/**
 * Filtre les ads selon des critères
 * @param {Array} ads
 * @param {Object} filters
 * @returns {Array}
 */
export function filterAds(ads, filters) {
  let filtered = [...ads];

  // Filtre par réseau
  if (filters.network && filters.network !== 'all') {
    filtered = filtered.filter(ad => ad.network === filters.network);
  }

  // Filtre par type de créatif
  if (filters.creativeType && filters.creativeType !== 'all') {
    filtered = filtered.filter(ad => ad.ad_creative_type === filters.creativeType);
  }

  // Filtre par statut actif
  if (filters.activeOnly) {
    filtered = filtered.filter(ad => ad.is_active);
  }

  // Filtre par plage de dépenses
  if (filters.minSpend) {
    filtered = filtered.filter(ad => ad.spend_estimate_max >= filters.minSpend);
  }

  if (filters.maxSpend) {
    filtered = filtered.filter(ad => ad.spend_estimate_min <= filters.maxSpend);
  }

  // Filtre par date
  if (filters.dateFrom) {
    const dateFrom = new Date(filters.dateFrom);
    filtered = filtered.filter(ad => {
      const adDate = new Date(ad.started_running_at);
      return adDate >= dateFrom;
    });
  }

  if (filters.dateTo) {
    const dateTo = new Date(filters.dateTo);
    filtered = filtered.filter(ad => {
      const adDate = new Date(ad.started_running_at);
      return adDate <= dateTo;
    });
  }

  // Recherche textuelle dans le copy
  if (filters.searchText) {
    const searchLower = filters.searchText.toLowerCase();
    filtered = filtered.filter(ad => {
      return (
        ad.copy_text?.toLowerCase().includes(searchLower) ||
        ad.brand_name?.toLowerCase().includes(searchLower) ||
        ad.page_name?.toLowerCase().includes(searchLower)
      );
    });
  }

  return filtered;
}

/**
 * Groupe les ads par marque
 * @param {Array} ads
 * @returns {Object}
 */
export function groupAdsByBrand(ads) {
  const grouped = {};
  
  ads.forEach(ad => {
    const brand = ad.brand_name || 'Unknown';
    if (!grouped[brand]) {
      grouped[brand] = [];
    }
    grouped[brand].push(ad);
  });

  return grouped;
}

/**
 * Calcule des statistiques sur les ads
 * @param {Array} ads
 * @returns {Object}
 */
export function calculateAdsStats(ads) {
  const stats = {
    total: ads.length,
    byNetwork: {},
    byCreativeType: {},
    activeCount: 0,
    totalSpendEstimate: 0,
    totalImpressionsEstimate: 0,
    topBrands: []
  };

  // Compteurs
  const brandCounts = {};

  ads.forEach(ad => {
    // Par réseau
    stats.byNetwork[ad.network] = (stats.byNetwork[ad.network] || 0) + 1;

    // Par type de créatif
    stats.byCreativeType[ad.ad_creative_type] = (stats.byCreativeType[ad.ad_creative_type] || 0) + 1;

    // Actives
    if (ad.is_active) stats.activeCount++;

    // Dépenses et impressions
    stats.totalSpendEstimate += (ad.spend_estimate_max || 0);
    stats.totalImpressionsEstimate += (ad.impressions_estimate_max || 0);

    // Comptage des marques
    const brand = ad.brand_name || 'Unknown';
    brandCounts[brand] = (brandCounts[brand] || 0) + 1;
  });

  // Top 10 marques
  stats.topBrands = Object.entries(brandCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([brand, count]) => ({ brand, count }));

  return stats;
}
