import { Types, Document } from 'mongoose';
import { CreateProductShoeInterface } from 'src/modules/products/interface/functions/business/business.functions.products.interface';
import {
  BusinessInterface,
  ClientInterface,
  DeliveryInterface,
} from 'src/modules/users/interface/users.interface';

export interface OrdersInterface {
  userId: Types.ObjectId;
  businessId: Types.ObjectId;
  productId: Types.ObjectId;
  quantity: number;
  date?: Date;
  total: number;
  additionalData: Record<string, any>;
}

export type OrdersInterfaceIdPopulated = Omit<
  OrdersInterface,
  'businessId productId userId'
> & {
  _id: string;
  businessId: BusinessInterface;
  productId: CreateProductShoeInterface;
  userId: ClientInterface;
};

export type OrderDocumentInterface = OrdersInterface & Document;

export interface OrdersDelivery {
  _id: string;
  deliveryId: DeliveryInterface;
  orderId: OrdersInterface;
  businessId: BusinessInterface;
  userId: ClientInterface;
  price: number;
  state: 'accepted' | 'pending';
  date: Date;
}

export interface PopulateBusinessArray {
  businessId: string;
  quantity: number;
  total: number;
}
