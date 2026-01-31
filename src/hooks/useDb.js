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

    const add = async (data) => {
        const newBatch = await db.addBatch(data);
        await fetchBatches();
        return newBatch;
    };

    const update = async (id, patch) => {
        const updated = await db.updateBatch(id, patch);
        await fetchBatches();
        return updated;
    };

    const remove = async (id) => {
        await db.deleteBatch(id);
        await fetchBatches();
    };

    const get = async (id) => {
        // This is for fetching a single batch without loading all
        return await db.getBatch(id);
    }

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

    const add = async (data) => {
        const newRecipe = await db.addRecipe(data);
        await fetchRecipes();
        return newRecipe;
    };

    const update = async (id, patch) => {
        const updated = await db.updateRecipe(id, patch);
        await fetchRecipes();
        return updated;
    };

    const remove = async (id) => {
        await db.deleteRecipe(id);
        await fetchRecipes();
    };

    return { recipes, loading, error, add, update, remove, refresh: fetchRecipes };
};
