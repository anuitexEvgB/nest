import { ObjectID } from 'typeorm';
import { Controller, Get, Param, Post, Body, Put, Delete, UseInterceptors, UploadedFiles, Res, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';

import { PhotoService, NoteService } from '../shared';
import { NoteDto } from '../dto/note.dto';
import { Note } from '../models/note.model';
import { MulterOptions } from '../middleware/multer-config';

@Controller('note')
export class NoteController {

    constructor(
        private noteService: NoteService,
        private photoService: PhotoService,
    ) { }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    async getNotes(@Req() req: any) {
        const user = req.user;
        return await this.noteService.getNotes(user.id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async create(@Body() note: NoteDto) {
        return await this.noteService.addNote(note);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('getPhotos')
    async getPhotos() {
        return await this.photoService.getPhotoToNote();
    }

    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    async update(@Param('id') id: ObjectID, @Body() note: Note) {
        return await this.noteService.updateNote(id, note);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.noteService.deleteNoteId(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('upload/:id')
    @UseInterceptors(AnyFilesInterceptor(MulterOptions))
    async uploadFile(@UploadedFiles() photo, @Param('id') id: ObjectID, @Res() res) {
        console.log(res, 'FOOOOOUR');
        console.log(typeof(res));
        const result = await this.photoService.addPhotoToNote(id, photo);
        res.status(HttpStatus.OK).json({ result });

    }

    @UseGuards(AuthGuard('jwt'))
    @Get('getPhotos/:id')
    async getPhoto(@Param('id') id: ObjectID) {
        return await this.photoService.getPhotoToNoteById(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('deletePhotos/:photoId')
    async deletePhoto(@Param('photoId') id: string, @Body() namePhoto: any) {
        console.log(namePhoto, 'THRRREEEEEE');
        console.log(typeof(namePhoto));
        return await this.photoService.deletePhoto(id, namePhoto);
    }
}
