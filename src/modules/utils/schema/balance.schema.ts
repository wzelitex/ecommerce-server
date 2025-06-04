import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class BalanceSchema extends Document {
  @Prop({ required: true, ref: 'Users' })
  userId: Types.ObjectId;

  @Prop({ required: true, type: Number })
  amount: number;

  @Prop({ required: true, type: String })
  activityType: string;

  @Prop({ required: true, default: Date.now, type: Date })
  date: Date;

  @Prop({ required: true, default: '' })
  description: string;
}

export const BalanceSchemaFactory = SchemaFactory.createForClass(BalanceSchema);
