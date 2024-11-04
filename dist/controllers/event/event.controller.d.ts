import { CreateEventDto } from '../../dto/event/create/create.event.dto';
import { EventService } from '../../services/event/event.service';
import { AuthenticatedRequest } from '../../interface/user/user.interface';
import { UserService } from '../../services/user/user.service';
import { Types } from 'mongoose';
import { AttendeeService } from '../../services/attendee/attendee.service';
import { UpdateEventDto } from '../../dto/event/update/update.event';
import { EventMailService } from '../../services/mail/mail.service';
export declare class EventController {
    private eventService;
    private userService;
    private attendeeService;
    private mailService;
    constructor(eventService: EventService, userService: UserService, attendeeService: AttendeeService, mailService: EventMailService);
    createEvent(data: CreateEventDto, request: AuthenticatedRequest): Promise<{
        status: string;
        message: string;
        event: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../../models/event/event.model").Event> & import("../../models/event/event.model").Event & {
            _id: Types.ObjectId;
        } & {
            __v?: number;
        }> & import("mongoose").Document<unknown, {}, import("../../models/event/event.model").Event> & import("../../models/event/event.model").Event & {
            _id: Types.ObjectId;
        } & {
            __v?: number;
        } & Required<{
            _id: Types.ObjectId;
        }>;
        attendees: Types.ObjectId[];
    }>;
    allEvents(page?: number, // Default value of 1; keep as string to avoid parsing issues
    limit?: number, // Default value of 2; keep as string to avoid parsing issues
    title?: string, // Optional title search parameter
    date?: string, // Optional date search parameter
    location?: string, // Optional location search parameter
    capacity?: number): Promise<{
        status: string;
        page: number;
        events: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../../models/event/event.model").Event> & import("../../models/event/event.model").Event & {
            _id: Types.ObjectId;
        } & {
            __v?: number;
        }> & import("mongoose").Document<unknown, {}, import("../../models/event/event.model").Event> & import("../../models/event/event.model").Event & {
            _id: Types.ObjectId;
        } & {
            __v?: number;
        } & Required<{
            _id: Types.ObjectId;
        }>)[];
    }>;
    getEvent(id: Types.ObjectId): Promise<{
        status: string;
        message: string;
        event: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../../models/event/event.model").Event> & import("../../models/event/event.model").Event & {
            _id: Types.ObjectId;
        } & {
            __v?: number;
        }> & import("mongoose").Document<unknown, {}, import("../../models/event/event.model").Event> & import("../../models/event/event.model").Event & {
            _id: Types.ObjectId;
        } & {
            __v?: number;
        } & Required<{
            _id: Types.ObjectId;
        }>;
        attendees: Types.ObjectId[];
    }>;
    updateEvent(id: Types.ObjectId, updateEventDto: UpdateEventDto, // Use a DTO for validation
    request: AuthenticatedRequest): Promise<{
        status: string;
        message: string;
        event: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../../models/event/event.model").Event> & import("../../models/event/event.model").Event & {
            _id: Types.ObjectId;
        } & {
            __v?: number;
        }> & import("mongoose").Document<unknown, {}, import("../../models/event/event.model").Event> & import("../../models/event/event.model").Event & {
            _id: Types.ObjectId;
        } & {
            __v?: number;
        } & Required<{
            _id: Types.ObjectId;
        }>) | null;
    }>;
    deleteEvent(id: Types.ObjectId, req: Request): Promise<{
        status: string;
        message: string;
    }>;
    registerForEvent(id: Types.ObjectId, req: Request): Promise<{
        status: string;
        message: string;
        attendee: import("../../models/attendee/attendee.model").Attendee;
    }>;
    cancelEventRegister(id: Types.ObjectId, req: AuthenticatedRequest): Promise<{
        status: string;
        message: string;
    }>;
}
