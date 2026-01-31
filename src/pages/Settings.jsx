import React, { useState } from 'react';
import { exportData, importData, clearAllData } from '../db/indexedDb';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Download, Upload, Trash, RefreshCw, Check } from 'lucide-react';

export default function Settings() {
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [importStatus, setImportStatus] = useState(null);

    const handleExport = async () => {
        try {
            const data = await exportData();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `kefir-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (e) {
            console.error(e);
            alert("Erreur lors de l'export");
        }
    };

    const handleImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const data = JSON.parse(event.target.result);
                await importData(data);
                setImportStatus('success');
                setTimeout(() => setImportStatus(null), 3000);
                // Force reload to refresh data across app
                window.location.reload();
            } catch (error) {
                console.error(error);
                setImportStatus('error');
                alert("Erreur: Fichier invalide");
            }
        };
        reader.readAsText(file);
    };

    const handleClear = async () => {
        await clearAllData();
        window.location.reload();
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Réglages</h2>

            <Card>
                <CardHeader>
                    <CardTitle className="text-gray-800 text-base">Données</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Sauvegarde</h4>
                        <p className="text-xs text-gray-500 mb-3">Téléchargez une copie de toutes vos données (lots et recettes).</p>
                        <Button variant="secondary" className="w-full justify-start gap-2" onClick={handleExport}>
                            <Download className="w-4 h-4" /> Exporter JSON
                        </Button>
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Restauration</h4>
                        <p className="text-xs text-gray-500 mb-3">Restaurer les données depuis un fichier JSON (écrase les données actuelles).</p>
                        <div className="relative">
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleImport}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <Button variant="secondary" className="w-full justify-start gap-2">
                                <Upload className="w-4 h-4" />
                                {importStatus === 'success' ? 'Import réussi !' : 'Importer JSON'}
                                {importStatus === 'success' && <Check className="w-4 h-4 text-green-500 ml-auto" />}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-red-100">
                <CardHeader>
                    <CardTitle className="text-red-700 text-base">Zone de danger</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-gray-500 mb-3">Supprimer définitivement tous les lots et recettes.</p>
                    <Button variant="danger" className="w-full gap-2" onClick={() => setShowClearConfirm(true)}>
                        <Trash className="w-4 h-4" /> Tout effacer
                    </Button>
                </CardContent>
            </Card>

            <div className="text-center text-xs text-gray-400 pt-8">
                Kefir Tracker v1.0.0
            </div>

            <ConfirmDialog
                isOpen={showClearConfirm}
                onClose={() => setShowClearConfirm(false)}
                onConfirm={handleClear}
                title="Tout effacer ?"
                message="Voulez-vous vraiment supprimer TOUTES les données ? Cette action est irréversible."
            />
        </div>
    );
}
