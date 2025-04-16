/**
 *  Defining the structure to payment service
 * **/
export interface PaymentsServiceInterface {
  /**
   *  endpoint web hook mercado pago
   *
   * @param {any} data - response MP to action of payment
   * @return {boolean} - response server to MP
   * **/
  webHookMP(data: any): Record<string, boolean>;
}
