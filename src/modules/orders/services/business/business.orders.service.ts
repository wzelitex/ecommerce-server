import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { OrderSchema } from '../../schema/orders.schema';
import { ResponseService } from 'src/modules/utils/services/response.service';
import { OrdersOffersSchema } from '../../schema/orders.offers.schema';
import { BusinessOrdersServiceInterface } from '../../interface/services/business.orders.interface';

@Injectable()
export class BusinessOrdersService implements BusinessOrdersServiceInterface {
  constructor(
    @InjectModel('Orders') private readonly ordersModel: Model<OrderSchema>,
    @InjectModel('Orders_offers')
    private readonly ordersOffersModel: Model<OrdersOffersSchema>,
    private readonly responseService: ResponseService,
  ) {}

  private readonly limitDocument = 10;

  async getOrders(
    userId: string,
    offset: string,
    type: 'canceled' | 'pending' | 'published',
    limit?: number,
  ) {
    const orders = await this.ordersModel
      .find({ businessId: new Types.ObjectId(userId), stateOrder: type })
      .limit(limit ?? this.limitDocument)
      .skip(parseInt(offset, 10))
      .populate('productId', 'name image price')
      .populate('userId', 'name');

    if (!orders || orders.length === 0)
      return this.responseService.error(404, 'Pedidos no encontrados.');
    return this.responseService.success(200, 'Pedidos encontrados.', orders);
  }

  async getOrdersOffers(id: string) {
    const offers = await this.ordersOffersModel
      .find({
        orderId: new Types.ObjectId(id),
      })
      .populate('deliveryId', 'name image')
      .populate({
        path: 'orderId',
        populate: {
          path: 'productId',
          select: 'name',
        },
      });

    if (offers.length === 0) {
      return this.responseService.error(404, 'Ofertas no encontradas.');
    }

    return this.responseService.success(200, ' Ofertas encontradas.', offers);
  }

  async findById(id: string) {
    const order = await this.ordersModel
      .findById(new Types.ObjectId(id))
      .populate(
        'userId',
        'name phone email lada street cologne country state zipCode municipality',
      )
      .populate('productId', 'name image color');
    if (!order) this.responseService.error(404, 'Pedido no encontrado.');
    return this.responseService.success(200, 'Pedido encontrado.', order);
  }

  async publishedOrder(id: string) {
    const order = await this.ordersModel.findByIdAndUpdate(id, {
      stateOrder: 'published',
    });

    if (!order) return this.responseService.error(404, 'Pedido no encontrado.');
    return this.responseService.success(200, 'Pedido publicado correctamente.');
  }

  async cancelOrder(id: string) {
    const order = await this.ordersModel.findByIdAndUpdate(id, {
      stateOrder: 'canceled',
    });

    if (!order) return this.responseService.error(404, 'Pedido no encontrado.');
    return this.responseService.success(200, 'Pedido cancelado correctamente.');
  }

  async acceptDeliveryOffer(id: string) {
    const order = await this.ordersOffersModel.findOneAndUpdate(
      { deliveryId: new Types.ObjectId(id) },
      { state: 'accepted' },
      { new: true },
    );

    if (!order)
      return this.responseService.error(404, 'Repartidor no encontrado.');

    await this.ordersOffersModel.deleteMany({ state: 'pending' });
    return this.responseService.success(200, 'Repartidor aceptado.');
  }
}
