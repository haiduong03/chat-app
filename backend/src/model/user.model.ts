import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  // @Prop({ unique: true, autoIncrement: true })
  // id: number;

  // @Prop({ required: true, unique: true })
  // email: string;

  @Prop({ unique: true })
  userName: String;

  @Prop({ required: true })
  password: String;

  @Prop({ default: 0 })
  status: Boolean;
}

export const userModel = SchemaFactory.createForClass(User);
