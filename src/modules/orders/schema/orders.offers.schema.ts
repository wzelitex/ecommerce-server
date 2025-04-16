import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class OrdersOffersSchema {
  @Prop({ required: true, ref: 'Delivery' })
  deliveryId: Types.ObjectId;

  @Prop({ required: true, ref: 'Orders' })
  orderId: Types.ObjectId;

  @Prop({ required: true, ref: 'Business' })
  businessId: Types.ObjectId;

  @Prop({ required: true, ref: 'Client' })
  userId: Types.ObjectId;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, default: Date.now })
  date: Date;

  @Prop({
    required: true,
    enum: ['pending', 'accepted', 'completed'],
    default: 'pending',
  })
  state: string;
}

export const OrdersOffersSchemaFactory =
  SchemaFactory.createForClass(OrdersOffersSchema);
