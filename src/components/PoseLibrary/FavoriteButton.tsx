import React, { useState, useEffect } from 'react';
import { analytics } from '../../utils/analytics';

interface FavoriteButtonProps {
  poseId: string;
  poseName?: string;
  className?: string;
}

export default function FavoriteButton({ poseId, poseName = '', className = "" }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Load favorite status from localStorage
    const favorites = JSON.parse(localStorage.getItem('yogaFavorites') || '[]');
    setIsFavorite(favorites.includes(poseId));
  }, [poseId]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('yogaFavorites') || '[]');
    let newFavorites;
    const willBeFavorite = !isFavorite;
    
    if (isFavorite) {
      newFavorites = favorites.filter((id: string) => id !== poseId);
    } else {
      newFavorites = [...favorites, poseId];
    }
    
    localStorage.setItem('yogaFavorites', JSON.stringify(newFavorites));
    setIsFavorite(willBeFavorite);

    // Track analytics
    analytics.trackPoseFavorite(poseId, poseName, willBeFavorite);
  };

  return (
    <button 
      onClick={toggleFavorite}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      className={`text-xl transition-colors hover:scale-110 ${className}`}
    >
      {isFavorite ? '★' : '☆'}
    </button>
  );
}