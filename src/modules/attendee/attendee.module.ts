import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Attendee, AttendeeSchema } from '../../models/attendee/attendee.model';
import { AttendeeController } from '../../controllers/attendee/attendee.controller';
import { AttendeeService } from '../../services/attendee/attendee.service';
import { UserModule } from '../user/user.module';
import { EventModule } from '../event/event.module';
import { JwtModules } from '../jwt/jwt.module';
import { ConfigModule } from '@nestjs/config';

@Module({
   imports:[ MongooseModule.forFeature([{ name: Attendee.name, schema: AttendeeSchema }]),
UserModule, forwardRef(() => EventModule), JwtModules, ConfigModule],
   controllers:[AttendeeController],
   providers:[AttendeeService],
   exports:[AttendeeService]
})
export class AttendeeModule {}
