import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OrdersOffersSchema } from '../../schema/orders.offers.schema';
import { Model, Types } from 'mongoose';
import { ResponseService } from 'src/modules/utils/services/response.service';
import { OrderSchema } from '../../schema/orders.schema';
import { DeliveryOrderServiceInterface } from '../../interface/services/delivery.orders.interface';
import { ExternalShoppingsService } from 'src/modules/shoppings/utils/external/external.shoppings.service';
import { OrdersDelivery } from '../../interface/orders.interface';

@Injectable()
export class DeliveryOrdersService implements DeliveryOrderServiceInterface {
  constructor(
    @InjectModel('Orders_offers')
    private readonly ordersOffersModel: Model<OrdersOffersSchema>,
    @InjectModel('Orders') private readonly ordersModel: Model<OrderSchema>,
    private readonly responseService: ResponseService,
    private readonly externalShoppingsService: ExternalShoppingsService,
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
      .skip(parseInt(offset))
      .lean();

    if (!orders || orders.length === 0)
      return this.responseService.error(404, 'Pedidos no encontrados.');

    return this.responseService.success(200, 'Pedidos encontrados.', orders);
  }

  async getOrdersHistory(userId: string, offset: string) {
    const orders = await this.ordersOffersModel
      .find(
        { deliveryId: new Types.ObjectId(userId), state: 'completed' },
        { deliveryId: 0, state: 0 },
      )
      .populate('businessId', 'name')
      .populate({
        path: 'orderId',
        populate: {
          path: 'productId',
          select: 'name',
        },
      })
      .skip(parseInt(offset))
      .limit(15)
      .lean();

    if (orders.length === 0)
      return this.responseService.error(404, 'Pedidos no encontrados.');
    return this.responseService.success(200, 'Pedidos encontrados.', orders);
  }

  async getDetailsOrderPublished(id: string, deliveryId: string) {
    const order = await this.ordersModel
      .findById(id, {
        productId: 1,
        userId: 1,
        businessId: 1,
        quantity: 1,
      })
      .populate('productId', 'image name price')
      .populate('userId', 'street cologne municipality state country')
      .populate('businessId', 'street cologne country state municipality ')
      .lean();

    if (!order) return this.responseService.error(404, 'Pedido no encontrado');

    const offer = await this.ordersOffersModel
      .findOne(
        {
          orderId: new Types.ObjectId(id),
          deliveryId: new Types.ObjectId(deliveryId),
          userId: order.userId._id,
        },
        { price: 1 },
      )
      .populate('deliveryId', 'name');

    return this.responseService.success(200, 'Pedido encontrado.', {
      order: order,
      offer: offer,
    });
  }

  async getOrdersPending(userId: string, offset: string) {
    const orders = await this.ordersOffersModel
      .find(
        { deliveryId: new Types.ObjectId(userId), state: 'accepted' },
        { deliveryId: 0, state: 0, userId: 0 },
      )
      .populate('businessId', 'name')
      .populate({
        path: 'orderId',
        populate: {
          path: 'productId',
          select: 'name',
        },
      })
      .skip(parseInt(offset) * 15)
      .limit(15)
      .lean();

    if (orders.length === 0)
      return this.responseService.error(404, 'Orders no fonud.');
    return this.responseService.success(200, 'Orders found.', orders);
  }

  async postCompleteOrder(id: string) {
    const order = (await this.ordersOffersModel.findOneAndUpdate(
      { orderId: new Types.ObjectId(id) },
      {
        state: 'completed',
      },
    )) as OrdersDelivery;

    if (!order) return this.responseService.error(404, 'Order no found.');

    // (await this.ordersModel.findByIdAndDelete(order.orderId._id).populate({
    //   path: 'orderId',
    //   select: 'quantity additionalData',
    // })) as Document & OrdersInterface;

    // await this.externalShoppingsService.postCreateShoppingCompleted(
    //   order.userId._id,
    //   {
    //     id: order.orderId.productId._id.toString(),
    //     quantity: order.orderId.quantity,
    //     size: order.orderId.additionalData.size,
    //   },
    // );
  }

  async postOffersDelivery(deliveryId: string, orderId: string, price: string) {
    const order = await this.ordersModel
      .findById(new Types.ObjectId(orderId), {
        businessId: 1,
        _id: 1,
        userId: 1,
      })
      .lean();

    if (!order) return this.responseService.error(404, 'Pedido no encontrado.');

    const newOrderOffer = new this.ordersOffersModel({
      businessId: new Types.ObjectId(order.businessId),
      deliveryId: new Types.ObjectId(deliveryId),
      userId: new Types.ObjectId(order.userId),
      orderId: order._id,
      price: parseInt(price),
    });

    await newOrderOffer.save();

    return this.responseService.success(
      200,
      'Oferta creada exitosamente.',
      price,
    );
  }
}
