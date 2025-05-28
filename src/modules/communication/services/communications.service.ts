import { Injectable } from '@nestjs/common';
import { ExternalUsersService } from 'src/modules/users/utils/external/external.users.service';
import { ResponseService } from 'src/modules/utils/services/response.service';
import { InternalCommunicationsService } from '../utils/internal/internal.communications.service';
import { RequestContactInterface } from '../interfaces/functions/functions.post.communication';
import { ContactsSchema } from '../schema/contact.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CommunicationsService {
  constructor(
    @InjectModel('Contacts')
    private readonly contactsModel: Model<ContactsSchema>,
    private readonly usersService: ExternalUsersService,
    private readonly responseService: ResponseService,
    private readonly internalService: InternalCommunicationsService,
  ) {}

  async postContact(body: RequestContactInterface, userId: string) {
    const user = await this.usersService.getUserIdById(body.to);

    if (!user)
      return this.responseService.error(404, 'Destinatario no encontrado.');

    await this.internalService.createNewDocument(body, userId);

    return this.responseService.success(
      200,
      'Notificación creada exitosamente.',
    );
  }

  async getNotifications(userId: string, offset: string) {
    const notifications = await this.contactsModel
      .find({ from: new Types.ObjectId(userId) })
      .skip(parseInt(offset))
      .limit(15)
      .lean();

    if (!notifications)
      return this.responseService.error(404, 'Notifications no found.');
    return this.responseService.success(
      200,
      'Notifications found.',
      notifications,
    );
  }
}
