/**
 * Centralized color logic for ingredients.
 * Maps ingredient names to a color palette including Tailwind classes and Hex values (for SVGs).
 */

const PALETTE = [
    {
        id: 'pink',
        matches: ['fraise', 'framboise', 'hibiscus', 'grenade', 'rose'],
        bgClass: 'bg-pink-400',
        bgLightClass: 'bg-pink-100',
        borderClass: 'border-pink-200',
        textClass: 'text-pink-700',
        hex: '#F472B6' // pink-400
    },
    {
        id: 'yellow',
        matches: ['citron', 'gingembre', 'ananas', 'banane'],
        bgClass: 'bg-yellow-400',
        bgLightClass: 'bg-yellow-100',
        borderClass: 'border-yellow-200',
        textClass: 'text-yellow-800',
        hex: '#FACC15' // yellow-400
    },
    {
        id: 'green',
        matches: ['menthe', 'kiwi', 'lime', 'vert', 'basilic', 'verveine'],
        bgClass: 'bg-green-400',
        bgLightClass: 'bg-green-100',
        borderClass: 'border-green-200',
        textClass: 'text-green-800',
        hex: '#4ADE80' // green-400
    },
    {
        id: 'purple',
        matches: ['mure', 'myrtille', 'cassis', 'raisin', 'lavande', 'violette'],
        bgClass: 'bg-purple-400',
        bgLightClass: 'bg-purple-100',
        borderClass: 'border-purple-200',
        textClass: 'text-purple-800',
        hex: '#C084FC' // purple-400
    },
    {
        id: 'orange',
        matches: ['orange', 'mangue', 'abricot', 'peche', 'pêche', 'clémentine', 'mandarine'],
        bgClass: 'bg-orange-400',
        bgLightClass: 'bg-orange-100',
        borderClass: 'border-orange-200',
        textClass: 'text-orange-800',
        hex: '#FB923C' // orange-400
    },
    {
        id: 'red',
        matches: ['pomme', 'cerise', 'rouge'],
        bgClass: 'bg-red-400',
        bgLightClass: 'bg-red-100',
        borderClass: 'border-red-200',
        textClass: 'text-red-800',
        hex: '#F87171' // red-400
    },
    {
        id: 'amber',
        matches: ['figue', 'datte', 'miel', 'sucre'],
        bgClass: 'bg-amber-400',
        bgLightClass: 'bg-amber-100',
        borderClass: 'border-amber-200',
        textClass: 'text-amber-800',
        hex: '#FBBF24' // amber-400
    }
];

const DEFAULT_COLOR = {
    id: 'default',
    bgClass: 'bg-indigo-400',
    bgLightClass: 'bg-indigo-100',
    borderClass: 'border-indigo-200',
    textClass: 'text-indigo-800',
    hex: '#818CF8' // indigo-400
};

/**
 * Returns color info based on ingredient string.
 * @param {string|string[]} ingredients - Comma separated string or array of ingredients
 * @returns {typeof DEFAULT_COLOR}
 */
export const getIngredientColorInfo = (ingredients) => {
    if (!ingredients) return DEFAULT_COLOR;

    const normalizedText = Array.isArray(ingredients)
        ? ingredients.join(' ').toLowerCase()
        : ingredients.toLowerCase();

    for (const color of PALETTE) {
        if (color.matches.some(match => normalizedText.includes(match))) {
            return color;
        }
    }

    return DEFAULT_COLOR;
};
