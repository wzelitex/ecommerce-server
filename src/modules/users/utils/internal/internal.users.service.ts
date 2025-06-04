import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserBusinessSchema } from '../../schema/users.schema';

@Injectable()
export class InternalUsersService {
  constructor(
    @InjectModel('Business')
    private readonly businessModel: Model<UserBusinessSchema>,
  ) {}

  async getHeaderData(id: string) {
    return this.businessModel.findById(new Types.ObjectId(id), {
      name: 1,
      image: 1,
      _id: 1,
      description: 1,
      street: 1,
      state: 1,
      cologne: 1,
      municipality: 1,
      country: 1,
      number: 1,
      zipCode: 1,
      facebook: 1,
      tiktok: 1,
      twitter: 1,
      instagram: 1,
    });
  }
}
