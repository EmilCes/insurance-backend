import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, HttpException, UnprocessableEntityException, BadRequestException } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { Public } from 'src/skipAuth.decorator';
import { BrandModel } from './entities/brandModel.entity';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) { }

  @Get()
  async findAll() {
    try {
      const brands = await this.brandsService.findAll();
      if (!brands) {
        throw new NotFoundException(`Brands not found`);
      }
      return brands;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new UnprocessableEntityException("Error getting the brands");
    }
  }

  @Get('/models/:idModel')
  async findModels(@Param('idModel') idModel: string) {
    try {
      const modelBrand = await this.brandsService.findModelBrand(+idModel);
      if (!modelBrand) {
        throw new NotFoundException(`Brand or Model not found`);
      }
      const brandModel: BrandModel = { idBrand: modelBrand.Brand.idBrand, name: modelBrand.Brand.name, year: modelBrand.year };
      return brandModel;
      
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new UnprocessableEntityException("Error getting the models and brands");
    }

  }

}
