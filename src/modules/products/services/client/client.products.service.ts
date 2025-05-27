import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ProductShoeSchema } from '../../schema/product.schema';
import { ResponseService } from 'src/modules/utils/services/response.service';
import { ClientProductsServiceInterface } from '../../interface/services/client.products.interface';
import { ExternalShoppingsService } from 'src/modules/shoppings/utils/external/external.shoppings.service';
import { CommonResponseInterface } from 'src/interface/response.interface';
import { ProductsShoeBasicInterface } from '../../interface/functions/business/business.functions.products.interface';
import { ShoppingSchema } from 'src/modules/shoppings/schema/shoppints.schema';

@Injectable()
export class ClientProductsService implements ClientProductsServiceInterface {
  constructor(
    @InjectModel('Shoe')
    private readonly productsModel: Model<ProductShoeSchema>,
    private readonly responseService: ResponseService,
    private readonly shoppingsService: ExternalShoppingsService,
  ) {}

  private readonly limitDocuments = 10;

  async findProductsSellerOrCheaper(
    businessId: string,
  ): Promise<CommonResponseInterface<any>> {
    const shoppings =
      await this.shoppingsService.getProductsBestSellerByBusiness(businessId);

    if (shoppings.length === 0) {
      const products = await this.productsModel
        .find(
          { businessId: new Types.ObjectId(businessId) },
          { image: 1, price: 1, name: 1, _id: 1 },
        )
        .limit(10)
        .sort({ price: -1 });

      return this.responseService.success(200, 'Productos encontrados.', {
        products: products,
        title: 'Nuestros productos',
      });
    }

    const products = await this.findProductsBestCheaper(shoppings);
    if (products.length === 0)
      return this.responseService.error(
        404,
        'Productos no encontrados.',
        products,
      );

    return this.responseService.success(200, 'Productos encontrados.', {
      products: products,
      title: 'Lo mas vendido',
    });
  }

  async findProductsRandom() {
    const products = await this.productsModel.aggregate([
      { $sample: { size: this.limitDocuments } },
      { $project: { _id: 1, name: 1, image: 1, price: 1, businessId: 1 } },
      {
        $lookup: {
          from: 'businesses',
          localField: 'businessId',
          foreignField: '_id',
          as: 'businessId',
        },
      },
      { $limit: this.limitDocuments },
    ]);

    if (products.length === 0)
      return this.responseService.error(404, 'Productos no encontrados.', []);

    return this.responseService.success(
      200,
      'Productos encontrados.',
      products,
    );
  }

  async findProductsByBusinessId(id: string, offset: string) {
    const products = await this.productsModel
      .find(
        { businessId: new Types.ObjectId(id) },
        {
          name: 1,
          image: 1,
          price: 1,
          _id: 1,
        },
      )
      .limit(this.limitDocuments)
      .skip(parseInt(offset) * 10);

    if (!products || products.length === 0)
      return this.responseService.error(404, 'Productos no encontrados.', []);

    return this.responseService.success(
      200,
      'Productos encontrados.',
      products,
    );
  }

  async findProductsRecommendSearcher(id: string) {
    const shoppings =
      await this.shoppingsService.getShoppingsRealizedToRecommendProductsSearcher(
        id,
        1,
      );

    if (shoppings.length === 0) {
      const products = await this.productsModel
        .find({}, { name: 1, price: 1, image: 1, _id: 1, businessId: 1 })
        .populate('businessId', 'name')
        .limit(10)
        .lean();

      if (!products.length) {
        return this.responseService.error(
          404,
          'Productos no recomendados.',
          [],
        );
      }

      return this.responseService.success(
        200,
        'Productos recomendados.',
        products,
      );
    }

    if (shoppings.length === 1) {
      const product = await this.productsModel.findById(id, {
        name: 1,
        description: 1,
      });

      if (!product)
        return this.responseService.error(404, 'Producto no encontrado.', []);

      const products = await this.productsModel.aggregate([
        {
          $match: {
            $or: [
              { name: { $regex: product.name, $options: 'i' } },
              { description: { $regex: product.description, $options: 'i' } },
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
            score: { $meta: 'textScore' },
          },
        },
        { $sort: { score: -1 } },
        { $limit: 15 },
      ]);

      if (!products.length) {
        return this.responseService.error(
          404,
          'Productos no recomendados.',
          [],
        );
      }

      return this.responseService.success(
        200,
        'Productos recomendados.',
        products,
      );
    }

    const ids = shoppings.map((s) => s.productId);

    const products = await this.productsModel
      .find(
        { _id: { $in: ids } },
        { name: 1, price: 1, image: 1, _id: 1, businessId: 1 },
      )
      .populate('businessId', 'name')
      .lean();

    return this.responseService.success(
      200,
      'Productos recomendados por compras previas.',
      products,
    );
  }

  async findProductsSearcher(text: string, offset: string) {
    const products = await this.productsModel.aggregate([
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
      {
        $unwind: '$businessId',
      },
      {
        $project: {
          name: 1,
          price: 1,
          image: 1,
          'businessId.name': 1,
        },
      },
      { $skip: parseInt(offset) },
      { $limit: this.limitDocuments },
    ]);

    if (!products || products.length === 0)
      return this.responseService.error(404, 'Productos no encontrados.', []);

    return this.responseService.success(
      200,
      'Productos encontrados.',
      products,
    );
  }

  async findProducts(type: string, offset: string, limit?: number) {
    const products = await this.productsModel
      .find(
        { quantity: { $gt: 1 } },
        { name: 1, price: 1, businessId: 1, image: 1 },
      )
      .populate('businessId', 'name')
      .limit(limit ?? this.limitDocuments)
      .skip(parseInt(offset, 10) * 10);

    if (!products || products.length === 0)
      return this.responseService.error(404, 'Productos no encotrados.', []);

    return this.responseService.success(
      200,
      'Productos encontrados.',
      products,
    );
  }

  async findById(id: string) {
    const product = await this.productsModel
      .findById(id)
      .populate(
        'businessId',
        'name description facebook tiktok instagram twitter',
      );
    if (!product)
      return this.responseService.error(404, 'Producto no encontrado.', []);
    return this.responseService.success(200, 'Producto encontrados.', product);
  }

  private async findProductsBestCheaper(shoppings: ShoppingSchema[]) {
    const productsArray: ProductsShoeBasicInterface[] = [];

    for (const shopping of shoppings) {
      const product = await this.productsModel
        .findById(shopping.productId, {
          image: 1,
          name: 1,
          price: 1,
          _id: 1,
        })
        .lean();

      if (!product) continue;
      productsArray.push(product);
    }

    return productsArray;
  }
}
