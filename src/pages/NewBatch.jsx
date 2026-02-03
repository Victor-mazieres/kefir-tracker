import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBatches, useRecipes } from '../hooks/useDb';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';
import { ArrowLeft, ChefHat } from 'lucide-react';
import { format } from 'date-fns';
import { batchSchema } from '../lib/schemas';

import { DateTimePicker } from '../components/DateTimePicker';

export default function NewBatch() {
    const navigate = useNavigate();
    const { add: addBatch } = useBatches();
    const { recipes } = useRecipes();

    const [formData, setFormData] = useState({
        title: 'Kéfir citron',
        f1Start: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        waterL: "2", // Managed as string for input, converted for submit
        sugarG: "60",
        sugarUnit: 'g',
        grainsG: "50",
        f1Hours: "48",
        temperature: "20",
        isAmbientTemp: false,
        ingredients: 'Citron, figue'
    });

    const [errors, setErrors] = useState({});

    /* New logic for preselecting recipe from navigation state */
    const { state } = useLocation();

    useEffect(() => {
        if (state?.preselectedRecipeId && recipes.length > 0) {
            const recipe = recipes.find(r => r.id === state.preselectedRecipeId);
            if (recipe) {
                setFormData(prev => ({
                    ...prev,
                    title: recipe.name || prev.title,
                    waterL: String(recipe.waterL),
                    sugarG: String(recipe.sugarG),
                    grainsG: String(recipe.grainsG),
                    f1Hours: String(recipe.f1Hours),
                    temperature: recipe.temperature ? String(recipe.temperature) : prev.temperature,
                    isAmbientTemp: recipe.isAmbientTemp || false,
                    ingredients: recipe.ingredients || prev.ingredients
                }));
            }
        }
    }, [state, recipes]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error when user changes field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleRecipeSelect = (e) => {
        const recipeId = e.target.value;
        if (!recipeId) return;
        const recipe = recipes.find(r => r.id === recipeId);
        if (recipe) {
            setFormData(prev => ({
                ...prev,
                title: recipe.name || prev.title,
                waterL: String(recipe.waterL),
                sugarG: String(recipe.sugarG),
                grainsG: String(recipe.grainsG),
                f1Hours: String(recipe.f1Hours),
                temperature: recipe.temperature ? String(recipe.temperature) : prev.temperature,
                isAmbientTemp: recipe.isAmbientTemp || false,
                ingredients: recipe.ingredients || prev.ingredients
            }));
            setErrors({});
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        // Convert to numbers for validation
        const rawData = {
            ...formData,
            waterL: Number(formData.waterL),
            sugarG: Number(formData.sugarG),
            grainsG: Number(formData.grainsG),
            f1Hours: Number(formData.f1Hours),
            temperature: formData.temperature ? Number(formData.temperature) : undefined,
        };

        const result = batchSchema.safeParse(rawData);

        if (!result.success) {
            const formattedErrors = {};
            result.error.issues.forEach(issue => {
                formattedErrors[issue.path[0]] = issue.message;
            });
            setErrors(formattedErrors);
            return;
        }

        try {
            const batch = await addBatch({
                ...result.data,
                f1Start: new Date(formData.f1Start).toISOString(),
                rating: 0,
                notes: '',
                f1DoneAt: null
            });
            navigate(`/batch/${batch.id}`);
        } catch (error) {
            console.error("Failed to create batch", error);
            alert("Erreur lors de la création du lot");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h2 className="text-xl font-bold text-gray-900">Nouveau Lot</h2>
            </div>

            <Card>
                <CardContent className="space-y-4 pt-6">
                    {recipes.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                                <ChefHat className="w-4 h-4" /> Importer une recette
                            </label>
                            <select
                                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                                onChange={handleRecipeSelect}
                                defaultValue=""
                            >
                                <option value="" disabled>Choisir...</option>
                                {recipes.map(r => (
                                    <option key={r.id} value={r.id}>{r.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Titre"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            error={errors.title}
                        />

                        <DateTimePicker
                            label="Début F1"
                            name="f1Start"
                            value={formData.f1Start}
                            onChange={handleChange}
                            error={errors.f1Start}
                        />

                        {/* Row 1: Water & Time */}
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Eau (L)"
                                type="number"
                                step="0.1"
                                name="waterL"
                                value={formData.waterL}
                                onChange={handleChange}
                                error={errors.waterL}
                            />
                            <Input
                                label="Durée F1 (h)"
                                type="number"
                                name="f1Hours"
                                value={formData.f1Hours}
                                onChange={handleChange}
                                error={errors.f1Hours}
                            />
                        </div>

                        {/* Row 2: Sugar & Grains */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-text-main mb-1">Sucre</label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        name="sugarG"
                                        value={formData.sugarG}
                                        onChange={handleChange}
                                        className="flex-1"
                                        placeholder="Qté"
                                        error={errors.sugarG}
                                    />
                                    <select
                                        name="sugarUnit"
                                        value={formData.sugarUnit}
                                        onChange={handleChange}
                                        className="h-12 rounded-md border border-secondary bg-surface px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                    >
                                        <option value="g">g</option>
                                        <option value="c.à.s">c.à.s</option>
                                        <option value="c.à.c">c.à.c</option>
                                    </select>
                                </div>
                            </div>
                            <Input
                                label="Grains (g)"
                                type="number"
                                name="grainsG"
                                value={formData.grainsG}
                                onChange={handleChange}
                                error={errors.grainsG}
                            />
                        </div>

                        {/* Row 3: Temperature */}
                        <div className="grid grid-cols-2 gap-4 items-end">
                            <Input
                                label="Température (°C)"
                                type="number"
                                step="0.5"
                                name="temperature"
                                value={formData.temperature}
                                onChange={handleChange}
                                error={errors.temperature}
                            />
                            <div className="flex items-center gap-2 h-12 pb-2">
                                <input
                                    type="checkbox"
                                    id="isAmbientTemp"
                                    name="isAmbientTemp"
                                    checked={formData.isAmbientTemp}
                                    onChange={handleChange}
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <label htmlFor="isAmbientTemp" className="text-sm font-medium text-gray-700">
                                    Temp. ambiante
                                </label>
                            </div>
                        </div>

                        <Input
                            label="Ingrédients / Arômes"
                            name="ingredients"
                            value={formData.ingredients}
                            onChange={handleChange}
                            placeholder="Ex: Citron, figue, dattes..."
                            error={errors.ingredients}
                        />

                        <div className="pt-4">
                            <Button type="submit" className="w-full" size="lg">
                                Enregistrer le lot
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div >
    );
}
