import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true, trim: true })
  username!: string;

  @Prop({ required: true, trim: true, unique: true, lowercase: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ default: 'user', enum: ['user', 'organizer'] })
  role?: string;

  @Prop()
  token?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
