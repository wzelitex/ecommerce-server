import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ProductShoeSchema } from '../../schema/product.schema';
import { ResponseService } from 'src/modules/utils/services/response.service';
import { ImageService } from 'src/modules/utils/services/image.service';
import { SanitizeService } from 'src/modules/utils/services/sanitize.service';
import { BusinessProductsServiceInterface } from '../../interface/services/business.products.interface';
import { CreateProductShoeInterface } from '../../interface/functions/business/business.functions.products.interface';

@Injectable()
export class BusinessProductsService
  implements BusinessProductsServiceInterface
{
  constructor(
    @InjectModel('Shoe')
    private readonly productsModel: Model<ProductShoeSchema>,
    private readonly responseService: ResponseService,
    private readonly imageService: ImageService,
    private readonly sanitizeService: SanitizeService,
  ) {}

  private readonly limitDocument = 10;

  private sanitizeData(data: CreateProductShoeInterface) {
    this.sanitizeService.sanitizeString(data.name);
    this.sanitizeService.sanitizeString(data.description);
    this.sanitizeService.sanitizeString(data.material);

    return data;
  }

  async findAll(
    id: string,
    offset: string,
    isDeleted: boolean,
    limit?: number,
  ) {
    const products = await this.productsModel
      .find(
        { businessId: new Types.ObjectId(id), isDeleted: isDeleted },
        { _id: 1, name: 1, price: 1, quantity: 1 },
      )
      .limit(30)
      .skip(parseInt(offset, 10) * 10);

    if (!products || products.length === 0)
      return this.responseService.error(404, 'Productos no encontrados.');

    return this.responseService.success(
      200,
      'Productos encontrados.',
      products,
    );
  }

  async findById(id: string) {
    const IdProduct = new Types.ObjectId(id);
    const product = await this.productsModel.findById(IdProduct);
    if (!product)
      return this.responseService.error(404, 'Producto no encontrados.');
    return this.responseService.success(200, 'Producto encontrados.', product);
  }

  async putProduct(
    id: string,
    data: CreateProductShoeInterface,
    image: Express.Multer.File,
    userId: string,
  ) {
    if (data._id) {
      delete data._id;
    }

    this.sanitizeData(data);
    const product = await this.productsModel.findByIdAndUpdate(
      id,
      {
        ...data,
        businessId: new Types.ObjectId(userId),
      },
      {
        new: true,
      },
    );

    if (!product)
      return this.responseService.error(404, 'Producto no encontrado.');
    return this.responseService.success(200, 'Producto actualizado.');
  }

  async createProduct(
    data: CreateProductShoeInterface,
    file: Express.Multer.File,
    businessId: string,
  ) {
    // const urlImage = await this.imageService.uploadFile(file);
    const urlImage = 'https://google.images/' + Date.now();
    this.sanitizeData(data);

    const arraySizes = data.size.split(',').map((size) => size.trim());
    this.sanitizeService.sanitizeArray(arraySizes);

    const newProduct = new this.productsModel({
      ...data,
      image: urlImage,
      typeProduct: data.type,
      sizes: arraySizes,
      businessId: new Types.ObjectId(businessId),
    });

    await newProduct.save();
    return this.responseService.success(201, 'Producto creado exitosamente.');
  }

  async deleteProduct(id: string) {
    const IdProduct = new Types.ObjectId(id);
    const product = await this.productsModel.findByIdAndUpdate(IdProduct, {
      isDeleted: true,
    });

    if (!product)
      return this.responseService.error(404, 'Producto no encontrado.');

    return this.responseService.success(
      200,
      'Producto eliminado correctamente.',
    );
  }

  async postRestoreProduct(id: string) {
    const product = await this.productsModel.findByIdAndUpdate(id, {
      isDeleted: false,
    });

    if (!product)
      return this.responseService.error(404, 'Producto no encontrado.');

    return this.responseService.success(200, 'Producto restaurado.');
  }
}
