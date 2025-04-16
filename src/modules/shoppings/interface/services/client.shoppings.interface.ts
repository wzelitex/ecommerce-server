import { CommonResponseInterface } from 'src/interface/response.interface';
import { CreateShoppingInterface } from '../shoppings.interface';

/**
 * Interface defining the structure for Client Shopping operations.
 */
export interface ClientShoppingsServiceInterface {
  /**
   * Retrieves all shopping cart items for a given user.
   * @param id - The user ID.
   * @returns A response containing the shopping cart items.
   */
  findShoppingCart(id: string): Promise<CommonResponseInterface>;

  /**
   * Retrieves the shopping history for a user with pagination.
   * @param userId - The user ID.
   * @param offset - The number of records to skip for pagination.
   * @returns A response containing the shopping history.
   */
  findShoppingsHistory(
    userId: string,
    offset: string,
  ): Promise<CommonResponseInterface>;

  /**
   * Adds a product to the user's shopping cart.
   * @param userId - The user ID.
   * @param data - The shopping details, including product ID and quantity.
   * @returns A response indicating the success or failure of the operation.
   */
  addShoppingCart(
    userId: string,
    data: CreateShoppingInterface,
  ): Promise<CommonResponseInterface>;

  /**
   * Removes a product from the user's shopping cart.
   * @param id - The shopping item ID.
   * @returns A response indicating whether the item was successfully removed.
   */
  deleteShoppingFromCart(id: string): Promise<CommonResponseInterface>;
}
