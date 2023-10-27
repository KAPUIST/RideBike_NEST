import {
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Users } from 'src/entities/users/users';

import { UserAuthDto } from './dtos/user.auth.dto';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
export interface Payload {
  sub: number;
  username: string;
}
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async hashedPassword(password: string) {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash;
  }
  // async getJWT(id: number, email: string) {
  //   //const user = await this.kakaoValidateUser(kakaoId);	// 카카오 정보 검증 및 회원가입 로직
  //   const accessToken = await this.generateAccessToken(id, email); // AccessToken 생성
  //   const refreshToken = await this.generateRefreshToken(id, email); // refreshToken 생성
  //   return { accessToken, refreshToken };
  // }
  async generateAccessToken(id: number, username: string) {
    const payload = { sub: id, username: username };
    const accessToken = await this.jwtService.signAsync(payload);
    console.log(accessToken);
    return accessToken;
  }
  async generateRefreshToken(id: number, username: string) {
    const payload = { sub: id, username: username };

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION_TIME'),
    });
    const saltOrRounds = 10;
    const currentRefreshToken = await bcrypt.hash(refreshToken, saltOrRounds);
    const user = await this.usersRepository.findOne({
      where: { username },
      relations: ['password'],
    });
    if (!user) {
      throw new UnauthorizedException('not found user');
    }
    user.password.refreshToken = refreshToken;
    await this.usersRepository.save(user);
    return refreshToken;
  }
  // async kakaoValidateUser(email: string, password: string) {}
  async validatePassword(user: Users, password: string): Promise<any> {
    //const user = await this.usersService.find(email);

    const validUser = await bcrypt.compare(password, user.password.password);
    if (!validUser) {
      throw new UnauthorizedException('wrong password');
    }

    const accessToken = await this.generateAccessToken(user.id, user.username);

    const refreshToken = await this.generateRefreshToken(
      user.id,
      user.username,
    );
    const userData: UserAuthDto = {
      id: user.id,
      username: user.username,
      nickname: '',
      accessToken: accessToken,
      refreshToken: refreshToken,
    };

    return userData;
  }
  async tokenValidateUser(payload: Payload) {
    const user = await this.usersRepository.findOne({
      where: { username: payload.username },
    });

    return user;
  }
  async getkakaoJWT(id: number, email: string) {
    const accessToken = this.generateAccessToken(id, email); // AccessToken 생성
    const refreshToken = await this.generateRefreshToken(id, email); // refreshToken 생성
    return { accessToken, refreshToken };
  }
  // async kakaoValidateUser(kakaoId: number) {
  //   let user = await this.usersRepository.findUserByKakaoId(kakaoId); // 유저 조회
  //   if (!user) {
  //     // 회원 가입 로직
  //     user = await this.usersRepository.create({
  //       kakaoId,
  //       provider: 'kakao',
  //     });
  //   }
  //   return user;
  // }
}
