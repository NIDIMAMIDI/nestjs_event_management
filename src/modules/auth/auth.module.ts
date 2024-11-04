import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthController } from '../../controllers/auth/auth.controller';
import { AuthService } from '../../services/auth/auth.service';
import { JwtModules } from '../jwt/jwt.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UserModule, JwtModules, ConfigModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
