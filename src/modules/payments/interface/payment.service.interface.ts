import { CommonResponseInterface } from 'src/interface/response.interface';

/**
 *  Defining the structure to payment service
 * **/
export interface PaymentsServiceInterface {
  /**
   *  endpoint web hook mercado pago
   *
   * @param {any} data - response MP to action of payment
   * **/
  webHookMP(data: any): CommonResponseInterface;
}
