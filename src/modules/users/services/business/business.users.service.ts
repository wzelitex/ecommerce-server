import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserBaseSchema, UserBusinessSchema } from '../../schema/users.schema';
import { ResponseService } from 'src/modules/utils/services/response.service';
import {
  BusinessInterface,
  NetWorksUsersInterface,
} from '../../interface/users.interface';
import { SanitizeService } from 'src/modules/utils/services/sanitize.service';
import { BusinessUsersServiceInterface } from '../../interface/services/business.users.interface';
import { CommonResponseInterface } from 'src/interface/response.interface';
import { AddLocationUserDto } from '../../dto/update.users.dto';
import { CloudinaryService } from 'src/modules/utils/services/image.service';
import { EncryptService } from 'src/modules/utils/services/encrypt.service';
import { ExternalCommunicationsService } from 'src/modules/communication/utils/external/external.communications.service';

interface LeanUser {
  _id: Types.ObjectId;
  code: string;
  email: string;
}

@Injectable()
export class BusinessUsersService implements BusinessUsersServiceInterface {
  constructor(
    @InjectModel('Business')
    private readonly usersModel: Model<UserBusinessSchema>,
    @InjectModel('Users') private readonly userMainModel: Model<UserBaseSchema>,
    private readonly responseService: ResponseService,
    private readonly sanitizeService: SanitizeService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly encryptService: EncryptService,
    private readonly eternalCommunicationsService: ExternalCommunicationsService,
  ) {}

  private readonly limitDocuments = 10;

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
    const user = await this.usersModel.findById(new Types.ObjectId(userId), {
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

  async putAddNetworks(id: string, data: NetWorksUsersInterface) {
    this.sanitizeService.sanitizeAllString(data);

    // Construir las URLs completas si se proporcionan los usernames
    if (data.facebook)
      data.facebook = 'https://www.facebook.com/' + data.facebook;
    if (data.instagram)
      data.instagram = 'https://www.instagram.com/' + data.instagram;
    if (data.tiktok) data.tiktok = 'https://www.tiktok.com/@' + data.tiktok;
    if (data.twitter) data.twitter = 'https://twitter.com/' + data.twitter;

    const user = await this.usersModel.findByIdAndUpdate(
      new Types.ObjectId(id),
      {
        facebook: data.facebook,
        instagram: data.instagram,
        tiktok: data.tiktok,
        twitter: data.twitter,
      },
    );

    if (!user) return this.responseService.error(404, 'User no found.');
    return this.responseService.success(200, 'User update.');
  }

  async putAddComplement(
    id: string,
    data: { description: string; number: number; owner: string },
    file: Express.Multer.File,
  ) {
    this.sanitizeService.sanitizeAllString(data);
    const image = await this.cloudinaryService.uploadFile(file, 'business');

    const user = await this.usersModel.findByIdAndUpdate(
      new Types.ObjectId(id),
      {
        image: image.url,
        description: data.description,
        ownerAccount: data.owner,
        numberAccount: data.number,
      },
    );

    if (!user) return this.responseService.error(404, 'User no found.');
    return this.responseService.success(200, 'User update.');
  }

  async postSendCredentails(userId: string) {
    const user = await this.usersModel
      .findById(new Types.ObjectId(userId), {
        _id: 1,
        code: 1,
        email: 1,
      })
      .lean<LeanUser>();

    if (!user) return this.responseService.error(404, 'User no found.');

    await this.eternalCommunicationsService.sendBulkNotifications([
      {
        message: `
    Hola, estas son tus credenciales para agregar nuevos trabajadores a tu negocio:

    🧾 ID del negocio: ${user._id.toString()}
    📧 Codigo: ${user.code}
    📧 Correo asociado: ${user.email}

    Comparte esta información con tus trabajadores para que puedan registrarse en la app y unirse a tu negocio.
    `,
        subject: 'Credenciales',
        to: user.email,
        type: 'credentails',
      },
    ]);

    return this.responseService.success(200, 'Credentials sent successfully.');
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

  private async updatePassword(id: string, password: string) {
    return await this.userMainModel.findOneAndUpdate(
      { userId: new Types.ObjectId(id) },
      { password },
    );
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
}
