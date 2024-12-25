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
    const model = await this.prisma.model.findUnique({ where: { idModel : idModel }});
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
    });
    if (!brand) {
      throw new NotFoundException(`Brand not found`);
    }

    const brandModel: BrandModel = { idBrand: brand.idBrand, name: brand.name, year: model.year};    
    return brandModel;
  }

}
