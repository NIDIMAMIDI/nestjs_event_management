import { Connection, Model, Types } from 'mongoose';
import { User, UserDocument } from '../../models/user/user.model';
export declare class UserService {
    private userModel;
    private connection;
    constructor(userModel: Model<UserDocument>, connection: Connection);
    userExists(email: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, User> & User & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    }> & import("mongoose").Document<unknown, {}, User> & User & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    } & Required<{
        _id: Types.ObjectId;
    }>) | null>;
    userCreate(email: string, password: string, username: string, role: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, User> & User & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    }> & import("mongoose").Document<unknown, {}, User> & User & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    userTokenUpdate(id: Types.ObjectId, token: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, User> & User & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    }> & import("mongoose").Document<unknown, {}, User> & User & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    } & Required<{
        _id: Types.ObjectId;
    }>) | null>;
    userById(id: Types.ObjectId): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, User> & User & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    }> & import("mongoose").Document<unknown, {}, User> & User & {
        _id: Types.ObjectId;
    } & {
        __v?: number;
    } & Required<{
        _id: Types.ObjectId;
    }>) | null>;
    removeToken(id: Types.ObjectId): Promise<void>;
    checkAttendeesAndCapacity(attendees: Types.ObjectId[] | undefined, capacity: number): Promise<{
        validAttendees: Types.ObjectId[];
        adjustedCapacity: number;
    }>;
}
