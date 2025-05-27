import { Controller, Get, Query } from '@nestjs/common';
import { PlataformSeacherService } from './plataform.searcher.service';

@Controller('api/plataform/searcher')
export class PlataformSearcherController {
  constructor(
    private readonly plataformSeacherService: PlataformSeacherService,
  ) {}

  @Get('get/recomendations/searcher')
  getRecomendationsSearcher(
    @Query('text') text: string,
    @Query('offest') offset: string,
  ) {
    return this.plataformSeacherService.getRecomendationsSearcher(text, offset);
  }

  @Get('get/products')
  getProductsSearched(
    @Query('text') text: string,
    @Query('offset') offset: string,
  ) {
    return this.plataformSeacherService.getProductsSearched(text, offset);
  }
}
