import { CommonResponseInterface } from 'src/interface/response.interface';
import { ClientInterface } from '../../interface/users.interface';
import { UpdateUsersDto } from '../../dto/update.users.dto';

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
    data: UpdateUsersDto,
  ): Promise<CommonResponseInterface>;

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
