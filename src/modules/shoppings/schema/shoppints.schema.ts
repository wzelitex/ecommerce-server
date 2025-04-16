import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class ShoppingSchema extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Client', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Shoe', required: true })
  productId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Business', required: true })
  businessId: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  total: number;

  @Prop({ required: true, default: 'pending' })
  state: string;

  @Prop({ type: Map, of: Object, default: {} })
  additionalData: Record<string, any>;
}

export const ShoppingSchemaFactory =
  SchemaFactory.createForClass(ShoppingSchema);
