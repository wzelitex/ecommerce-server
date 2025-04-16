import {
  Body,
  Controller,
  Get,
  Patch,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import {
  AddLocationUserDto,
  UpdateDataSecitonDto,
  UpdateUsersDto,
} from '../../dto/update.users.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { BusinessUsersService } from '../../services/business/business.users.service';

@UseGuards(AuthGuard('jwt'))
@Controller('api/business/users')
export class BusinessUsersController {
  constructor(private readonly businessUsersService: BusinessUsersService) {}

  @Get('get/info')
  getInfo(@Req() req: Request) {
    return this.businessUsersService.getInfo(req.user.userId);
  }

  @Get('get/business')
  getBusiness(@Query('offset') offset: string) {
    return this.businessUsersService.getBusiness(offset);
  }

  @Patch('put/add/location')
  postAddLocation(@Body() data: AddLocationUserDto, @Req() req: Request) {
    return this.businessUsersService.postAddLocation(data, req.user.userId);
  }

  @UseInterceptors(FileInterceptor('exterior'))
  @UseInterceptors(FileInterceptor('interior'))
  @Patch('put/add/data/section')
  postAddDataSection(
    @UploadedFile() exterior: Express.Multer.File,
    @UploadedFile() interior: Express.Multer.File,
    @Body() data: UpdateDataSecitonDto,
    @Req() req: Request,
  ) {
    return this.businessUsersService.postAddDataSection(
      {
        aboutUs: data.aboutUs,
        exteriorImage: exterior,
        interiorImage: interior,
      },
      req.user.userId,
    );
  }

  @Patch('put/info')
  putInfo(@Req() req: Request, @Body() data: UpdateUsersDto) {
    return this.businessUsersService.putInfo(req.user.userId, {
      ...data,
      password: '',
    });
  }
}
