import { BalanceSchema } from '../../schema/balance.shcema';
import { BalanceInterfaceRequest } from '../balance.interface';

/**
 * Interface defining encryption-related operations.
 */
export interface EncryptServiceInterface {
  /**
   * Hashes a given value using bcrypt.
   *
   * @param {string} value - The value to be hashed.
   * @returns {Promise<string>} - The hashed value.
   */
  hasher(value: string): Promise<string>;

  /**
   * Compares a plain text value with a hashed value.
   *
   * @param {string} value - The plain text value.
   * @param {string} valueCompare - The hashed value to compare against.
   * @returns {Promise<boolean>} - True if they match, false otherwise.
   */
  compare(value: string, valueCompare: string): Promise<boolean>;
}

/**
 * Interface defining the operations for image-related services.
 */
export interface ImageServiceInterface {
  /**
   * Uploads a file to Google Cloud Storage and returns the file URL.
   *
   * @param {Express.Multer.File} body - The file to be uploaded.
   * @returns {Promise<string>} - The URL of the uploaded file.
   */
  uploadFile(body: Express.Multer.File): Promise<string>;
}

/**
 * Interface defining the structure for response services.
 */
export interface ResponseServiceInterface {
  /**
   * Generates a success response.
   *
   * @param {number} status - The status code of the response.
   * @param {string} message - The success message.
   * @param {T} [data] - Optional data to include in the response.
   * @returns {object} The response object.
   */
  success<T>(
    status: number,
    message: string,
    data?: T,
  ): { success: boolean; status: number; message: string; data?: T };

  /**
   * Generates an error response.
   *
   * @param {number} status - The status code of the response.
   * @param {string} message - The error message.
   * @param {T} [data] - Optional data to include in the response.
   * @returns {object} The response object.
   */
  error<T>(
    status: number,
    message: string,
    data?: T,
  ): { success: boolean; status: number; message: string; data?: T };
}

/**
 * Interface defining the structure for sanitize services.
 */
export interface SanitizeServiceInterface {
  /**
   * Sanitizes a string value to remove unwanted HTML elements.
   *
   * @param {string} value - The string to sanitize.
   * @returns {string} The sanitized string.
   */
  sanitizeString(value: string): string;

  /**
   * Sanitizes an array of string values.
   *
   * @param {string[]} value - The array of strings to sanitize.
   * @returns {string[]} The sanitized array of strings.
   */
  sanitizeArray(value: string[]): string[];

  /**
   * Sanitizes an object, sanitizing string values within it.
   *
   * @param {Record<string, T>} value - The object to sanitize.
   * @returns {T} The sanitized object.
   */
  sanitizeObject<T>(value: Record<string, T>): T;

  /**
   * Sanitizes all string values within an object.
   *
   * @param {T} data - The object to sanitize.
   * @returns {T} The object with sanitized string values.
   */
  sanitizeAllString<T>(data: T): T;
}

/**
 *  Interface defining the structure for Balance service
 * **/
export interface BalanceServiceInterface {
  /**
   * Create new register balance
   *
   * @param {BalanceInterfaceRequest} data - the object to contain the information to create new balance document
   * @return {Promise<BalanceSchema>} - return the document created
   * **/
  createNewBalance(data: BalanceInterfaceRequest): Promise<BalanceSchema>;

  /**
   *  Get balance document by userId
   *
   * @param {string} userId - id to search document by id
   * @param {string} offset - offset for lazy loading
   *
   * @return {Promise<BalanceSchema[]>} - return the documents found
   * **/
  getDocumentsBalanceByUserId(
    userId: string,
    offset: string,
  ): Promise<BalanceSchema[]>;
}
