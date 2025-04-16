import {
  Body,
  Controller,
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
import { CreateProductShoeDto } from '../../dto/products.dto';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { BusinessProductsService } from '../../services/business/business.products.service';

@UseGuards(AuthGuard('jwt'))
@Controller('api/business/products')
export class BusinessProductsController {
  constructor(
    private readonly businessProductsService: BusinessProductsService,
  ) {}

  @Get('get/:id/product')
  getProductById(@Param('id') id: string) {
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
  @UseInterceptors(FileInterceptor('image'))
  createProduct(
    @Body() data: CreateProductShoeDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    const userId = req.user.userId;
    return this.businessProductsService.createProduct(
      {
        ...data,
        _id: '',
      },
      file,
      userId,
    );
  }

  @Patch('put/:id/product')
  putProductById(
    @Param('id') id: string,
    @Body() data: CreateProductShoeDto,
    file: Express.Multer.File,
    @Req() req: Request,
  ) {
    return this.businessProductsService.putProduct(
      id,
      {
        ...data,
        _id: id,
      },
      file,
      req.user.userId,
    );
  }

  @Patch('delete/:id/product')
  deleteProduct(@Param('id') id: string) {
    return this.businessProductsService.deleteProduct(id);
  }

  @Post('post/restore/:id/product')
  restoreProduct(@Param('id') id: string) {
    return this.businessProductsService.postRestoreProduct(id);
  }
}
