import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';
export class LoginUserDto {
  @ApiProperty({
    example: 'luke123',
    description: '아이디',
    required: true,
  })
  @IsString()
  @Expose()
  username: string;

  @ApiProperty({
    example: 'password',
    description: '비밀번호',
    required: true,
  })
  @IsString()
  password: string;
}
