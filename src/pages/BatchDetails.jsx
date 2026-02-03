import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBatches, useRecipes } from '../hooks/useDb';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Toast } from '../components/ui/Toast';
import { ArrowLeft, Trash2 } from 'lucide-react';

// Sub-components
import { BatchTimeline } from '../components/batch/BatchTimeline';
import { BatchBottling } from '../components/batch/BatchBottling';
import { BatchRecipe } from '../components/batch/BatchRecipe';
import { BatchTasting } from '../components/batch/BatchTasting';
import { BatchGlobalRating } from '../components/batch/BatchGlobalRating';

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await get(id);
                if (data) {
                    setBatch(data);
                    setNotes(data.notes || '');
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

    // Handlers
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

    // Sub-component specific handlers
    const handleUpdateBottles = async (updatedBottles) => {
        setBatch(prev => ({ ...prev, bottles: updatedBottles }));
        await update(id, { bottles: updatedBottles });
    };

    const handleRatingChange = async (key, value) => {
        const updated = await update(id, { [key]: value });
        setBatch(updated);
    };

    const handleNotesSave = async () => {
        const updated = await update(id, { notes });
        setBatch(updated);
    };

    if (loading) return <div className="p-8 text-center">Chargement...</div>;
    if (!batch) return null;

    return (
        <div className="space-y-8 relative pb-8">
            {/* Header */}
            <div className="flex items-center justify-between px-1">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:bg-gray-100 rounded-full">
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                </Button>
                <h2 className="text-2xl font-bold text-gray-800 truncate flex-1 ml-2 tracking-tight">{batch.title}</h2>
                <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full" onClick={() => setShowDeleteConfirm(true)}>
                    <Trash2 className="w-5 h-5" />
                </Button>
            </div>

            {/* Components Flow */}
            <BatchTimeline batch={batch} onF1Complete={handleF1Complete} />

            <BatchBottling batch={batch} onStartBottling={() => navigate(`/batch/${id}/bottling`)} />

            <BatchRecipe batch={batch} onSaveRecipe={handleSaveRecipe} />

            {/* Tasting / Rating Section */}
            {batch.bottles && batch.bottles.length > 0 ? (
                <BatchTasting
                    bottles={batch.bottles}
                    f2Start={batch.f2Start}
                    onUpdateBottles={handleUpdateBottles}
                />
            ) : (
                <BatchGlobalRating
                    batch={batch}
                    notes={notes}
                    onNotesChange={setNotes}
                    onNotesSave={handleNotesSave}
                    onRatingChange={handleRatingChange}
                />
            )}

            {/* Dialogs */}
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
        </div>
    );
}
