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
        <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden relative">
            <header className="bg-white border-b border-gray-100 p-4 sticky top-0 z-10">
                <h1 className="text-xl font-bold text-indigo-600">Kéfir Tracker</h1>
            </header>

            <main className="flex-1 overflow-y-auto pb-24 p-4">
                <Outlet />
            </main>

            <nav className="fixed bottom-0 md:relative md:bottom-auto w-full max-w-md bg-white border-t border-gray-200 pb-safe">
                <div className="flex justify-around items-center h-16">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            cn(
                                "flex flex-col items-center justify-center w-full h-full space-y-1",
                                isActive ? "text-indigo-600" : "text-gray-500 hover:text-gray-900"
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
                                "flex flex-col items-center justify-center w-full h-full space-y-1",
                                isActive ? "text-indigo-600" : "text-gray-500 hover:text-gray-900"
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
                                "flex flex-col items-center justify-center w-full h-full space-y-1",
                                isActive ? "text-indigo-600" : "text-gray-500 hover:text-gray-900"
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
                                "flex flex-col items-center justify-center w-full h-full space-y-1",
                                isActive ? "text-indigo-600" : "text-gray-500 hover:text-gray-900"
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
