import { PhotoService } from './photo/photo.service';
import { NoteDto } from './../DTO/note.dto';
import { ObjectID } from 'typeorm';
import { Controller, Get, Param, Post, Body, Put, Delete, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { NoteService } from './note.service';
import { Note } from 'src/models/note.model';
import { MulterOptions } from 'src/LoadConfg/multer-config';

@Controller('note')
export class NoteController {

    constructor(
        private noteService: NoteService,
        private photoService: PhotoService,
    ) { }

    @Get()
    async getNotes() {
        return await this.noteService.getNotes();
    }

    @Post()
    async create(@Body() note: NoteDto) {
        return await this.noteService.addNote(note);
    }

    @Get('getPhotos')
    async getPhotos() {
        return await this.photoService.getPhotoToNote();
    }

    @Put(':id')
    async update(@Param('id') id: ObjectID, @Body() note: Note) {
        return await this.noteService.updateNote(id, note);
    }

    @Delete(':id')
    async delete(@Param('id') id: ObjectID) {
        return await this.noteService.deleteNoteId(id);
    }

    @Post('upload/:id')
    @UseInterceptors(AnyFilesInterceptor(MulterOptions))
    async uploadFile(@UploadedFiles() photo, @Param('id') id: ObjectID) {
        return await this.photoService.addPhotoToNote(id, photo);
    }

    @Get('getPhotos/:id')
    async getPhoto(@Param('id') id: ObjectID) {
        return await this.photoService.getPhotoToNoteById(id);
    }

    @Delete('getPhotos/:id')
    async deletePhoto(@Param('id') id: ObjectID, @Body() namePhoto: any) {
        return await this.photoService.deletePhoto(id, namePhoto);
    }
}
