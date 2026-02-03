import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as db from '../db/indexedDb';

export const useBatches = () => {
    const queryClient = useQueryClient();

    const { data: batches = [], isLoading: loading, error } = useQuery({
        queryKey: ['batches'],
        queryFn: db.listBatches,
    });

    const addMutation = useMutation({
        mutationFn: db.addBatch,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['batches'] })
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, patch }) => db.updateBatch(id, patch),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['batches'] })
    });

    const deleteMutation = useMutation({
        mutationFn: db.deleteBatch,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['batches'] });
            queryClient.invalidateQueries({ queryKey: ['batch'] }); // If we had individual batch queries
        }
    });

    return {
        batches,
        loading,
        error,
        add: addMutation.mutateAsync,
        update: (id, patch) => updateMutation.mutateAsync({ id, patch }),
        remove: deleteMutation.mutateAsync,
        get: db.getBatch,
        refresh: () => queryClient.invalidateQueries({ queryKey: ['batches'] })
    };
};

export const useRecipes = () => {
    const queryClient = useQueryClient();

    const { data: recipes = [], isLoading: loading, error } = useQuery({
        queryKey: ['recipes'],
        queryFn: db.listRecipes,
    });

    const addMutation = useMutation({
        mutationFn: db.addRecipe,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['recipes'] })
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, patch }) => db.updateRecipe(id, patch),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['recipes'] })
    });

    const deleteMutation = useMutation({
        mutationFn: db.deleteRecipe,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['recipes'] })
    });

    return {
        recipes,
        loading,
        error,
        add: addMutation.mutateAsync,
        update: (id, patch) => updateMutation.mutateAsync({ id, patch }),
        remove: deleteMutation.mutateAsync,
        refresh: () => queryClient.invalidateQueries({ queryKey: ['recipes'] })
    };
};
