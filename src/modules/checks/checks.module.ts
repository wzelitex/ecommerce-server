import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChecksItemsSchemaFactory } from './schema/checks.items.schema';
import { ChecksSchemaFactory } from './schema/checks.schema';
import { UtilsModule } from '../utils/utils.module';
import { CommunicationsModule } from '../communication/communication.module';

/* import controllers */
import { ChecksController } from './controllers/checks.controller';

/* import services */
import { ChecksItemsService } from './services/checks.items.service';
import { ChecksService } from './services/checks.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Check',
        schema: ChecksSchemaFactory,
      },
      { name: 'CheckItem', schema: ChecksItemsSchemaFactory },
    ]),
    UtilsModule,
    CommunicationsModule,
  ],
  controllers: [ChecksController],
  providers: [ChecksItemsService, ChecksService],
  exports: [ChecksService],
})
export class ChecksModule {}
