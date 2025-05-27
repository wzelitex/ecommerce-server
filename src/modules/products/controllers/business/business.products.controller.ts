import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  CreateProductShoeDto,
  UpdateProductShoeDto,
} from '../../dto/products.dto';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { BusinessProductsService } from '../../services/business/business.products.service';

@Controller('api/business/products')
@UseGuards(AuthGuard('jwt'))
export class BusinessProductsController {
  constructor(
    private readonly businessProductsService: BusinessProductsService,
  ) {}

  @Get('get/product')
  getProductById(@Query('id') id: string) {
    return this.businessProductsService.findById(id);
  }

  @Get('get/products')
  getProducts(
    @Req() req: Request,
    @Query('offset') offset: string,
    @Query('limit') limit: number,
    @Query('isDeleted') isDeleted: boolean,
  ) {
    return this.businessProductsService.findAll(
      req.user.userId,
      offset,
      isDeleted,
      limit,
    );
  }

  @Post('post/product')
  @UseInterceptors(FileInterceptor('file'))
  createProduct(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: CreateProductShoeDto,
    @Req() req: Request,
  ) {
    return this.businessProductsService.createProduct(
      req.user.userId,
      { ...data },
      file,
    );
  }

  @Patch('put/product')
  putProductById(
    @Query('id') id: string,
    @Body() data: UpdateProductShoeDto,
    @Req() req: Request,
  ) {
    return this.businessProductsService.putProduct(id, req.user.userId, data);
  }

  @Delete('delete/product')
  deleteProduct(@Query('id') id: string) {
    return this.businessProductsService.deleteProduct(id);
  }

  @Post('post/restore/product')
  restoreProduct(@Query('id') id: string) {
    return this.businessProductsService.postRestoreProduct(id);
  }
}
