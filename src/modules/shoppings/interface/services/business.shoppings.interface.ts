import { CommonResponseInterface } from 'src/interface/response.interface';

/**
 * Interface defining the structure for Business Shopping operations.
 */
export interface BusinessShoppingsServiceInterface {
  /**
   * Retrieves all sales associated with a business.
   * @param id - The business ID.
   * @param offset - The number of records to skip.
   * @param limit - Optional limit on the number of records returned.
   * @returns A response containing a list of sales.
   */
  findAll(
    id: string,
    offset: string,
    limit?: number,
  ): Promise<CommonResponseInterface>;

  /**
   * Retrieves details of a specific sale by its ID.
   * @param id - The sale ID.
   * @returns A response containing the sale details.
   */
  findOne(id: string): Promise<CommonResponseInterface>;
}
