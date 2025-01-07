/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateMunicipalityDto } from './dto/create-municipality.dto';
import { UpdateMunicipalityDto } from './dto/update-municipality.dto';
import { PrismaService } from 'src/prisma.service';


@Injectable()
export class MunicipalityService {

  constructor(
      private prisma: PrismaService
    ) { }

  create(createMunicipalityDto: CreateMunicipalityDto) {
    return 'This action adds a new municipality';
  }

  async findAll() {
    return await this.prisma.municipality.findMany({
      select: {
        idMunicipality: true,
        municipalityName: true,
        idState: true
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} municipality`;
  }

  update(id: number, updateMunicipalityDto: UpdateMunicipalityDto) {
    return `This action updates a #${id} municipality`;
  }

  remove(id: number) {
    return `This action removes a #${id} municipality`;
  }
}
