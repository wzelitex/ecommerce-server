import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ProductShoeSchema } from '../../schema/product.schema';
import { ResponseService } from 'src/modules/utils/services/response.service';
import { CloudinaryService } from 'src/modules/utils/services/image.service';
import { SanitizeService } from 'src/modules/utils/services/sanitize.service';
import { BusinessProductsServiceInterface } from '../../interface/services/business.products.interface';
import { CreateProductShoeInterface } from '../../interface/functions/business/business.functions.products.interface';
import { UpdateProductShoeDto } from '../../dto/products.dto';

@Injectable()
export class BusinessProductsService
  implements BusinessProductsServiceInterface
{
  constructor(
    @InjectModel('Shoe')
    private readonly productsModel: Model<ProductShoeSchema>,
    private readonly responseService: ResponseService,
    private readonly imageService: CloudinaryService,
    private readonly sanitizeService: SanitizeService,
  ) {}

  private readonly limitDocument = 10;

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
      .limit(this.limitDocument)
      .skip(parseInt(offset, 10) * 10)
      .lean();

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

  async putProduct(id: string, userId: string, data: UpdateProductShoeDto) {
    this.sanitizeService.sanitizeAllString(data);

    const product = await this.productsModel.findByIdAndUpdate(
      id,
      {
        ...data,
        businessId: new Types.ObjectId(userId),
      },
      { new: true },
    );

    if (!product)
      return this.responseService.error(404, 'Producto no encontrado.');
    return this.responseService.success(200, 'Producto actualizado.');
  }

  async createProduct(
    businessId: string,
    data: CreateProductShoeInterface,
    file: Express.Multer.File,
  ) {
    const urlImage = await this.imageService.uploadFile(file, 'products');
    const sizes = JSON.parse(data.size) as string;
    const newProduct = new this.productsModel({
      ...data,
      image: urlImage.url,
      typeProduct: data.type,
      sizes: sizes,
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
