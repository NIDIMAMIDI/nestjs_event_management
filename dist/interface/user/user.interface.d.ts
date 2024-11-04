import { Types } from 'mongoose';
export interface UserInterface {
    _id: Types.ObjectId;
    username: string;
    email: string;
    password: string;
    role?: string;
    token?: string;
    __v?: number;
}
export interface AuthenticatedRequest extends Request {
    user?: UserInterface;
}
