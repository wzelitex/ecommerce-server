import { BusinessInterface } from 'src/modules/users/interface/users.interface';

export interface InterfaceItemsPaymet {
  _id: string;
  name: string;
  price: number;
  currency_id?: 'MXN';
  quantity: number;
}

export interface InterfacePayerPayment {
  /* general info */
  name: string;
  email: string;
  phone: number;
  lada: number;
  /* location info */
  street: string;
  cologne: string;
  zipCode: string;
  state: string;
  number: string;
  municipality: string;
  country: string;
}

export interface InterfaceOptionsPayment {
  userId: string;
}

export interface InterfaceBusinessPay {
  businessId: BusinessInterface;
}
