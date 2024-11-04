import { HydratedDocument, Types } from 'mongoose';
export type AttendeeDocument = HydratedDocument<Attendee>;
export declare class Attendee {
    event_id: Types.ObjectId;
    user_id: Types.ObjectId;
}
export declare const AttendeeSchema: import("mongoose").Schema<Attendee, import("mongoose").Model<Attendee, any, any, any, import("mongoose").Document<unknown, any, Attendee> & Attendee & {
    _id: Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Attendee, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Attendee>> & import("mongoose").FlatRecord<Attendee> & {
    _id: Types.ObjectId;
} & {
    __v?: number;
}>;
