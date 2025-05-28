import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { IsString } from 'class-validator';
import { Document, Types } from 'mongoose';

// Esquema base de los usuarios
@Schema()
export class UserBaseSchema extends Document {
  @Prop({ required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  phone: number;

  @Prop({ required: true })
  lada: number;

  @Prop({ required: true })
  type: 'client' | 'business' | 'delivery';
}

export const UserBaseSchemaFactory =
  SchemaFactory.createForClass(UserBaseSchema);

// Esquema del cliente
@Schema()
export class UserClientSchema extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  phone: number;

  @Prop({ required: true })
  lada: number;

  @Prop({ default: '' })
  zipCode: string;

  @Prop({ default: '' })
  cologne: string;

  @Prop({ default: '' })
  street: string;

  @Prop({ default: '' })
  number: string;

  @Prop({ default: '' })
  municipality: string;

  @Prop({ default: '' })
  state: string;
  e;
  @Prop({ default: '' })
  country: string;
}

export const UserClientSchemaFactory =
  SchemaFactory.createForClass(UserClientSchema);

// Esquema del negocio
@Schema()
export class UserBusinessSchema extends UserClientSchema {
  /* Redes Sociales */

  @IsString()
  @Prop({ required: false, default: '' })
  image: string;

  @IsString()
  @Prop({ required: false, default: '' })
  description: string;

  @IsString()
  @Prop({ type: String, required: false, default: '' })
  facebook: string;

  @IsString()
  @Prop({ type: String, required: false, default: '' })
  instagram: string;

  @IsString()
  @Prop({ type: String, required: false, default: '' })
  twitter: string;

  @IsString()
  @Prop({ type: String, required: false, default: '' })
  tiktok: string;
}

export const UserBusinessSchemaFactory =
  SchemaFactory.createForClass(UserBusinessSchema);

/* delivery schema */
export class UserDeliverySchema extends UserClientSchema {
  @IsString()
  @Prop({ required: true })
  image: string;
}

export const UserDeliverySchemaFactory =
  SchemaFactory.createForClass(UserDeliverySchema);
