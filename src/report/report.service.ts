import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ReportService {
  constructor(private prisma: PrismaService) { }

  async create(createReportDto: CreateReportDto, files: Express.MulterS3.File[], idUser: number) {
    
    console.log(createReportDto)

    const policy = await this.prisma.policy.findUnique({
      where: { serialNumber: createReportDto.serialNumber }
    });

    const vehicle = await this.prisma.vehicle.findUnique({
      where: { plates: policy.plates }
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    /*const implicatePartiesData = createReportDto.involvedPeople.map((party) => ({
      name: party.name || null,
      plates: party.plates || null,
      brandId: parseInt(party.brand) || null,
      colorId: parseInt(party.color) || null
    }));*/

    const photographsData = files.map((file) => ({
      name: file.originalname,
      url: file.location
    }));

    const report = await this.prisma.report.create({
      data: {
        description: '',
        date: new Date(),
        latitude: createReportDto.location.latitude,
        longitude: createReportDto.location.longitude,
        Vehicle: {
          connect: { plates: vehicle.plates } 
        },
        Status: {
          connect: { idStatus: 1 }
        },
        Driver: {
          connect: { idUser: idUser }
        },
        ImplicateParties: {
          create: createReportDto.involvedPeople.map((person) => ({
            name: person.name,
            plates: person.plates,
            Brand: {
              connect: {
                idBrand: person.brandId
              }
            },
            Color: {
              connect: {
                idColor: person.colorId
              }
            }
          }))
        },
        Photographs: {
          create: photographsData
        }
      },
      include: {
        ImplicateParties: true,
        Photographs: true,
        Vehicle: true
      }
    });

    return report;
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
      where.date = { gte: new Date(firstdatetime), lte: new Date(enddatetime), };
    }
    let esConductor = false; // si es CONDUCTOR SOLO puede ver los SUYOS, si es Employee SOLO puede ver a los que esta ASIGNADO
    if (esConductor) {
      let idUser = 2
      if (idUser !== undefined && idUser !== null) {
        where.Driver = { some: { idUser: idUser, }, };
      }
    } else {
      let idEmployee = 1
      if (idEmployee !== undefined && idEmployee !== null) {
        where.Employee = { some: { idEmployee: idEmployee, }}
      }
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
