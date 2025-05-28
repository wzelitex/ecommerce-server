import { Global, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProductShoeSchema } from '../../schema/product.schema';

@Global()
@Injectable()
export class ExternalProductsService {
  constructor(
    @InjectModel('Shoe')
    private readonly productModel: Model<ProductShoeSchema>,
  ) {}

  async getInfoProductRealizePrefereceId(id: string) {
    return await this.productModel.findById(id, {
      name: 1,
      _id: 0,
    });
  }

  async getInfoProductRealizeOrder(id: string) {
    return await this.productModel.findById(id, {
      price: 1,
      _id: 0,
    });
  }

  async getInfoProductForCreateShoppingCart(id: string) {
    return await this.productModel.findById(new Types.ObjectId(id), {
      price: 1,
      businessId: 1,
    });
  }

  async substractQuantityProduct(
    id: string,
    quantity: number,
  ): Promise<boolean> {
    if (!quantity) return false;
    const product = await this.productModel.findById(id, {
      _id: 1,
      quantity: 1,
    });
    if (!product) return false;
    product.quantity -= quantity;
    await product.save();

    return true;
  }

  async addQuantityProduct(id: string, quantity: number): Promise<boolean> {
    if (!quantity) return false;
    const product = await this.productModel.findById(id, {
      _id: 1,
      quantity: 1,
    });
    if (!product) return false;
    product.quantity += quantity;
    await product.save();

    return true;
  }

  async getProductsSearched(text: string, offset: string) {
    return await this.productModel.aggregate([
      {
        $match: {
          $or: [
            { name: { $regex: text, $options: 'i' } },
            { description: { $regex: text, $options: 'i' } },
          ],
        },
      },
      {
        $lookup: {
          from: 'businesses',
          localField: 'businessId',
          foreignField: '_id',
          as: 'businessId',
        },
      },
      { $unwind: '$businessId' },
      {
        $project: {
          name: 1,
          price: 1,
          image: 1,
          'businessId.name': 1,
        },
      },
      { $limit: 15 },
    ]);
  }
}
