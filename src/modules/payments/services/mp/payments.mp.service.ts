import { Injectable } from '@nestjs/common';
import { PaymentsServiceInterface } from '../../interface/payment.service.interface';

@Injectable()
export class PaymentsMPService implements PaymentsServiceInterface {
  webHookMP(data: any) {
    console.log('Respuesta: ', data);

    return { success: true };
  }
}
