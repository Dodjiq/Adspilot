'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Loader2, AlertCircle, Settings, TrendingUp, Facebook, Video as VideoIcon, Heart, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dropdown } from '@/components/ui/Dropdown';
import AdCard from '@/components/AdCard';
import { getMockAdsForSearch } from '@/lib/mockAdsData';

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function AdScoutView({ supabase, user }) {
  const [activeTab, setActiveTab] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNetworks, setSelectedNetworks] = useState(['all']);
  const [selectedCountry, setSelectedCountry] = useState('ALL');
  const [activeOnly, setActiveOnly] = useState(true);
  
  const [searchResults, setSearchResults] = useState([]);
  const [savedAds, setSavedAds] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [apiConnections, setApiConnections] = useState([]);
  
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchStats, setSearchStats] = useState(null);

  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [metaToken, setMetaToken] = useState('');
  const [tiktokToken, setTiktokToken] = useState('');

  const countries = [
    { code: 'ALL', label: 'Tous les pays' },
    { code: 'FR', label: 'France' },
    { code: 'SN', label: 'Sénégal' },
    { code: 'CI', label: 'Côte d\'Ivoire' },
    { code: 'MA', label: 'Maroc' },
    { code: 'US', label: 'États-Unis' },
    { code: 'GB', label: 'Royaume-Uni' },
  ];

  const networks = [
    { id: 'all', label: 'Tous les réseaux', icon: TrendingUp },
    { id: 'facebook', label: 'Facebook', icon: Facebook },
    { id: 'instagram', label: 'Instagram', icon: Facebook },
    { id: 'tiktok', label: 'TikTok', icon: VideoIcon },
  ];

  useEffect(() => {
    loadApiConnections();
    if (activeTab === 'saved') {
      loadSavedAds();
    } else if (activeTab === 'history') {
      loadSearchHistory();
    }
  }, [activeTab]);

  const loadApiConnections = async () => {
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      const response = await fetch('/api/adscout/connections', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setApiConnections(data.connections || []);
    } catch (err) {
      console.error('Failed to load API connections:', err);
    }
  };

  const loadSavedAds = async () => {
    setIsLoading(true);
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      const response = await fetch('/api/adscout/saved', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setSavedAds(data.savedAds || []);
    } catch (err) {
      console.error('Failed to load saved ads:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSearchHistory = async () => {
    setIsLoading(true);
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      const response = await fetch('/api/adscout/history', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setSearchHistory(data.history || []);
    } catch (err) {
      console.error('Failed to load search history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e?.preventDefault();
    
    if (!searchQuery.trim()) {
      setError('Veuillez entrer un mot-clé de recherche');
      return;
    }

    setIsSearching(true);
    setError(null);
    setSearchResults([]);
    setSearchStats(null);

    try {
      // MODE DÉMO : Utiliser les données fictives si pas de connexions API
      const useMockData = !hasMetaConnection && !hasTikTokConnection;

      if (useMockData) {
        // Simuler un délai de recherche
        await new Promise(resolve => setTimeout(resolve, 1000));

        const networkFilter = selectedNetworks[0] === 'all' ? 'all' : selectedNetworks[0];
        const mockResults = getMockAdsForSearch(searchQuery, networkFilter, activeOnly);

        setSearchResults(mockResults.ads);
        setSearchStats({
          total: mockResults.total,
          meta: mockResults.meta,
          tiktok: mockResults.tiktok
        });

        if (mockResults.total === 0) {
          setError('Aucune publicité trouvée pour cette recherche');
        }
      } else {
        // Mode réel avec API
        const token = (await supabase.auth.getSession()).data.session?.access_token;
        const response = await fetch('/api/adscout/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            keyword: searchQuery,
            networks: selectedNetworks,
            country: selectedCountry,
            activeOnly: activeOnly
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Erreur lors de la recherche');
        }

        setSearchResults(data.ads || []);
        setSearchStats({
          total: data.total,
          meta: data.meta,
          tiktok: data.tiktok
        });

        if (data.total === 0) {
          setError('Aucune publicité trouvée pour cette recherche');
        }
      }
    } catch (err) {
      setError(err.message);
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSaveAd = async (ad) => {
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      const response = await fetch('/api/adscout/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          cached_ad_id: ad.id
        })
      });

      if (response.ok) {
        // Mettre à jour l'UI
        setSearchResults(prev => 
          prev.map(a => a.id === ad.id ? { ...a, isSaved: true } : a)
        );
      }
    } catch (err) {
      console.error('Failed to save ad:', err);
    }
  };

  const handleUnsaveAd = async (ad) => {
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      await fetch(`/api/adscout/saved/${ad.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setSavedAds(prev => prev.filter(a => a.id !== ad.id));
    } catch (err) {
      console.error('Failed to unsave ad:', err);
    }
  };

  const handleSaveConnection = async (provider) => {
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      const credentials = provider === 'meta' 
        ? { meta_access_token: metaToken }
        : { tiktok_access_token: tiktokToken };

      const response = await fetch('/api/adscout/connections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          provider,
          credentials
        })
      });

      const data = await response.json();

      if (response.ok) {
        loadApiConnections();
        setMetaToken('');
        setTiktokToken('');
        setShowConnectionModal(false);
      } else {
        alert(data.error || 'Erreur lors de la connexion');
      }
    } catch (err) {
      console.error('Failed to save connection:', err);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const hasMetaConnection = apiConnections.some(c => c.provider === 'meta' && c.is_active);
  const hasTikTokConnection = apiConnections.some(c => c.provider === 'tiktok' && c.is_active);

  return (
    <div className="min-h-screen bg-bg-primary p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary flex items-center gap-3">
              <Search className="w-8 h-8 text-brand" />
              AdScout
            </h1>
            <p className="text-text-secondary mt-1">
              Espionnez les publicités de vos concurrents sur Facebook, Instagram et TikTok
            </p>
          </div>
          <Button
            variant="outline"
            className="border-brand/40 hover:bg-brand/10"
            onClick={() => setShowConnectionModal(true)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Connexions API
          </Button>
        </div>

        {/* Connection Status */}
        <div className="flex gap-3 flex-wrap">
          <Badge className={cn(
            'border font-medium',
            hasMetaConnection 
              ? 'bg-green-500/30 text-green-300 border-green-500/50' 
              : 'bg-red-500/30 text-red-300 border-red-500/50'
          )}>
            <Facebook className="w-3 h-3 mr-1" />
            Meta {hasMetaConnection ? 'Connecté' : 'Non connecté'}
          </Badge>
          <Badge className={cn(
            'border font-medium',
            hasTikTokConnection 
              ? 'bg-green-500/30 text-green-300 border-green-500/50' 
              : 'bg-red-500/30 text-red-300 border-red-500/50'
          )}>
            <VideoIcon className="w-3 h-3 mr-1" />
            TikTok {hasTikTokConnection ? 'Connecté' : 'Non connecté'}
          </Badge>
          {!hasMetaConnection && !hasTikTokConnection && (
            <Badge className="bg-yellow-500/30 text-yellow-300 border-yellow-500/50 font-medium">
              <AlertCircle className="w-3 h-3 mr-1" />
              MODE DÉMO - Données fictives
            </Badge>
          )}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-bg-secondary border border-white/20">
            <TabsTrigger value="search" className="text-white/70 data-[state=active]:bg-brand/20 data-[state=active]:text-white font-medium">
              <Search className="w-4 h-4 mr-2" />
              Recherche
            </TabsTrigger>
            <TabsTrigger value="saved" className="text-white/70 data-[state=active]:bg-brand/20 data-[state=active]:text-white font-medium">
              <Heart className="w-4 h-4 mr-2" />
              Sauvegardées ({savedAds.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="text-white/70 data-[state=active]:bg-brand/20 data-[state=active]:text-white font-medium">
              <History className="w-4 h-4 mr-2" />
              Historique
            </TabsTrigger>
          </TabsList>

          {/* Search Tab */}
          <TabsContent value="search" className="space-y-6 mt-6">
            {/* Search Form */}
            <Card className="bg-bg-secondary border-white/10">
              <CardContent className="p-6 space-y-4">
                <form onSubmit={handleSearch} className="space-y-4">
                  {/* Search Input */}
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Input
                        placeholder="Rechercher des pubs (ex: 'skincare', 'fashion', 'food delivery'...)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-bg-tertiary border-white/20 text-white placeholder:text-white/40 focus:border-brand/50"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      disabled={isSearching || !searchQuery.trim()}
                      className="bg-brand hover:bg-brand-light text-white font-medium"
                    >
                      {isSearching ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Recherche...
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4 mr-2" />
                          Rechercher
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Filters */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Network Filter */}
                    <div>
                      <label className="text-sm font-medium text-white/90 mb-2 block">Réseau</label>
                      <Dropdown
                        value={selectedNetworks[0]}
                        onChange={(val) => setSelectedNetworks([val])}
                        options={networks.map(n => ({ value: n.id, label: n.label }))}
                      />
                    </div>

                    {/* Country Filter */}
                    <div>
                      <label className="text-sm font-medium text-white/90 mb-2 block">Pays</label>
                      <Dropdown
                        value={selectedCountry}
                        onChange={setSelectedCountry}
                        options={countries.map(c => ({ value: c.code, label: c.label }))}
                      />
                    </div>

                    {/* Active Only Toggle */}
                    <div>
                      <label className="text-sm font-medium text-white/90 mb-2 block">Statut</label>
                      <Button
                        type="button"
                        className={cn(
                          'w-full text-white font-medium transition-all',
                          activeOnly 
                            ? 'bg-brand hover:bg-brand-light border border-brand' 
                            : 'bg-bg-tertiary border border-white/20 hover:border-white/40 hover:bg-white/10 hover:text-white'
                        )}
                        onClick={() => setActiveOnly(!activeOnly)}
                      >
                        {activeOnly ? 'Actives uniquement' : 'Toutes les pubs'}
                      </Button>
                    </div>
                  </div>
                </form>

                {/* Search Stats */}
                {searchStats && (
                  <div className="flex gap-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-brand" />
                      <span className="text-sm text-text-secondary">
                        <span className="font-semibold text-text-primary">{searchStats.total}</span> résultats
                      </span>
                    </div>
                    {searchStats.meta.success && (
                      <div className="flex items-center gap-2">
                        <Facebook className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-text-secondary">
                          <span className="font-semibold text-text-primary">{searchStats.meta.count}</span> Meta
                        </span>
                      </div>
                    )}
                    {searchStats.tiktok.success && (
                      <div className="flex items-center gap-2">
                        <VideoIcon className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-text-secondary">
                          <span className="font-semibold text-text-primary">{searchStats.tiktok.count}</span> TikTok
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Error Message */}
            {error && (
              <Card className="bg-red-500/10 border-red-500/30">
                <CardContent className="p-4 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <p className="text-red-400">{error}</p>
                </CardContent>
              </Card>
            )}

            {/* Results Grid */}
            {searchResults.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {searchResults.map((ad) => (
                  <AdCard
                    key={ad.id}
                    ad={ad}
                    onSave={handleSaveAd}
                    isSaved={ad.isSaved}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Saved Ads Tab */}
          <TabsContent value="saved" className="mt-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-brand" />
              </div>
            ) : savedAds.length === 0 ? (
              <Card className="bg-bg-secondary border-white/10">
                <CardContent className="p-12 text-center">
                  <Heart className="w-12 h-12 text-text-muted mx-auto mb-4" />
                  <p className="text-text-secondary">Aucune publicité sauvegardée</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {savedAds.map((savedAd) => (
                  <AdCard
                    key={savedAd.id}
                    ad={savedAd.ad}
                    isSaved={true}
                    onUnsave={() => handleUnsaveAd(savedAd)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="mt-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-brand" />
              </div>
            ) : searchHistory.length === 0 ? (
              <Card className="bg-bg-secondary border-white/10">
                <CardContent className="p-12 text-center">
                  <History className="w-12 h-12 text-text-muted mx-auto mb-4" />
                  <p className="text-text-secondary">Aucun historique de recherche</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {searchHistory.map((item) => (
                  <Card key={item.id} className="bg-bg-secondary border-white/10 hover:border-brand/40 transition-colors cursor-pointer"
                    onClick={() => {
                      setSearchQuery(item.search_query);
                      setActiveTab('search');
                    }}
                  >
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Search className="w-4 h-4 text-brand" />
                        <div>
                          <p className="font-medium text-text-primary">{item.search_query}</p>
                          <p className="text-sm text-text-muted">
                            {new Date(item.searched_at).toLocaleDateString('fr-FR')} • {item.results_count} résultats
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Connection Modal */}
        {showConnectionModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="bg-bg-secondary border-white/10 max-w-2xl w-full">
              <CardHeader>
                <CardTitle className="text-text-primary flex items-center gap-2">
                  <Settings className="w-5 h-5 text-brand" />
                  Connexions API
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Meta Connection */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      <Facebook className="w-5 h-5 text-blue-400" />
                      Meta (Facebook/Instagram)
                    </h3>
                    {hasMetaConnection && (
                      <Badge className="bg-green-500/30 text-green-300 border-green-500/50 font-medium">
                        Connecté
                      </Badge>
                    )}
                  </div>
                  <Input
                    type="password"
                    placeholder="Meta Access Token"
                    value={metaToken}
                    onChange={(e) => setMetaToken(e.target.value)}
                    className="bg-bg-tertiary border-white/20 text-white placeholder:text-white/40 focus:border-blue-500/50"
                  />
                  <Button
                    onClick={() => handleSaveConnection('meta')}
                    disabled={!metaToken}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium"
                  >
                    Connecter Meta
                  </Button>
                </div>

                {/* TikTok Connection */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      <VideoIcon className="w-5 h-5 text-purple-400" />
                      TikTok
                    </h3>
                    {hasTikTokConnection && (
                      <Badge className="bg-green-500/30 text-green-300 border-green-500/50 font-medium">
                        Connecté
                      </Badge>
                    )}
                  </div>
                  <Input
                    type="password"
                    placeholder="TikTok Access Token"
                    value={tiktokToken}
                    onChange={(e) => setTiktokToken(e.target.value)}
                    className="bg-bg-tertiary border-white/20 text-white placeholder:text-white/40 focus:border-purple-500/50"
                  />
                  <Button
                    onClick={() => handleSaveConnection('tiktok')}
                    disabled={!tiktokToken}
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium"
                  >
                    Connecter TikTok
                  </Button>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <Button
                    variant="outline"
                    onClick={() => setShowConnectionModal(false)}
                    className="border-white/20 text-white hover:bg-white/5"
                  >
                    Fermer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
