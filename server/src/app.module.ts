// Vendors
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';

// Component
import { AppController } from './app.controller';
import { NoteController } from './note/note.controller';
import { UsersModule } from './users';

// Service
import { NoteService, PhotoService } from './shared';
import { AppService } from './app.service';

// Models
import { Note, Photo } from './models';

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
    UsersModule,
  ],
  controllers: [AppController, NoteController],
  providers: [AppService, NoteService, PhotoService ],
})
export class AppModule {}
