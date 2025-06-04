import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ShoppingSchema } from '../../schema/shoppints.schema';
import { CreateShoppingInterface } from '../../interface/shoppings.interface';
import { ExternalProductsService } from 'src/modules/products/utils/external/external.products.service';

@Injectable()
export class ExternalShoppingsService {
  constructor(
    @InjectModel('Shoppings')
    private readonly shoppingsModel: Model<ShoppingSchema>,
    private readonly productsService: ExternalProductsService,
  ) {}

  private readonly limitDocuments = 10;

  async getShoppingsRealizedToRecommendProductsSearcher(
    id: string,
    limit: number = 5,
  ) {
    return await this.shoppingsModel
      .find({ userId: new Types.ObjectId(id) }, { productId: 1, _id: 0 })
      .limit(limit ?? this.limitDocuments);
  }

  async getShoppingsFromCart(userId: string) {
    return await this.shoppingsModel.find({
      userId: new Types.ObjectId(userId),
    });
  }

  async deleteShoppingsFromCart(userId: string) {
    return await this.shoppingsModel.deleteMany({
      userId: new Types.ObjectId(userId),
    });
  }

  async getBusinessRecommend(id: string) {
    return await this.shoppingsModel
      .find({ userId: id }, { businessId: 1, _id: 0 })
      .sort({ quntity: -1 })
      .limit(5);
  }

  async getProductsBestSellerByBusiness(
    businessId: string,
  ): Promise<ShoppingSchema[]> {
    const shoppings = await this.shoppingsModel.aggregate([
      {
        $match: {
          businessId: new Types.ObjectId(businessId),
          state: 'completed',
        },
      },
      {
        $group: {
          _id: '$productId',
          totalQuantity: { $sum: '$quantity' },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          productId: 1,
        },
      },
    ]);

    return shoppings as ShoppingSchema[];
  }

  async postCreateShoppingCompleted(
    userId: string,
    data: CreateShoppingInterface,
  ) {
    const product =
      await this.productsService.getInfoProductForCreateShoppingCart(data.id);

    if (!product) return false;

    const newDocument = new this.shoppingsModel({
      ...data,
      businessId: new Types.ObjectId(product.businessId),
      userId: new Types.ObjectId(userId),
      productId: new Types.ObjectId(data.id),
      total: product.price * data.quantity,
      additionalData: { size: parseInt(data.size) },
      state: 'completed',
    });

    await newDocument.save();
    return true;
  }
}
