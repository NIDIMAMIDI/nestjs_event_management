import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { JwtModules } from '../jwt/jwt.module';
import { EventModule } from '../event/event.module';
import { AttendeeModule } from '../attendee/attendee.module';
import { MailModule } from '../mail/mail.module';
// import { GlobalJwtModuleModule } from '../global-jwt-module/global-jwt-module.module';

@Module({
  imports: [
    AttendeeModule,

    AuthModule,

    UserModule,

    MailModule,

    EventModule,

    JwtModules,

    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true, // Makes the ConfigModule global, so you don't need to import it in other modules.
      expandVariables: true, // Allows environment variable expansion.
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
