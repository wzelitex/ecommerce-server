import { Types } from 'mongoose';

/* interface base user */
export interface CreateUserInterface {
  name: string;
  email: string;
  password: string;
  phone: number;
  lada: number;
}

/* interface location user */
interface LocationUserInterface {
  zipCode: string;
  cologne: string;
  street: string;
  number: string;
  municipality: string;
  state: string;
  country: string;
}

/* interface newtworks user */
export interface NetWorksUsersInterface {
  facebook: string;
  instagram: string;
  twitter: string;
  tiktok: string;
}

export interface BusinessInterface
  extends CreateUserInterface,
    NetWorksUsersInterface,
    LocationUserInterface {
  image: string;
  description: string;
  delivery: number;
}

export interface ClientInterface
  extends LocationUserInterface,
    NetWorksUsersInterface,
    CreateUserInterface {
  _id: string;
}

export interface CreateUserInterfaceDocument
  extends CreateUserInterface,
    Document {
  _id: string;
}

export interface DeliveryInterface
  extends LocationUserInterface,
    CreateUserInterface {}

export interface CreateUserWorker extends CreateUserInterface {
  businessId: Types.ObjectId;
}

export interface ReturnBusinessDetailsToPay {
  _id: string;
  name: string;
  ownerAccount: string;
  numberAccount: number;
}
