export interface ResponseLoginInterface {
  status: number;
  success: boolean;
  message: string;
  data: {
    access_token: string;
    refresh_token: string;
  };
}

export interface NewUserCollectionInterface {
  userId: string;
  email: string;
  password: string;
  phone: number;
  lada: number;
  type: 'client' | 'business' | 'delivery';
}

export interface PayloadUserInterface {
  userId: string;
  email: string;
  type: string;
}
