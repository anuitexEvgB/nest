// Vendors
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';

// Dtos
import { CustomLoginDto } from '../dto/custom-auth.dto';

// Models
import { User } from '../models/user.model';

// Services
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    private async validate(userData: User): Promise<User> {
        return await this.usersService.findByEmail(userData.email);
    }

    public async getUserById(id: string): Promise<User> {
        return await this.usersService.findById(id);
    }

    public async login(user: User): Promise<User | { status: number }> {
        return this.validate(user).then(userData => {
            user.password = crypto.createHmac('sha256', user.password).digest('hex');
            if (!userData) {
                return { status: 404 };
            }
            if (userData.password !== user.password) {
                return { status: 404 };
            }
            const payload = `${userData.id}`;
            const accessToken = this.jwtService.sign(payload);

            return {
                expires_in: 3600,
                access_token: accessToken,
                user_id: userData.id,
                status: 200,
            };
        });
    }

    public async register(user: User): Promise<User> {
        user.password = crypto.createHmac('sha256', user.password).digest('hex');
        return this.usersService.create(user);
    }

    public async socialLogin(user: CustomLoginDto): Promise<any> {
        return this.usersService.customCreate(user).then(userData => {
            if (!userData) {
                return { status: 404 };
            }
            const payload = `${userData.id}`;
            const accessToken = this.jwtService.sign(payload);

            return {
                expires_in: 3600,
                access_token: accessToken,
                user_id: userData.id,
                status: 200,
                _id: userData.id,
                name: userData.name,
                email: userData.email,
            };
        });
    }
}
