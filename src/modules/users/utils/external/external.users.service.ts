import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SanitizeService } from 'src/modules/utils/services/sanitize.service';
import {
  UserBaseSchema,
  UserBusinessSchema,
  UserClientSchema,
  UserDeliverySchema,
} from '../../schema/users.schema';
import {
  CreateUserInterface,
  CreateUserInterfaceDocument,
} from '../../interface/users.interface';

@Injectable()
export class ExternalUsersService {
  constructor(
    @InjectModel('Users') private readonly usersModel: Model<UserBaseSchema>,
    @InjectModel('Client')
    private readonly clientModel: Model<UserClientSchema>,
    @InjectModel('Business')
    private readonly businessModel: Model<UserBusinessSchema>,
    @InjectModel('Delivery')
    private readonly deliveryModel: Model<UserDeliverySchema>,
    private readonly sanitizeService: SanitizeService,
  ) {}

  async createBusiness(
    data: CreateUserInterface,
  ): Promise<CreateUserInterfaceDocument> {
    this.sanitizeService.sanitizeString(data.name);
    this.sanitizeService.sanitizeString(data.email);

    const newDocument = new this.businessModel(data);
    await newDocument.save();

    return newDocument.toObject() as unknown as CreateUserInterfaceDocument;
  }

  async createClient(data: CreateUserInterface) {
    this.sanitizeService.sanitizeString(data.name);
    this.sanitizeService.sanitizeString(data.email);

    const newDocument = new this.clientModel(data);
    await newDocument.save();

    return newDocument.toObject() as unknown as CreateUserInterfaceDocument;
  }

  async createDelivery(data: CreateUserInterface) {
    this.sanitizeService.sanitizeString(data.name);
    this.sanitizeService.sanitizeString(data.email);

    const newDocument = new this.deliveryModel(data);
    await newDocument.save();

    return newDocument.toObject() as unknown as CreateUserInterfaceDocument;
  }

  async getUserInfoForCreateOrders(userId: string) {
    return await this.clientModel.findById(new Types.ObjectId(userId), {
      name: 1,
      email: 1,
      phone: 1,
      lada: 1,
      street: 1,
      cologne: 1,
      zipCode: 1,
      state: 1,
      number: 1,
      municipality: 1,
      country: 1,
    });
  }
  async getUserIdById(id: string) {
    return await this.usersModel.findOne(
      { userId: new Types.ObjectId(id) },
      {
        userId: 1,
        _id: 0,
      },
    );
  }

  async getInfoPayer(id: string) {
    return this.clientModel.findById(id, {
      name: 1,
      email: 1,
      phone: 1,
      lada: 1,
      street: 1,
      cologne: 1,
      zipCode: 1,
      state: 1,
      number: 1,
      municipality: 1,
      country: 1,
    });
  }
}
