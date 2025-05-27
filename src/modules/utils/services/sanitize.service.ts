import { Injectable } from '@nestjs/common';
import * as sanitize from 'sanitize-html';
import { SanitizeServiceInterface } from '../interfaces/services/utils.interface';

@Injectable()
export class SanitizeService implements SanitizeServiceInterface {
  sanitizeString(value: string): string {
    return sanitize(value) as string;
  }

  sanitizeArray(value: string[]): string[] {
    if (!Array.isArray(value)) {
      throw new Error('Input value must be an array of strings');
    }
    return value.map((val) => this.sanitizeString(val));
  }

  sanitizeObject<T>(value: Record<string, T>): T {
    if (typeof value !== 'object' || value === null) {
      throw new Error('Input value must be an object');
    }

    const objectSanitized: Record<string, T> = {} as Record<string, T>;

    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        const val = value[key];

        if (typeof val === 'string') {
          objectSanitized[key] = this.sanitizeString(val) as T;
        } else if (typeof val === 'number') {
          objectSanitized[key] = val;
        }
      }
    }
    return objectSanitized as T;
  }

  sanitizeAllString<T extends Record<string, any>>(data: T): T {
    const sanitizedData: Record<string, any> = {};

    for (const key in data) {
      if (typeof data[key] === 'string') {
        sanitizedData[key] = this.sanitizeString(data[key]);
      } else {
        sanitizedData[key] = data[key]; // mantiene el valor si no es string
      }
    }

    return sanitizedData as T;
  }
}
