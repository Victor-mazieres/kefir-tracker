import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Edit2, Trash2, Droplets } from 'lucide-react';

export const RecipeCard = ({ recipe, onEdit, onDelete, onUse }) => {
    return (
        <Card className="hover:border-primary-light/50 transition-colors border-secondary/20 bg-white/50 backdrop-blur-sm">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-lg text-primary">{recipe.name}</CardTitle>
                <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-text-muted hover:text-primary" onClick={(e) => { e.stopPropagation(); onEdit(recipe); }}>
                        <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-accent hover:text-accent-hover" onClick={(e) => { e.stopPropagation(); onDelete(recipe); }}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="py-2 text-sm text-text-main">
                <div className="grid grid-cols-2 gap-2 mb-2">
                    <div className="flex items-center gap-1"><Droplets className="w-3 h-3 text-primary-light" /> {recipe.waterL}L</div>
                    <div className="flex items-center gap-1">🧂 {recipe.sugarG}{recipe.sugarUnit || 'g'}</div>
                    <div className="flex items-center gap-1">🦠 {recipe.grainsG}g</div>
                    <div className="flex items-center gap-1">⏱️ {recipe.f1Hours}h</div>
                </div>
                {recipe.ingredients && (
                    <div className="text-xs italic text-text-muted mt-1">
                        {recipe.ingredients}
                    </div>
                )}
                <div className="mt-3">
                    <Button variant="secondary" size="sm" className="w-full text-primary border-secondary/50 hover:bg-secondary/20" onClick={onUse}>
                        Utiliser cette recette
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
