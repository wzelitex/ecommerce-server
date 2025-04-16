import { Global, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
    return await this.productModel.findById(id, { price: 1, businessId: 1 });
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
}
