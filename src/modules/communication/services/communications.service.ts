import { Injectable } from '@nestjs/common';
import { ExternalUsersService } from 'src/modules/users/utils/external/external.users.service';
import { ResponseService } from 'src/modules/utils/services/response.service';
import { InternalCommunicationsService } from '../utils/internal/internal.communications.service';
import { RequestContactInterface } from '../interfaces/functions/functions.post.communication';

@Injectable()
export class CommunicationsService {
  constructor(
    private readonly usersService: ExternalUsersService,
    private readonly responseService: ResponseService,
    private readonly internalService: InternalCommunicationsService,
  ) {}

  async postContact(body: RequestContactInterface, userId: string) {
    const user = await this.usersService.getUserIdById(body.to);

    if (!user)
      return this.responseService.error(404, 'Destinatario no encontrado.');

    console.log(body);
    await this.internalService.createNewDocument(body, userId);

    return this.responseService.success(
      200,
      'Notificación creada exitosamente.',
    );
  }
}
