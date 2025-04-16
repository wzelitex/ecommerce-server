import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { BusinessShoppingsService } from '../../services/business/business.shoppings.service';

@UseGuards(AuthGuard('jwt'))
@Controller('api/business/shoppings')
export class BusinessShoppingsController {
  constructor(
    private readonly businessShoppingsService: BusinessShoppingsService,
  ) {}

  @Get('get/shoppings')
  findAll(
    @Req() req: Request,
    @Query('offset') offset: string,
    @Query('limit') limit: number,
  ) {
    return this.businessShoppingsService.findAll(
      req.user.userId,
      offset,
      limit,
    );
  }

  @Get('get/shopping')
  findOne(@Query('id') id: string) {
    return this.businessShoppingsService.findOne(id);
  }
}
