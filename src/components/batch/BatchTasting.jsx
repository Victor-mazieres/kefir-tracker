import React, { useState } from 'react';
import { differenceInDays } from 'date-fns';
import { BottleItem } from './BottleItem';

export const BatchTasting = ({ bottles, f2Start, onUpdateBottles }) => {
    const [expandedBottleId, setExpandedBottleId] = useState(null);

    const handleBottleUpdate = (bottleId, field, value) => {
        const updatedBottles = bottles.map(b =>
            b.id === bottleId ? { ...b, [field]: value } : b
        );
        onUpdateBottles(updatedBottles);
    };

    const f2Duration = f2Start ? differenceInDays(new Date(), new Date(f2Start)) : 0;

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-800 px-1">Dégustation par Bouteille ({bottles.length})</h3>
            {bottles.map((bottle) => (
                <BottleItem
                    key={bottle.id}
                    bottle={bottle}
                    f2Duration={f2Duration}
                    isExpanded={expandedBottleId === bottle.id}
                    onToggleExpand={() => setExpandedBottleId(prev => prev === bottle.id ? null : bottle.id)}
                    onUpdate={handleBottleUpdate}
                />
            ))}
        </div>
    );
};
