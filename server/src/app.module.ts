import { User } from './models/user.model';
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
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './users/auth/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './users/jwt.strategy';

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
    TypeOrmModule.forFeature([Note, Photo, User]),
    MulterModule.register({
      dest: 'uploads/',
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secret: 'aye228',
      // signOptions: {
      //   expiresIn: 3600,
      // },
    }),
  ],
  controllers: [AppController, NoteController, UsersController],
  providers: [AppService, NoteService, PhotoService, UsersService, AuthService, JwtStrategy],
})
export class AppModule {}
