import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ShoppingSchema } from '../../schema/shoppints.schema';
import { InjectModel } from '@nestjs/mongoose';
import { ResponseService } from 'src/modules/utils/services/response.service';
import { BusinessShoppingsServiceInterface } from '../../interface/services/business.shoppings.interface';

@Injectable()
export class BusinessShoppingsService
  implements BusinessShoppingsServiceInterface
{
  constructor(
    @InjectModel('Shoppings')
    private readonly shoppingsModel: Model<ShoppingSchema>,
    private readonly responseService: ResponseService,
  ) {}

  private readonly limitDocumentByRequest = 10;

  async findAll(id: string, offset: string, limit?: number) {
    const sales = await this.shoppingsModel
      .find({ negocio: id })
      .populate('productId', 'name -_id')
      .populate('userId', 'name')
      .limit(limit ?? this.limitDocumentByRequest)
      .skip(parseInt(offset));

    if (!sales || sales.length === 0)
      return this.responseService.error(404, 'Ventas no encontradas.');
    return this.responseService.success(200, 'Ventas encontradas.', sales);
  }

  async findOne(id: string) {
    const sale = await this.shoppingsModel.findById(id);
    if (!sale) return this.responseService.error(404, 'Venta no encontrada.');
    return this.responseService.success(200, 'Venta encontrada.', sale);
  }
}
