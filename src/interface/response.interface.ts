/**
 * @interface CommonResponseInterface
 * Represents a standard response for service operations.
 */
export interface CommonResponseInterface<T = any> {
  /** Indicates whether the operation was successful. */
  success: boolean;
  /** HTTP status code of the response. */
  status: number;
  /** Descriptive message of the response. */
  message: string;
  /** Optional data returned in the response. */
  data?: T;
}
