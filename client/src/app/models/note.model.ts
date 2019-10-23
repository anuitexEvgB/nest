export interface Note {
    id?: number;
    title: string;
    text: string;
    photos: any;
    completed: boolean;
    latLng: {
        lat: number,
        lng: number
    };
}
