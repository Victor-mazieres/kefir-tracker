import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Home, PlusCircle, Book, Settings } from 'lucide-react';
import { cn } from '../lib/utils';

export const Layout = () => {
    const location = useLocation();

    // Hide bottom nav on specific detailed sub-pages if necessary, 
    // but user requested bottom nav. Usually good to keep it unless it blocks keyboard.
    // For now we keep it everywhere.

    return (
        <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden relative font-sans">
            <header className="bg-surface border-b border-secondary/20 p-4 sticky top-0 z-10 shadow-sm">
                <h1 className="text-xl font-bold text-primary flex items-center gap-2">
                    <img src="/Grains&Bulles.svg" alt="Logo" className="w-8 h-8" />
                    Grains & Bulles
                </h1>
            </header>

            <main className="flex-1 overflow-y-auto pb-24 p-4 text-text-main">
                <Outlet />
            </main>

            <nav className="fixed bottom-0 md:relative md:bottom-auto w-full max-w-md bg-surface border-t border-secondary/20 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="flex justify-around items-center h-16">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            cn(
                                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200",
                                isActive ? "text-primary scale-105" : "text-text-muted hover:text-primary-light"
                            )
                        }
                    >
                        <Home className="w-6 h-6" />
                        <span className="text-xs font-medium">Accueil</span>
                    </NavLink>

                    <NavLink
                        to="/new-batch"
                        className={({ isActive }) =>
                            cn(
                                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200",
                                isActive ? "text-primary scale-105" : "text-text-muted hover:text-primary-light"
                            )
                        }
                    >
                        <PlusCircle className="w-6 h-6" />
                        <span className="text-xs font-medium">Lot</span>
                    </NavLink>

                    <NavLink
                        to="/recipes"
                        className={({ isActive }) =>
                            cn(
                                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200",
                                isActive ? "text-primary scale-105" : "text-text-muted hover:text-primary-light"
                            )
                        }
                    >
                        <Book className="w-6 h-6" />
                        <span className="text-xs font-medium">Recettes</span>
                    </NavLink>

                    <NavLink
                        to="/settings"
                        className={({ isActive }) =>
                            cn(
                                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200",
                                isActive ? "text-primary scale-105" : "text-text-muted hover:text-primary-light"
                            )
                        }
                    >
                        <Settings className="w-6 h-6" />
                        <span className="text-xs font-medium">Réglages</span>
                    </NavLink>
                </div>
            </nav>
        </div>
    );
};
