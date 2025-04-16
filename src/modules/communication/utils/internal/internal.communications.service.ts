import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ContactsSchema } from '../../schema/contact.schema';
import { RequestContactInterface } from '../../interfaces/functions/functions.post.communication';
import { SanitizeService } from 'src/modules/utils/services/sanitize.service';

@Injectable()
export class InternalCommunicationsService {
  constructor(
    @InjectModel('Contacts')
    private readonly contactsModel: Model<ContactsSchema>,
    private readonly sanitizeService: SanitizeService,
  ) {}

  createNewDocument(data: RequestContactInterface, id: string) {
    this.sanitizeService.sanitizeAllString(data);

    const newDocument = new this.contactsModel({
      ...data,
      from: new Types.ObjectId(id),
      to: new Types.ObjectId(data.to),
      subject: data.subject,
    });

    return newDocument.save();
  }
}
