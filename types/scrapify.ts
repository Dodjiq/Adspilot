// ============================================
// SCRAPIFY MODULE - TYPESCRIPT TYPES
// ============================================

export interface ShopifyVariant {
  id?: number;
  title: string;
  price: string;
  compare_at_price?: string | null;
  sku?: string;
  position?: number;
  inventory_policy?: 'deny' | 'continue';
  fulfillment_service?: string;
  inventory_management?: string | null;
  option1?: string | null;
  option2?: string | null;
  option3?: string | null;
  taxable?: boolean;
  barcode?: string | null;
  grams?: number;
  weight?: number;
  weight_unit?: 'kg' | 'g' | 'lb' | 'oz';
  inventory_quantity?: number;
  requires_shipping?: boolean;
}

export interface ShopifyImage {
  id?: number;
  product_id?: number;
  position?: number;
  created_at?: string;
  updated_at?: string;
  alt?: string | null;
  width?: number;
  height?: number;
  src: string;
  variant_ids?: number[];
  selected?: boolean; // Pour l'UI d'édition
}

export interface ShopifyOption {
  id?: number;
  product_id?: number;
  name: string;
  position?: number;
  values: string[];
}

export interface ScrapedProduct {
  // Métadonnées de scraping
  scraped_at: string;
  source_url: string;
  source_shop_domain: string;
  
  // Données produit Shopify
  id?: number;
  title: string;
  body_html: string;
  vendor?: string;
  product_type?: string;
  handle?: string;
  tags?: string[];
  status?: 'active' | 'draft' | 'archived';
  published_scope?: 'web' | 'global';
  
  // Prix et variantes
  variants: ShopifyVariant[];
  options?: ShopifyOption[];
  
  // Médias
  images: ShopifyImage[];
  
  // SEO
  metafields_global_title_tag?: string;
  metafields_global_description_tag?: string;
  
  // Flags d'édition
  is_edited?: boolean;
  edited_fields?: string[];
}

export interface ScrapedProductRecord {
  id: string;
  user_id: string;
  product_data: ScrapedProduct;
  status: 'scraped' | 'edited' | 'published' | 'failed';
  published_to_shop_id?: string | null;
  published_product_id?: string | null;
  error_message?: string | null;
  source_url?: string;
  source_shop_domain?: string;
  created_at: string;
  updated_at: string;
}

export interface ShopifyStore {
  id: string;
  user_id: string;
  shop_domain: string;
  shop_name?: string;
  shop_email?: string;
  shop_owner?: string;
  access_token: string;
  scope?: string;
  is_active: boolean;
  last_sync_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ScrapifySettings {
  id: string;
  user_id: string;
  auto_select_all_images: boolean;
  default_product_status: 'active' | 'draft' | 'archived';
  preserve_vendor: boolean;
  preserve_tags: boolean;
  price_adjustment_type?: 'none' | 'percentage' | 'fixed';
  price_adjustment_value?: number;
  default_shop_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ScrapeRequest {
  url: string;
}

export interface ScrapeResponse {
  success: boolean;
  product?: ScrapedProduct;
  record_id?: string;
  error?: string;
}

export interface PublishRequest {
  record_id: string;
  shop_id: string;
  product_data: ScrapedProduct;
}

export interface PublishResponse {
  success: boolean;
  product_id?: string;
  admin_url?: string;
  error?: string;
}
