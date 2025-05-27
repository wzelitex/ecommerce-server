import {
  Body,
  Controller,
  Get,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UpdateUsersDto } from '../../dto/update.users.dto';
import { ClientUsersService } from '../../services/client/client.users.service';

@UseGuards(AuthGuard('jwt'))
@Controller('api/client/users')
export class ClientUsersController {
  constructor(private readonly clientUsersService: ClientUsersService) {}

  @Get('get/email')
  getEmail(@Req() req: Request) {
    return this.clientUsersService.getEmail(req.user.userId);
  }

  @Get('get/info')
  getInfo(@Req() req: Request) {
    return this.clientUsersService.getInfo(req.user.userId);
  }

  @Get('get/business/searcher')
  getBusinessSearcher(
    @Query('offset') offset: string,
    @Query('text') text: string,
  ) {
    return this.clientUsersService.getBusinessSearcher(text, offset);
  }

  @Get('get/business/recommend')
  getBusinessRecommend(@Req() req: Request) {
    return this.clientUsersService.getBusinessRecommend(req.user.userId);
  }

  @Patch('put/info')
  putInfo(@Req() req: Request, @Body() data: UpdateUsersDto) {
    return this.clientUsersService.putInfo(req.user.userId, data);
  }
}

@Controller('api/client/users')
export class ClientUserNoProtectedController {
  constructor(private readonly clientUsersService: ClientUsersService) {}

  @Get('get/header/data')
  getHeaderData(@Query('id') id: string) {
    return this.clientUsersService.getHomePageBusiness(id);
  }

  @Get('get/random/business')
  getRandomBusiness() {
    return this.clientUsersService.getRandomBusiness();
  }
}
