import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class ChecksSchema {
  @Prop({ required: true, ref: 'Client', type: Types.ObjectId })
  userId: Types.ObjectId;

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ required: true })
  totalItems: number;

  @Prop({ required: false, type: String, default: '' })
  paymentProof: string;

  @Prop({ default: 'pending' })
  status: string;

  @Prop({ required: true, type: Date, default: Date.now })
  date: Date;
}

export const ChecksSchemaFactory = SchemaFactory.createForClass(ChecksSchema);
