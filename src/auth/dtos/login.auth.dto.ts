import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';
export class LoginUserDto {
  @ApiProperty({
    example: 'luke@example.com',
    description: '이메일',
    required: true,
  })
  @IsString()
  @IsEmail()
  @Expose()
  email: string;

  @ApiProperty({
    example: 'password',
    description: '비밀번호',
    required: true,
  })
  @IsString()
  password: string;
}
