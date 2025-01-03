import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { CreatePhotographDto } from './dto/photograph.dto';
import { PrismaService } from 'src/prisma.service';
import { ImplicatePartyDto } from './dto/implicate-party.dto';

@Injectable()
export class ReportService {
  constructor(private prisma: PrismaService) { }

  async create(createReportDto: CreateReportDto, file: CreatePhotographDto[], implicateParty: ImplicatePartyDto[]) {
    const vehicle = await this.prisma.vehicle.findFirst({
      where: {
        plates: createReportDto.plates, 
      },
      select: {
        plates: true, 
      },
    });

    if(!vehicle){
      throw new NotFoundException;
    }
    const newReport = await this.prisma.report.create({
      data: {
        description: createReportDto.description,
        date: new Date(),
        latitude: createReportDto.latitude,
        longitude: createReportDto.longitude,
        reportDecisionDate: createReportDto.reportDecisionDate || null,
        Vehicle: {
          connect: { plates: createReportDto.plates }, 
        },
        Status: {
          connect: { idStatus: 1 },
        },
        ImplicateParties: {
          create: implicateParty.map((party) => ({
            name: party.name || null, 
            idModel: party.idModel || null, 
            idColor: party.idColor || null,
          })),
        },
        Photographs: {
          create: file.map((photo) => ({
            name: photo.name,
            url: photo.url,
          })),

        },
      },
      include: {
        Photographs: true,
        ImplicateParties: true,
      },
    })
    return newReport;
  }

  findAll() {
    return `This action returns all report`;
  }

  findOne(id: number) {
    return `This action returns a #${id} report`;
  }

  update(id: number, updateReportDto: UpdateReportDto) {
    return `This action updates a #${id} report`;
  }

  remove(id: number) {
    return `This action removes a #${id} report`;
  }
}
