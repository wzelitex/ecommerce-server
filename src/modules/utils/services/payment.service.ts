import { Injectable } from '@nestjs/common';
import {
  IPayerPayment,
  IOptionsPayment,
  IPaymentItems,
} from '../interfaces/payment.interface';
import * as dotenv from 'dotenv';
dotenv.config();

import { MercadoPagoConfig, Preference } from 'mercadopago';

@Injectable()
export class PaymentsService {
  private readonly client: MercadoPagoConfig;

  constructor() {
    this.client = new MercadoPagoConfig({
      accessToken: process.env.PAYMENT_ACCESS_TOKEN ?? '',
      options: {
        timeout: 5000,
      },
    });
  }

  async payOrders(
    orders: IPaymentItems[],
    payer: IPayerPayment,
    options: IOptionsPayment,
  ) {
    try {
      const body = {
        items: orders.map((item) => ({
          id: item._id.toString(),
          title: item.name,
          currency_id: item.currency_id || 'MXN',
          quantity: item.quantity,
          unit_price: item.total / item.quantity,
        })),
        payer: {
          email: 'test_user_39316957@testuser.com',
          name: payer.username,
          address: {
            zip_code: payer.zipCode.toString(),
            street_name: payer.street,
            city_name: payer.municipality,
            state_name: payer.state,
            country_name: payer.country,
          },
        },
        back_urls: {
          success: process.env.BACKRULS_SUCCESS,
          failure: process.env.BACKRULS_FAILURE,
          pending: process.env.BACKRULS_PENDING,
        },
        external_reference: options.userId,
        binary_mode: true,
        shipments: {
          receiver_address: {
            zip_code: payer.zipCode.toString(),
            street_name: payer.street,
            city_name: payer.municipality,
            state_name: payer.state,
            country_name: payer.country,
          },
        },
      };

      const preference = new Preference(this.client);
      return await preference.create({ body });
    } catch (error) {
      console.error('Error al crear el preferenceId', error);
    }
  }
}
