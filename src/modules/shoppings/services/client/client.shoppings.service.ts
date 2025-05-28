import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ShoppingSchema } from '../../schema/shoppints.schema';
import { CreateShoppingInterface } from '../../interface/shoppings.interface';
import { ExternalProductsService } from 'src/modules/products/utils/external/external.products.service';
import { ResponseService } from 'src/modules/utils/services/response.service';
import { ClientShoppingsServiceInterface } from '../../interface/services/client.shoppings.interface';

@Injectable()
export class ClientShoppingsService implements ClientShoppingsServiceInterface {
  constructor(
    @InjectModel('Shoppings')
    private readonly shoppingModel: Model<ShoppingSchema>,
    private readonly responseService: ResponseService,
    private readonly productService: ExternalProductsService,
  ) {}

  private readonly limitDocuments = 10;

  async findShoppingCart(id: string) {
    const shoppings = await this.shoppingModel
      .find({
        userId: new Types.ObjectId(id),
      })
      .populate('productId', 'name price image');

    if (!shoppings || shoppings.length === 0)
      return this.responseService.error(404, 'Compras no encontradas.');

    return this.responseService.success(200, 'Compras encontradas.', shoppings);
  }

  async findShoppingsHistory(userId: string, offset: string) {
    const shoppings = await this.shoppingModel
      .find({ userId: userId })
      .limit(this.limitDocuments)
      .skip(parseInt(offset, 10) * 10);

    if (shoppings.length === 0)
      return this.responseService.error(404, 'Compras no encontradas.');
    return this.responseService.success(200, 'Compras encontradas.', shoppings);
  }

  async addShoppingCart(userId: string, data: CreateShoppingInterface) {
    const product =
      await this.productService.getInfoProductForCreateShoppingCart(data.id);

    if (!product)
      return this.responseService.error(404, 'Producto no encontrado.');

    const newDocument = new this.shoppingModel({
      ...data,
      businessId: new Types.ObjectId(product.businessId),
      userId: new Types.ObjectId(userId),
      productId: new Types.ObjectId(data.id),
      total: product.price * data.quantity,
      additionalData: { size: parseInt(data.size) },
    });

    await newDocument.save();
    return this.responseService.success(
      200,
      'Compra agregada al carrito de compras.',
    );
  }

  async getShopping(id: string) {
    const shopping = await this.shoppingModel
      .findById(id)
      .populate('productId', 'name image price description')
      .populate('businessId', 'name')
      .lean();
    if (!shopping) return this.responseService.error(404, 'Shopping no found.');
    return this.responseService.success(200, 'Shopping found.', shopping);
  }

  async deleteShoppingFromCart(id: string) {
    const shopping = await this.shoppingModel.findByIdAndDelete(id);
    if (!shopping)
      return this.responseService.error(404, 'Compra no encontrada.');
    return this.responseService.success(200, 'Compra eliminada correctamente.');
  }
}
