import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Edit2, Trash2, Droplets, Play } from 'lucide-react';

import { getIngredientColorInfo } from '../lib/colors';

export const RecipeCard = ({ recipe, onEdit, onDelete, onUse }) => {

    const colorInfo = getIngredientColorInfo(recipe.ingredients);
    const accentColor = colorInfo.bgClass;
    const ingredientsList = recipe.ingredients ? recipe.ingredients.split(',').map(i => i.trim()) : [];

    return (
        <Card className="hover:shadow-lg hover:shadow-indigo-100/40 transition-all border-0 shadow-sm shadow-gray-200 overflow-hidden relative group active:scale-[0.99] duration-200">
            {/* Left Accent Bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${accentColor}`} />

            <div className="p-4 pl-5">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-800 leading-tight pr-8">{recipe.name}</h3>

                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1 rounded-lg shadow-sm border border-gray-100">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full" onClick={(e) => { e.stopPropagation(); onEdit(recipe); }}>
                            <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full" onClick={(e) => { e.stopPropagation(); onDelete(recipe); }}>
                            <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                </div>

                {/* Tech Info Line */}
                <div className="flex flex-wrap items-center text-xs text-gray-600 mb-3 bg-gray-50 p-2 rounded-lg gap-y-1">
                    <span className="font-semibold text-gray-800">{recipe.waterL} L</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span>{recipe.sugarG} {recipe.sugarUnit || 'g'} sucre</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span>{recipe.grainsG} g grains</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span>{recipe.f1Hours} h</span>
                </div>

                {/* Ingredients Chips */}
                {ingredientsList.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {ingredientsList.map((ing, i) => (
                            <span
                                key={i}
                                className="text-[10px] uppercase font-bold tracking-wide text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-100"
                            >
                                {ing}
                            </span>
                        ))}
                    </div>
                )}

                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-indigo-600 bg-indigo-50/50 hover:bg-indigo-100 hover:text-indigo-800 border-0 flex justify-between items-center group/btn h-9"
                    onClick={onUse}
                >
                    <span className="font-medium">Utiliser cette recette</span>
                    <Play className="w-3.5 h-3.5 fill-current opacity-70 group-hover/btn:opacity-100 group-hover/btn:translate-x-0.5 transition-all" />
                </Button>
            </div>
        </Card>
    );
};
