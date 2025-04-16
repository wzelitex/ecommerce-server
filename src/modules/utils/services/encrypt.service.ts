import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { EncryptServiceInterface } from '../interfaces/services/utils.interface';

@Injectable()
export class EncryptService implements EncryptServiceInterface {
  private readonly salt = 10;

  private async generateSalt() {
    return await bcrypt.genSalt(this.salt);
  }

  async hasher(value: string) {
    const saltGenerated = await this.generateSalt();
    return bcrypt.hash(value, saltGenerated);
  }

  async compare(value: string, valueCompare: string) {
    return bcrypt.compare(value, valueCompare);
  }
}
