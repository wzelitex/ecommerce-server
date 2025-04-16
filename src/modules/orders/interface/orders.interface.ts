import { Types, Document } from 'mongoose';
import { CreateProductShoeInterface } from 'src/modules/products/interface/functions/business/business.functions.products.interface';
import {
  BusinessInterface,
  ClientInterface,
} from 'src/modules/users/interface/users.interface';

export interface OrdersInterface {
  userId: Types.ObjectId;
  businessId: Types.ObjectId;
  productId: Types.ObjectId;
  quantity: number;
  date?: Date;
  total: number;
  additionalData?: Record<string, any>;
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
