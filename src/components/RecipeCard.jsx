import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Edit2, Trash2 } from 'lucide-react';

export const RecipeCard = ({ recipe, onEdit, onDelete, onUse }) => {
    return (
        <Card className="hover:border-indigo-200 transition-colors">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-lg">{recipe.name}</CardTitle>
                <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500" onClick={(e) => { e.stopPropagation(); onEdit(recipe); }}>
                        <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={(e) => { e.stopPropagation(); onDelete(recipe); }}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="py-2 text-sm text-gray-600">
                <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>💧 {recipe.waterL}L</div>
                    <div>🧂 {recipe.sugarG}g</div>
                    <div>🦠 {recipe.grainsG}g</div>
                    <div>⏱️ {recipe.f1Hours}h</div>
                </div>
                {recipe.ingredients && (
                    <div className="text-xs italic text-gray-500 mt-1">
                        {recipe.ingredients}
                    </div>
                )}
                <div className="mt-3">
                    <Button variant="secondary" size="sm" className="w-full text-indigo-600 border-indigo-200 hover:bg-indigo-50" onClick={onUse}>
                        Utiliser cette recette
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
