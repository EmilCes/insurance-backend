import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { Public } from 'src/skipAuth.decorator';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Public()
  @Get()
  findAll() {
    return this.brandsService.findAll();
  }

  @Public()
  @Get('/models/:id')
  findModels(@Param('id') id: string) {
    return this.brandsService.findModels(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandsService.findOne(+id);
  }

}
