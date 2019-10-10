import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NoteService } from './note/note.service';
import { NoteController } from './note/note.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './models/note.model';
import { MulterModule } from '@nestjs/platform-express';
import { PhotoService } from './note/photo/photo.service';
import { Photo } from './models/photo.model';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb+srv://local:12345@cluster0-vrq7n.mongodb.net/notes',
      entities: [__dirname + '/**/*.model{.ts,.js}'],
      synchronize: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    TypeOrmModule.forFeature([Note, Photo]),
    MulterModule.register({
      dest: 'uploads/',
    }),
  ],
  controllers: [AppController, NoteController],
  providers: [AppService, NoteService, PhotoService],
})
export class AppModule {}
