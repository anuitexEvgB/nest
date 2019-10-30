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
  public async validate(payload: string) {
    const user = await this.authService.getUserById(payload);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
