

import React from 'react';
// FIX: Correctly imported StarIcon.
import { StarIcon } from '../icons/Icons';

interface Props {
    rating: number;
    maxRating?: number;
    className?: string;
}

const StarRating: React.FC<Props> = ({ rating, maxRating = 5, className = "text-yellow-400" }) => {
    return (
        <div className={`flex items-center ${className}`}>
            {[...Array(maxRating)].map((_, index) => {
                const starValue = index + 1;
                return (
                    <StarIcon 
                        key={index} 
                        className="w-5 h-5" 
                        filled={starValue <= rating} 
                    />
                );
            })}
        </div>
    );
};

export default StarRating;