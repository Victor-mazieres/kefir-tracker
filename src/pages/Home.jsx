import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBatches } from '../hooks/useDb';
import { BatchCard } from '../components/BatchCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Plus, Search, ArrowUpDown, Loader2 } from 'lucide-react';

export default function Home() {
    const { batches, loading } = useBatches();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('date'); // 'date' | 'rating'

    const filteredBatches = useMemo(() => {
        let result = [...batches];

        // Filter
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            result = result.filter(b =>
                b.title?.toLowerCase().includes(lower) ||
                b.ingredients?.toLowerCase().includes(lower)
            );
        }

        // Sort
        result.sort((a, b) => {
            if (sortBy === 'rating') {
                const ratingA = a.rating || 0;
                const ratingB = b.rating || 0;
                if (ratingA !== ratingB) return ratingB - ratingA; // Descending rating
            }
            // Default date sort (Recent first)
            return new Date(b.f1Start) - new Date(a.f1Start);
        });

        return result;
    }, [batches, searchTerm, sortBy]);

    return (
        <div className="space-y-6 pb-6">
            <div className="flex items-center gap-3 pt-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Rechercher un lot, un ingrédient..."
                        className="pl-9 h-10 bg-white border-gray-200 focus:border-indigo-300 focus:ring-indigo-100 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => setSortBy(prev => prev === 'date' ? 'rating' : 'date')}
                    className={`transition-all duration-200 border ${sortBy === 'rating' ? "bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm" : "bg-white border-gray-200 text-gray-500"}`}
                    title={sortBy === 'rating' ? "Trier par date" : "Trier par note"}
                >
                    <ArrowUpDown className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex items-center justify-between px-1">
                <h2 className="text-xl font-bold text-gray-800 tracking-tight">
                    Historique <span className="text-gray-400 text-lg font-normal ml-1">({filteredBatches.length})</span>
                </h2>
                <Button
                    onClick={() => navigate('/new-batch')}
                    size="sm"
                    className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 active:scale-95 transition-all rounded-full px-4"
                >
                    <Plus className="w-4 h-4" />
                    Nouveau
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : filteredBatches.length === 0 ? (
                <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                    <p>Aucun lot trouvé.</p>
                    <Button variant="link" onClick={() => navigate('/new-batch')}>
                        Commencer un nouveau lot
                    </Button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredBatches.map(batch => (
                        <BatchCard key={batch.id} batch={batch} />
                    ))}
                </div>
            )}
        </div>
    );
}
