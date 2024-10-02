import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Public } from '../../decorators/public/public.decorator';
import { LoginDto, SignupDto } from './auth.dto';
import { AuthService } from './auth.service';
import { AuthResponse } from './types';
import { Response } from 'express';
import { standardResponse } from '../../common/utils/standard-response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @Public()
  @Get('verify-access-token')
  @HttpCode(HttpStatus.CREATED)
  async signup(
    @Res({
      passthrough: true,
    })
    response: Response,
    @Body() signupDto: SignupDto,
  ): AuthResponse {
    return this.authService.signup(response, signupDto);
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  async login(
    @Res({ passthrough: true }) response: Response,
    @Body() loginDto: LoginDto,
  ): AuthResponse {
    return this.authService.login(response, loginDto);
  }

  @Get('verify-access-token')
  @HttpCode(HttpStatus.OK)
  async verifyAccessToken() {
    return standardResponse({
      message: 'Access token is valid',
    });
  }
}
