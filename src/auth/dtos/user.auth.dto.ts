import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
export class UserAuthDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  nickname: string;

  @Expose()
  access_token: string;

  @Expose()
  refresh_token: string;
}
