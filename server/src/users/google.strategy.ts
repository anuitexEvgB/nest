import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        super({
            clientID    : '160010738906-m7r2ltrlf0cugjb033f76n39hhs2aj9r.apps.googleusercontent.com',     // <- Replace this with your client id
            clientSecret: 'RxZXdfQkC6XLJAdgfkFuMmDq', // <- Replace this with your client secret
            callbackURL : 'http://localhost:3000/users/google/callback',
            passReqToCallback: true,
            scope: ['profile'],
        });
    }

    // tslint:disable-next-line: ban-types
    async validate(request: any, accessToken: string, refreshToken: string, profile: any, done: Function) {
        try {
            console.log(profile);
            console.log(accessToken);
            const jwt: string = 'placeholderJWT';
            const user = {
                jwt,
            };

            done(null, user);
        } catch (err) {
            // console.log(err)
            done(err, false);
        }
    }
}
