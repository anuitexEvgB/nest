import { CustomLoginDto } from '../dto/custom-auth.dto';
import { User } from './../models/user.model';
import { AuthService } from '../shared/auth.service';

import { Controller, Post, Body } from '@nestjs/common';

@Controller('users')
export class UsersController {
    constructor(
        private readonly authService: AuthService,
        ) {}

    @Post('login')
    async login(@Body() user: User): Promise<User | { status: number }> {
        return this.authService.login(user);
    }

    @Post('register')
    async register(@Body() user: User): Promise<User> {
        return this.authService.register(user);
    }

    @Post('customReg')
    async customCreate(@Body() user: CustomLoginDto): Promise<CustomLoginDto> {
        return this.authService.customReg(user);
    }
}
