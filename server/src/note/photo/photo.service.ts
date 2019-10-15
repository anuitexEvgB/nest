import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ObjectID } from 'typeorm';
import { Photo } from 'src/models/photo.model';
import { fileURLToPath } from 'url';

@Injectable()
export class PhotoService {
    constructor(@InjectRepository(Photo) private noteRepository: Repository<Photo>) {}

    async addPhotoToNote(id: ObjectID, photo: Photo) {
        console.log(photo)
        const photoToSave = {
            noteId: id,
            photo: photo[0].filename,
        } as any;
        const res = await this.noteRepository.save(photoToSave);
        return res;
    }

    async getPhotoToNote(): Promise<Photo[]> {
        const res = await this.noteRepository.find();
        return res;
    }

    async getPhotoToNoteById(id: ObjectID): Promise<Photo | undefined> {
        return await this.noteRepository.findOne(id);
    }

    async deletePhoto(id: string, namePhoto: any) {
        const name = namePhoto.namePhoto;
        const fs = require('fs');
        const file = 'uploads/';
        fs.unlink(file + name, function(err) {
            console.log(err, ' Eror unlinka');
        });
        return await this.noteRepository.delete(id);
    }
}
