import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Req,
  UseGuards,
  Request,
  NotFoundException,
  ForbiddenException,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';

import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserDto } from './dtos/user.dto';
import { CreateUserDto } from 'src/users/dtos/create.auth.dto';
import { UserAuthDto } from 'src/auth/dtos/user.auth.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { LoginUserDto } from './dtos/login.auth.dto';

@Controller('auth')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: '내정보 조회' })
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
  @ApiResponse({
    status: 201,
    description: '회원가입 성공',
    type: UserDto,
  })
  @ApiOperation({ summary: '회원가입' })
  @Post('register')
  async postUsers(@Body() body: CreateUserDto) {
    const result = await this.usersService.register(
      body.username,
      body.password,
      body.nickname,
    );
    if (result) {
      return 'ok';
    } else {
      throw new ForbiddenException();
    }
  }
  @ApiResponse({
    status: 200,
    description: '로그인 성공',
    type: UserAuthDto,
  })
  @Serialize(UserAuthDto)
  @ApiOperation({ summary: '로그인' })
  @Post('login')
  async login(@Body() body: LoginUserDto, @Res() res: Response) {
    const userData = await this.usersService.validateUser(
      body.username,
      body.password,
    );
    //const userUpdate = await this.usersService.refereshTokenUpdate()
    res.setHeader('Authorization', 'Bearer ' + userData.accessToken);
    return res.json(userData);
  }
}
