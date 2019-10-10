import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ObjectID } from 'typeorm';
import { Photo } from 'src/models/photo.model';

@Injectable()
export class PhotoService {
    constructor(@InjectRepository(Photo) private noteRepository: Repository<Photo>) {}

    async addPhotoToNote(id: ObjectID, photo: Photo) {
        const photoToSave = {
            noteId: id,
            photo: photo[0].filename,
        } as any;
        const res = await this.noteRepository.save(photoToSave);
        return res;
    }

    async getPhotoToNote(): Promise<Photo[]> {
        const res = await this.noteRepository.find();
        console.log(res);
        return res;
    }
}
