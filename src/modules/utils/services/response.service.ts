import { Injectable } from '@nestjs/common';
import { ResponseServiceInterface } from '../interfaces/services/utils.interface';
import { CommonResponseInterface } from 'src/interface/response.interface';

@Injectable()
export class ResponseService implements ResponseServiceInterface {
  success<T>(
    status: number,
    message: string,
    data?: T,
  ): CommonResponseInterface<T> {
    return {
      success: true,
      status: status,
      message: message,
      data: data,
    };
  }

  error<T>(
    status: number,
    message: string,
    data?: T,
  ): CommonResponseInterface<T> {
    return {
      success: false,
      status: status,
      message: message,
      data: data,
    };
  }
}
