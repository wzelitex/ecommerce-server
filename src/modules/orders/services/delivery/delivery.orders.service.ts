import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OrdersOffersSchema } from '../../schema/orders.offers.schema';
import { Model, Types } from 'mongoose';
import { ResponseService } from 'src/modules/utils/services/response.service';
import { OrderSchema } from '../../schema/orders.schema';
import { DeliveryOrderServiceInterface } from '../../interface/services/delivery.orders.interface';

@Injectable()
export class DeliveryOrdersService implements DeliveryOrderServiceInterface {
  constructor(
    @InjectModel('Orders_offers')
    private readonly ordersOffersModel: Model<OrdersOffersSchema>,
    @InjectModel('Orders') private readonly ordersModel: Model<OrderSchema>,
    private readonly responseService: ResponseService,
  ) {}

  private readonly limitDocuments = 10;

  async getOrdersPublished(offset: string) {
    const orders = await this.ordersModel
      .find(
        { stateOrder: 'published' },
        {
          _id: 1,
          businessId: 1,
          productId: 1,
          quantity: 1,
          date: 1,
        },
      )
      .populate('productId', 'name')
      .populate('businessId', 'name')
      .limit(this.limitDocuments)
      .skip(parseInt(offset));

    if (!orders || orders.length === 0)
      return this.responseService.error(404, 'Pedidos no encontrados.');

    return this.responseService.success(200, 'Pedidos encontrados.', orders);
  }

  async getOrdersHistory(userId: string, offset: string, page: string) {
    const orders = await this.ordersOffersModel.aggregate([
      { $match: { deliveryId: userId } },
      {
        $lookup: {
          from: 'businesses',
          localField: 'businessId',
          foreignField: '_id',
          as: 'businessId',
        },
      },
      {
        $lookup: {
          from: 'shoes',
          localField: 'productId',
          foreignField: '_id',
          as: 'productId',
        },
      },
      {
        $project: {
          _id: 1,
          price: 1,
          date: 1,
          'productId.name': 1,
          'businessId.name': 1,
        },
      },
      { $sort: { date: -1 } },
      { $limit: this.limitDocuments },
      { $skip: parseInt(offset) },
    ]);

    if (orders.length === 0)
      return this.responseService.error(404, 'Pedidos no encontrados.');
    return this.responseService.success(200, 'Pedidos encontrados.', orders);
  }

  async getDetailsOrderPublished(id: string, deliveryId: string) {
    const order = await this.ordersModel
      .findById(id, { productId: 1, userId: 1, businessId: 1, quantity: 1 })
      .populate('productId', 'image name')
      .populate('userId', 'street cologne municipality state country')
      .populate('businessId', 'street cologne country state municipality ');

    if (!order) return this.responseService.error(404, 'Pedido no encontrado');

    const offer = await this.ordersOffersModel.findOne({
      orderId: new Types.ObjectId(id),
      deliveryId: new Types.ObjectId(deliveryId),
      userId: order.userId._id,
    });

    return this.responseService.success(200, 'Pedido encontrado.', {
      order: order,
      offer: offer,
    });
  }

  async postOffersDelivery(deliveryId: string, orderId: string, price: number) {
    const order = await this.ordersModel.findById(orderId, {
      businessId: 1,
      _id: 1,
      userId: 1,
    });

    const newOrderOffer = new this.ordersOffersModel({
      businessId: new Types.ObjectId(order.businessId),
      deliveryId: new Types.ObjectId(deliveryId),
      userId: new Types.ObjectId(order.userId),
      orderId: order._id,
      price: price,
    });

    await newOrderOffer.save();

    return this.responseService.success(
      200,
      'Oferta creada exitosamente.',
      price,
    );
  }
}
