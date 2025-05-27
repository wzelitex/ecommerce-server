import { Module } from '@nestjs/common';
import { UserBusinessSchema } from '../users/schema/users.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { UtilsModule } from '../utils/utils.module';
import { ProductsModule } from '../products/products.module';

/* imports services */
import { PlataformSeacherService } from './sub-modules/searcher/plataform.searcher.service';

/* import controllers */
import { PlataformSearcherController } from './sub-modules/searcher/plataform.searcher.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Business',
        schema: UserBusinessSchema,
      },
    ]),
    UsersModule,
    UtilsModule,
    ProductsModule,
  ],
  controllers: [PlataformSearcherController],
  providers: [PlataformSeacherService],
})
export class PlataformModule {}
