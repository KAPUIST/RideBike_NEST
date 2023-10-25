import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Req,
  UseGuards,
  Res,
} from '@nestjs/common';
import { CreateUserDto } from '../auth/dtos/create.auth.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../auth/dtos/login.auth.dto';
import { Response, Request } from 'express';
import { UserAuthDto } from './dtos/user.auth.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('auth')
@Controller('auth')
@Serialize(UserAuthDto)
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponse({
    status: 201,
    description: '회원가입 성공',
    type: UserAuthDto,
  })
  @ApiOperation({ summary: '회원가입' })
  @Post('register')
  async postUsers(@Body() body: CreateUserDto) {
    const user = await this.authService.register(
      body.email,
      body.password,
      body.nickname,
    );
    return user;
  }
  @ApiResponse({
    status: 200,
    description: '로그인 성공',
    type: UserAuthDto,
  })
  @ApiOperation({ summary: '로그인' })
  //   @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Body() body: LoginUserDto, @Res() res: Response) {
    const jwt = await this.authService.validateUser(body.email, body.password);
    res.setHeader('Authorization', 'Bearer ' + jwt.accessToken);
    return res.json(jwt);
  }
  @ApiResponse({
    status: 200,
    description: '로그아웃 성공',
    type: UserAuthDto,
  })
  @ApiOperation({ summary: '로그아웃' })
  @Post('logout')
  logout(@Req() req) {
    req.logOut();
  }
  @Get('/authenticate')
  @UseGuards(AuthGuard())
  isAuthenticated(@Req() req: Request): any {
    const user: any = req.user;
    return user;
  }
}
