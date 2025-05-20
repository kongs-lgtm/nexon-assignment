import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ versionKey: false })
export class User {
  _id: Types.ObjectId;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
