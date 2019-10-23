import { UsersService } from './../users.service';
import { User } from './../../models/user.model';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    private async validate(userData: User): Promise<User> {
        return await this.usersService.findByEmail(userData.email);
    }

    public async login(user: User): Promise<any | {status: number}> {
        return this.validate(user).then(userData => {
            user.password = crypto.createHmac('sha256', user.password).digest('hex');
            if (!userData) {
                return {status: 404};
            }
            if (userData.password !== user.password) {
                return {status: 404};
            }
            let payload = `${userData.name}${userData.id}`;
            const accessToken = this.jwtService.sign(payload);

            return {
                expires_in: 3600,
                access_token: accessToken,
                user_id: payload,
                status: 200,
            };
        });
    }

    async validateUser(useremail: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(useremail);
        if (user && user.password === pass) {
          const { password, ...result } = user;
          console.log(result);
          console.log(user);
          return result;
        }
        return null;
      }

    public async register(user: User): Promise<any> {
        user.password = crypto.createHmac('sha256', user.password).digest('hex');
        return this.usersService.create(user);
    }
}
