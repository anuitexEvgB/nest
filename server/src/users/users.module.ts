import { Googlefb } from './../models/customAuth.model';
import { JwtStrategy } from './jwt.strategy';
import { Module } from '@nestjs/common';
import { User } from '../models/user.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Googlefb]),
        PassportModule.register({
            defaultStrategy: 'jwt',
          }),
          JwtModule.register({
            secret: 'aye228',
          }),
    ],
    controllers: [UsersController],
    providers: [UsersService, AuthService, JwtStrategy],
})
export class UsersModule {}
