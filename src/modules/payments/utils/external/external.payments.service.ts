import { Injectable } from '@nestjs/common';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { ResponseService } from 'src/modules/utils/services/response.service';
import {
  InterfaceItemsPaymet,
  InterfacePayerPayment,
} from '../../interface/payment.interfac';
import { ExternalProductsService } from 'src/modules/products/utils/external/external.products.service';
import { OrderSchema } from 'src/modules/orders/schema/orders.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaymentCredentialsSchema } from '../../schema/payment.credentials.schema';

@Injectable()
export class ExternalPaymentsService {
  private readonly client: MercadoPagoConfig;

  constructor(
    @InjectModel('credentials_payment')
    private readonly paymentsCredentialsModel: Model<PaymentCredentialsSchema>,
    private readonly responseService: ResponseService,
    private readonly productsService: ExternalProductsService,
  ) {}

  private async getAccessTokenForBusiness(businessId: string) {
    return await this.paymentsCredentialsModel.findOne({
      businessId: businessId,
    });
  }

  async createPreference(
    orders: InterfaceItemsPaymet[],
    payer: InterfacePayerPayment,
    businessId: string,
  ) {
    const totalAmount = orders.reduce((acc, item) => acc + item.price, 0);
    const credentials = await this.getAccessTokenForBusiness(businessId);
    const accessToken = credentials?.accessToken;

    if (!accessToken) {
      return this.responseService.error(
        400,
        'No se encontró access_token para el negocio.',
      );
    }

    try {
      const mpClient = new MercadoPagoConfig({ accessToken });
      const preference = new Preference(mpClient);

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
        _id: order._id!.toString(),
        name: product.name,
        price: order.total / order.quantity,
        quantity: order.quantity,
      };

      arrayForPreferenceId.push(newDocument);
    }

    return arrayForPreferenceId;
  }
}
