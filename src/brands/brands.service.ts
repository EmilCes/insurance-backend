import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { BrandModel } from './entities/brandModel.entity';


@Injectable()
export class BrandsService {
  constructor(
    private prisma: PrismaService
  ) { }

  async findAll() {
    const brands = await this.prisma.brand.findMany({
      include: {
        Model: true
      },
      where: {
        Model: {
          some: {}
        }
      }
    });
    if (!brands) {
      throw new NotFoundException(`Brands not found`);
    }
    return brands;
  }

  findOne(id: number) {
    return `This action returns a #${id} brand`;
  }

  async findModelBrand(idModel: number){
    const modelBrand = await this.prisma.model.findUnique({
      where: { idModel : idModel },
      select: { year: true, Brand: true }
    });
    /*const model = await this.prisma.model.findUnique({ where: { idModel : idModel }});
    if (!model) {
      throw new NotFoundException(`Model not found`);
    }
    const brand = await this.prisma.brand.findFirst({
      select: {
        idBrand: true,
        name: true,
        Model: {
          where: {idModel : idModel}
        }
      }
    });*/
    if (!modelBrand) {
      throw new NotFoundException(`Brand or Model not found`);
    }

    const brandModel: BrandModel = { idBrand: modelBrand.Brand.idBrand, name: modelBrand.Brand.name, year: modelBrand.year};    
    return brandModel;
  }

}
