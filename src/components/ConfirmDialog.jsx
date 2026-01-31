import React from 'react';
import { Button } from './ui/Button';

export const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <Button variant="secondary" onClick={onClose}>
                        Annuler
                    </Button>
                    <Button variant="danger" onClick={() => {
                        onConfirm();
                        onClose();
                    }}>
                        Confirmer
                    </Button>
                </div>
            </div>
        </div>
    );
};
