import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class ProductBaseSchema extends Document {
  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true, default: true })
  available: boolean;

  @Prop({ default: '' })
  description: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Business' })
  businessId: Types.ObjectId;

  @Prop({ required: true, default: false })
  isDeleted: boolean;
}

export const ProductBaseSchemaFactory =
  SchemaFactory.createForClass(ProductBaseSchema);

ProductBaseSchemaFactory.index({ nombre: 'text', descripcion: 'text' });

@Schema()
export class ProductShoeSchema extends ProductBaseSchema {
  @Prop({ type: [String], default: [''] })
  sizes: string[];

  @Prop({ required: true })
  color: string;

  @Prop({ default: '' })
  material: string;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  typeProduct: string;
}

export const ProductShoeSchemaFactory =
  SchemaFactory.createForClass(ProductShoeSchema);
