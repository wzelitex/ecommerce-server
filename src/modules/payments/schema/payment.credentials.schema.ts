import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class PaymentCredentialsSchema {
  @Prop({ required: true, ref: 'Business' })
  businessId: Types.ObjectId;

  @Prop({ required: true, type: String })
  accessToken: string;

  @Prop({ required: true, type: String })
  refreshToken: string;

  @Prop({ required: true })
  mpUserId: string;
}

export const PaymentCredentialsSchemaFactory = SchemaFactory.createForClass(
  PaymentCredentialsSchema,
);
