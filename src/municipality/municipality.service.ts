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

  async findAll() {
    return await this.prisma.municipality.findMany({
      select: {
        idMunicipality: true,
        municipalityName: true,
        idState: true
      },
    });
  }

}
