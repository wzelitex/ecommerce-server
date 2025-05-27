import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  UserBusinessSchema,
  UserClientSchema,
} from '../../schema/users.schema';
import { ResponseService } from 'src/modules/utils/services/response.service';
import { SanitizeService } from 'src/modules/utils/services/sanitize.service';
import { ClientInterface } from '../../interface/users.interface';
import { BusinessUsersService } from '../business/business.users.service';
import { ClientUsersServiceInterface } from '../../interface/services/client.users.interface';
import { ExternalShoppingsService } from 'src/modules/shoppings/utils/external/external.shoppings.service';
import { InternalUsersService } from '../../utils/internal/internal.users.service';
import { GetBusinessRecommendInterface } from '../../interface/arrays/clients.arrays.interface';

@Injectable()
export class ClientUsersService implements ClientUsersServiceInterface {
  constructor(
    @InjectModel('Client')
    private readonly usersModel: Model<UserClientSchema>,
    @InjectModel('Business')
    private readonly businessModel: Model<UserBusinessSchema>,
    private readonly responseService: ResponseService,
    private readonly sanitizeService: SanitizeService,
    private readonly businessUsersService: BusinessUsersService,
    private readonly shoppingsService: ExternalShoppingsService,
    private readonly internalService: InternalUsersService,
  ) {}

  async getEmail(id: string) {
    const user = await this.usersModel.findById(id, { email: 1, _id: 0 });
    if (!user) return this.responseService.error(404, 'Usuario no encontrado.');
    return this.responseService.success(200, 'Usuario encontrado.', user);
  }

  async getInfo(userId: string) {
    const user = await this.usersModel.findById(userId);
    if (!user) return this.responseService.error(404, 'Usuario no encontrado.');
    return this.responseService.success(200, 'Usuario encontrado.', user);
  }

  async putInfo(userId: string, data: ClientInterface) {
    const user = await this.usersModel.findByIdAndUpdate(userId, data);
    if (!user) return this.responseService.error(404, 'Usuario no encontrado.');
    return this.responseService.success(200, 'Usuario actualizado.');
  }

  async getBusinessSearcher(text: string, offset: string) {
    const business = await this.businessUsersService.getBusinessSearcher(
      text,
      offset,
    );
    if (!business || business.length === 0)
      return this.responseService.error(404, 'Negocios no encontrados.');
    return this.responseService.success(200, 'Negocios encontrados.', business);
  }

  async getRandomBusiness() {
    const business = await this.businessUsersService.getRandomBusiness();
    if (business.length === 0)
      return this.responseService.error(404, 'Negocios no encontrados.');
    return this.responseService.success(200, 'Negocios encontrados.', business);
  }

  async getBusinessRecommend(id: string) {
    const businesses: GetBusinessRecommendInterface[] = [];

    const shoppingsBought =
      await this.shoppingsService.getBusinessRecommend(id);
    if (shoppingsBought.length === 0)
      return this.responseService.error(
        404,
        'No hay negocios para recomendar.',
      );

    for (const shopping of shoppingsBought) {
      const rawBusiness = await this.businessModel
        .findById(shopping.businessId, {
          image: 1,
          _id: 1,
          name: 1,
        })
        .lean();

      if (!rawBusiness) continue;

      const business: GetBusinessRecommendInterface = {
        name: rawBusiness.name,
        image: rawBusiness.image,
      };

      businesses.push(business);
    }

    if (businesses.length === 0)
      return this.responseService.error(404, 'Negocios no encontrados.');
    return this.responseService.success(
      200,
      'Negocios recomendados.',
      businesses,
    );
  }

  async getHomePageBusiness(id: string) {
    const business = await this.internalService.getHeaderData(id);
    if (!business) return this.responseService.error(404, 'Business no found.');
    return this.responseService.success(200, 'Business found.', business);
  }
}
