import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { OrderSchema } from '../../schema/orders.schema';
import { ResponseService } from 'src/modules/utils/services/response.service';
import { ClientOrdersServiceInterface } from '../../interface/services/client.orders.interface';
import { InternalCommonOrdersService } from '../../utils/internal/common/internal.common.orders.service';
import { ExternalShoppingsService } from 'src/modules/shoppings/utils/external/external.shoppings.service';
import {
  OrdersInterface,
  OrdersInterfaceIdPopulated,
} from '../../interface/orders.interface';
import { ChecksService } from 'src/modules/checks/services/checks.service';
import { PaymentsService } from 'src/modules/utils/services/payment.service';
import { ExternalUsersService } from 'src/modules/users/utils/external/external.users.service';

@Injectable()
export class ClientOrdersService implements ClientOrdersServiceInterface {
  constructor(
    @InjectModel('Orders') private readonly ordersModel: Model<OrderSchema>,
    private readonly responseService: ResponseService,
    private readonly shoppingsService: ExternalShoppingsService,
    private readonly internalService: InternalCommonOrdersService,
    private readonly checksService: ChecksService,
    private readonly paymentService: PaymentsService,
    private readonly externalUsersService: ExternalUsersService,
  ) {}

  private readonly limitDocuments = 10;

  async historyOrders(userId: string, offset: string, limit?: number) {
    const skip = parseInt(offset, 10) * this.limitDocuments;
    const docsLimit = limit ?? this.limitDocuments;

    const orders = await this.ordersModel
      .find(
        { userId: new Types.ObjectId(userId) },
        { quantity: 1, total: 1, date: 1, businessId: 1, productId: 1 },
      )
      .populate('businessId', 'name')
      .populate('productId', 'name image')
      .limit(docsLimit)
      .skip(skip);

    if (!orders || orders.length === 0)
      return this.responseService.error(404, 'Pedidos no encontrados.');

    return this.responseService.success(200, 'Pedidos encontrados.', orders);
  }

  async realizeOrdersFromCart(userId: string) {
    const shoppings = await this.shoppingsService.getShoppingsFromCart(userId);
    if (!shoppings || shoppings.length === 0)
      return this.responseService.error(404, 'Compras no encontradas.');

    const ordersCreated = await this.internalService.createArrayDocuments(
      shoppings as unknown as OrdersInterface[],
    );

    // create orders documents
    const OrdersSaved = (await this.ordersModel.insertMany(
      ordersCreated,
    )) as unknown as OrdersInterfaceIdPopulated[];

    const response = await this.checksService.postCreateCheck(OrdersSaved);

    // delete all shoppings from cart
    await this.shoppingsService.deleteShoppingsFromCart(userId);

    return this.responseService.success(
      201,
      'Pedidos creados exitosamente.',
      response,
    );
  }
}
