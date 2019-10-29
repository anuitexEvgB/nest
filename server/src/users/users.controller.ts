import { User } from './../models/user.model';
import { AuthService } from './auth/auth.service';
import { Controller, Post, Body, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Googlefb } from '../models/customAuth.model';

@Controller('users')
export class UsersController {
    constructor(private readonly authService: AuthService) {}

    @Get()
    async getUsers() {
        return this.authService.getUsers();
    }

    @Post('login')
    async login(@Body() user: User): Promise<any> {
        return this.authService.login(user);
    }

    @Post('register')
    async register(@Body() user: User): Promise<any> {
        return this.authService.register(user);
    }

    @Post('customReg')
    async customCreate(@Body() user: Googlefb): Promise<any> {
        return this.authService.customReg(user);
    }

    // @Get('google')
    // @UseGuards(AuthGuard('google'))
    // googleLogin()
    // {
    //     console.log('asdasd');
    //     // initiates the Google OAuth2 login flow
    // }

    // @Get('google/callback')
    // @UseGuards(AuthGuard('google'))
    // googleLoginCallback(@Req() req, @Res() res)
    // {
    //     // handles the Google OAuth2 callback
    //     const jwt: string = req.user.jwt;
    //     if (jwt) {
    //         res.redirect('http://localhost:8100/login/succes/' + jwt);
    //     } else {
    //         res.redirect('http://localhost:8100/login/failure');
    //     }
    // }
}
