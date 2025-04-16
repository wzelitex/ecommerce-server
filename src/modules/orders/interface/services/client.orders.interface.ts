import { CommonResponseInterface } from 'src/interface/response.interface';
import { OrdersInterface } from '../orders.interface';

/**
 * @interface ClientOrdersServiceInterface
 * Defines the methods for managing client orders.
 */
export type ClientOrdersServiceInterface = {
  /**
   * Retrieves the history of orders for a given user.
   *
   * @param {string} userId - The ID of the user whose order history is being retrieved.
   * @param {string} offset - Number of items to skip for pagination.
   * @param {number} [limit] - Optional limit on the number of orders returned.
   * @returns {Promise<CommonResponseInterface>} - A response containing the order history.
   */
  historyOrders(
    userId: string,
    offset: string,
    limit?: number,
  ): Promise<CommonResponseInterface>;

  /**
   * Places orders from the user's shopping cart.
   *
   * @param {string} userId - The ID of the user placing the orders.
   * @returns {Promise<CommonResponseInterface>} - A response indicating the success or failure of the operation.
   */
  realizeOrdersFromCart(userId: string): Promise<CommonResponseInterface>;
};
