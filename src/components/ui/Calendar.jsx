import React from 'react';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    startOfWeek,
    endOfWeek
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Calendar({ viewDate, onViewChange, value, onChange }) {
    const monthStart = startOfMonth(viewDate);
    const monthEnd = endOfMonth(monthStart);
    const calendarStart = startOfWeek(monthStart, { locale: fr });
    const calendarEnd = endOfWeek(monthEnd, { locale: fr });

    const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    const weekDays = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];

    return (
        <div className="space-y-4">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
                <button
                    type="button"
                    onClick={() => onViewChange(subMonths(viewDate, 1))}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ChevronLeft className="h-5 w-5 text-gray-500" />
                </button>
                <span className="font-bold text-gray-800 capitalize">
                    {format(viewDate, "MMMM yyyy", { locale: fr })}
                </span>
                <button
                    type="button"
                    onClick={() => onViewChange(addMonths(viewDate, 1))}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                </button>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 mb-2 text-center">
                {weekDays.map(day => (
                    <div key={day} className="text-xs font-medium text-gray-400 py-1">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, i) => {
                    const isSelected = isSameDay(day, value);
                    const isCurrentMonth = isSameMonth(day, viewDate);
                    return (
                        <button
                            key={i}
                            type="button"
                            onClick={() => onChange(day)}
                            className={cn(
                                "h-9 w-9 text-sm rounded-full flex items-center justify-center transition-all",
                                !isCurrentMonth && "text-gray-300",
                                isSelected
                                    ? "bg-primary text-white font-bold shadow-md shadow-primary/30"
                                    : "text-gray-700 hover:bg-gray-100",
                                isSameDay(day, new Date()) && !isSelected && "border border-primary text-primary font-bold"
                            )}
                        >
                            {format(day, "d")}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
