import { useState, useEffect, useCallback } from 'react';
import * as db from '../db/indexedDb';

export const useBatches = () => {
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBatches = useCallback(async () => {
        try {
            setLoading(true);
            const data = await db.listBatches();
            setBatches(data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBatches();
    }, [fetchBatches]);

    const add = useCallback(async (data) => {
        const newBatch = await db.addBatch(data);
        await fetchBatches();
        return newBatch;
    }, [fetchBatches]);

    const update = useCallback(async (id, patch) => {
        const updated = await db.updateBatch(id, patch);
        await fetchBatches();
        return updated;
    }, [fetchBatches]);

    const remove = useCallback(async (id) => {
        await db.deleteBatch(id);
        await fetchBatches();
    }, [fetchBatches]);

    const get = useCallback(async (id) => {
        // This is for fetching a single batch without loading all
        return await db.getBatch(id);
    }, []);

    return { batches, loading, error, add, update, remove, get, refresh: fetchBatches };
};

export const useRecipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRecipes = useCallback(async () => {
        try {
            setLoading(true);
            const data = await db.listRecipes();
            setRecipes(data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRecipes();
    }, [fetchRecipes]);

    const add = useCallback(async (data) => {
        const newRecipe = await db.addRecipe(data);
        await fetchRecipes();
        return newRecipe;
    }, [fetchRecipes]);

    const update = useCallback(async (id, patch) => {
        const updated = await db.updateRecipe(id, patch);
        await fetchRecipes();
        return updated;
    }, [fetchRecipes]);

    const remove = useCallback(async (id) => {
        await db.deleteRecipe(id);
        await fetchRecipes();
    }, [fetchRecipes]);

    return { recipes, loading, error, add, update, remove, refresh: fetchRecipes };
};
