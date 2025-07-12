import React from 'react';
import { Star } from 'lucide-react';

interface RatingProps {
  rating: number;
  totalRatings?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
}

export const Rating: React.FC<RatingProps> = ({
  rating,
  totalRatings,
  size = 'md',
  showNumber = true
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const stars = Array.from({ length: 5 }, (_, index) => {
    const isFilled = index < Math.floor(rating);
    const isHalf = index === Math.floor(rating) && rating % 1 >= 0.5;

    return (
      <Star
        key={index}
        className={`${sizeClasses[size]} ${
          isFilled || isHalf ? 'text-yellow-400 fill-current' : 'text-gray-600'
        }`}
      />
    );
  });

  return (
    <div className="flex items-center gap-1">
      <div className="flex">{stars}</div>
      {showNumber && (
        <span className="text-sm text-gray-400 ml-1">
          {rating.toFixed(1)} {totalRatings && `(${totalRatings})`}
        </span>
      )}
    </div>
  );
};