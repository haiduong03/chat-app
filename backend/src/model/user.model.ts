import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export type UserDocument = User & Document;
export type ReqFriend = RequestFriend & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: SchemaTypes.ObjectId })
  id: Types.ObjectId;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  phone: number;

  @Prop({ unique: true, required: true })
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 0 })
  status: boolean;

  @Prop()
  friend?: string[];

  @Prop()
  room?: string[];
}

@Schema({ timestamps: true })
export class RequestFriend {
  @Prop({ unique: true, required: true })
  from: string;

  @Prop({ required: true })
  to: string;

  @Prop({ default: 0 })
  status: boolean;
}

@Schema()
export class Room {
  @Prop({ required: true })
  name: string;

  @Prop({ default: 'admin' })
  role?: string;
}

@Schema()
export class Messages {
  @Prop({ required: true })
  room: string;

  @Prop({ required: true })
  messages: string;

  @Prop({ required: true })
  date: string;

  @Prop()
  from: User;
}

export const userModel = SchemaFactory.createForClass(User);
export const reqFriend = SchemaFactory.createForClass(RequestFriend);
export const room = SchemaFactory.createForClass(Room);
