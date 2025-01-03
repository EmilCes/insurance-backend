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

    if (!vehicle) {
      throw new NotFoundException;
    }

    const formatDateToStartOfDay = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}T00:00:00.000Z`;
    };

    const newReport = await this.prisma.report.create({
      data: {
        description: createReportDto.description,
        date: formatDateToStartOfDay(new Date()),
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

  async findReportPage(page: number, status: number, idReport: number, firstdatetime: string, enddatetime: string) {
    const pageSize = 3;
    const skip = page * pageSize;

    const where: any = {};
    if (status !== 0) {
      where.idStatus = status;
    }
    if (idReport !== undefined && idReport !== null && !isNaN(idReport)) {
      where.idReport = idReport;
    }
    if (firstdatetime && enddatetime) {
      where.date = {
        gte: new Date(firstdatetime),
        lte: new Date(enddatetime),
      };
    }

    let reports;
    if (status == 0) {
      reports = await this.prisma.report.findMany({
        where,
        skip,
        take: pageSize
      });
    } else {
      reports = await this.prisma.report.findMany({
        where,
        skip,
        take: pageSize
      });
    }
    return reports;
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
