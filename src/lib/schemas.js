import { z } from 'zod';

export const batchSchema = z.object({
    waterL: z.number().min(0.1, "L'eau doit être > 0"),
    sugarG: z.number().min(0, "Le sucre ne peut pas être négatif"),
    sugarUnit: z.enum(['g', 'c.à.s', 'c.à.c']).default('g'),
    grainsG: z.number().min(0, "Les grains ne peuvent pas être négatifs"),
    f1Hours: z.number().min(1, "La F1 dure au moins 1h").max(168, "F1 trop longue (> 7 jours)"),
    temperature: z.number().optional(),
    isAmbientTemp: z.boolean().default(true),
    ingredients: z.string().optional(),
});

export const recipeSchema = batchSchema.extend({
    name: z.string().min(2, "Le nom doit faire au moins 2 caractères"),
});
