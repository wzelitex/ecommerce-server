import { Controller, Get, Query } from '@nestjs/common';
import { ClientProductsService } from '../../services/client/client.products.service';

@Controller('api/client/products')
export class ClientProductsController {
  constructor(private readonly clientProductsService: ClientProductsService) {}

  @Get('get/products/searcher')
  findProductsSearcher(
    @Query('text') text: string,
    @Query('offset') offset: string,
  ) {
    return this.clientProductsService.findProductsSearcher(text, offset);
  }

  @Get()
  findProductsRecommendSearcher() {
    // return this.clientProductsService.fin;
  }

  @Get('get/random/products')
  findRandomProducts() {
    return this.clientProductsService.findProductsRandom();
  }

  @Get('get/products')
  findProducts(
    @Query('type') type: string,
    @Query('offset') offset: string,
    @Query('limit') limit: number,
  ) {
    return this.clientProductsService.findProducts(type, offset, limit);
  }

  @Get('get/product')
  findById(@Query('id') id: string) {
    return this.clientProductsService.findById(id);
  }

  @Get('get/business/products')
  findProductsByBusinessId(
    @Query('id') id: string,
    @Query('offset') offset: string,
  ) {
    return this.clientProductsService.findProductsByBusinessId(id, offset);
  }

  @Get('get/products/main/business')
  findProductsBestSellerOrCheaper(@Query('id') id: string) {
    return this.clientProductsService.findProductsSellerOrCheaper(id);
  }
}
