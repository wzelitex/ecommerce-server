import { CommonResponseInterface } from 'src/interface/response.interface';
import { CreateProductShoeInterface } from '../functions/business/business.functions.products.interface';

/**
 * Interface defining the structure for Business Product operations.
 */
export interface BusinessProductsServiceInterface {
  /**
   * Retrieves all products belonging to a business.
   * @param id - The business ID.
   * @param offset - The number of records to skip.
   * @param isDeleted - Filter to retrieve deleted or active products.
   * @param limit - Optional limit on the number of records returned.
   * @returns A response containing a list of products.
   */
  findAll(
    id: string,
    offset: string,
    isDeleted: boolean,
    limit?: number,
  ): Promise<CommonResponseInterface>;

  /**
   * Retrieves a specific product by its ID.
   * @param id - The product ID.
   * @returns A response containing the product details.
   */
  findById(id: string): Promise<CommonResponseInterface>;

  /**
   * Updates an existing product.
   * @param id - The product ID.
   * @param data - The updated product data.
   * @param image - The product image file (optional).
   * @param userId - The ID of the user updating the product.
   * @returns A response indicating the success or failure of the operation.
   */
  putProduct(
    id: string,
    userId: string,
    data: CreateProductShoeInterface,
    // image: Express.Multer.File,
  ): Promise<CommonResponseInterface>;

  /**
   * Creates a new product for a business.
   * @param data - The product details.
   * @param file - The product image file.
   * @param businessId - The ID of the business adding the product.
   * @returns A response indicating the success or failure of the operation.
   */
  createProduct(
    businessId: string,
    data: CreateProductShoeInterface,
    file: Express.Multer.File,
  ): Promise<CommonResponseInterface>;

  /**
   * Marks a product as deleted.
   * @param id - The product ID.
   * @returns A response indicating whether the product was successfully deleted.
   */
  deleteProduct(id: string): Promise<CommonResponseInterface>;

  /**
   * Restores a previously deleted product.
   * @param id - The product ID.
   * @returns A response indicating whether the product was successfully restored.
   */
  postRestoreProduct(id: string): Promise<CommonResponseInterface>;
}
