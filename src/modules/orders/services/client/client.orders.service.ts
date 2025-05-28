import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { OrderSchema } from '../../schema/orders.schema';
import { ResponseService } from 'src/modules/utils/services/response.service';
import { ClientOrdersServiceInterface } from '../../interface/services/client.orders.interface';
import { InternalCommonOrdersService } from '../../utils/internal/common/internal.common.orders.service';
import { ExternalShoppingsService } from 'src/modules/shoppings/utils/external/external.shoppings.service';
import { ExternalPaymentsService } from 'src/modules/payments/utils/external/external.payments.service';
import { ExternalUsersService } from 'src/modules/users/utils/external/external.users.service';

@Injectable()
export class ClientOrdersService implements ClientOrdersServiceInterface {
  constructor(
    @InjectModel('Orders') private readonly ordersModel: Model<OrderSchema>,
    private readonly responseService: ResponseService,
    private readonly shoppingsService: ExternalShoppingsService,
    private readonly paymentsService: ExternalPaymentsService,
    private readonly internalService: InternalCommonOrdersService,
    private readonly usersService: ExternalUsersService,
  ) {}

  private readonly limitDocuments = 10;

  async historyOrders(userId: string, offset: string, limit?: number) {
    const orders = await this.ordersModel
      .find(
        { userId: new Types.ObjectId(userId) },
        { quantity: 1, total: 1, date: 1, businessId: 1, productId: 1 },
      )
      .populate('businessId', 'name')
      .populate('productId', 'name image')
      .limit(limit ?? this.limitDocuments)
      .skip(parseInt(offset, 10));

    if (!orders || orders.length === 0)
      return this.responseService.error(404, 'Pedidos no encontrados.');

    return this.responseService.success(200, 'Pedidos encontrados.', orders);
  }

  async realizeOrdersFromCart(userId: string) {
    const shoppings = await this.shoppingsService.getShoppingsFromCart(userId);
    if (!shoppings || shoppings.length === 0)
      return this.responseService.error(404, 'Compras no encontradas.');

    const ordersCreated =
      await this.internalService.createArrayDocuments(shoppings);

    const OrdersSaved = await this.ordersModel.insertMany(ordersCreated);
    const plainOrders = OrdersSaved.map((doc) => doc.toObject() as OrderSchema);

    const newArray =
      await this.paymentsService.createArrayForPreference(plainOrders);

    const user = await this.usersService.getInfoPayer(userId);

    // const preferenceId = await this.paymentsService.createPreference(
    //   newArray,
    //   user,
    // );

    await this.shoppingsService.deleteShoppingsFromCart(userId);

    return this.responseService.success(
      201,
      'Pedidos creados exitosamente.',
      // preferenceId,
    );
  }
}
