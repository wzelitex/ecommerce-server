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
import { AddLocationUserDto, UpdateUsersDto } from '../../dto/update.users.dto';
import { BusinessUsersService } from '../../services/business/business.users.service';
import { NetWorksUsersInterface } from '../../interface/users.interface';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @Patch('put/add/networks')
  postAddNetworks(@Body() data: NetWorksUsersInterface, @Req() req: Request) {
    return this.businessUsersService.putAddNetworks(req.user.userId, data);
  }

  @Patch('put/add/complement')
  @UseInterceptors(FileInterceptor('image'))
  postAddComplement(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: { description: string; image: string },
    @Req() req: Request,
  ) {
    return this.businessUsersService.putAddComplement(
      req.user.userId,
      data,
      file,
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
