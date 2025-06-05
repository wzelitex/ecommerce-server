import { Types } from 'mongoose';

export interface IPaymentItems {
  _id: Types.ObjectId;
  name: string;
  price: number;
  currency_id: string;
  quantity: number;
  total: number;
}

export interface IPayerPayment {
  /* general info */
  username: string;
  email: string;
  phone: number;
  lada: number;
  /* location info */
  street: string;
  cologne: string;
  zipCode: number;
  state: string;
  municipality: string;
  country: string;
}

export interface IOptionsPayment {
  userId: string;
}
