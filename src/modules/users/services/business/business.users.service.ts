import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserBusinessSchema } from '../../schema/users.schema';
import { ResponseService } from 'src/modules/utils/services/response.service';
import { BusinessInterface } from '../../interface/users.interface';
import { SanitizeService } from 'src/modules/utils/services/sanitize.service';
import { BusinessUsersServiceInterface } from '../../interface/services/business.users.interface';
import { CommonResponseInterface } from 'src/interface/response.interface';
import { UpdateDataSectionInterface } from '../../interface/users.update.interface';
import { AddLocationUserDto } from '../../dto/update.users.dto';

@Injectable()
export class BusinessUsersService implements BusinessUsersServiceInterface {
  constructor(
    @InjectModel('Business')
    private readonly usersModel: Model<UserBusinessSchema>,
    private readonly responseService: ResponseService,
    private readonly sanitizeService: SanitizeService,
  ) {}

  private readonly limitDocuments = 10;

  async postAddDataSection(
    data: UpdateDataSectionInterface,
    userId: string,
  ): Promise<CommonResponseInterface> {
    const user = await this.usersModel.findByIdAndUpdate(userId, {
      aboutUs: data.aboutUs,
      exteriorImage: data.exteriorImage,
      interiorImage: data.interiorImage,
    });

    if (!user) return this.responseService.error(404, 'Negocio no encontrado.');
    return this.responseService.success(
      200,
      'Negocio actualizado correctamente.',
    );
  }

  async postAddLocation(
    data: AddLocationUserDto,
    userId: string,
  ): Promise<CommonResponseInterface> {
    const user = await this.usersModel.findByIdAndUpdate(userId, {
      street: data.street,
      municipality: data.municipality,
      state: data.state,
      cologne: data.cologne,
      country: data.country,
      number: data.number,
      zipCode: data.zipCode,
    });

    if (!user) return this.responseService.error(404, 'Negocio no encontrado.');
    return this.responseService.success(
      200,
      'Negocio actualizado correctamente.',
    );
  }

  async getEmail(userId: string) {
    const user = await this.usersModel.findById(userId, {
      email: 1,
      id: 0,
    });

    if (!user) return this.responseService.error(404, 'Usuario no encontrado.');
    return this.responseService.success(200, 'Usuario encontrado.', user);
  }

  async getInfo(userId: string) {
    const user = await this.usersModel.findById(userId, {
      password: 0,
    });

    if (!user) return this.responseService.error(404, 'Usuario no encontrado.');
    return this.responseService.success(200, 'Usuario encontrado.', user);
  }

  async getBusiness(offset: string) {
    const businesses = await this.usersModel
      .find(
        {},
        {
          name: 1,
          image: 1,
        },
      )
      .skip(parseInt(offset))
      .limit(this.limitDocuments);

    if (!businesses || businesses.length === 0)
      return this.responseService.error(404, 'Negocios no encontrados.');

    return this.responseService.success(
      200,
      'Negocios encontrados.',
      businesses,
    );
  }

  async putInfo(id: string, data: BusinessInterface) {
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined && v !== ''),
    );

    this.sanitizeService.sanitizeAllString(updateData);

    const user = await this.usersModel.findByIdAndUpdate(
      new Types.ObjectId(id),
      data,
    );
    if (!user) return this.responseService.error(404, 'Usuario no encontrado.');
    return this.responseService.success(200, 'Usuario actualizado.');
  }

  /* funcitons to another controllers */
  async getHeaderData(id: string) {
    return this.usersModel.findById(new Types.ObjectId(id), {
      name: 1,
      image: 1,
      _id: 0,
    });
  }

  async getBusinessSearcher(text: string, offset: string) {
    return this.usersModel.aggregate([
      {
        $match: {
          $or: [{ name: { $regex: text, $options: 'i' } }],
        },
      },
      {
        $project: {
          name: 1,
          image: 1,
          description: 1,
          _id: 1,
        },
      },
      { $skip: parseInt(offset) },
      { $limit: this.limitDocuments },
    ]);
  }

  async getRandomBusiness() {
    return this.usersModel.aggregate([
      { $sample: { size: this.limitDocuments } },
      { $project: { name: 1, image: 1, _id: 1, description: 1 } },
    ]);
  }
}
