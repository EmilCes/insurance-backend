import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';


@Injectable()
export class BrandsService {
  constructor(
    private prisma: PrismaService
  ) { }

  findAll() {
    const brands = this.prisma.brand.findMany({
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

  findModels(id: number){
    const brands = this.prisma.model.findMany({
      where: { idBrand: id}
    });
    if (!brands) {
      throw new NotFoundException(`Models not found`);
    }
    
    return brands;
  }

}
