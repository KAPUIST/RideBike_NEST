import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
export class UserAuthDto {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Expose()
  nickname: string;

  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;
}
