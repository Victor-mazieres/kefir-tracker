import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Clock, CheckCircle } from 'lucide-react';
import { addHours, isPast, format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const BatchTimeline = ({ batch, onF1Complete }) => {
    const f1StartDate = new Date(batch.f1Start);
    const f1EndDate = addHours(f1StartDate, batch.f1Hours);
    const isF1Overdue = isPast(f1EndDate) && !batch.f1DoneAt;

    const now = new Date();
    const totalDurationMs = batch.f1Hours * 60 * 60 * 1000;
    const elapsedMs = now - f1StartDate;

    let progressPercentage = 0;
    if (batch.f1DoneAt) {
        progressPercentage = 100;
    } else {
        progressPercentage = Math.min(100, Math.max(0, (elapsedMs / totalDurationMs) * 100));
    }

    return (
        <Card className="border-0 shadow-lg shadow-indigo-100/50 overflow-hidden">
            <CardHeader className="pb-4">
                <CardTitle className="text-indigo-950 flex items-center gap-2 text-lg">
                    <Clock className="w-5 h-5 text-indigo-500" /> Timeline F1
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium text-gray-500 uppercase tracking-wide">
                        <span>Début</span>
                        <span>{batch.f1Hours}H</span>
                        <span>Fin</span>
                    </div>
                    <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner relative">
                        <div
                            className="h-full bg-gradient-to-r from-yellow-300 to-green-400 transition-all duration-1000 ease-out rounded-full"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600 font-medium">{format(f1StartDate, "HH:mm", { locale: fr })}</span>
                        <span className={`font-bold ${isF1Overdue ? 'text-red-500' : 'text-gray-600'}`}>
                            {format(f1EndDate, "HH:mm", { locale: fr })}
                        </span>
                    </div>
                </div>

                <div className="pt-2">
                    {batch.f1DoneAt ? (
                        <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 py-3 rounded-xl border border-green-100 shadow-sm animate-in fade-in zoom-in duration-300">
                            <CheckCircle className="w-5 h-5 fill-green-100" />
                            <span className="font-semibold text-sm">F1 terminée le {format(new Date(batch.f1DoneAt), "d MMM", { locale: fr })}</span>
                        </div>
                    ) : (
                        <Button
                            onClick={onF1Complete}
                            className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200"
                        >
                            <CheckCircle className="w-4 h-4" />
                            Marquer F1 terminée
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
