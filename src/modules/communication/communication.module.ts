import { forwardRef, Module } from '@nestjs/common';
import { ContactsSchemaFactory } from './schema/contact.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UtilsModule } from '../utils/utils.module';
import { UsersModule } from '../users/users.module';

/* import controllers */
import { CommunicationsController } from './controllers/communications.controller';

/* import services */
import { CommunicationsService } from './services/communications.service';

/* import utils */
import { ExternalCommunicationsService } from './utils/external/external.communications.service';
import { InternalCommunicationsService } from './utils/internal/internal.communications.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Contacts',
        schema: ContactsSchemaFactory,
      },
    ]),
    UtilsModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [CommunicationsController],
  providers: [
    /* services */
    CommunicationsService,
    /* utils */
    ExternalCommunicationsService,
    InternalCommunicationsService,
  ],
  exports: [ExternalCommunicationsService],
})
export class CommunicationsModule {}
