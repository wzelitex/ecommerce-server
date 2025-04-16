import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class ContactsSchema {
  @Prop({ required: true, ref: 'Users' })
  from: Types.ObjectId;

  @Prop({ required: true, ref: 'Users' })
  to: Types.ObjectId;

  @Prop({ required: true, type: String })
  subject: string;

  @Prop({ required: true, type: String })
  message: string;

  @Prop({ required: true, type: String })
  type: string;
}

export const ContactsSchemaFactory =
  SchemaFactory.createForClass(ContactsSchema);
