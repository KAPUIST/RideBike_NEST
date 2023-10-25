import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Req,
  UseGuards,
  Request,
} from '@nestjs/common';

import { UsersService } from './users.service';

import { ApiOperation } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: '내정보 조회' })
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
