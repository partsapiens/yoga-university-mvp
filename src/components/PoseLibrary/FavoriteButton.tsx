import { useState, useEffect } from 'react';

interface FavoriteButtonProps {
  poseId: string;
  className?: string;
}

export default function FavoriteButton({ poseId, className = "" }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Load favorite status from localStorage
    const favorites = JSON.parse(localStorage.getItem('yogaFavorites') || '[]');
    setIsFavorite(favorites.includes(poseId));
  }, [poseId]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('yogaFavorites') || '[]');
    let newFavorites;
    
    if (isFavorite) {
      newFavorites = favorites.filter((id: string) => id !== poseId);
    } else {
      newFavorites = [...favorites, poseId];
    }
    
    localStorage.setItem('yogaFavorites', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
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