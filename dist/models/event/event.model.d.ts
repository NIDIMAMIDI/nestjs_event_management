import { HydratedDocument, Types } from 'mongoose';
export type EventDocument = HydratedDocument<Event>;
export declare class Event {
    title: string;
    description?: string;
    date: Date;
    location: string;
    capacity: number;
    createdBy: Types.ObjectId;
}
export declare const EventSchema: import("mongoose").Schema<Event, import("mongoose").Model<Event, any, any, any, import("mongoose").Document<unknown, any, Event> & Event & {
    _id: Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Event, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Event>> & import("mongoose").FlatRecord<Event> & {
    _id: Types.ObjectId;
} & {
    __v?: number;
}>;
