import { Photo } from './../models/photo.model';
import { NoteDto } from './../DTO/note.dto';
import { Note } from '../models/note.model';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ObjectID } from 'typeorm';

@Injectable()
export class NoteService {

    constructor(
        @InjectRepository(Note) private noteRepository: Repository<Note>,
        @InjectRepository(Photo) private photoRepository: Repository<Photo>,
    ) { }

    public async getNotes(id: ObjectID): Promise<Note[]> {
        const note = await this.noteRepository.find({
            where: {
                userId: String(id),
            },
       });
        return note;
    }

    async getNote(id: ObjectID): Promise<Note | undefined> {
        return await this.noteRepository.findOne(id);
    }

    async addNote(note: NoteDto): Promise<Note> {
        const savedNote = await this.noteRepository.save(note);
        // save images
        const images = savedNote.photos;
        images.forEach(x => {
            x.noteId = savedNote.id;
        });
        images.forEach(a => {
            const dat = {
                noteId: String(a.noteId),
            };
            this.photoRepository.update(a._id, dat);
        });
        return savedNote;
    }

    async updateNote(id: ObjectID, note: Note) {
        return await this.noteRepository.update(id, note);
    }

    async deleteNoteId(id: string) {
        const res = await this.noteRepository.delete(id);
        if (res) {
            const photos = await this.photoRepository.find({
                noteId: id,
            });
            photos.forEach(a => {
                const name = a.photo;
                const fs = require('fs');
                const file = 'uploads/';
                // tslint:disable-next-line: only-arrow-functions
                fs.unlink(file + name, function(err) {
                    // tslint:disable-next-line: no-console
                    console.error(err, ' Eror unlinka');
                });
            });
            await this.photoRepository.remove(photos);
        }
        return res;
    }
}
