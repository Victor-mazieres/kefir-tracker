import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { StarRating } from '../StarRating';
import { Bottle } from '../illustrations/Bottle';
import { ChevronDown, Snowflake, Sun, ThermometerSun, Save } from 'lucide-react';
import { getIngredientColorInfo } from '../../lib/colors';
import { useDebounce } from '../../hooks/useDebounce';

export const BottleItem = ({ bottle, f2Duration, isExpanded, onToggleExpand, onUpdate }) => {
    const colorInfo = getIngredientColorInfo(bottle.ingredients);

    // Note state for debounce
    const [note, setNote] = useState(bottle.review || '');
    const debouncedNote = useDebounce(note, 1500); // 1.5s delay for comfortable typing

    // Sync note state if bottle.review changes externally (e.g. after save)
    // But be careful not to overwrite user typing if update comes from elsewhere?
    // Actually, if we just saved, bottle.review becomes what we typed.
    // So logic: setNote(bottle.review) only if it's different and meaningful?
    // Safer: only use initial state, but that desyncs if we navigate away and back?
    // React pattern: Key the component by ID? We are already doing that.

    // Auto-save effect
    useEffect(() => {
        // Only save if different from DB value
        if (debouncedNote !== (bottle.review || '')) {
            onUpdate(bottle.id, 'review', debouncedNote);
        }
    }, [debouncedNote, bottle.id, bottle.review, onUpdate]);

    return (
        <Card className="border-0 shadow-md shadow-purple-100 overflow-hidden ring-1 ring-black/5">
            <CardHeader
                className="pb-2 bg-purple-50/30 cursor-pointer hover:bg-purple-50/60 transition-colors"
                onClick={onToggleExpand}
            >
                <div className="flex justify-between items-center w-full">
                    <CardTitle className="text-gray-800 text-base flex items-center gap-2">
                        <span>Bouteille {bottle.id}</span>
                        {Array.isArray(bottle.ingredients) && bottle.ingredients.length > 0 && (
                            <span className={`text-xs font-normal py-1 px-2 rounded-full ${colorInfo.bgLightClass} ${colorInfo.textClass}`}>
                                {bottle.ingredients.join(', ')}
                            </span>
                        )}
                    </CardTitle>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
                {!isExpanded && (bottle.rating > 0 || bottle.ratingTaste > 0 || bottle.ratingFizz > 0) && (
                    <div className="text-xs text-gray-500 mt-1 flex gap-2">
                        {bottle.rating > 0 && <span>★ {bottle.rating}/5</span>}
                        {bottle.rating > 0 && (bottle.ratingTaste || bottle.ratingFizz) && <span>•</span>}
                        {bottle.ratingTaste > 0 && <span>Goût: {bottle.ratingTaste}</span>}
                    </div>
                )}
            </CardHeader>
            {isExpanded && (
                <CardContent className="space-y-4 pt-4 animate-in slide-in-from-top-2 duration-200">
                    <div className="space-y-6">
                        <div className="text-center">
                            <label className="block text-sm font-medium text-gray-700 mb-2">État de la bouteille</label>
                            <div className="flex gap-4 justify-center mb-6">
                                {/* Pressure Selector */}
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-xs text-gray-500">Pression</span>
                                    <div className="flex bg-gray-100 p-1 rounded-lg">
                                        <button
                                            onClick={() => onUpdate(bottle.id, 'pressure', 'low')}
                                            className={`p-2 rounded-md transition-all ${bottle.pressure === 'low' || !bottle.pressure ? 'bg-white shadow-sm text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}
                                            title="Faible"
                                        >
                                            <div className="w-2 h-2 rounded-full bg-gray-300" />
                                        </button>
                                        <button
                                            onClick={() => onUpdate(bottle.id, 'pressure', 'medium')}
                                            className={`p-2 rounded-md transition-all ${bottle.pressure === 'medium' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}
                                            title="Moyenne"
                                        >
                                            <div className="w-2 h-2 rounded-full bg-green-500" />
                                        </button>
                                        <button
                                            onClick={() => onUpdate(bottle.id, 'pressure', 'high')}
                                            className={`p-2 rounded-md transition-all ${bottle.pressure === 'high' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}
                                            title="Forte"
                                        >
                                            <div className="w-2 h-2 rounded-full bg-red-500" />
                                        </button>
                                    </div>
                                </div>

                                {/* Storage Selector */}
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-xs text-gray-500">Lieu</span>
                                    <div className="flex bg-gray-100 p-1 rounded-lg">
                                        <button
                                            onClick={() => onUpdate(bottle.id, 'storage', 'ambient')}
                                            className={`p-1.5 rounded-md transition-all ${bottle.storage === 'ambient' || !bottle.storage ? 'bg-white shadow-sm text-orange-500' : 'text-gray-400'}`}
                                            title="Ambiante"
                                        >
                                            <ThermometerSun className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onUpdate(bottle.id, 'storage', 'fridge')}
                                            className={`p-1.5 rounded-md transition-all ${bottle.storage === 'fridge' ? 'bg-white shadow-sm text-cyan-500' : 'text-gray-400'}`}
                                            title="Frigo"
                                        >
                                            <Snowflake className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <label className="block text-sm font-medium text-gray-700 mb-1">Note Globale</label>
                            <div className="flex flex-col items-center justify-center gap-2">
                                <StarRating
                                    rating={bottle.rating || 0}
                                    onChange={(val) => onUpdate(bottle.id, 'rating', val)}
                                />

                                {/* Calculated Score */}
                                {(bottle.ratingTaste || bottle.ratingFizz || bottle.ratingSugar || bottle.ratingAcidity) && (
                                    <div className="px-3 py-1 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-full text-xs font-medium text-gray-500 flex items-center gap-2 shadow-sm">
                                        <span>Score calculé</span>
                                        <span className="text-indigo-600 font-bold text-sm">
                                            {((
                                                (bottle.ratingTaste || 5) +
                                                (bottle.ratingFizz || 5) +
                                                (bottle.ratingSugar || 5) +
                                                (bottle.ratingAcidity || 5)
                                            ) / 4).toFixed(1)}
                                            /10
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
                            <div>
                                <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                                    <span>Goût</span>
                                    <span className="text-primary font-bold">{bottle.ratingTaste || 5}/10</span>
                                </label>
                                <input
                                    type="range" min="1" max="10"
                                    value={bottle.ratingTaste || 5}
                                    onChange={(e) => onUpdate(bottle.id, 'ratingTaste', Number(e.target.value))}
                                    className="w-full accent-primary h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            <div>
                                <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                                    <span>Bulles</span>
                                    <span className="text-purple-600 font-bold">{bottle.ratingFizz || 5}/10</span>
                                </label>
                                <input
                                    type="range" min="1" max="10"
                                    value={bottle.ratingFizz || 5}
                                    onChange={(e) => onUpdate(bottle.id, 'ratingFizz', Number(e.target.value))}
                                    className="w-full accent-purple-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            <div>
                                <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                                    <span>Sucre ressenti</span>
                                    <span className="text-pink-500 font-bold">{bottle.ratingSugar || 5}/10</span>
                                </label>
                                <input
                                    type="range" min="1" max="10"
                                    value={bottle.ratingSugar || 5}
                                    onChange={(e) => onUpdate(bottle.id, 'ratingSugar', Number(e.target.value))}
                                    className="w-full accent-pink-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>

                            <div>
                                <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                                    <span>Acidité</span>
                                    <span className="text-amber-500 font-bold">{bottle.ratingAcidity || 5}/10</span>
                                </label>
                                <input
                                    type="range" min="1" max="10"
                                    value={bottle.ratingAcidity || 5}
                                    onChange={(e) => onUpdate(bottle.id, 'ratingAcidity', Number(e.target.value))}
                                    className="w-full accent-amber-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                            Notes de dégustation
                            {Array.isArray(bottle.ingredients) && bottle.ingredients.length > 0 && (
                                <span className="text-[10px] font-normal bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full border border-gray-200">
                                    {bottle.ingredients.join(', ')}
                                </span>
                            )}
                        </label>
                        <textarea
                            className="w-full min-h-[100px] p-3 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            placeholder={`Commentaires pour la bouteille ${bottle.id}...`}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        ></textarea>
                        <div className="flex justify-between mt-2">
                            <span className="text-xs text-gray-400 italic self-center">
                                {debouncedNote !== (bottle.review || '') ? 'Enregistrement...' : 'Sauvegardé'}
                            </span>
                            {/* Manual save button still useful */}
                            <Button
                                onClick={() => onUpdate(bottle.id, 'review', note)}
                                size="sm"
                                className="gap-2"
                                disabled={note === (bottle.review || '')}
                            >
                                <Save className="w-4 h-4" /> Sauvegarder
                            </Button>
                        </div>
                    </div>
                </CardContent>
            )}
        </Card>
    );
};
