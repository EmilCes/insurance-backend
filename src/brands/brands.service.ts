import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

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
    return brands;
  }

  async findModelBrand(idModel: number) {
    const modelBrand = await this.prisma.model.findUnique({
      where: { idModel: idModel },
      select: { year: true, Brand: true }
    });
    return modelBrand;
  }

}
