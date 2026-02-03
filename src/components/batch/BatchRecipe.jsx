import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { BookHeart, Droplets, Candy, Wheat, Thermometer } from 'lucide-react';

export const BatchRecipe = ({ batch, onSaveRecipe }) => {
    return (
        <Card className="border-0 shadow-lg shadow-pink-100/50 overflow-hidden bg-gradient-to-br from-white to-pink-50/30">
            <CardHeader className="pb-4">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-gray-800 text-lg flex items-center gap-2">
                        <BookHeart className="w-5 h-5 text-pink-500" /> Recette
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={onSaveRecipe} className="h-8 px-3 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-full transition-colors">
                        <span className="text-xs font-semibold">Sauvegarder</span>
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    {/* Water */}
                    <div className="bg-blue-50/50 p-3 rounded-2xl flex items-center gap-3 border border-blue-100/50">
                        <div className="bg-white p-2 rounded-full shadow-sm text-blue-500">
                            <Droplets className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-xl font-bold text-gray-800 leading-none">{batch.waterL} <span className="text-xs font-normal text-gray-500">L</span></div>
                            <div className="text-[10px] uppercase tracking-wider text-blue-400 font-semibold mt-0.5">Eau</div>
                        </div>
                    </div>

                    {/* Sugar */}
                    <div className="bg-pink-50/50 p-3 rounded-2xl flex items-center gap-3 border border-pink-100/50">
                        <div className="bg-white p-2 rounded-full shadow-sm text-pink-500">
                            <Candy className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-xl font-bold text-gray-800 leading-none">{batch.sugarG} <span className="text-xs font-normal text-gray-500">{batch.sugarUnit || 'g'}</span></div>
                            <div className="text-[10px] uppercase tracking-wider text-pink-400 font-semibold mt-0.5">Sucre</div>
                        </div>
                    </div>

                    {/* Grains */}
                    <div className="bg-amber-50/50 p-3 rounded-2xl flex items-center gap-3 border border-amber-100/50">
                        <div className="bg-white p-2 rounded-full shadow-sm text-amber-500">
                            <Wheat className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-xl font-bold text-gray-800 leading-none">{batch.grainsG} <span className="text-xs font-normal text-gray-500">g</span></div>
                            <div className="text-[10px] uppercase tracking-wider text-amber-500 font-semibold mt-0.5">Grains</div>
                        </div>
                    </div>

                    {/* Temperature */}
                    {batch.temperature && (
                        <div className="bg-red-50/50 p-3 rounded-2xl flex items-center gap-3 border border-red-100/50">
                            <div className="bg-white p-2 rounded-full shadow-sm text-red-500">
                                <Thermometer className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-xl font-bold text-gray-800 leading-none">{batch.temperature}°</div>
                                <div className="text-[10px] uppercase tracking-wider text-red-400 font-semibold mt-0.5">{batch.isAmbientTemp ? 'Ambiante' : 'Cible'}</div>
                            </div>
                        </div>
                    )}
                </div>

                {batch.ingredients && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-xl text-gray-700 italic border border-gray-100 text-sm leading-relaxed text-center relative">
                        "{batch.ingredients}"
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
