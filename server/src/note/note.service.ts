import { NoteDto } from './../DTO/note.dto';
import { Injectable } from '@nestjs/common';
import { Note } from 'src/models/note.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ObjectID } from 'typeorm';

@Injectable()
export class NoteService {

    constructor(@InjectRepository(Note) private noteRepository: Repository<Note>) {}

    async getNotes(): Promise<Note[]> {
        return await this.noteRepository.find();
    }

    async getNote(id: ObjectID): Promise<Note | undefined> {
        return await this.noteRepository.findOne(id);
    }

    async addNote(note: NoteDto): Promise<Note> {
        return await this.noteRepository.save(note);
    }

    async updateNote(id: ObjectID, note: Note) {
        return await this.noteRepository.update(id, note);
    }

    async deleteNoteId(id: ObjectID) {
        return await this.noteRepository.delete(id);
    }
}
