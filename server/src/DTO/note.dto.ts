import { ObjectID } from 'typeorm';

export class NoteDto {
    readonly id: ObjectID;
    readonly title: string;
    readonly text: string;
    readonly photos: any;
    readonly completed: boolean;
    readonly latLng: {
        lat: number,
        lng: number,
    };
    readonly userId: string;
    readonly LiteId: number;
}
