'use client';

import { useState, useEffect } from 'react';
import { Package, Link as LinkIcon, Search, Store, Download, Edit, Trash2, Check, X, AlertCircle, ExternalLink, Image as ImageIcon, DollarSign, Tag, ShoppingCart, Loader2, Plus, Settings } from 'lucide-react';
import { scrapeShopifyProduct, getConnectedStores, getScrapedProducts, updateScrapedProduct, deleteScrapedProduct, publishToShopify, initiateShopifyOAuth, disconnectShopifyStore, getScrapifyStats } from '@/lib/services/scrapifyService';

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = {
  card:   { background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, padding:20 },
  modal:  { background:'#13131b', border:'1px solid rgba(255,255,255,0.1)', borderRadius:16, padding:28, maxWidth:900, width:'100%', maxHeight:'90vh', overflowY:'auto' },
  field:  { background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:8, padding:'10px 14px', color:'#fff', width:'100%', fontSize:14, outline:'none', boxSizing:'border-box', colorScheme:'dark' },
  label:  { fontSize:13, fontWeight:500, color:'rgba(255,255,255,0.75)', display:'block', marginBottom:6 },
  muted:  { fontSize:12, color:'rgba(255,255,255,0.35)', marginTop:5 },
  grid2:  { display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 },
  row:    { display:'flex', alignItems:'center', gap:10 },
  col:    { display:'flex', flexDirection:'column', gap:14 },
};

// ─── BTN ──────────────────────────────────────────────────────────────────────
const BTN = ({ children, onClick, color='default', size='md', disabled=false, style={} }) => {
  const sz = { sm:'6px 12px', md:'9px 18px', lg:'11px 22px' };
  const cols = {
    default: { background:'rgba(255,255,255,0.07)', color:'#fff', border:'1px solid rgba(255,255,255,0.18)' },
    brand:   { background:'#7c3aed', color:'#fff', border:'1px solid #7c3aed' },
    red:     { background:'rgba(239,68,68,0.12)', color:'#f87171', border:'1px solid rgba(239,68,68,0.3)' },
    green:   { background:'rgba(34,197,94,0.12)', color:'#4ade80', border:'1px solid rgba(34,197,94,0.3)' },
    ghost:   { background:'transparent', color:'rgba(255,255,255,0.6)', border:'1px solid transparent' },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...cols[color],
        padding:sz[size],
        borderRadius:8,
        fontSize:13,
        fontWeight:500,
        cursor:disabled?'not-allowed':'pointer',
        display:'flex',
        alignItems:'center',
        gap:6,
        transition:'all 0.2s',
        opacity:disabled?0.5:1,
        ...style,
      }}
    >
      {children}
    </button>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ScrapifyView({ supabase, user }) {
  const [scrapeUrl, setScrapeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectedStores, setConnectedStores] = useState([]);
  const [scrapedProducts, setScrapedProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [newShopDomain, setNewShopDomain] = useState('');
  const [activeTab, setActiveTab] = useState('scraper');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [stores, products, statsData] = await Promise.all([
        getConnectedStores(supabase),
        getScrapedProducts(supabase, { limit: 20 }),
        getScrapifyStats(supabase),
      ]);
      setConnectedStores(stores);
      setScrapedProducts(products);
      setStats(statsData);
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  const handleScrape = async () => {
    if (!scrapeUrl.trim()) {
      setError('Veuillez entrer une URL de produit Shopify');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await scrapeShopifyProduct(scrapeUrl, supabase);
      setSuccess('Produit scrapé avec succès !');
      setScrapeUrl('');
      
      // Ouvrir le modal d'édition avec le produit scrapé
      setSelectedProduct({
        id: result.record_id,
        product_data: result.product,
        status: 'scraped',
      });
      setShowEditModal(true);
      
      // Recharger la liste
      await loadData();
    } catch (err) {
      setError(err.message || 'Erreur lors du scraping');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleSaveEdits = async (editedData) => {
    try {
      await updateScrapedProduct(supabase, selectedProduct.id, {
        product_data: editedData,
        status: 'edited',
      });
      setSuccess('Modifications enregistrées');
      setShowEditModal(false);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePublish = async (recordId, shopId, productData) => {
    try {
      setIsLoading(true);
      const result = await publishToShopify(supabase, recordId, shopId, productData);
      setSuccess(`Produit publié avec succès !`);
      setShowEditModal(false);
      await loadData();
    } catch (err) {
      setError(err.message || 'Erreur lors de la publication');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (recordId) => {
    if (!confirm('Supprimer ce produit scrapé ?')) return;
    
    try {
      await deleteScrapedProduct(supabase, recordId);
      setSuccess('Produit supprimé');
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleConnectStore = () => {
    if (!newShopDomain.trim()) {
      setError('Veuillez entrer le domaine de votre boutique');
      return;
    }

    const domain = newShopDomain.includes('.myshopify.com') 
      ? newShopDomain 
      : `${newShopDomain}.myshopify.com`;

    initiateShopifyOAuth(domain);
  };

  const handleDisconnectStore = async (storeId) => {
    if (!confirm('Déconnecter cette boutique ?')) return;
    
    try {
      await disconnectShopifyStore(supabase, storeId);
      setSuccess('Boutique déconnectée');
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const tabSt = (v) => ({ 
    padding:'10px 20px', 
    borderRadius:8, 
    border:'none', 
    cursor:'pointer', 
    fontWeight:500, 
    fontSize:14, 
    transition:'all 0.2s', 
    background:activeTab===v?'rgba(124,58,237,0.25)':'transparent', 
    color:activeTab===v?'#fff':'rgba(255,255,255,0.6)' 
  });

  const statusBadge = {
    scraped: { bg:'rgba(59,130,246,0.2)', color:'#60a5fa', border:'1px solid rgba(59,130,246,0.3)' },
    edited: { bg:'rgba(234,179,8,0.2)', color:'#facc15', border:'1px solid rgba(234,179,8,0.3)' },
    published: { bg:'rgba(34,197,94,0.2)', color:'#4ade80', border:'1px solid rgba(34,197,94,0.3)' },
    failed: { bg:'rgba(239,68,68,0.2)', color:'#f87171', border:'1px solid rgba(239,68,68,0.3)' },
  };

  return (
    <div style={{ minHeight:'100vh', padding:24 }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
          <div>
            <h1 style={{ fontSize:26, fontWeight:700, color:'#fff', display:'flex', alignItems:'center', gap:10, margin:0 }}>
              <Package style={{ width:28, height:28, color:'#7c3aed' }} /> Scrapify
            </h1>
            <p style={{ color:'rgba(255,255,255,0.5)', marginTop:4, fontSize:14 }}>
              Importez des produits Shopify concurrents en un clic
            </p>
          </div>
          <BTN color="brand" onClick={() => setShowConnectModal(true)}>
            <Plus style={{ width:15, height:15 }} /> Connecter une boutique
          </BTN>
        </div>

        {/* Alerts */}
        {error && (
          <div style={{ ...S.card, background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.25)', marginBottom:20, display:'flex', alignItems:'center', gap:10 }}>
            <AlertCircle style={{ width:18, height:18, color:'#f87171', flexShrink:0 }} />
            <span style={{ color:'#f87171', fontSize:13 }}>{error}</span>
            <button onClick={() => setError(null)} style={{ marginLeft:'auto', background:'none', border:'none', color:'#f87171', cursor:'pointer' }}>
              <X style={{ width:16, height:16 }} />
            </button>
          </div>
        )}

        {success && (
          <div style={{ ...S.card, background:'rgba(34,197,94,0.08)', border:'1px solid rgba(34,197,94,0.25)', marginBottom:20, display:'flex', alignItems:'center', gap:10 }}>
            <Check style={{ width:18, height:18, color:'#4ade80', flexShrink:0 }} />
            <span style={{ color:'#4ade80', fontSize:13 }}>{success}</span>
            <button onClick={() => setSuccess(null)} style={{ marginLeft:'auto', background:'none', border:'none', color:'#4ade80', cursor:'pointer' }}>
              <X style={{ width:16, height:16 }} />
            </button>
          </div>
        )}

        {/* Stats */}
        {stats && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:12, marginBottom:24 }}>
            {[
              ['Boutiques connectées', stats.connected_stores, <Store style={{width:18,height:18,color:'#7c3aed'}}/>, 'rgba(124,58,237,0.15)'],
              ['Produits scrapés', stats.total_scraped, <Search style={{width:18,height:18,color:'#60a5fa'}}/>, 'rgba(59,130,246,0.15)'],
              ['Modifiés', stats.total_edited, <Edit style={{width:18,height:18,color:'#facc15'}}/>, 'rgba(234,179,8,0.15)'],
              ['Publiés', stats.total_published, <Check style={{width:18,height:18,color:'#4ade80'}}/>, 'rgba(34,197,94,0.15)'],
              ['Échecs', stats.total_failed, <AlertCircle style={{width:18,height:18,color:'#f87171'}}/>, 'rgba(239,68,68,0.15)'],
            ].map(([l,v,ico,bg],i)=>(
              <div key={i} style={{ ...S.card, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div><p style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginBottom:4 }}>{l}</p><p style={{ fontSize:18, fontWeight:700, color:'#fff' }}>{v}</p></div>
                <div style={{ width:38, height:38, borderRadius:10, background:bg, display:'flex', alignItems:'center', justifyContent:'center' }}>{ico}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display:'flex', gap:4, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, padding:4, marginBottom:20, width:'fit-content' }}>
          <button onClick={()=>setActiveTab('scraper')} style={tabSt('scraper')}>🔍 Scraper</button>
          <button onClick={()=>setActiveTab('history')} style={tabSt('history')}>📦 Historique</button>
          <button onClick={()=>setActiveTab('stores')} style={tabSt('stores')}>🏪 Boutiques</button>
        </div>

        {/* Tab Content */}
        {activeTab === 'scraper' && (
          <div style={S.card}>
            <h3 style={{ fontSize:16, fontWeight:600, color:'#fff', marginBottom:16, display:'flex', alignItems:'center', gap:8 }}>
              <LinkIcon style={{ width:18, height:18, color:'#7c3aed' }} />
              Scraper un produit Shopify
            </h3>
            
            <div style={{ display:'flex', gap:10, marginBottom:16 }}>
              <input
                type="text"
                placeholder="https://boutique-concurrent.myshopify.com/products/exemple"
                value={scrapeUrl}
                onChange={(e) => setScrapeUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleScrape()}
                style={{ ...S.field, flex:1 }}
              />
              <BTN color="brand" onClick={handleScrape} disabled={isLoading || !scrapeUrl.trim()}>
                {isLoading ? <Loader2 style={{ width:15, height:15, animation:'spin 1s linear infinite' }} /> : <Search style={{ width:15, height:15 }} />}
                {isLoading ? 'Scraping...' : 'Scraper'}
              </BTN>
            </div>

            <p style={S.muted}>
              💡 Collez l'URL complète d'un produit Shopify concurrent. Le système extraira automatiquement toutes les données (titre, description, prix, images, variantes).
            </p>

            {connectedStores.length === 0 && (
              <div style={{ marginTop:16, padding:12, background:'rgba(234,179,8,0.08)', border:'1px solid rgba(234,179,8,0.25)', borderRadius:8 }}>
                <p style={{ fontSize:13, color:'#facc15', margin:0 }}>
                  ⚠️ Aucune boutique connectée. Connectez votre boutique Shopify pour pouvoir publier les produits scrapés.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div style={S.col}>
            {scrapedProducts.length === 0 ? (
              <div style={{ ...S.card, padding:48, textAlign:'center' }}>
                <Package style={{ width:48, height:48, color:'rgba(255,255,255,0.2)', margin:'0 auto 12px' }} />
                <p style={{ color:'rgba(255,255,255,0.5)' }}>Aucun produit scrapé pour le moment</p>
              </div>
            ) : (
              scrapedProducts.map(record => {
                const product = record.product_data;
                const firstImage = product.images?.[0]?.src;
                const status = statusBadge[record.status] || statusBadge.scraped;
                
                return (
                  <div key={record.id} style={S.card}>
                    <div style={{ display:'flex', gap:16 }}>
                      {/* Image */}
                      <div style={{ width:80, height:80, borderRadius:8, overflow:'hidden', background:'rgba(255,255,255,0.05)', flexShrink:0 }}>
                        {firstImage ? (
                          <img src={firstImage} alt={product.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                        ) : (
                          <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <ImageIcon style={{ width:24, height:24, color:'rgba(255,255,255,0.2)' }} />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:8 }}>
                          <div style={{ flex:1, minWidth:0 }}>
                            <h4 style={{ fontSize:15, fontWeight:600, color:'#fff', margin:'0 0 4px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                              {product.title}
                            </h4>
                            <p style={{ fontSize:12, color:'rgba(255,255,255,0.4)', margin:0 }}>
                              {product.source_shop_domain} • {new Date(record.created_at).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                          <span style={{ ...status, padding:'4px 10px', borderRadius:999, fontSize:11, fontWeight:600, flexShrink:0, marginLeft:12 }}>
                            {record.status}
                          </span>
                        </div>

                        <div style={{ display:'flex', gap:16, fontSize:12, color:'rgba(255,255,255,0.5)', marginBottom:12 }}>
                          <span>{product.variants?.length || 0} variante{product.variants?.length > 1 ? 's' : ''}</span>
                          <span>{product.images?.length || 0} image{product.images?.length > 1 ? 's' : ''}</span>
                          {product.variants?.[0] && <span style={{ color:'#4ade80', fontWeight:600 }}>{product.variants[0].price} €</span>}
                        </div>

                        <div style={{ display:'flex', gap:6 }}>
                          <BTN size="sm" onClick={() => handleEditProduct(record)}>
                            <Edit style={{ width:11, height:11 }} /> Modifier
                          </BTN>
                          {record.status === 'published' && record.published_to_shop_id && (
                            <BTN size="sm" color="green" onClick={() => window.open(`https://${connectedStores.find(s=>s.id===record.published_to_shop_id)?.shop_domain}/admin/products/${record.published_product_id}`, '_blank')}>
                              <ExternalLink style={{ width:11, height:11 }} /> Voir sur Shopify
                            </BTN>
                          )}
                          <BTN size="sm" color="red" onClick={() => handleDelete(record.id)}>
                            <Trash2 style={{ width:11, height:11 }} />
                          </BTN>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'stores' && (
          <div style={S.col}>
            {connectedStores.length === 0 ? (
              <div style={{ ...S.card, padding:48, textAlign:'center' }}>
                <Store style={{ width:48, height:48, color:'rgba(255,255,255,0.2)', margin:'0 auto 12px' }} />
                <p style={{ color:'rgba(255,255,255,0.5)', marginBottom:16 }}>Aucune boutique connectée</p>
                <BTN color="brand" onClick={() => setShowConnectModal(true)}>
                  <Plus style={{ width:15, height:15 }} /> Connecter ma première boutique
                </BTN>
              </div>
            ) : (
              connectedStores.map(store => (
                <div key={store.id} style={S.card}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                      <div style={{ width:40, height:40, borderRadius:8, background:'rgba(124,58,237,0.15)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <Store style={{ width:20, height:20, color:'#7c3aed' }} />
                      </div>
                      <div>
                        <h4 style={{ fontSize:15, fontWeight:600, color:'#fff', margin:'0 0 2px' }}>
                          {store.shop_name || store.shop_domain}
                        </h4>
                        <p style={{ fontSize:12, color:'rgba(255,255,255,0.4)', margin:0 }}>
                          {store.shop_domain}
                        </p>
                      </div>
                    </div>
                    <div style={{ display:'flex', gap:6 }}>
                      <span style={{ padding:'4px 10px', borderRadius:999, fontSize:11, fontWeight:600, background:'rgba(34,197,94,0.2)', color:'#4ade80', border:'1px solid rgba(34,197,94,0.3)' }}>
                        Connectée
                      </span>
                      <BTN size="sm" color="red" onClick={() => handleDisconnectStore(store.id)}>
                        <X style={{ width:11, height:11 }} /> Déconnecter
                      </BTN>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Modal: Connect Store */}
        {showConnectModal && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:50, padding:16 }}>
            <div style={{ ...S.modal, maxWidth:500 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
                <h2 style={{ fontSize:18, fontWeight:700, color:'#fff', margin:0 }}>Connecter une boutique Shopify</h2>
                <button onClick={() => setShowConnectModal(false)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.5)', cursor:'pointer', fontSize:22 }}>×</button>
              </div>

              <div style={S.col}>
                <div>
                  <label style={S.label}>Domaine de votre boutique</label>
                  <input
                    type="text"
                    placeholder="ma-boutique.myshopify.com"
                    value={newShopDomain}
                    onChange={(e) => setNewShopDomain(e.target.value)}
                    style={S.field}
                  />
                  <p style={S.muted}>
                    Entrez le domaine complet de votre boutique Shopify (ex: ma-boutique.myshopify.com)
                  </p>
                </div>

                <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
                  <BTN onClick={() => setShowConnectModal(false)}>Annuler</BTN>
                  <BTN color="brand" onClick={handleConnectStore} disabled={!newShopDomain.trim()}>
                    <LinkIcon style={{ width:15, height:15 }} /> Connecter via OAuth
                  </BTN>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Edit Product */}
        {showEditModal && selectedProduct && (
          <ProductEditModal
            product={selectedProduct}
            connectedStores={connectedStores}
            onSave={handleSaveEdits}
            onPublish={handlePublish}
            onClose={() => setShowEditModal(false)}
            isLoading={isLoading}
          />
        )}

      </div>
    </div>
  );
}

// ─── Product Edit Modal ───────────────────────────────────────────────────────
function ProductEditModal({ product, connectedStores, onSave, onPublish, onClose, isLoading }) {
  const [editedData, setEditedData] = useState(product.product_data);
  const [selectedShop, setSelectedShop] = useState(connectedStores[0]?.id || '');

  const updateField = (field, value) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  const toggleImage = (index) => {
    setEditedData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => 
        i === index ? { ...img, selected: !img.selected } : img
      ),
    }));
  };

  const handlePublishClick = () => {
    if (!selectedShop) {
      alert('Sélectionnez une boutique');
      return;
    }
    onPublish(product.id, selectedShop, editedData);
  };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:50, padding:16, overflowY:'auto' }}>
      <div style={{ ...S.modal, marginTop:20, marginBottom:20 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
          <h2 style={{ fontSize:18, fontWeight:700, color:'#fff', margin:0 }}>Éditer le produit</h2>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.5)', cursor:'pointer', fontSize:22 }}>×</button>
        </div>

        <div style={S.col}>
          {/* Titre */}
          <div>
            <label style={S.label}>Titre du produit</label>
            <input
              type="text"
              value={editedData.title}
              onChange={(e) => updateField('title', e.target.value)}
              style={S.field}
            />
          </div>

          {/* Prix */}
          <div style={S.grid2}>
            <div>
              <label style={S.label}>Prix</label>
              <input
                type="text"
                value={editedData.variants?.[0]?.price || ''}
                onChange={(e) => {
                  const newVariants = [...(editedData.variants || [])];
                  if (newVariants[0]) newVariants[0].price = e.target.value;
                  updateField('variants', newVariants);
                }}
                style={S.field}
              />
            </div>
            <div>
              <label style={S.label}>Prix comparé (optionnel)</label>
              <input
                type="text"
                value={editedData.variants?.[0]?.compare_at_price || ''}
                onChange={(e) => {
                  const newVariants = [...(editedData.variants || [])];
                  if (newVariants[0]) newVariants[0].compare_at_price = e.target.value;
                  updateField('variants', newVariants);
                }}
                style={S.field}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={S.label}>Description</label>
            <textarea
              value={editedData.body_html?.replace(/<[^>]*>/g, '') || ''}
              onChange={(e) => updateField('body_html', `<p>${e.target.value}</p>`)}
              rows={4}
              style={S.field}
            />
          </div>

          {/* Images */}
          <div>
            <label style={S.label}>Images ({editedData.images?.filter(img => img.selected !== false).length || 0} sélectionnée{editedData.images?.filter(img => img.selected !== false).length > 1 ? 's' : ''})</label>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(100px, 1fr))', gap:10 }}>
              {editedData.images?.map((img, i) => (
                <div
                  key={i}
                  onClick={() => toggleImage(i)}
                  style={{
                    position:'relative',
                    paddingTop:'100%',
                    borderRadius:8,
                    overflow:'hidden',
                    cursor:'pointer',
                    border: img.selected !== false ? '2px solid #7c3aed' : '2px solid rgba(255,255,255,0.1)',
                    opacity: img.selected !== false ? 1 : 0.4,
                  }}
                >
                  <img
                    src={img.src}
                    alt=""
                    style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }}
                  />
                  {img.selected !== false && (
                    <div style={{ position:'absolute', top:4, right:4, width:20, height:20, borderRadius:'50%', background:'#7c3aed', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Check style={{ width:12, height:12, color:'#fff' }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Boutique de destination */}
          {connectedStores.length > 0 && (
            <div>
              <label style={S.label}>Publier sur</label>
              <select
                value={selectedShop}
                onChange={(e) => setSelectedShop(e.target.value)}
                style={S.field}
              >
                {connectedStores.map(store => (
                  <option key={store.id} value={store.id}>
                    {store.shop_name || store.shop_domain}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Actions */}
          <div style={{ display:'flex', gap:10, justifyContent:'flex-end', paddingTop:12, borderTop:'1px solid rgba(255,255,255,0.08)' }}>
            <BTN onClick={onClose}>Annuler</BTN>
            <BTN onClick={() => onSave(editedData)}>
              <Download style={{ width:15, height:15 }} /> Enregistrer
            </BTN>
            {connectedStores.length > 0 && (
              <BTN color="brand" onClick={handlePublishClick} disabled={isLoading}>
                {isLoading ? <Loader2 style={{ width:15, height:15, animation:'spin 1s linear infinite' }} /> : <ShoppingCart style={{ width:15, height:15 }} />}
                {isLoading ? 'Publication...' : 'Publier sur Shopify'}
              </BTN>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
