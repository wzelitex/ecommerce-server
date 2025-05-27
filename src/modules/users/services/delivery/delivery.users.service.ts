import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserDeliverySchema } from '../../schema/users.schema';
import { ResponseService } from 'src/modules/utils/services/response.service';
import { DeliveryUserServiceInterface } from '../../interface/services/delivery.users.interface';
import { UpdateInfoDeliveryDto } from '../../dto/update.users.dto';
import { SanitizeService } from 'src/modules/utils/services/sanitize.service';

@Injectable()
export class DeliveryUserService implements DeliveryUserServiceInterface {
  constructor(
    @InjectModel('Delivery')
    private readonly deliveryModel: Model<UserDeliverySchema>,
    private readonly responseService: ResponseService,
    private readonly sanitizeService: SanitizeService,
  ) {}

  async getInfo(userId: string) {
    const user = await this.deliveryModel.findById(userId, {
      password: 0,
    });

    if (!user)
      return this.responseService.error(404, 'Usuario no encontrado.', null);

    return this.responseService.success(200, 'Usuario encontrado.', user);
  }

  async getName(userId: string) {
    const user = await this.deliveryModel.findById(new Types.ObjectId(userId), {
      name: 1,
      _id: 1,
    });

    if (!user)
      return this.responseService.error(404, 'Repartidor no encontrado.', null);

    return this.responseService.success(200, 'Repartidor encontrado.', user);
  }

  async putInfo(id: string, data: UpdateInfoDeliveryDto) {
    this.sanitizeService.sanitizeAllString(data);

    const user = await this.deliveryModel.findByIdAndUpdate(id, {
      name: data.name,
      email: data.email,
      phone: data.phone,
      lada: data.lada,
      street: data.street,
      cologne: data.cologne,
      municipality: data.municipality,
      state: data.state,
      country: data.country,
      number: data.number,
    });

    if (!user) return this.responseService.error(404, 'Usuario no encontrado.');
    return this.responseService.success(
      200,
      'Usuario actualizado correctamente.',
    );
  }
}
