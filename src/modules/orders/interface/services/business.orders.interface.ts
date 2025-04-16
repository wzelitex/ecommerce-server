import { CommonResponseInterface } from 'src/interface/response.interface';

/**
 * @interface BusinessOrdersServiceInterface
 * Defines methods for managing business orders.
 */
export type BusinessOrdersServiceInterface = {
  /**
   * Retrieves business orders based on their status.
   *
   * @param {string} userId - The ID of the business owner.
   * @param {string} offset - Number of items to skip for pagination.
   * @param {'canceled' | 'pending' | 'published'} type - The status of the orders to retrieve.
   * @param {number} [limit] - Optional limit on the number of orders returned.
   * @returns {Promise<CommonResponseInterface>} - A response containing the orders.
   */
  getOrders(
    userId: string,
    offset: string,
    type: 'canceled' | 'pending' | 'published',
    limit?: number,
  ): Promise<CommonResponseInterface>;

  /**
   * Retrieves offers for a specific order.
   *
   * @param {string} id - The ID of the order.
   * @returns {Promise<CommonResponseInterface>} - A response containing the offers.
   */
  getOrdersOffers(id: string): Promise<CommonResponseInterface>;

  /**
   * Finds an order by its ID.
   *
   * @param {string} id - The ID of the order.
   * @returns {Promise<CommonResponseInterface>} - A response containing the order details.
   */
  findById(id: string): Promise<CommonResponseInterface>;

  /**
   * Publishes an order, changing its status to 'published'.
   *
   * @param {string} id - The ID of the order to publish.
   * @returns {Promise<CommonResponseInterface>} - A response indicating the success of the operation.
   */
  publishedOrder(id: string): Promise<CommonResponseInterface>;

  /**
   * Cancels an order, changing its status to 'canceled'.
   *
   * @param {string} id - The ID of the order to cancel.
   * @returns {Promise<CommonResponseInterface>} - A response indicating the success of the operation.
   */
  cancelOrder(id: string): Promise<CommonResponseInterface>;

  /**
   * Accepts a delivery offer for an order.
   *
   * @param {string} id - The ID of the delivery offer.
   * @returns {Promise<CommonResponseInterface>} - A response indicating the success of the operation.
   */
  acceptDeliveryOffer(id: string): Promise<CommonResponseInterface>;
};
