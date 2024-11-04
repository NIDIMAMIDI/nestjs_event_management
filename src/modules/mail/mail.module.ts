import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { EventMailService } from '../../services/mail/mail.service';

@Module({
  imports: [UserModule, ConfigModule],
  providers: [EventMailService],
  exports: [EventMailService],
})
export class MailModule {}
