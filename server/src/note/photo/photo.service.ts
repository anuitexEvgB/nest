import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ObjectID } from 'typeorm';

import { Photo } from '../../models/photo.model';

@Injectable()
export class PhotoService {
    constructor(
        @InjectRepository(Photo) private photoRepository: Repository<Photo>,
        ) {}

    async addPhotoToNote(id: ObjectID, photo: Photo) {
        const photoToSave = {
            noteId: id,
            photo: photo[0].filename,
        } as any;
        const res = await this.photoRepository.save(photoToSave);
        return res;
    }

    async getPhotoToNote(): Promise<Photo[]> {
        const res = await this.photoRepository.find();
        return res;
    }

    async getPhotoToNoteById(id: ObjectID): Promise<Photo | undefined> {
        return await this.photoRepository.findOne(id);
    }

    async deletePhoto(id: string, namePhoto) {
        const name = namePhoto.namePhoto;
        const fs = require('fs');
        const file = 'uploads/';
        // tslint:disable-next-line: only-arrow-functions
        fs.unlink(file + name, function(err) {
            // tslint:disable-next-line: no-console
            console.error(err, ' Eror unlinka');
        });
        return await this.photoRepository.delete(id);
    }
}
