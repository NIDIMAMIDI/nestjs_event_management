import { forwardRef, Module } from '@nestjs/common';
import { EventController } from '../../controllers/event/event.controller';
import { EventService } from '../../services/event/event.service';
import { JwtModules } from '../jwt/jwt.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from '../../models/event/event.model';
import { AttendeeModule } from '../attendee/attendee.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    JwtModules,
    ConfigModule,
    UserModule,
    MailModule,
    forwardRef(() => AttendeeModule),
  ], // Use forwardRef here],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
