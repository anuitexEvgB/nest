export interface Photo {
    id?: string;
    noteId: number | string;
    photo: string;
}

export interface PhotoRemove {
    id?: string;
    photo: string;
    namePhoto: string;
}

export interface PhotoResponse {
    result: {
        id: string;
        noteId: string;
        photo: string
    };
}
