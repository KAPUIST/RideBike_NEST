import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService, Payload } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: Payload, done: VerifiedCallback): Promise<any> {
    const user = await this.authService.tokenValidateUser(payload);
    if (!user) {
      return done(
        new UnauthorizedException({ message: 'user does not exist' }),
        false,
      );
    }
    return done(null, user);
  }
}
