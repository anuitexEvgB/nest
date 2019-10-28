import { AuthService } from './auth/auth.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'aye228',
    });
  }

  // async validate(payload: any) {
  //   console.log(payload);
  //   return { userId: payload.sub, username: payload.username };
  // }
  public async validate(payload) {
    const user = await this.authService.getUserById(payload);
    if (!user) {
        throw new UnauthorizedException();
    }
    return user;
}

  // async validate(useremail: string, password: string): Promise<any> {
  //   const user = await this.authService.validateUser(useremail, password);
  //   if (!user) {
  //     throw new UnauthorizedException();
  //   }
  //   return user;
  // }
}
