import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';


export type AttendeeDocument = HydratedDocument<Attendee>;

@Schema()
export class Attendee {
    
    @Prop({type:Types.ObjectId, ref: 'Event', required:true})
    event_id!:Types.ObjectId

    @Prop({type:Types.ObjectId, ref: 'User', required:true})
     user_id!: Types.ObjectId

}

export const AttendeeSchema = SchemaFactory.createForClass(Attendee);
