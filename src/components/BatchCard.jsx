import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/Card';
import { StarRating } from './StarRating';
import { Calendar, Droplets } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const BatchCard = ({ batch }) => {
    const navigate = useNavigate();

    return (
        <Card
            className="cursor-pointer hover:shadow-md transition-shadow active:scale-95 duration-200"
            onClick={() => navigate(`/batch/${batch.id}`)}
        >
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-lg text-primary">{batch.title}</CardTitle>
                    {batch.rating > 0 && <StarRating rating={batch.rating} readOnly />}
                </div>
                <div className="flex items-center text-sm text-text-muted mt-1">
                    <Calendar className="w-3 h-3 mr-1" />
                    {format(new Date(batch.f1Start), "d MMM HH:mm", { locale: fr })}
                </div>
            </CardHeader>
            <CardContent className="py-2 text-sm text-text-main">
                <div className="flex gap-4">
                    <div className="flex items-center">
                        <Droplets className="w-4 h-4 mr-1 text-primary-light" />
                        {batch.waterL} L
                    </div>
                    <div className="flex items-center">
                        <span className="font-bold mr-1 text-primary-dark">S:</span> {batch.sugarG}{batch.sugarUnit || 'g'}
                    </div>
                    <div className="flex items-center">
                        <span className="font-bold mr-1 text-primary-dark">G:</span> {batch.grainsG}g
                    </div>
                </div>
                {batch.ingredients && (
                    <div className="mt-2 text-xs truncate text-text-muted italic">
                        {batch.ingredients}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
