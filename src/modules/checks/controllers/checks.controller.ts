import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ChecksService } from '../services/checks.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/checks')
export class ChecksController {
  constructor(private readonly checksService: ChecksService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('get/check')
  getCheck(@Query('id') id: string) {
    return this.checksService.getCheckById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('post/validate/payment')
  @UseInterceptors(FileInterceptor('file'))
  postValidatePayment(
    @UploadedFile() file: Express.Multer.File,
    @Query('id') id: string,
  ) {
    return this.checksService.postValidatePayment(id, file);
  }

  @Get('get/checks')
  getChecks(
    @Query('offset') offset: string,
    @Query('type') type: 'pending' | 'accepted' | 'rejected',
  ) {
    return this.checksService.getChecks(offset, type);
  }

  @Get('get/details/check')
  getDetailsCheck(@Query('id') id: string) {
    return this.checksService.getCheck(id);
  }

  @Post('post/complete/check')
  postCompleteCheck(
    @Query('id') id: string,
    @Query('type') type: 'accepted' | 'rejected',
    @Query('rejectionReason') rejectionReason: 'money' | 'invalid',
  ) {
    return this.checksService.postCompleteCheck(id, type, rejectionReason);
  }
}
