import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  userName: String;

  @Prop({ required: true })
  password: String;

  @Prop()
  status: Boolean;
}

export const userModel = SchemaFactory.createForClass(User);
