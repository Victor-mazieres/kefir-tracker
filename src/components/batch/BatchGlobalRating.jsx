import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { StarRating } from '../StarRating';
import { Save } from 'lucide-react';

export const BatchGlobalRating = ({ batch, notes, onNotesChange, onNotesSave, onRatingChange }) => {
    return (
        <Card className="border-0 shadow-lg shadow-indigo-100/50">
            <CardHeader className="pb-2">
                <CardTitle className="text-gray-800 text-base">Résultat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-6">
                    <div className="text-center">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Note Globale</label>
                        <div className="flex justify-center">
                            <StarRating rating={batch.rating} onChange={(val) => onRatingChange('rating', val)} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
                        <div>
                            <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                                <span>Goût</span>
                                <span className="text-primary font-bold">{batch.ratingTaste || 5}/10</span>
                            </label>
                            <input
                                type="range" min="1" max="10"
                                value={batch.ratingTaste || 5}
                                onChange={(e) => onRatingChange('ratingTaste', Number(e.target.value))}
                                className="w-full accent-primary h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        <div>
                            <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                                <span>Bulles</span>
                                <span className="text-purple-600 font-bold">{batch.ratingFizz || 5}/10</span>
                            </label>
                            <input
                                type="range" min="1" max="10"
                                value={batch.ratingFizz || 5}
                                onChange={(e) => onRatingChange('ratingFizz', Number(e.target.value))}
                                className="w-full accent-purple-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        <div>
                            <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                                <span>Sucre ressenti</span>
                                <span className="text-pink-500 font-bold">{batch.ratingSugar || 5}/10</span>
                            </label>
                            <input
                                type="range" min="1" max="10"
                                value={batch.ratingSugar || 5}
                                onChange={(e) => onRatingChange('ratingSugar', Number(e.target.value))}
                                className="w-full accent-pink-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        <div>
                            <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                                <span>Acidité</span>
                                <span className="text-amber-500 font-bold">{batch.ratingAcidity || 5}/10</span>
                            </label>
                            <input
                                type="range" min="1" max="10"
                                value={batch.ratingAcidity || 5}
                                onChange={(e) => onRatingChange('ratingAcidity', Number(e.target.value))}
                                className="w-full accent-amber-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                        className="w-full min-h-[100px] p-3 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        placeholder="Comment était le goût ? Pétillant ?..."
                        value={notes}
                        onChange={(e) => onNotesChange(e.target.value)}
                        onBlur={onNotesSave}
                    ></textarea>
                    <div className="flex justify-between mt-2">
                        <span className="text-xs text-gray-400 italic self-center">Sauvegardé auto. au départ du champ</span>
                        <Button onClick={onNotesSave} size="sm" className="gap-2">
                            <Save className="w-4 h-4" /> Sauvegarder
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
