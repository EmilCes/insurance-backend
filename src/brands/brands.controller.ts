import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { Public } from 'src/skipAuth.decorator';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Public()
  @Get()
  async findAll() {
    return await this.brandsService.findAll();
  }

  @Public()
  @Get('/models/:idModel')
  findModels(@Param('idModel') idModel: string) {
    return this.brandsService.findModelBrand(+idModel);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandsService.findOne(+id);
  }

}
