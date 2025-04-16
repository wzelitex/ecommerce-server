import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { OrderSchema } from '../../../schema/orders.schema';
import { InjectModel } from '@nestjs/mongoose';
import { OrdersInterfaceIdPopulated } from '../../../interface/orders.interface';
import { InterfaceItemsPaymet } from 'src/modules/payments/interface/payment.interfac';
import { ExternalUsersService } from 'src/modules/users/utils/external/external.users.service';

@Injectable()
export class InternalSpecialOrdersService {
  constructor(
    @InjectModel('Orders') private readonly ordersModel: Model<OrderSchema>,
    private readonly usersService: ExternalUsersService,
  ) {}

  async createObjectPreferenceId(
    data: OrdersInterfaceIdPopulated[],
    userId: string,
  ): Promise<InterfaceItemsPaymet[]> {
    const user = await this.usersService.getUserInfoForCreateOrders(userId);
    if (!user) return;

    return data.map((item) => ({
      _id: item._id,
      name: item.productId.name,
      price: item.productId.price,
      quantity: item.quantity,
    }));
  }
}
