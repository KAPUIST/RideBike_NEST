import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Users } from 'src/entities/Users';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
export interface Payload {
  sub: number;
  email: string;
}
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private repo: Repository<Users>,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async register(email: string, password: string, nickname: string) {
    if (!email) {
      throw new BadRequestException('이메일이 필요합니다.');
    }
    if (!password) {
      throw new BadRequestException('비밀번호가 필요합니다.');
    }
    if (!nickname) {
      throw new BadRequestException('닉네임이 필요합니다.');
    }
    const duplicatedUser = await this.usersService.find(email);
    if (duplicatedUser) {
      throw new UnauthorizedException('이미 존재하는 사용자 입니다.');
    }

    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    const user = await this.usersService.create(email, hash, nickname);
    return user;
  }

  //   async login(email: string, password: string) {
  //     const user = await this.validateUser(email, password);
  //     const payload = { sub: user.id, email: user.email };
  //     return {
  //       access_token: await this.jwtService.signAsync(payload),
  //     };
  //   }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.find(email);
    if (!user) {
      throw new UnauthorizedException('not found user');
    }
    const validUser = await bcrypt.compare(password, user.password);
    if (!validUser) {
      throw new UnauthorizedException('wrong password');
    }
    const payload = { sub: user.id, email: user.email };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
  async tokenValidateUser(payload: Payload) {
    return await this.usersService.find(payload.email);
  }
}
