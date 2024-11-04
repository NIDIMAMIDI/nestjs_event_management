import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';


export type EventDocument = HydratedDocument<Event>;

@Schema()
export class Event {
  @Prop({ trim: true, lowercase: true})
  title!: string;

  @Prop()
  description?: string;

  @Prop({required:true})
  date!: Date;

  @Prop({required:true, trim: true})
  location!:string

  @Prop({required:true})
  capacity!: number

  @Prop({type:Types.ObjectId, ref: 'User', required:true})
  createdBy!: Types.ObjectId

}

export const EventSchema = SchemaFactory.createForClass(Event);
