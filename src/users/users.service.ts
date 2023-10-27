import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/users/users';
import { Password } from 'src/entities/auth/auth.password';
import { AuthService } from 'src/auth/auth.service';
import { SocialProvider } from 'src/entities/users/users';
import { UserAuthDto } from 'src/auth/dtos/user.auth.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    private dataSource: DataSource,

    private authService: AuthService,
  ) {}
  async register(username: string, password: string, nickname: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    if (!username) {
      throw new BadRequestException('이메일이 필요합니다.');
    }
    if (!password) {
      throw new BadRequestException('비밀번호가 필요합니다.');
    }
    if (!nickname) {
      throw new BadRequestException('닉네임이 필요합니다.');
    }
    const duplicatedUser = await this.find(username);
    if (duplicatedUser) {
      throw new UnauthorizedException('이미 존재하는 사용자 입니다.');
    }

    const hash = await this.authService.hashedPassword(password);
    try {
      const userPassword: Password = new Password();
      userPassword.password = hash;
      await queryRunner.manager.getRepository(Users).save({
        username,
        nickname,
        provider: SocialProvider.RIDEBIKE,
        password: userPassword,
      });

      await queryRunner.commitTransaction();
      return true;
    } catch (err) {
      console.error(err);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async validateUser(username: string, password: string): Promise<UserAuthDto> {
    const user = await this.usersRepository.findOne({
      where: { username },
      relations: ['password'],
    });
    if (!user) {
      throw new UnauthorizedException('not found user');
    }

    const validP = await this.authService.validatePassword(user, password);

    return validP;
  }
  // async refereshTokenUpdate(username: string, refreshToken: string) {
  //   const user = await this.usersRepository.findOne({
  //     where: { username },
  //     relations: ['password'],
  //   });
  //   if (!user) {
  //     throw new UnauthorizedException('not found user');
  //   }

  //   user.password.refreshToken = refreshToken;

  //   return true;
  // }
  async find(username: string) {
    return await this.usersRepository.findOne({ where: { username } });
  }

  // async setCurrentRefreshToken(username: string, refreshToken: string) {
  //   const user = await this.find(email);

  //   user.refreshToken = refreshToken;
  //   return this.repo.save(user);
  // }
}
