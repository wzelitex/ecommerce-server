import {
  ClientInterface,
  BusinessInterface,
} from 'src/modules/users/interface/users.interface';
import { OrdersInterface } from 'src/modules/orders/interface/orders.interface';

export interface CheckItemInterface {
  _id: string;
  checkId: CheckInterface;
  businessId: BusinessInterface;
  totalPieces: number;
  totalAmount: number;
}

export interface CheckInterface {
  _id: string;
  userId: ClientInterface;
  totalAmount: number;
  totalItems: number;
  paymentProof: string;
  status: string;
  orderId: OrdersInterface;
}

export type CheckPopulateInterface = Omit<CheckInterface, 'userId'> & {
  userId: ClientInterface;
};
