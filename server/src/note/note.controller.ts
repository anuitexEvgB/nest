import { NoteDto } from './../DTO/note.dto';

import { ObjectID } from 'typeorm';
import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { NoteService } from './note.service';
import { Note } from 'src/models/note.model';

@Controller('note')
export class NoteController {

    constructor(private noteService: NoteService) {}

    @Get()
    async getNotes() {
        return await this.noteService.getNotes();
    }

    @Get()
    async getUsersFotList() {
        return await this.noteService.getNotes();
    }
    @Get(':id')
    async getNote(@Param('id') id: ObjectID) {
        return await this.noteService.getNote(id);
    }
    @Post()
    async create(@Body() note: NoteDto) {
        return await this.noteService.addNote(note);
    }
    @Put(':id')
    async update(@Param('id') id: ObjectID, @Body() note: Note) {
        return await this.noteService.updateNote(id, note);
    }
    @Delete(':id')
    async delete(@Param('id') id: ObjectID) {
        return await this.noteService.deleteNoteId(id);
    }
}
