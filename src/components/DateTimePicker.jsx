import React, { useState, useRef, useEffect } from 'react';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    setHours,
    setMinutes,
    getHours,
    getMinutes,
    startOfWeek,
    endOfWeek,
    subDays
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/Button';

export function DateTimePicker({ label, value, onChange, name }) {
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(new Date()); // For calendar navigation
    const containerRef = useRef(null);

    // value is "yyyy-MM-ddThh:mm" string
    const dateValue = value ? new Date(value) : new Date();

    useEffect(() => {
        if (isOpen && value) {
            setViewDate(new Date(value));
        }
    }, [isOpen, value]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDateSelect = (date) => {
        const newDate = setMinutes(setHours(date, getHours(dateValue)), getMinutes(dateValue));
        onChange({ target: { name, value: format(newDate, "yyyy-MM-dd'T'HH:mm") } });
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

    const setNow = () => {
        onChange({ target: { name, value: format(new Date(), "yyyy-MM-dd'T'HH:mm") } });
        setViewDate(new Date());
    };

    const setYesterday = () => {
        const yesterday = subDays(new Date(), 1);
        onChange({ target: { name, value: format(yesterday, "yyyy-MM-dd'T'HH:mm") } });
        setViewDate(yesterday);
    };

    const toggleOpen = () => setIsOpen(!isOpen);

    // Calendar generation
    const monthStart = startOfMonth(viewDate);
    const monthEnd = endOfMonth(monthStart);
    const calendarStart = startOfWeek(monthStart, { locale: fr });
    const calendarEnd = endOfWeek(monthEnd, { locale: fr });

    const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    const weekDays = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];

    return (
        <div className="space-y-1 w-full" ref={containerRef}>
            {label && <label className="block text-sm font-medium text-text-main">{label}</label>}

            <div className="relative">
                <button
                    type="button"
                    onClick={toggleOpen}
                    className={cn(
                        "flex items-center w-full h-12 rounded-xl border bg-white px-4 text-left transition-all duration-200 outline-none",
                        isOpen ? "border-primary ring-2 ring-primary/20" : "border-gray-200 hover:border-primary/50"
                    )}
                >
                    <CalendarIcon className="mr-3 h-5 w-5 text-primary" />
                    <span className="flex-1 text-gray-700 font-medium">
                        {format(dateValue, "d MMMM yyyy", { locale: fr })}
                        <span className="text-gray-400 mx-2">|</span>
                        <span className="text-gray-900">{format(dateValue, "HH:mm")}</span>
                    </span>
                </button>

                {isOpen && (
                    <div className="absolute z-50 mt-2 w-full max-w-[340px] p-4 rounded-2xl bg-white shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200 left-0 sm:left-auto">

                        {/* Quick Actions */}
                        <div className="flex gap-2 mb-4">
                            <button onClick={setNow} type="button" className="flex-1 py-1.5 text-xs font-semibold bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors">
                                Maintenant
                            </button>
                            <button onClick={setYesterday} type="button" className="flex-1 py-1.5 text-xs font-semibold bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                                Hier
                            </button>
                        </div>

                        {/* Calendar Header */}
                        <div className="flex items-center justify-between mb-4">
                            <button type="button" onClick={() => setViewDate(subMonths(viewDate, 1))} className="p-1 hover:bg-gray-100 rounded-full">
                                <ChevronLeft className="h-5 w-5 text-gray-500" />
                            </button>
                            <span className="font-bold text-gray-800 capitalize">
                                {format(viewDate, "MMMM yyyy", { locale: fr })}
                            </span>
                            <button type="button" onClick={() => setViewDate(addMonths(viewDate, 1))} className="p-1 hover:bg-gray-100 rounded-full">
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
                        <div className="grid grid-cols-7 gap-1 mb-6">
                            {calendarDays.map((day, i) => {
                                const isSelected = isSameDay(day, dateValue);
                                const isCurrentMonth = isSameMonth(day, viewDate);
                                return (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => handleDateSelect(day)}
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

                        {/* Time Picker */}
                        <div className="border-t pt-4">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> Heure
                                </label>
                                <span className="text-xl font-bold text-gray-900 bg-gray-50 px-3 py-1 rounded-lg">
                                    {format(dateValue, "HH:mm")}
                                </span>
                            </div>
                            <div className="flex gap-2 h-32">
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

                    </div>
                )}
            </div>
        </div>
    );
}
