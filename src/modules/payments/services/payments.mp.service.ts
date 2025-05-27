import { Injectable, Query } from '@nestjs/common';
import { PaymentsServiceInterface } from '../interface/payment.service.interface';
import { ResponseService } from 'src/modules/utils/services/response.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PaymentCredentialsSchema } from '../schema/payment.credentials.schema';
import { InterfacePaymentCredentials } from '../interface/payment.interfac';
import axios from 'axios';

@Injectable()
export class PaymentsMPService implements PaymentsServiceInterface {
  constructor(
    @InjectModel('credentials_payment')
    private readonly paymentCredentailsModel: Model<PaymentCredentialsSchema>,
    private readonly responseService: ResponseService,
  ) {}

  webHookMP(data: any) {
    return this.responseService.success(200, 'Web hook succesfully.');
  }

  async mercadoPagoCallback(@Query('code') code: string, businessId: string) {
    const url = 'https://api.mercadopago.com/oauth/token';

    try {
      const response = await axios.post<InterfacePaymentCredentials>(url, {
        client_secret: process.env.MP_CLIENT_SECRET,
        client_id: process.env.MP_CLIENT_ID,
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.MP_REDIRECT_URI,
      });

      await this.saveMercadoPagoCredentials({
        ...response.data,
        businessId: businessId,
      });

      return this.responseService.success(200, 'Get code succesfuly');
    } catch (error) {
      throw new Error(
        'No se pudo conectar la cuenta de Mercado Pago',
        error as Error,
      );
    }
  }

  redirectToMercadoPago() {
    const redirectUri = process.env.MP_REDIRECT_URI;
    const clientId = process.env.MP_CLIENT_ID;

    const authUrl = `https://auth.mercadopago.com.ar/authorization?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}`;

    return this.responseService.success(200, 'Redirect user', authUrl);
  }

  private async saveMercadoPagoCredentials(data: InterfacePaymentCredentials) {
    const filter = { businessId: new Types.ObjectId(data.businessId) };
    const update = {
      ...data,
      businessId: new Types.ObjectId(data.businessId),
    };

    return await this.paymentCredentailsModel.findOneAndUpdate(filter, update, {
      upsert: true,
      new: true,
    });
  }
}
