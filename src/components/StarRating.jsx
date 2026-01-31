import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '../lib/utils';

export const StarRating = ({ rating, onChange, readOnly = false }) => {
    const [hoverRating, setHoverRating] = useState(0);

    const stars = [1, 2, 3, 4, 5];

    return (
        <div className="flex gap-1">
            {stars.map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => !readOnly && onChange(star)}
                    onMouseEnter={() => !readOnly && setHoverRating(star)}
                    onMouseLeave={() => !readOnly && setHoverRating(0)}
                    disabled={readOnly}
                    aria-label={`Rate ${star} stars`}
                    className={cn(
                        "p-1 focus:outline-none transition-colors",
                        readOnly ? "cursor-default pointer-events-none" : "cursor-pointer hover:scale-110"
                    )}
                >
                    <Star
                        className={cn(
                            "w-8 h-8 transition-colors",
                            (hoverRating || rating) >= star
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                        )}
                    />
                </button>
            ))}
        </div>
    );
};
