import { Injectable } from '@nestjs/common';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { ResponseService } from 'src/modules/utils/services/response.service';
import {
  InterfaceItemsPaymet,
  InterfacePayerPayment,
} from '../../interface/payment.interfac';
import { ExternalProductsService } from 'src/modules/products/utils/external/external.products.service';
import { OrderSchema } from 'src/modules/orders/schema/orders.schema';

@Injectable()
export class ExternalPaymentsService {
  private readonly client: MercadoPagoConfig;

  constructor(
    private readonly responseService: ResponseService,
    private readonly productsService: ExternalProductsService,
  ) {}

  async createPreference(
    orders: InterfaceItemsPaymet[],
    payer: InterfacePayerPayment,
  ) {
    /* total calculated */
    const totalAmount = orders.reduce((acc, item) => acc + item.price, 0);

    try {
      const body = {
        items: orders.map((item) => ({
          title: item.name,
          unit_price: item.price / item.quantity,
          quantity: item.quantity,
          currency_id: item.currency_id || 'MXN',
          id: item._id,
        })),
        payer: {
          email: payer.email,
          name: payer.name,
          address: {
            zip_code: payer.zipCode,
            street_name: payer.street,
            city_name: payer.municipality,
            state_name: payer.state,
            country_name: payer.country,
          },
        },
        back_urls: {
          success: 'http://localhost:3000/success',
          failure: 'http://localhost:3000/failure',
          pending: 'http://localhost:3000/pending',
        },
        auto_return: 'approved',
        external_reference: orders.map((item) => item._id).join(','),
        binary_mode: true,
        application_fee: totalAmount * 0.08,
        shipments: {
          receiver_address: {
            zip_code: payer.zipCode,
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
      this.responseService.error(
        500,
        'Error al crear la preferencia de pago.',
        error,
      );
    }
  }

  async createArrayForPreference(data: OrderSchema[]) {
    const arrayForPreferenceId: InterfaceItemsPaymet[] = [];

    for (const order of data) {
      const product =
        await this.productsService.getInfoProductRealizePrefereceId(
          order.productId.toString(),
        );
      if (!product) continue;

      const newDocument: InterfaceItemsPaymet = {
        _id: order._id.toString(),
        name: product.name,
        price: order.total / order.quantity,
        quantity: order.quantity,
      };

      arrayForPreferenceId.push(newDocument);
    }

    return arrayForPreferenceId;
  }
}
