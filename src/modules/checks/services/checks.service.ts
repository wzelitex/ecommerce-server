import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { ChecksSchema } from '../schema/checks.schema';
import { InjectModel } from '@nestjs/mongoose';
import { ResponseService } from 'src/modules/utils/services/response.service';
import { OrdersInterfaceIdPopulated } from 'src/modules/orders/interface/orders.interface';
import { ChecksItemsService } from './checks.items.service';
import { CloudinaryService } from 'src/modules/utils/services/image.service';
import { ExternalCommunicationsService } from 'src/modules/communication/utils/external/external.communications.service';
import { CheckPopulateInterface } from '../interfaces/checks.interface';

@Injectable()
export class ChecksService {
  constructor(
    @InjectModel('Check') private readonly checksModel: Model<ChecksSchema>,
    private readonly responseService: ResponseService,
    private readonly checksItemsService: ChecksItemsService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly externalCommunicationService: ExternalCommunicationsService,
  ) {}

  async postCreateCheck(data: OrdersInterfaceIdPopulated[]) {
    const userId = data[0].userId;

    const totalAmount = data.reduce((acc, item) => acc + item.total, 0);
    const totalItems = data.reduce((acc, item) => acc + item.quantity, 0);

    const newCheck = new this.checksModel({
      userId,
      totalAmount,
      totalItems,
      paymentProof: '',
      status: 'pending',
      date: new Date(),
    });

    const savedCheck = await newCheck.save();

    for (const order of data) {
      await this.checksItemsService.createCheckItem(
        savedCheck._id.toString(),
        order,
      );
    }

    return savedCheck._id;
  }

  async getCheckById(id: string) {
    const check = await this.checksModel.findById(id);
    if (!check) return this.responseService.error(404, 'Check no foun.');

    const checkItems = await this.checksItemsService.getCheckItemsByCheckId(
      check._id.toString(),
    );

    return this.responseService.success(200, 'Checks and checksItems found.', {
      check,
      checkItems,
    });
  }

  async postValidatePayment(id: string, file: Express.Multer.File) {
    const image = await this.cloudinaryService.uploadFile(file, 'payments');

    const check = await this.checksModel.findByIdAndUpdate(
      new Types.ObjectId(id),
      {
        paymentProof: image.url,
      },
    );

    if (!check) return this.responseService.error(404, 'Check no found.');
    return this.responseService.success(200, 'Check on verification.');
  }

  async getChecks(offset: string, type: 'pending' | 'accepted' | 'rejected') {
    const checks = await this.checksModel
      .find({ status: type })
      .populate('userId', 'name')
      .skip(parseInt(offset))
      .limit(15)
      .lean();

    if (checks.length === 0)
      return this.responseService.error(404, 'Checks no found.');

    return this.responseService.success(200, 'Checks found.', checks);
  }

  async getCheck(id: string) {
    const check = await this.checksModel
      .findById(new Types.ObjectId(id))
      .populate('userId', 'name email lada phone')
      .lean();
    if (!check) return this.responseService.error(404, 'Check no found.');
    return this.responseService.success(200, 'Check found.', check);
  }

  async postCompleteCheck(
    id: string,
    type: 'accepted' | 'rejected',
    rejectionReason: 'money' | 'invalid',
  ) {
    const check = await this.checksModel
      .findByIdAndUpdate(id, { status: type }, { new: true })
      .populate('userId', 'name')
      .lean<CheckPopulateInterface>();

    if (!check) return this.responseService.error(404, 'Check not found.');

    let message = '';

    if (type === 'accepted') {
      message = 'Su nota ha sido Aceptada.';
    } else {
      const reasonText =
        rejectionReason === 'money'
          ? 'el monto del depósito no coincide'
          : 'la imagen del comprobante no es válida';

      message = `Su nota ha sido Rechazada porque ${reasonText}.`;
    }

    await this.externalCommunicationService.sendBulkNotifications([
      {
        message,
        subject: 'Confirmación de nota',
        to: check.userId.email,
        type: 'Checks',
      },
    ]);

    return this.responseService.success(200, 'Check completed');
  }
}
