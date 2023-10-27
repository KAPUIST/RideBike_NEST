import { Module } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
// import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategy/passport.jwt.strategy';
import { UsersService } from 'src/users/users.service';
import { JwtKakaoStrategy } from './strategy/passport.kakao.jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/users/users';
@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get<string>('JWT_EXPIRATION_TIME')}`,
        },
      }),
    }),
  ],

  exports: [AuthService],
  providers: [AuthService, JwtStrategy, JwtKakaoStrategy],
})
export class AuthModule {}
