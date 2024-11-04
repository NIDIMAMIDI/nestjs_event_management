import { Attendee, AttendeeDocument } from '../../models/attendee/attendee.model';
import { Connection, Model, Types } from 'mongoose';
export declare class AttendeeService {
    private attendeeModel;
    private connection;
    constructor(attendeeModel: Model<AttendeeDocument>, connection: Connection);
    insertAttendees(validAttendees: Types.ObjectId[], id: Types.ObjectId): Promise<void>;
    attendeeList(id: Types.ObjectId): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Attendee> & Attendee & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    }> & import("mongoose").Document<unknown, {}, Attendee> & Attendee & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    } & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    deleteAttendees(eventId: Types.ObjectId): Promise<void>;
    findAttendee(eventId: Types.ObjectId, userId: Types.ObjectId): Promise<Attendee | null>;
    createAttendee(eventId: Types.ObjectId, userId: Types.ObjectId): Promise<Attendee>;
    deleteAttendee(userId: Types.ObjectId, eventId: Types.ObjectId): Promise<void>;
}
