import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { LoginUserDto } from './login.auth.dto';
export class CreateUserDto extends LoginUserDto {
  @ApiProperty({
    example: 'luke',
    description: '닉네임',
    required: true,
  })
  @IsString()
  nickname: string;
}
