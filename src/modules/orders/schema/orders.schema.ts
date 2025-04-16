import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class OrderSchema extends Document {
  /* Data to plataform */
  @Prop({ type: Types.ObjectId, ref: 'Client', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Business', required: true })
  businessId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Shoe', required: true })
  productId: Types.ObjectId;

  @Prop({ required: true })
  quantity: number;

  @Prop({ type: Date, default: Date.now() })
  date: Date;

  @Prop({ required: true })
  total: number;

  @Prop({ required: true, default: 'pending' })
  stateOrder: string;

  @Prop({ type: Map, of: Object, default: {} })
  additionalData: Record<string, any>;
}

export const OrderSchemaFactory = SchemaFactory.createForClass(OrderSchema);
