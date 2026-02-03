import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/Card';
import { StarRating } from './StarRating';
import { Calendar, Droplets } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { getIngredientColorInfo } from '../lib/colors';

export const BatchCard = ({ batch }) => {
    const navigate = useNavigate();

    const colorInfo = getIngredientColorInfo(batch.ingredients);
    const accentColor = colorInfo.bgClass;
    const ingredientsList = batch.ingredients ? batch.ingredients.split(',').map(i => i.trim()) : [];

    return (
        <Card
            className="cursor-pointer hover:shadow-lg hover:shadow-indigo-100/50 transition-all active:scale-[0.98] duration-200 border-0 shadow-sm shadow-gray-200/50 overflow-hidden group relative"
            onClick={() => navigate(`/batch/${batch.id}`)}
        >
            {/* Left Accent Bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${accentColor}`} />

            <CardContent className="p-4 pl-5">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <CardTitle className="text-base font-bold text-gray-800 leading-tight group-hover:text-indigo-700 transition-colors">
                            {batch.title}
                        </CardTitle>
                        <div className="flex items-center text-xs text-gray-400 mt-1 font-medium">
                            <Calendar className="w-3 h-3 mr-1" />
                            {format(new Date(batch.f1Start), "d MMM", { locale: fr })}
                        </div>
                    </div>
                    {batch.rating > 0 && (
                        <div className="bg-yellow-50 px-2 py-1 rounded-lg flex items-center justify-center">
                            <StarRating rating={batch.rating} readOnly size="sm" />
                        </div>
                    )}
                </div>

                {/* Tech Info Line */}
                <div className="flex items-center text-xs text-gray-500 mb-3 bg-gray-50/80 p-1.5 rounded-md w-fit">
                    <span className="font-semibold text-gray-700">{batch.waterL} L</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span>S <span className="font-medium text-gray-700">{batch.sugarG}{batch.sugarUnit || 'g'}</span></span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span>G <span className="font-medium text-gray-700">{batch.grainsG}g</span></span>
                </div>

                {/* Ingredients Chips */}
                {ingredientsList.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                        {ingredientsList.slice(0, 3).map((ing, i) => (
                            <span
                                key={i}
                                className="text-[10px] uppercase font-bold tracking-wide text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full"
                            >
                                {ing}
                            </span>
                        ))}
                        {ingredientsList.length > 3 && (
                            <span className="text-[10px] text-gray-400 self-center">+{ingredientsList.length - 3}</span>
                        )}
                    </div>
                ) : (
                    <span className="text-[10px] text-gray-300 italic">Nature</span>
                )}
            </CardContent>
        </Card>
    );
};
