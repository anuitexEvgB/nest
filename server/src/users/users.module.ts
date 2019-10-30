import { JwtStrategy } from './jwt.strategy';
import { User } from '../models/user.model';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth/auth.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
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
