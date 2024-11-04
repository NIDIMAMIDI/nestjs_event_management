import { Types } from 'mongoose';
export declare class CreateEventDto {
    title: string;
    description?: string;
    date: string;
    location: string;
    capacity: number;
    attendees?: Types.ObjectId[];
}
