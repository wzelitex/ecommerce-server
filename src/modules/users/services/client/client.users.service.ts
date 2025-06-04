import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  UserBaseSchema,
  UserBusinessSchema,
  UserClientSchema,
} from '../../schema/users.schema';
import { ResponseService } from 'src/modules/utils/services/response.service';
import { BusinessUsersService } from '../business/business.users.service';
import { ClientUsersServiceInterface } from '../../interface/services/client.users.interface';
import { ExternalShoppingsService } from 'src/modules/shoppings/utils/external/external.shoppings.service';
import { InternalUsersService } from '../../utils/internal/internal.users.service';
import { GetBusinessRecommendInterface } from '../../interface/arrays/clients.arrays.interface';
import { ExternalCommunicationsService } from 'src/modules/communication/utils/external/external.communications.service';
import { EncryptService } from 'src/modules/utils/services/encrypt.service';
import { UpdateUsersDto } from '../../dto/update.users.dto';

@Injectable()
export class ClientUsersService implements ClientUsersServiceInterface {
  constructor(
    @InjectModel('Users')
    private readonly usersMainModel: Model<UserBaseSchema>,
    @InjectModel('Client')
    private readonly usersModel: Model<UserClientSchema>,
    @InjectModel('Business')
    private readonly businessModel: Model<UserBusinessSchema>,
    private readonly responseService: ResponseService,
    private readonly businessUsersService: BusinessUsersService,
    private readonly shoppingsService: ExternalShoppingsService,
    private readonly internalService: InternalUsersService,
    private readonly externalCommunicationService: ExternalCommunicationsService,
    private readonly encryptService: EncryptService,
  ) {}

  async getEmail(id: string) {
    const user = await this.usersModel.findById(new Types.ObjectId(id), {
      email: 1,
      _id: 0,
    });
    if (!user) return this.responseService.error(404, 'Usuario no encontrado.');
    return this.responseService.success(200, 'Usuario encontrado.', user);
  }

  async getInfo(userId: string) {
    const user = await this.usersModel.findById(userId);
    if (!user) return this.responseService.error(404, 'Usuario no encontrado.');
    return this.responseService.success(200, 'Usuario encontrado.', user);
  }

  async postValidatePassword(id: string, password: string) {
    const user = await this.usersModel
      .findById(new Types.ObjectId(id), { password: 1 })
      .lean();
    if (!user) return this.responseService.error(404, 'User no found.');

    const validatePassword = await this.encryptService.compare(
      password,
      user.password,
    );

    if (!validatePassword)
      return this.responseService.error(400, 'Passwords dont match.');
    return this.responseService.success(200, 'Password match.');
  }

  async getCode(id: string) {
    const user = await this.usersModel
      .findById(new Types.ObjectId(id), {
        email: 1,
      })
      .lean();
    if (!user) return this.responseService.error(404, 'User no found.');

    const code = this.generateCode();

    // await this.externalCommunicationService.sendBulkNotifications([
    //   {
    //     message: code,
    //     subject: 'Codigo de seguridad.',
    //     to: user.email,
    //     type: 'Code security',
    //   },
    // ]);

    return this.responseService.success(200, 'Code sent.', code);
  }

  async putInfo(userId: string, data: UpdateUsersDto) {
    const user = await this.usersModel.findByIdAndUpdate(userId, data);
    if (!user) return this.responseService.error(404, 'Usuario no encontrado.');
    return this.responseService.success(200, 'Usuario actualizado.');
  }

  async putPassword(id: string, password: string) {
    const passwordHashed = await this.encryptService.hasher(password);

    const user = await this.usersModel.findByIdAndUpdate(
      new Types.ObjectId(id),
      { password: passwordHashed },
    );
    if (!user) return this.responseService.error(404, 'User no found.');

    await this.updatePassword(id, passwordHashed);

    return this.responseService.success(200, 'Password updated.');
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

  private generateCode(): string {
    const charset =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      code += charset[randomIndex];
    }
    return code;
  }

  private async updatePassword(id: string, password: string) {
    return await this.usersMainModel.findOneAndUpdate(
      { userId: new Types.ObjectId(id) },
      { password: password },
    );
  }
}
