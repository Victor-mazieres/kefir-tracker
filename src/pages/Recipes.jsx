import React, { useState } from 'react';
import { useRecipes } from '../hooks/useDb';
import { RecipeCard } from '../components/RecipeCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Save } from 'lucide-react';

export default function Recipes() {
    const { recipes, add, update, remove } = useRecipes();
    const navigate = useNavigate();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        waterL: 2,
        sugarG: 60,
        grainsG: 50,
        f1Hours: 48,
        ingredients: ''
    });

    const resetForm = () => {
        setFormData({
            name: '',
            waterL: 2,
            sugarG: 60,
            grainsG: 50,
            f1Hours: 48,
            ingredients: ''
        });
        setEditingId(null);
        setIsFormOpen(false);
    }

    const handleEdit = (recipe) => {
        setFormData({
            name: recipe.name,
            waterL: recipe.waterL,
            sugarG: recipe.sugarG,
            grainsG: recipe.grainsG,
            f1Hours: recipe.f1Hours,
            ingredients: recipe.ingredients || ''
        });
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
        const data = {
            ...formData,
            waterL: Number(formData.waterL),
            sugarG: Number(formData.sugarG),
            grainsG: Number(formData.grainsG),
            f1Hours: Number(formData.f1Hours),
        };

        if (editingId) {
            await update(editingId, data);
        } else {
            await add(data);
        }
        resetForm();
    };

    const handleUseRecipe = (recipe) => {
        // We can't easily pass state via navigate to a new route in a standard way that persists refresh if not using query params or state.
        // But NewBatch can read from state location.
        // Let's modify NewBatch to read location.state later if needed? 
        // Actually typical pattern is just navigate and let user select, OR pass state.
        // Simplest: just navigate to new-batch? But user wants to "Select recipe".
        // Let's pass it in state.
        navigate('/new-batch', { state: { preselectedRecipeId: recipe.id } }); // Note: Need to handle this in NewBatch if I want auto-select
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Mes Recettes ({recipes.length})</h2>
                {!isFormOpen && (
                    <Button size="sm" onClick={() => setIsFormOpen(true)} className="gap-1">
                        <Plus className="w-4 h-4" /> Nouvelle
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
                            required
                            placeholder="Ex: Kéfir Citron Classique"
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <Input label="Eau (L)" type="number" step="0.1" value={formData.waterL} onChange={e => setFormData({ ...formData, waterL: e.target.value })} required />
                            <Input label="Durée F1 (h)" type="number" value={formData.f1Hours} onChange={e => setFormData({ ...formData, f1Hours: e.target.value })} required />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <Input label="Sucre (g)" type="number" value={formData.sugarG} onChange={e => setFormData({ ...formData, sugarG: e.target.value })} required />
                            <Input label="Grains (g)" type="number" value={formData.grainsG} onChange={e => setFormData({ ...formData, grainsG: e.target.value })} required />
                        </div>
                        <Input
                            label="Ingrédients (défaut)"
                            value={formData.ingredients}
                            onChange={e => setFormData({ ...formData, ingredients: e.target.value })}
                            placeholder="Ingrédients par défaut..."
                        />
                        <Button type="submit" className="w-full gap-2">
                            <Save className="w-4 h-4" /> Enregistrer
                        </Button>
                    </form>
                </div>
            )}

            <div className="grid gap-3">
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
                    <p className="text-center text-gray-500 py-8 italic">Aucune recette enregistrée.</p>
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
