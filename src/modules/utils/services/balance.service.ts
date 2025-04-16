import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BalanceSchema } from '../schema/balance.shcema';
import { BalanceInterfaceRequest } from '../interfaces/balance.interface';
import { BalanceServiceInterface } from '../interfaces/services/utils.interface';

@Injectable()
export class BalanceService implements BalanceServiceInterface {
  constructor(
    @InjectModel('Balance') private readonly balanceModel: Model<BalanceSchema>,
  ) {}

  private readonly limitDocuments = 10;

  public async createNewBalance(data: BalanceInterfaceRequest) {
    const newDocument = new this.balanceModel(data);
    return await newDocument.save();
  }

  public async getDocumentsBalanceByUserId(
    userId: string,
    offset: string,
  ): Promise<BalanceSchema[]> {
    return await this.balanceModel
      .find({
        userId: new Types.ObjectId(userId),
      })
      .skip(parseInt(offset))
      .limit(this.limitDocuments);
  }
}
