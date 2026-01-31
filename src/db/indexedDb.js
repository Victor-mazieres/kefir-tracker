import { openDB } from 'idb';
import { v4 as uuidv4 } from 'uuid';

const DB_NAME = 'kefir_tracker';
const DB_VERSION = 1;

export const initDB = async () => {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('batches')) {
                const batchStore = db.createObjectStore('batches', { keyPath: 'id' });
                batchStore.createIndex('createdAt', 'createdAt');
            }
            if (!db.objectStoreNames.contains('recipes')) {
                db.createObjectStore('recipes', { keyPath: 'id' });
            }
        },
    });
};

export const dbRequest = async (storeName, mode, callback) => {
    const db = await initDB();
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    const result = await callback(store);
    await tx.done;
    return result;
};

// Batches API
export const listBatches = async () => {
    return dbRequest('batches', 'readonly', (store) => store.getAll());
};

export const getBatch = async (id) => {
    return dbRequest('batches', 'readonly', (store) => store.get(id));
};

export const addBatch = async (data) => {
    const batch = {
        ...data,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    await dbRequest('batches', 'readwrite', (store) => store.add(batch));
    return batch;
};

export const updateBatch = async (id, patch) => {
    const db = await initDB();
    const tx = db.transaction('batches', 'readwrite');
    const store = tx.objectStore('batches');
    const batch = await store.get(id);
    if (!batch) throw new Error('Batch not found');

    const updatedBatch = { ...batch, ...patch, updatedAt: new Date().toISOString() };
    await store.put(updatedBatch);
    await tx.done;
    return updatedBatch;
};

export const deleteBatch = async (id) => {
    return dbRequest('batches', 'readwrite', (store) => store.delete(id));
};

// Recipes API
export const listRecipes = async () => {
    return dbRequest('recipes', 'readonly', (store) => store.getAll());
};

export const addRecipe = async (data) => {
    const recipe = {
        ...data,
        id: uuidv4(),
    };
    await dbRequest('recipes', 'readwrite', (store) => store.add(recipe));
    return recipe;
};

export const updateRecipe = async (id, patch) => {
    const db = await initDB();
    const tx = db.transaction('recipes', 'readwrite');
    const store = tx.objectStore('recipes');
    const recipe = await store.get(id);
    if (!recipe) throw new Error('Recipe not found');

    const updatedRecipe = { ...recipe, ...patch };
    await store.put(updatedRecipe);
    await tx.done;
    return updatedRecipe;
};

export const deleteRecipe = async (id) => {
    return dbRequest('recipes', 'readwrite', (store) => store.delete(id));
};

export const clearAllData = async () => {
    const db = await initDB();
    const tx = db.transaction(['batches', 'recipes'], 'readwrite');
    await tx.objectStore('batches').clear();
    await tx.objectStore('recipes').clear();
    await tx.done;
};

export const importData = async (data) => {
    const db = await initDB();
    const tx = db.transaction(['batches', 'recipes'], 'readwrite');

    if (data.batches) {
        const batchStore = tx.objectStore('batches');
        await batchStore.clear();
        for (const batch of data.batches) {
            await batchStore.put(batch);
        }
    }

    if (data.recipes) {
        const recipeStore = tx.objectStore('recipes');
        await recipeStore.clear();
        for (const recipe of data.recipes) {
            await recipeStore.put(recipe);
        }
    }

    await tx.done;
};

export const exportData = async () => {
    const batches = await listBatches();
    const recipes = await listRecipes();
    return { batches, recipes };
};
