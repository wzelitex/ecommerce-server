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

  async getAboutBusiness(id: string, type: 'short' | 'large') {
    const Id = new Types.ObjectId(id);

    if (type === 'short') {
      return this.businessModel.findById(Id, { _id: 0, values: 1 });
    }

    return this.businessModel.findById(Id, {
      aboutUs: 1,
      values: 1,
      exteriorImage: 1,
      interiorImage: 1,
    });
  }
}
