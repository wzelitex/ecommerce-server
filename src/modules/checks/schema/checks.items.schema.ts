import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class ChecksItemsSchema {
  @Prop({ required: true, ref: 'Check', type: Types.ObjectId })
  checkId: Types.ObjectId;

  @Prop({ required: true, ref: 'Orders', type: Types.ObjectId })
  orderId: Types.ObjectId;

  @Prop({ required: true, ref: 'Business', type: Types.ObjectId })
  businessId: Types.ObjectId;

  @Prop({ required: true })
  totalPieces: number;

  @Prop({ required: true })
  totalAmount: number;
}

export const ChecksItemsSchemaFactory =
  SchemaFactory.createForClass(ChecksItemsSchema);
