import { CommonResponseInterface } from 'src/interface/response.interface';
import { BusinessInterface } from '../users.interface';

/**
 * Interface defining the structure for business user operations.
 */
export interface BusinessUsersServiceInterface {
  /**
   * Retrieves the email of a business user.
   *
   * @param {string} userId - ID of the user.
   * @returns {Promise<CommonResponseInterface>} - Response containing the user's email.
   */
  getEmail(userId: string): Promise<CommonResponseInterface>;

  /**
   * Retrieves complete information about a business user.
   *
   * @param {string} userId - ID of the user.
   * @returns {Promise<CommonResponseInterface>} - Response with user details.
   */
  getInfo(userId: string): Promise<CommonResponseInterface>;

  /**
   * Retrieves a paginated list of businesses.
   *
   * @param {string} offset - The pagination offset.
   * @returns {Promise<CommonResponseInterface>} - Response with the list of businesses.
   */
  getBusiness(offset: string): Promise<CommonResponseInterface>;

  /**
   * Updates user information.
   *
   * @param {string} id - ID of the user.
   * @param {UsersInterface} data - Data to update.
   * @returns {Promise<CommonResponseInterface>} - Response indicating success or failure.
   */
  putInfo(
    id: string,
    data: BusinessInterface,
  ): Promise<CommonResponseInterface>;

  /**
   *  Add info location business
   *
   *  @param {any} data - data location business
   *  @param {string} userId - id to update the document business
   *
   *  @return {Promise<CommonResponseInterface>} - Resposne indicating success or failure
   *  **/
  postAddLocation(data: any, userId: string): Promise<CommonResponseInterface>;

  /**
   *  Add info location business
   *
   *  @param {any} data - data location business
   *  @param {string} userId - id to update the document business
   *
   *  @return {Promise<CommonResponseInterface>} - Resposne indicating success or failure
   *  **/
  postAddDataSection(
    data: any,
    userId: string,
  ): Promise<CommonResponseInterface>;

  /**
   * Retrieves basic header data for a business user.
   *
   * @param {string} id - ID of the user.
   * @returns {Promise<{ name: string; image: string }>} - Response with name and image.
   */
  getHeaderData(id: string): Promise<{ name: string; image: string }>;

  /**
   * Searches businesses by name.
   *
   * @param {string} text - The search query.
   * @param {string} offset - The pagination offset.
   * @returns {Promise<Array<{ name: string; image: string; _id: string }>>} - List of matching businesses.
   */
  getBusinessSearcher(
    text: string,
    offset: string,
  ): Promise<Array<{ name: string; image: string; _id: string }>>;

  /**
   * Retrieves a random list of businesses.
   *
   * @returns {Promise<Array<{ name: string; image: string; _id: string }>>} - Randomly selected businesses.
   */
  getRandomBusiness(): Promise<
    Array<{ name: string; image: string; _id: string }>
  >;
}
