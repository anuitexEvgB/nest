import { Geo } from './geo.model';

export interface Note {
    id?: number;
    title: string;
    text: string;
    photos: any;
    completed: boolean;
    latLng: Geo;
    userId: string;
}
