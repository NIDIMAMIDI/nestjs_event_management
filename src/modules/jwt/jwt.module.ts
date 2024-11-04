import { Global, Module } from '@nestjs/common';
import { JwtServices } from '../../services/jwt/jwt.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Global() // This makes the module globally available
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'), // Get secret from environment variable
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') }, // Get expiration time from environment variable
      }),
    }),
  ],
  providers: [JwtServices],
  exports: [JwtModule, JwtServices], // Export JwtModule so that it can be used elsewhere
})
export class JwtModules {}
