import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class ContactsSchema {
  @Prop({ required: true, ref: 'Client' })
  from: Types.ObjectId;

  @Prop({ required: true, ref: 'Business' })
  to: Types.ObjectId;

  @Prop({ required: true, type: String })
  subject: string;

  @Prop({ required: true, type: String })
  message: string;

  @Prop({ required: true, type: String })
  type: string;

  @Prop({ required: true, type: Date, default: Date.now })
  date: Date;
}

export const ContactsSchemaFactory =
  SchemaFactory.createForClass(ContactsSchema);
