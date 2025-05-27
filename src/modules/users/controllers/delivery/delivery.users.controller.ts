import {
  Body,
  Controller,
  Get,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { DeliveryUserService } from '../../services/delivery/delivery.users.service';
import { UpdateInfoDeliveryDto } from '../../dto/update.users.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('api/delivery/users')
export class DeliveryUsersController {
  constructor(private readonly usersDeliveryService: DeliveryUserService) {}

  @Get('get/info')
  getInfo(@Req() req: Request) {
    return this.usersDeliveryService.getInfo(req.user.userId);
  }

  @Get('get/delivery/name')
  getNameDelivery(@Query('id') id: string) {
    return this.usersDeliveryService.getName(id);
  }

  @Patch('put/info')
  putInfo(@Req() req: Request, @Body() data: UpdateInfoDeliveryDto) {
    return this.usersDeliveryService.putInfo(req.user.userId, data);
  }
}
