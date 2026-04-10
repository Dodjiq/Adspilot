'use client';

import { useState } from 'react';
import { Heart, ExternalLink, Play, TrendingUp, Calendar, DollarSign, Eye, Facebook, Video as VideoIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function AdCard({ ad, onSave, isSaved = false, onUnsave }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [imageError, setImageError] = useState(false);

  const networkColors = {
    facebook: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    instagram: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    tiktok: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
  };

  const networkIcons = {
    facebook: Facebook,
    instagram: Facebook,
    tiktok: VideoIcon
  };

  const NetworkIcon = networkIcons[ad.network] || Facebook;

  const formatNumber = (num) => {
    if (!num) return 'N/A';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleSaveToggle = () => {
    if (isSaved) {
      onUnsave?.(ad);
    } else {
      onSave?.(ad);
    }
  };

  return (
    <Card className="group bg-bg-secondary border-white/10 hover:border-brand/40 transition-all duration-300 overflow-hidden">
      {/* Creative Preview */}
      <div className="relative aspect-square bg-bg-tertiary overflow-hidden">
        {ad.ad_creative_type === 'video' && !isPlaying ? (
          <div className="relative w-full h-full">
            {!imageError ? (
              <img
                src={ad.thumbnail_url || ad.ad_creative_url}
                alt={ad.brand_name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-bg-tertiary">
                <VideoIcon className="w-16 h-16 text-text-muted" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="lg"
                className="rounded-full bg-brand hover:bg-brand-light"
                onClick={() => setIsPlaying(true)}
              >
                <Play className="w-6 h-6" />
              </Button>
            </div>
            <Badge className="absolute top-3 left-3 bg-black/60 text-white border-0">
              <VideoIcon className="w-3 h-3 mr-1" />
              Vidéo
            </Badge>
          </div>
        ) : ad.ad_creative_type === 'video' && isPlaying ? (
          <iframe
            src={ad.ad_creative_url}
            className="w-full h-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        ) : (
          <div className="relative w-full h-full">
            {!imageError ? (
              <img
                src={ad.thumbnail_url || ad.ad_creative_url}
                alt={ad.brand_name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-bg-tertiary">
                <VideoIcon className="w-16 h-16 text-text-muted" />
              </div>
            )}
          </div>
        )}

        {/* Network Badge */}
        <Badge className={cn('absolute top-3 right-3 border', networkColors[ad.network])}>
          <NetworkIcon className="w-3 h-3 mr-1" />
          {ad.network.charAt(0).toUpperCase() + ad.network.slice(1)}
        </Badge>

        {/* Active Status */}
        {ad.is_active && (
          <div className="absolute bottom-3 left-3">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              ● Active
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Brand Name */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-text-primary line-clamp-1">
            {ad.brand_name || ad.page_name || 'Unknown Brand'}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'h-8 w-8 p-0 transition-colors',
              isSaved ? 'text-red-400 hover:text-red-300' : 'text-text-muted hover:text-red-400'
            )}
            onClick={handleSaveToggle}
          >
            <Heart className={cn('w-4 h-4', isSaved && 'fill-current')} />
          </Button>
        </div>

        {/* Ad Copy */}
        {ad.copy_text && (
          <p className="text-sm text-text-secondary line-clamp-3">
            {ad.copy_text}
          </p>
        )}

        {/* CTA */}
        {ad.cta_text && (
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand/20 border border-brand/30">
            <span className="text-xs font-medium text-brand-light">{ad.cta_text}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
          {/* Spend Estimate */}
          {(ad.spend_estimate_min > 0 || ad.spend_estimate_max > 0) && (
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-accent-gold" />
              <div>
                <p className="text-xs text-text-muted">Dépenses</p>
                <p className="text-sm font-semibold text-text-primary">
                  {formatNumber(ad.spend_estimate_min)}-{formatNumber(ad.spend_estimate_max)}
                </p>
              </div>
            </div>
          )}

          {/* Impressions Estimate */}
          {(ad.impressions_estimate_min > 0 || ad.impressions_estimate_max > 0) && (
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-400" />
              <div>
                <p className="text-xs text-text-muted">Impressions</p>
                <p className="text-sm font-semibold text-text-primary">
                  {formatNumber(ad.impressions_estimate_min)}-{formatNumber(ad.impressions_estimate_max)}
                </p>
              </div>
            </div>
          )}

          {/* Start Date */}
          {ad.started_running_at && (
            <div className="flex items-center gap-2 col-span-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              <div>
                <p className="text-xs text-text-muted">Lancée le</p>
                <p className="text-sm font-medium text-text-primary">
                  {formatDate(ad.started_running_at)}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        {/* CTA Button (si disponible) */}
        {ad.cta_text && (
          <Button
            className="w-full bg-white hover:bg-gray-100 text-black font-semibold transition-all hover:scale-[1.02]"
            onClick={() => {
              // Rediriger vers la destination de la pub si disponible
              const destination = ad.destination_url || ad.ad_creative_url;
              window.open(destination, '_blank');
            }}
          >
            {ad.cta_text}
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        )}
        
        {/* Bouton secondaire pour voir la pub complète */}
        <Button
          variant="outline"
          className="w-full border-white/20 text-white/90 hover:border-white/40 hover:bg-white/5 hover:text-white transition-all"
          onClick={() => window.open(ad.ad_creative_url, '_blank')}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Voir la pub complète
        </Button>
      </CardFooter>
    </Card>
  );
}
