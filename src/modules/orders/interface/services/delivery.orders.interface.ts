import { CommonResponseInterface } from 'src/interface/response.interface';

/**
 * @interface DeliveryOrderServiceInterface
 * Defines the methods for managing orders in the delivery platform.
 */
export type DeliveryOrderServiceInterface = {
  /**
   * Retrieves published orders available for delivery personnel.
   *
   * @param {string} offset - Number of orders to skip for pagination (lazy loading).
   * @returns {Promise<CommonResponse>} - Response containing the list of published orders.
   */
  getOrdersPublished(offset: string): Promise<CommonResponseInterface>;

  /**
   * Retrieves the order history for a specific delivery person.
   *
   * @param {string} userId - ID of the delivery person.
   * @param {string} offset - Number of items to skip for pagination.
   * @param {string} page - Current page number.
   * @returns {Promise<CommonResponseInterface>} - Response containing the list of historical orders.
   */
  getOrdersHistory(
    userId: string,
    offset: string,
    page: string,
  ): Promise<CommonResponseInterface>;

  /**
   * Retrieves details of a specific published order.
   *
   * @param {string} id - ID of the order.
   * @param {string} deliveryId - ID of the delivery person requesting details.
   * @returns {Promise<CommonResponseInterface>} - Response containing order details.
   */
  getDetailsOrderPublished(
    id: string,
    deliveryId: string,
  ): Promise<CommonResponseInterface>;

  /**
   * Submits a delivery offer for a specific order.
   *
   * @param {string} deliveryId - ID of the delivery person making the offer.
   * @param {string} orderId - ID of the order for which the offer is made.
   * @param {number} price - Price offered for the delivery.
   * @returns {Promise<CommonResponseInterface>} - Response confirming the offer submission.
   */
  postOffersDelivery(
    deliveryId: string,
    orderId: string,
    price: string,
  ): Promise<CommonResponseInterface>;
};
