import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Bottle } from '../illustrations/Bottle';
import { Snowflake, Sun, PlusCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { getIngredientColorInfo } from '../../lib/colors';
import { differenceInDays, format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const BatchBottling = ({ batch, onStartBottling }) => {
    return (
        <Card className="border-0 shadow-lg shadow-purple-100/50 overflow-hidden bg-gradient-to-b from-white to-purple-50/30">
            <CardHeader className="pb-2">
                <CardTitle className="text-purple-900 flex items-center gap-2 text-lg">
                    <div className="flex justify-between w-full items-center">
                        <span className="flex items-center gap-2">Mise en bouteille</span>
                        {batch.f2Start && <span className="text-xs font-medium text-purple-700 bg-purple-100 px-3 py-1 rounded-full">{format(new Date(batch.f2Start), "d MMM", { locale: fr })}</span>}
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {batch.bottles ? (
                    <div className="grid grid-cols-2 justify-items-center gap-x-4 gap-y-8 pt-6">
                        {batch.bottles.map((bottle) => {
                            const f2Duration = batch.f2Start ? differenceInDays(new Date(), new Date(batch.f2Start)) : 0;
                            const colorInfo = getIngredientColorInfo(bottle.ingredients);

                            return (
                                <div key={bottle.id} className="flex flex-col items-center w-full">
                                    <Bottle index={bottle.id} size="sm" noRotation color={colorInfo.hex}>
                                        <div className="w-full h-full flex flex-col justify-center items-center">
                                            <span className="text-[7px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200/50 w-full text-center mb-0.5 shrink-0">
                                                N° {bottle.id}
                                            </span>
                                            <div className="flex-1 flex flex-col items-center justify-center w-full min-h-0 overflow-hidden">
                                                {Array.isArray(bottle.ingredients) ? (
                                                    <div className="flex flex-col items-center gap-0.5 w-full">
                                                        {bottle.ingredients.slice(0, 5).map((ing, i) => (
                                                            <span key={i} className="font-handwriting text-gray-800 text-[9px] leading-3 text-center w-full truncate px-1" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }}>
                                                                {ing}
                                                            </span>
                                                        ))}
                                                        {bottle.ingredients.length > 5 && (
                                                            <span className="text-[8px] text-gray-500 leading-none">...</span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center gap-0.5 w-full">
                                                        {(bottle.ingredients || "Nature").toString().split(',').slice(0, 5).map((ing, i) => (
                                                            <span key={i} className="font-handwriting text-gray-800 text-[9px] leading-3 text-center w-full truncate px-1" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }}>
                                                                {ing.trim()}
                                                            </span>
                                                        ))}
                                                        {(bottle.ingredients || "").toString().split(',').length > 5 && (
                                                            <span className="text-[8px] text-gray-500 leading-none">...</span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Bottle>

                                    {/* Quick Info Badges */}
                                    <div className="mt-[-10px] z-10 flex flex-col gap-1 w-full max-w-[120px]">
                                        <div className="bg-white/90 backdrop-blur-sm shadow-sm rounded-lg border border-purple-100 p-1.5 flex justify-between items-center text-[10px] text-gray-600">
                                            <span className="font-bold text-indigo-600">J+{f2Duration}</span>
                                            <div className="h-3 w-[1px] bg-gray-200"></div>
                                            {bottle.storage === 'fridge' ? <Snowflake className="w-3 h-3 text-cyan-400" /> : <Sun className="w-3 h-3 text-orange-400" />}
                                            <div className="h-3 w-[1px] bg-gray-200"></div>
                                            <div className={`w-2 h-2 rounded-full ${bottle.pressure === 'high' ? 'bg-red-500' : bottle.pressure === 'medium' ? 'bg-green-500' : 'bg-gray-300'}`} title="Pression" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-2">
                        <p className="text-sm text-gray-500 mb-4">La première fermentation est terminée ? Passez à la mise en bouteille !</p>
                        <Button onClick={onStartBottling} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Lancer F2 & Aromatiser
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
