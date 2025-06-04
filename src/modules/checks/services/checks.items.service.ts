import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ChecksItemsSchema } from '../schema/checks.items.schema';
import { OrdersInterfaceIdPopulated } from 'src/modules/orders/interface/orders.interface';

@Injectable()
export class ChecksItemsService {
  constructor(
    @InjectModel('CheckItem')
    private readonly checkItemsModel: Model<ChecksItemsSchema>,
  ) {}

  async createCheckItem(checkId: string, order: OrdersInterfaceIdPopulated) {
    const newItem = new this.checkItemsModel({
      checkId: new Types.ObjectId(checkId),
      businessId: order.businessId._id,
      orderId: order._id,
      totalAmount: order.total,
      totalPieces: order.quantity,
    });

    await newItem.save();
  }

  async getCheckItemsByCheckId(id: string) {
    return await this.checkItemsModel
      .find({ checkId: new Types.ObjectId(id) })
      .populate('businessId', 'name')
      .populate({
        path: 'orderId',
        select: 'productId',
        populate: {
          path: 'productId',
          select: 'name',
        },
      })
      .lean();
  }
}
