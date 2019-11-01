// Vendors
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

// Component
import { JwtStrategy, UsersController } from './';

// Models
import { User } from '../models/user.model';

// Service
import { UsersService, AuthService } from '../shared';

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
