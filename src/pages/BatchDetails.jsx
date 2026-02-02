import React, { useState, useEffect } from 'react';
import { Bottle } from '../components/illustrations/Bottle';
import { useParams, useNavigate } from 'react-router-dom';
import { useBatches, useRecipes } from '../hooks/useDb';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { StarRating } from '../components/StarRating';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Toast } from '../components/ui/Toast';
import { ArrowLeft, Clock, Calendar, CheckCircle, Trash2, Save, PlusCircle, BookHeart, ChevronDown } from 'lucide-react';
import { format, addHours, isPast } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function BatchDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { get, update, remove } = useBatches();
    const { add: addRecipe } = useRecipes();
    const [batch, setBatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [notes, setNotes] = useState('');
    const [toast, setToast] = useState(null);

    const [bottleNotes, setBottleNotes] = useState({});
    const [expandedBottleId, setExpandedBottleId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await get(id);
                if (data) {
                    setBatch(data);
                    setNotes(data.notes || '');
                    // Initialize bottle notes
                    if (data.bottles) {
                        const bNotes = {};
                        data.bottles.forEach(b => {
                            bNotes[b.id] = b.notes || '';
                        });
                        setBottleNotes(bNotes);
                    }
                } else {
                    navigate('/');
                }
            } catch (e) {
                console.error(e);
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, get, navigate]);

    const handleRatingChange = async (key, value) => {
        const updated = await update(id, { [key]: value });
        setBatch(updated);
    };

    const handleNotesSave = async () => {
        const updated = await update(id, { notes });
        setBatch(updated);
    };

    const handleBottleRatingChange = async (bottleId, key, value) => {
        if (!batch.bottles) return;
        const updatedBottles = batch.bottles.map(b =>
            b.id === bottleId ? { ...b, [key]: value } : b
        );
        const updatedBatch = await update(id, { bottles: updatedBottles });
        setBatch(updatedBatch);
    };

    const handleBottleNoteChange = (bottleId, value) => {
        setBottleNotes(prev => ({ ...prev, [bottleId]: value }));
    };

    const handleBottleNoteSave = async (bottleId) => {
        if (!batch.bottles) return;
        const note = bottleNotes[bottleId];
        const updatedBottles = batch.bottles.map(b =>
            b.id === bottleId ? { ...b, notes: note } : b
        );
        const updatedBatch = await update(id, { bottles: updatedBottles });
        setBatch(updatedBatch);
    };

    const handleF1Complete = async () => {
        const updated = await update(id, { f1DoneAt: new Date().toISOString() });
        setBatch(updated);
    };

    const handleDelete = async () => {
        await remove(id);
        navigate('/', { replace: true });
    };

    const handleSaveRecipe = async () => {
        const name = prompt("Nom de la recette :", batch.title);
        if (!name) return;

        try {
            await addRecipe({
                name,
                waterL: batch.waterL,
                sugarG: batch.sugarG,
                sugarUnit: batch.sugarUnit,
                grainsG: batch.grainsG,
                f1Hours: batch.f1Hours,
                temperature: batch.temperature,
                isAmbientTemp: batch.isAmbientTemp,
                ingredients: batch.ingredients
            });
            setToast({ message: "Recette sauvegardée avec succès !", type: "success" });
        } catch (error) {
            console.error("Failed to save recipe", error);
            setToast({ message: "Erreur lors de la sauvegarde", type: "error" });
        }
    };

    if (loading) return <div className="p-8 text-center">Chargement...</div>;
    if (!batch) return null;

    const f1StartDate = new Date(batch.f1Start);
    const f1EndDate = addHours(f1StartDate, batch.f1Hours);
    const isF1Overdue = isPast(f1EndDate) && !batch.f1DoneAt;

    return (
        <div className="space-y-6 relative">
            <div className="flex items-center justify-between">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h2 className="text-xl font-bold text-gray-900 truncate flex-1 ml-2">{batch.title}</h2>
                <Button variant="ghost" size="icon" className="text-red-500" onClick={() => setShowDeleteConfirm(true)}>
                    <Trash2 className="w-5 h-5" />
                </Button>
            </div>

            {/* Timeline Card */}
            <Card className="bg-gradient-to-br from-background to-surface">
                <CardHeader className="pb-2">
                    <CardTitle className="text-primary flex items-center gap-2">
                        <Clock className="w-5 h-5" /> Timeline F1
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Début</span>
                        <span className="font-medium">{format(f1StartDate, "d MMM HH:mm", { locale: fr })}</span>
                    </div>
                    <div className="relative pl-4 border-l-2 border-indigo-200 py-2">
                        <div className="text-xs text-gray-500 mb-1">{batch.f1Hours} heures</div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Fin prévue</span>
                            <span className={`font-medium ${isF1Overdue ? 'text-orange-600 font-bold' : ''}`}>
                                {format(f1EndDate, "d MMM HH:mm", { locale: fr })}
                            </span>
                        </div>
                    </div>

                    {batch.f1DoneAt ? (
                        <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium">
                            <CheckCircle className="w-4 h-4" />
                            F1 terminée le {format(new Date(batch.f1DoneAt), "d MMM HH:mm", { locale: fr })}
                        </div>
                    ) : (
                        <Button onClick={handleF1Complete} className="w-full gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Marquer F1 terminée
                        </Button>
                    )}
                </CardContent>

            </Card>

            {/* F2 / Bottling Card */}
            <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100">
                <CardHeader className="pb-2">
                    <CardTitle className="text-purple-900 flex items-center gap-2">
                        <div className="flex justify-between w-full items-center">
                            <span className="flex items-center gap-2">Mise en bouteille (F2)</span>
                            {batch.f2Start && <span className="text-xs font-normal text-purple-600 bg-purple-100 px-2 py-1 rounded-full">{format(new Date(batch.f2Start), "d MMM", { locale: fr })}</span>}
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {batch.bottles ? (
                        <div className="grid grid-cols-2 justify-items-center gap-4 pt-6">
                            {batch.bottles.map((bottle, idx) => (
                                <Bottle key={idx} index={idx} size="sm" noRotation>
                                    <div className="w-full h-full flex flex-col justify-center items-center">
                                        <span className="text-[7px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 w-full text-center mb-0.5 shrink-0">
                                            Bouteille {bottle.id}
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
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-2">
                            <p className="text-sm text-gray-500 mb-4">La première fermentation est terminée ? Passez à la mise en bouteille !</p>
                            <Button onClick={() => navigate(`/batch/${id}/bottling`)} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                                <PlusCircle className="w-4 h-4 mr-2" />
                                Start F2 & Add Ingredients
                            </Button>
                        </div>
                    )
                    }
                </CardContent>
            </Card>

            {/* Recipe Info */}
            <Card>
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-gray-800 text-base">Recette</CardTitle>
                        <Button variant="ghost" size="sm" onClick={handleSaveRecipe} className="h-8 px-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                            <BookHeart className="w-4 h-4 mr-1.5" />
                            <span className="text-xs font-medium">Sauvegarder</span>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                    <div className="grid grid-cols-4 gap-2 text-center">
                        <div className="bg-blue-50 p-2 rounded">
                            <div className="text-blue-500 font-bold">{batch.waterL} L</div>
                            <div className="text-xs text-blue-400">Eau</div>
                        </div>
                        <div className="bg-pink-50 p-2 rounded">
                            <div className="text-pink-500 font-bold">{batch.sugarG} {batch.sugarUnit || 'g'}</div>
                            <div className="text-xs text-pink-400">Sucre</div>
                        </div>
                        <div className="bg-amber-50 p-2 rounded">
                            <div className="text-amber-600 font-bold">{batch.grainsG} g</div>
                            <div className="text-xs text-amber-500">Grains</div>
                        </div>
                        {batch.temperature && (
                            <div className="bg-red-50 p-2 rounded">
                                <div className="text-red-500 font-bold">{batch.temperature}°</div>
                                <div className="text-xs text-red-400">{batch.isAmbientTemp ? 'Ambiante' : 'Temp.'}</div>
                            </div>
                        )}
                    </div>
                    {batch.ingredients && (
                        <div className="mt-3 p-3 bg-gray-50 rounded text-gray-700 italic border border-gray-100">
                            {batch.ingredients}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Rating & Notes System */}
            {batch.bottles && batch.bottles.length > 0 ? (
                // *** Per-Bottle Rating System ***
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-800 px-1">Dégustation par Bouteille ({batch.bottles.length})</h3>
                    {batch.bottles.map((bottle) => {
                        const isExpanded = expandedBottleId === bottle.id;
                        return (
                            <Card key={bottle.id} className="border-l-4 border-l-purple-500 overflow-hidden">
                                <CardHeader
                                    className="pb-2 bg-purple-50/30 cursor-pointer hover:bg-purple-50/60 transition-colors"
                                    onClick={() => setExpandedBottleId(isExpanded ? null : bottle.id)}
                                >
                                    <div className="flex justify-between items-center w-full">
                                        <CardTitle className="text-gray-800 text-base flex items-center gap-2">
                                            <span>Bouteille {bottle.id}</span>
                                            {Array.isArray(bottle.ingredients) && bottle.ingredients.length > 0 && (
                                                <span className="text-xs font-normal bg-purple-100 text-purple-700 py-1 px-2 rounded-full">
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
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Note Globale</label>
                                                <div className="flex justify-center">
                                                    <StarRating
                                                        rating={bottle.rating || 0}
                                                        onChange={(val) => handleBottleRatingChange(bottle.id, 'rating', val)}
                                                    />
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
                                                        onChange={(e) => handleBottleRatingChange(bottle.id, 'ratingTaste', Number(e.target.value))}
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
                                                        onChange={(e) => handleBottleRatingChange(bottle.id, 'ratingFizz', Number(e.target.value))}
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
                                                        onChange={(e) => handleBottleRatingChange(bottle.id, 'ratingSugar', Number(e.target.value))}
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
                                                        onChange={(e) => handleBottleRatingChange(bottle.id, 'ratingAcidity', Number(e.target.value))}
                                                        className="w-full accent-amber-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Notes ({Array.isArray(bottle.ingredients) ? bottle.ingredients.join(', ') : (bottle.ingredients || `Bouteille ${bottle.id}`)})</label>
                                            <textarea
                                                className="w-full min-h-[100px] p-3 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                placeholder={`Commentaires pour la bouteille ${bottle.id}...`}
                                                value={bottleNotes[bottle.id] || ''}
                                                onChange={(e) => handleBottleNoteChange(bottle.id, e.target.value)}
                                                onBlur={() => handleBottleNoteSave(bottle.id)}
                                            ></textarea>
                                            <div className="flex justify-between mt-2">
                                                <span className="text-xs text-gray-400 italic self-center">Sauvegardé auto. au départ du champ</span>
                                                <Button onClick={() => handleBottleNoteSave(bottle.id)} size="sm" className="gap-2">
                                                    <Save className="w-4 h-4" /> Sauvegarder
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                )}
                            </Card>
                        );
                    })}
                </div>
            ) : (
                // *** Legacy Global Rating (Fallback) ***
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-gray-800 text-base">Résultat</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-6">
                            <div className="text-center">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Note Globale</label>
                                <div className="flex justify-center">
                                    <StarRating rating={batch.rating} onChange={(val) => handleRatingChange('rating', val)} />
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
                                        onChange={(e) => handleRatingChange('ratingTaste', Number(e.target.value))}
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
                                        onChange={(e) => handleRatingChange('ratingFizz', Number(e.target.value))}
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
                                        onChange={(e) => handleRatingChange('ratingSugar', Number(e.target.value))}
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
                                        onChange={(e) => handleRatingChange('ratingAcidity', Number(e.target.value))}
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
                                onChange={(e) => setNotes(e.target.value)}
                                onBlur={handleNotesSave}
                            ></textarea>
                            <div className="flex justify-between mt-2">
                                <span className="text-xs text-gray-400 italic self-center">Sauvegardé auto. au départ du champ</span>
                                <Button onClick={handleNotesSave} size="sm" className="gap-2">
                                    <Save className="w-4 h-4" /> Sauvegarder
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <ConfirmDialog
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={handleDelete}
                title="Supprimer le lot ?"
                message="Cette action est irréversible."
            />


            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div >
    );
}
