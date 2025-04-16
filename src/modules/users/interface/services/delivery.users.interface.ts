import { CommonResponseInterface } from 'src/interface/response.interface';

/**
 * Interface defining the structure for delivery user operations.
 */
export interface DeliveryUserServiceInterface {
  /**
   * Retrieves complete user information.
   *
   * @param {string} userId - ID used to find the user in the database.
   * @returns {Promise<CommonResponseInterface>} - Common response interface with user details.
   */
  getInfo(userId: string): Promise<CommonResponseInterface>;

  /**
   * Retrieves the user's name and ID.
   *
   * @param {string} userId - ID used to find the user in the database.
   * @returns {Promise<CommonResponseInterface>} - Common response interface with user name and ID.
   */
  getName(userId: string): Promise<CommonResponseInterface>;
}
