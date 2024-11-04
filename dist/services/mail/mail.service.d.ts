import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { Types } from 'mongoose';
export declare class EventMailService {
    private readonly userService;
    private readonly configService;
    constructor(userService: UserService, // Injecting UserService for user retrieval
    configService: ConfigService);
    private sendMail;
    sendEventRegistrationMail(userId: Types.ObjectId, eventTitle: string): Promise<void>;
    sendEventCancelRegistrationMail(userId: Types.ObjectId, eventTitle: string): Promise<void>;
}
