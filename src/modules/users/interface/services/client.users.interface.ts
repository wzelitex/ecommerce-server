import { CommonResponseInterface } from 'src/interface/response.interface';
import { ClientInterface } from '../../interface/users.interface';
import { UserBusinessSchema } from '../../schema/users.schema';

/**
 * Interface defining the structure for client user operations.
 */
export interface ClientUsersServiceInterface {
  /**
   * Retrieves the email of a client user.
   *
   * @param {string} id - ID of the client user.
   * @returns {Promise<CommonResponseInterface>} - Response containing the user's email.
   */
  getEmail(id: string): Promise<CommonResponseInterface>;

  /**
   * Retrieves complete information about a client user.
   *
   * @param {string} userId - ID of the client user.
   * @returns {Promise<CommonResponseInterface>} - Response with user details.
   */
  getInfo(userId: string): Promise<CommonResponseInterface>;

  /**
   * Updates client user information.
   *
   * @param {string} userId - ID of the client user.
   * @param {UsersInterface} data - Data to update.
   * @returns {Promise<CommonResponseInterface>} - Response indicating success or failure.
   */
  putInfo(
    userId: string,
    data: ClientInterface,
  ): Promise<CommonResponseInterface>;

  /**
   * Retrieves basic header data for a client user.
   *
   * @param {string} id - ID of the client user.
   * @returns {Promise<CommonResponseInterface>} - Response with name and image.
   */
  getHeaderData(id: string): Promise<CommonResponseInterface>;

  /**
   * Searches businesses by name.
   *
   * @param {string} text - The search query.
   * @param {string} offset - The pagination offset.
   * @returns {Promise<CommonResponseInterface>} - List of matching businesses.
   */
  getBusinessSearcher(
    text: string,
    offset: string,
  ): Promise<CommonResponseInterface>;

  /**
   *  Retrivies about-us data
   *
   * @param {string} id - id to search business document
   * @param {string} type - type of size of document
   *
   * @return {Promise<UserBusinessSchema>} - return data found
   * **/
  getAboutUsData(
    id: string,
    type: 'short' | 'large',
  ): Promise<CommonResponseInterface<UserBusinessSchema>>;

  /**
   * Retrieves a random list of businesses.
   *
   * @returns {Promise<CommonResponseInterface>} - Randomly selected businesses.
   */
  getRandomBusiness(): Promise<CommonResponseInterface>;

  /**
   * Retrieves business recommendations based on a client's purchase history.
   *
   * @param {string} id - ID of the client user.
   * @returns {Promise<CommonResponseInterface>} - List of recommended businesses.
   */
  getBusinessRecommend(id: string): Promise<CommonResponseInterface>;
}
