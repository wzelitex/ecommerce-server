import { CommonResponseInterface } from 'src/interface/response.interface';
import { ProductsShoeBasicInterface } from '../functions/business/business.functions.products.interface';

/**
 * Interface defining the methods for managing and retrieving client products.
 */
export interface ClientProductsServiceInterface {
  /**
   * Retrieves a random set of products.
   * @returns A promise resolving to a common response containing the products.
   */
  findProductsRandom(): Promise<CommonResponseInterface>;

  /**
   * Retrieves products associated with a specific business.
   * @param id - The business ID.
   * @param offset - The pagination offset.
   * @returns A promise resolving to a common response containing the products.
   */
  findProductsByBusinessId(
    id: string,
    offset: string,
  ): Promise<CommonResponseInterface>;

  /**
   * Retrieves recommended products based on the user's shopping history.
   * @param id - The user ID.
   * @returns A promise resolving to a common response containing recommended products.
   */
  findProductsRecommendSearcher(id: string): Promise<CommonResponseInterface>;

  /**
   * Searches for products based on a text query.
   * @param text - The search keyword.
   * @param offset - The pagination offset.
   * @returns A promise resolving to a common response containing matching products.
   */
  findProductsSearcher(
    text: string,
    offset: string,
  ): Promise<CommonResponseInterface>;

  /**
   * Retrieves products based on type and pagination parameters.
   * @param type - The product type.
   * @param offset - The pagination offset.
   * @param limit - (Optional) The number of products to retrieve.
   * @returns A promise resolving to a common response containing the products.
   */
  findProducts(
    type: string,
    offset: string,
    limit?: number,
  ): Promise<CommonResponseInterface>;

  /**
   * Retrieves a product by its unique identifier.
   * @param {string} id - The product ID.
   * @returns A promise resolving to a common response containing the product details.
   */
  findById(id: string): Promise<CommonResponseInterface>;

  /**
   *  Retrivies products best seller o products cheaper
   *
   * @param {string} businessId - businessId to search documents
   * @returns {Promise<CommonResponseInterface<CreateProductShoeInterface[]>>} - Response the products found
   * **/
  findProductsSellerOrCheaper(
    businessId: string,
  ): Promise<CommonResponseInterface<ProductsShoeBasicInterface[]>>;
}
