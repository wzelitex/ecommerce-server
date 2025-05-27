import { Injectable } from '@nestjs/common';
import { ExternalProductsService } from 'src/modules/products/utils/external/external.products.service';
import { ExternalUsersService } from 'src/modules/users/utils/external/external.users.service';
import { ResponseService } from 'src/modules/utils/services/response.service';

@Injectable()
export class PlataformSeacherService {
  constructor(
    private readonly externalUsersService: ExternalUsersService,
    private readonly responseService: ResponseService,
    private readonly externalProductsService: ExternalProductsService,
  ) {}

  async getRecomendationsSearcher(text: string, offset: string) {
    const businesses = await this.externalUsersService.getBusinessSearched(
      text,
      offset,
    );
    if (businesses.length === 0)
      return this.responseService.error(404, 'Business no found.');
    return this.responseService.success(200, 'Businesses found.', businesses);
  }

  async getProductsSearched(text: string, offset: string) {
    const products = await this.externalProductsService.getProductsSearched(
      text,
      offset,
    );
    if (!products) return this.responseService.error(404, 'Products no found.');
    return this.responseService.success(200, 'Product found.', products);
  }
}
