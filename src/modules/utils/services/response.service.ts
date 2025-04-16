import { Injectable } from '@nestjs/common';
import { ResponseServiceInterface } from '../interfaces/services/utils.interface';

@Injectable()
export class ResponseService implements ResponseServiceInterface {
  success<T>(status: number, message: string, data?: T) {
    return {
      success: true,
      status: status,
      message: message,
      data: data,
    };
  }

  error<T>(status: number, message: string, data?: T) {
    return {
      success: false,
      status: status,
      message: message,
      data: data,
    };
  }
}
