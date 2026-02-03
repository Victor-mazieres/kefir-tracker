import React, { useState } from 'react';
import { useRecipes } from '../hooks/useDb';
import { RecipeCard } from '../components/RecipeCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Save } from 'lucide-react';
import { recipeSchema } from '../lib/schemas';

export default function Recipes() {
    const { recipes, add, update, remove } = useRecipes();
    const navigate = useNavigate();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        waterL: "2",
        sugarG: "60",
        grainsG: "50",
        f1Hours: "48",
        ingredients: ''
    });

    const [errors, setErrors] = useState({});

    const resetForm = () => {
        setFormData({
            name: '',
            waterL: "2",
            sugarG: "60",
            grainsG: "50",
            f1Hours: "48",
            ingredients: ''
        });
        setErrors({});
        setEditingId(null);
        setIsFormOpen(false);
    }

    const handleEdit = (recipe) => {
        setFormData({
            name: recipe.name,
            waterL: String(recipe.waterL),
            sugarG: String(recipe.sugarG),
            grainsG: String(recipe.grainsG),
            f1Hours: String(recipe.f1Hours),
            ingredients: recipe.ingredients || ''
        });
        setErrors({});
        setEditingId(recipe.id);
        setIsFormOpen(true);
    };

    const handleDelete = async () => {
        if (deleteId) {
            await remove(deleteId);
            setDeleteId(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        const rawData = {
            ...formData,
            waterL: Number(formData.waterL),
            sugarG: Number(formData.sugarG),
            grainsG: Number(formData.grainsG),
            f1Hours: Number(formData.f1Hours),
            sugarUnit: 'g', // Default for simplified recipe form
            isAmbientTemp: false, // Default
            temperature: undefined
        };

        const result = recipeSchema.safeParse(rawData);

        if (!result.success) {
            const formattedErrors = {};
            result.error.issues.forEach(issue => {
                formattedErrors[issue.path[0]] = issue.message;
            });
            setErrors(formattedErrors);
            return;
        }

        const data = result.data;

        if (editingId) {
            await update(editingId, data);
        } else {
            await add(data);
        }
        resetForm();
    };

    const handleUseRecipe = (recipe) => {
        navigate('/new-batch', { state: { preselectedRecipeId: recipe.id } });
    };

    return (
        <div className="space-y-6 pb-6 pt-2">
            <div className="flex items-center justify-between px-1">
                <h2 className="text-xl font-bold text-gray-800 tracking-tight">
                    Mes Recettes <span className="text-gray-400 text-lg font-normal ml-1">({recipes.length})</span>
                </h2>
                {!isFormOpen && (
                    <Button
                        size="sm"
                        onClick={() => setIsFormOpen(true)}
                        className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 active:scale-95 transition-all rounded-full px-4"
                    >
                        <Plus className="w-4 h-4" />
                        Nouvelle
                    </Button>
                )}
            </div>

            {isFormOpen && (
                <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-100 animate-in slide-in-from-top-4 duration-300">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-900">{editingId ? 'Modifier la recette' : 'Nouvelle recette'}</h3>
                        <Button variant="ghost" size="icon" onClick={resetForm}>
                            <X className="w-5 h-5 text-gray-500" />
                        </Button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <Input
                            label="Nom de la recette"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            error={errors.name}
                            placeholder="Ex: Kéfir Citron Classique"
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <Input label="Eau (L)" type="number" step="0.1" value={formData.waterL} onChange={e => setFormData({ ...formData, waterL: e.target.value })} error={errors.waterL} />
                            <Input label="Durée F1 (h)" type="number" value={formData.f1Hours} onChange={e => setFormData({ ...formData, f1Hours: e.target.value })} error={errors.f1Hours} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <Input label="Sucre (g)" type="number" value={formData.sugarG} onChange={e => setFormData({ ...formData, sugarG: e.target.value })} error={errors.sugarG} />
                            <Input label="Grains (g)" type="number" value={formData.grainsG} onChange={e => setFormData({ ...formData, grainsG: e.target.value })} error={errors.grainsG} />
                        </div>
                        <Input
                            label="Ingrédients (défaut)"
                            value={formData.ingredients}
                            onChange={e => setFormData({ ...formData, ingredients: e.target.value })}
                            error={errors.ingredients}
                            placeholder="Ingrédients par défaut..."
                        />
                        <Button type="submit" className="w-full gap-2">
                            <Save className="w-4 h-4" /> Enregistrer
                        </Button>
                    </form>
                </div>
            )}

            <div className="grid gap-4">
                {recipes.map(recipe => (
                    <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        onEdit={handleEdit}
                        onDelete={() => setDeleteId(recipe.id)}
                        onUse={() => handleUseRecipe(recipe)}
                    />
                ))}
                {!isFormOpen && recipes.length === 0 && (
                    <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                        <p>Aucune recette enregistrée.</p>
                        <Button variant="link" onClick={() => setIsFormOpen(true)}>
                            Créer ma première recette
                        </Button>
                    </div>
                )}
            </div>

            <ConfirmDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Supprimer la recette ?"
                message="Voulez-vous vraiment supprimer cette recette ?"
            />
        </div>
    );
}
