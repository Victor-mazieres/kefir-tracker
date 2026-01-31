import React, { useState, useRef, useEffect } from 'react';
import {
    format,
    setHours,
    setMinutes,
    getHours,
    getMinutes,
    subDays
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { cn } from '../lib/utils';
import { Calendar } from './ui/Calendar';

export function DateTimePicker({ label, value, onChange, name }) {
    const [activePopover, setActivePopover] = useState(null); // 'date' | 'time' | null
    const [viewDate, setViewDate] = useState(new Date()); // For calendar navigation
    const containerRef = useRef(null);

    // value is "yyyy-MM-ddThh:mm" string
    const dateValue = value ? new Date(value) : new Date();

    useEffect(() => {
        if (activePopover === 'date' && value) {
            setViewDate(new Date(value));
        }
    }, [activePopover, value]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setActivePopover(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDateSelect = (date) => {
        const newDate = setMinutes(setHours(date, getHours(dateValue)), getMinutes(dateValue));
        onChange({ target: { name, value: format(newDate, "yyyy-MM-dd'T'HH:mm") } });
        setActivePopover(null); // Close after date selection
    };

    const handleTimeChange = (type, val) => {
        let newDate;
        if (type === 'hours') {
            newDate = setHours(dateValue, parseInt(val));
        } else {
            newDate = setMinutes(dateValue, parseInt(val));
        }
        onChange({ target: { name, value: format(newDate, "yyyy-MM-dd'T'HH:mm") } });
    };

    const setToday = () => {
        const newDate = setMinutes(setHours(new Date(), getHours(dateValue)), getMinutes(dateValue));
        onChange({ target: { name, value: format(newDate, "yyyy-MM-dd'T'HH:mm") } });
        setViewDate(new Date());
        setActivePopover(null);
    };

    const setYesterday = () => {
        const yesterday = subDays(new Date(), 1);
        const newDate = setMinutes(setHours(yesterday, getHours(dateValue)), getMinutes(dateValue));
        onChange({ target: { name, value: format(newDate, "yyyy-MM-dd'T'HH:mm") } });
        setViewDate(yesterday);
        setActivePopover(null);
    };

    const setNow = () => {
        onChange({ target: { name, value: format(new Date(), "yyyy-MM-dd'T'HH:mm") } });
    };

    const toggleDate = () => setActivePopover(activePopover === 'date' ? null : 'date');
    const toggleTime = () => setActivePopover(activePopover === 'time' ? null : 'time');

    return (
        <div className="space-y-1 w-full" ref={containerRef}>
            {label && <label className="block text-sm font-medium text-text-main">{label}</label>}

            <div className="flex gap-2 relative">
                {/* Date Picker Button */}
                <div className="relative flex-1">
                    <button
                        type="button"
                        onClick={toggleDate}
                        className={cn(
                            "flex items-center w-full h-12 rounded-xl border bg-white px-4 text-left transition-all duration-200 outline-none",
                            activePopover === 'date' ? "border-primary ring-2 ring-primary/20" : "border-gray-200 hover:border-primary/50"
                        )}
                    >
                        <CalendarIcon className="mr-3 h-5 w-5 text-gray-500" />
                        <span className="text-gray-900 font-medium truncate">
                            {format(dateValue, "d MMMM yyyy", { locale: fr })}
                        </span>
                    </button>

                    {activePopover === 'date' && (
                        <div className="absolute z-50 mt-2 w-[320px] p-4 rounded-2xl bg-white shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200 left-0">
                            <div className="flex gap-2 mb-4">
                                <button onClick={setToday} type="button" className="flex-1 py-1.5 text-xs font-semibold bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors">
                                    Aujourd'hui
                                </button>
                                <button onClick={setYesterday} type="button" className="flex-1 py-1.5 text-xs font-semibold bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                                    Hier
                                </button>
                            </div>

                            <Calendar
                                viewDate={viewDate}
                                onViewChange={setViewDate}
                                value={dateValue}
                                onChange={handleDateSelect}
                            />
                        </div>
                    )}
                </div>

                {/* Time Picker Button */}
                <div className="relative w-32">
                    <button
                        type="button"
                        onClick={toggleTime}
                        className={cn(
                            "flex items-center w-full h-12 rounded-xl border bg-white px-4 text-left transition-all duration-200 outline-none",
                            activePopover === 'time' ? "border-primary ring-2 ring-primary/20" : "border-gray-200 hover:border-primary/50"
                        )}
                    >
                        <Clock className="mr-3 h-5 w-5 text-gray-500" />
                        <span className="text-gray-900 font-medium">
                            {format(dateValue, "HH:mm")}
                        </span>
                    </button>

                    {activePopover === 'time' && (
                        <div className="absolute z-50 mt-2 w-[220px] p-4 rounded-2xl bg-white shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200 right-0 sm:left-0">
                            <button onClick={setNow} type="button" className="w-full mb-3 py-1.5 text-xs font-semibold bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors">
                                Maintenant
                            </button>

                            <div className="flex gap-2 h-48">
                                <div className="flex-1 overflow-y-auto no-scrollbar rounded-lg bg-gray-50 border border-gray-100">
                                    {Array.from({ length: 24 }).map((_, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => handleTimeChange('hours', i)}
                                            className={cn(
                                                "w-full text-center py-2 text-sm font-medium transition-colors hover:bg-gray-200",
                                                getHours(dateValue) === i ? "bg-primary text-white hover:bg-primary" : "text-gray-600"
                                            )}
                                        >
                                            {i.toString().padStart(2, '0')}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex-1 overflow-y-auto no-scrollbar rounded-lg bg-gray-50 border border-gray-100">
                                    {Array.from({ length: 12 }).map((_, i) => {
                                        const min = i * 5;
                                        return (
                                            <button
                                                key={min}
                                                type="button"
                                                onClick={() => handleTimeChange('minutes', min)}
                                                className={cn(
                                                    "w-full text-center py-2 text-sm font-medium transition-colors hover:bg-gray-200",
                                                    getMinutes(dateValue) === min ? "bg-primary text-white hover:bg-primary" : "text-gray-600"
                                                )}
                                            >
                                                {min.toString().padStart(2, '0')}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
