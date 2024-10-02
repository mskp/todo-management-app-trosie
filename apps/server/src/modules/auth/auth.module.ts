import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const JWT_SECRET = process.env.JWT_SECRET;

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
})
export class AuthModule {}
