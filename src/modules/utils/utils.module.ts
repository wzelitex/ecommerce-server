import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BalanceSchemaFactory } from './schema/balance.shcema';

import { ResponseService } from './services/response.service';
import { CloudinaryService } from './services/image.service';
import { SanitizeService } from './services/sanitize.service';
import { EncryptService } from './services/encrypt.service';
import { BalanceService } from './services/balance.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Balance', schema: BalanceSchemaFactory },
    ]),
  ],
  providers: [
    ResponseService,
    CloudinaryService,
    SanitizeService,
    EncryptService,
    BalanceService,
  ],
  exports: [
    ResponseService,
    CloudinaryService,
    SanitizeService,
    EncryptService,
    BalanceService,
  ],
})
export class UtilsModule {}
