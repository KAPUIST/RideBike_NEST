import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
@Injectable()
export class UsersService {
  constructor(@InjectRepository(Users) private repo: Repository<Users>) {}

  async create(email: string, password: string, nickname: string) {
    const user = await this.repo.create({ email, password, nickname });

    return this.repo.save(user);
  }

  find(email: string) {
    return this.repo.findOne({ where: { email } });
  }
}
