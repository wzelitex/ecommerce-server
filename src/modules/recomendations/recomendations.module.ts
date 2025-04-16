import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RecomendationsBaseSchemaFactory,
  RecomendationsSchemaFactory,
  RecomendationsCommentsSchemaFactory,
} from './schema/recomendations.schema';
import { RecomendationsController } from './recomendations.controller';
import { RecomendationsService } from './recomendations.service';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Recomendations',
        schema: RecomendationsBaseSchemaFactory,
        discriminators: [
          {
            name: 'Recomendation',
            schema: RecomendationsSchemaFactory,
          },
          {
            name: 'Comment',
            schema: RecomendationsCommentsSchemaFactory,
          },
        ],
      },
    ]),
    UtilsModule,
  ],
  controllers: [RecomendationsController],
  providers: [RecomendationsService],
})
export class RecomendationsModule {}
