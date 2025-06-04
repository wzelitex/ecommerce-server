import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserBusinessSchemaFactory,
  UserClientSchemaFactory,
  UserDeliverySchemaFactory,
  UserWorkerSchemaFactory,
} from './schema/users.schema';
import { UtilsModule } from '../utils/utils.module';
import { ShoppingsModule } from '../shoppings/shoppings.module';
import { AuthModule } from '../auth/auth.module';
import { CommunicationsModule } from '../communication/communication.module';

/* import controllers */
import { BusinessUsersController } from './controllers/business/business.users.controller';
import { DeliveryUsersController } from './controllers/delivery/delivery.users.controller';
import {
  ClientUserNoProtectedController,
  ClientUsersController,
} from './controllers/client/client.users.controller';

/* import services */
import { BusinessUsersService } from './services/business/business.users.service';
import { ClientUsersService } from './services/client/client.users.service';
import { DeliveryUserService } from './services/delivery/delivery.users.service';

/* import utils */
import { ExternalUsersService } from './utils/external/external.users.service';
import { InternalUsersService } from './utils/internal/internal.users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Business',
        schema: UserBusinessSchemaFactory,
      },
      {
        name: 'Client',
        schema: UserClientSchemaFactory,
      },
      {
        name: 'Delivery',
        schema: UserDeliverySchemaFactory,
      },
      { name: 'Worker', schema: UserWorkerSchemaFactory },
    ]),
    /* utils */
    UtilsModule,
    ShoppingsModule,
    forwardRef(() => CommunicationsModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [
    BusinessUsersController,
    ClientUsersController,
    DeliveryUsersController,
    ClientUserNoProtectedController,
  ],
  providers: [
    BusinessUsersService,
    ClientUsersService,
    ExternalUsersService,
    DeliveryUserService,
    InternalUsersService,
  ],
  exports: [ExternalUsersService, MongooseModule],
})
export class UsersModule {}
