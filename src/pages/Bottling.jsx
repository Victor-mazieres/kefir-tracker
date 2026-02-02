import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBatches } from '../hooks/useDb';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { ArrowLeft, Save, Plus, Minus, Wine } from 'lucide-react';

export default function Bottling() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { get, update } = useBatches();
    const [bottleCount, setBottleCount] = useState(1);
    const [bottles, setBottles] = useState([{ id: 1, ingredients: [] }]);

    const handleCountChange = (newCount) => {
        if (newCount < 1) return;
        setBottleCount(newCount);

        setBottles(prev => {
            if (newCount > prev.length) {
                const newBottles = [...prev];
                for (let i = prev.length; i < newCount; i++) {
                    newBottles.push({ id: i + 1, ingredients: [] });
                }
                return newBottles;
            } else {
                return prev.slice(0, newCount);
            }
        });
    };

    const addIngredient = (index, value) => {
        if (!value.trim()) return;
        const newBottles = [...bottles];
        if (!Array.isArray(newBottles[index].ingredients)) {
            newBottles[index].ingredients = [];
        }
        newBottles[index].ingredients.push(value.trim());
        setBottles(newBottles);
    };

    const removeIngredient = (bottleIndex, ingredientIndex) => {
        const newBottles = [...bottles];
        if (Array.isArray(newBottles[bottleIndex].ingredients)) {
            newBottles[bottleIndex].ingredients = newBottles[bottleIndex].ingredients.filter((_, i) => i !== ingredientIndex);
            setBottles(newBottles);
        }
    };

    const handleSave = async () => {
        try {
            await update(id, {
                f2Start: new Date().toISOString(),
                bottles: bottles
            });
            navigate(`/batch/${id}`);
        } catch (error) {
            console.error("Failed to save bottling data", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h2 className="text-xl font-bold text-text-main">Mise en bouteille (F2)</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg text-primary flex items-center gap-2">
                        <Wine className="w-5 h-5" /> Configuration
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Counter Section */}
                    <div className="flex flex-col items-center justify-center p-6 bg-primary/5 rounded-2xl border border-primary/10">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-primary shadow-sm mb-3">
                            <Wine className="w-8 h-8" />
                        </div>
                        <label className="block text-sm font-medium text-text-main mb-3">Nombre de bouteilles</label>
                        <div className="flex items-center gap-6">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleCountChange(bottleCount - 1)}
                                className="h-10 w-10 rounded-full border-primary/20 hover:bg-primary/5 hover:text-primary"
                            >
                                <Minus className="w-5 h-5" />
                            </Button>
                            <span className="text-3xl font-bold w-12 text-center text-primary">{bottleCount}</span>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleCountChange(bottleCount + 1)}
                                className="h-10 w-10 rounded-full border-primary/20 hover:bg-primary/5 hover:text-primary"
                            >
                                <Plus className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Bottles List */}
                    <div className="space-y-4">
                        {bottles.map((bottle, index) => (
                            <div
                                key={bottle.id}
                                className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md hover:border-primary/20 items-start"
                            >
                                <div className="flex-shrink-0 w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mt-1">
                                    <Wine className="w-6 h-6" />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <h4 className="text-sm font-bold text-gray-900">Bouteille #{bottle.id}</h4>

                                    {/* Ingredient List (Tags) */}
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {Array.isArray(bottle.ingredients) && bottle.ingredients.map((ing, i) => (
                                            <span key={i} className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                                                {ing}
                                                <button
                                                    onClick={() => removeIngredient(index, i)}
                                                    className="hover:bg-primary/20 rounded-full p-0.5"
                                                >
                                                    <Minus className="w-3 h-3" />

                                                </button>
                                            </span>
                                        ))}
                                    </div>

                                    {/* Add Ingredient Input */}
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Ajouter un ingrédient..."
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addIngredient(index, e.currentTarget.value);
                                                    e.currentTarget.value = '';
                                                }
                                            }}
                                            className="bg-gray-50/50"
                                            id={`ing-input-${bottle.id}`}
                                        />
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => {
                                                const input = document.getElementById(`ing-input-${bottle.id}`);
                                                if (input && input.value) {
                                                    addIngredient(index, input.value);
                                                    input.value = '';
                                                }
                                            }}
                                        >
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Button onClick={handleSave} className="w-full flex items-center justify-center gap-2" size="lg">
                        <Save className="w-4 h-4" /> Enregistrer et Lancer F2
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
