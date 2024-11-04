import { Event, EventDocument } from '../../models/event/event.model';
import { Connection, Model, Types } from 'mongoose';
import { UpdateEventDto } from '../../dto/event/update/update.event';
export declare class EventService {
    private eventModel;
    private connection;
    constructor(eventModel: Model<EventDocument>, connection: Connection);
    create(title: string, description: string, date: Date, location: string, capacity: number, createdBy: Types.ObjectId): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Event> & Event & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    }> & import("mongoose").Document<unknown, {}, Event> & Event & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    searchEventById(id: Types.ObjectId): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Event> & Event & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    }> & import("mongoose").Document<unknown, {}, Event> & Event & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    } & Required<{
        _id: Types.ObjectId;
    }>) | null>;
    searchEventByTitleAndCreator(title: string, createdBy: Types.ObjectId): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Event> & Event & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    }> & import("mongoose").Document<unknown, {}, Event> & Event & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    } & Required<{
        _id: Types.ObjectId;
    }>) | null>;
    findAllEvents(searchQuery: any, page: number, limit: number): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Event> & Event & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    }> & import("mongoose").Document<unknown, {}, Event> & Event & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    } & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    update(id: string, updateEventDto: UpdateEventDto): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Event> & Event & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    }> & import("mongoose").Document<unknown, {}, Event> & Event & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    } & Required<{
        _id: Types.ObjectId;
    }>) | null>;
    deleteEvent(eventId: Types.ObjectId): Promise<void>;
    updateCapacity(id: Types.ObjectId, newCapacity: number): Promise<void>;
    cancelRegistrationUpdates(eventId: Types.ObjectId): Promise<void>;
}
