import { Injectable } from '@nestjs/common';
import { Model, UpdateQuery } from 'mongoose';
import { OrderSchema } from '../../../schema/orders.schema';
import { InjectModel } from '@nestjs/mongoose';
import { OrdersInterface } from '../../../interface/orders.interface';
import { ExternalProductsService } from 'src/modules/products/utils/external/external.products.service';

@Injectable()
export class InternalCommonOrdersService {
  constructor(
    @InjectModel('Orders') private readonly ordersModel: Model<OrderSchema>,
    private readonly productsService: ExternalProductsService,
  ) {}

  async createArrayDocuments(data: OrdersInterface[]) {
    const arrayOrders: OrdersInterface[] =
      []; /* array to save the documents in db */

    for (const shopping of data) {
      const product = await this.productsService.getInfoProductRealizeOrder(
        shopping.productId.toString(),
      );

      if (!product) {
        continue;
      }

      await this.productsService.substractQuantityProduct(
        shopping.productId._id.toString(),
        shopping.quantity,
      );

      arrayOrders.push({
        businessId: shopping.businessId,
        productId: shopping.productId,
        quantity: shopping.quantity,
        total: shopping.quantity * product.price,
        userId: shopping.userId,
        additionalData: shopping.additionalData as { size: string },
      });
    }

    return arrayOrders;
  }

  async findById(id: string) {
    return this.ordersModel.findById(id);
  }

  async findByIdAndUpdate(id: string, data: UpdateQuery<OrderSchema>) {
    return this.ordersModel.findByIdAndUpdate(id, data, { new: true });
  }

  async findByIdAndDelete(id: string) {
    return this.ordersModel.findByIdAndDelete(id);
  }
}
