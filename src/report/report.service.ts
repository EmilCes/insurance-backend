import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateReportDto } from "./dto/create-report.dto";
import { UpdateReportDto } from "./dto/update-report.dto";
import { PrismaService } from "../prisma.service";

@Injectable()
export class ReportService {
  constructor(private prisma: PrismaService) {}

  async create(
    createReportDto: CreateReportDto,
    files: Express.MulterS3.File[],
    idUser: number,
  ) {
    console.log(createReportDto);

    const policy = await this.prisma.policy.findUnique({
      where: { serialNumber: createReportDto.serialNumber },
    });

    const vehicle = await this.prisma.vehicle.findUnique({
      where: { plates: policy.plates },
    });

    if (!vehicle) {
      throw new NotFoundException("Vehicle not found");
    }

    const photographsData = files.map((file) => ({
      name: file.originalname,
      url: file.location,
    }));

    const reportNumber = await this.generateUniqueReportNumber();

    const report = await this.prisma.report.create({
      data: {
        reportNumber: reportNumber,
        description: "",
        date: new Date(),
        latitude: createReportDto.location.latitude,
        longitude: createReportDto.location.longitude,
        Vehicle: {
          connect: { plates: vehicle.plates },
        },
        Status: {
          connect: { idStatus: 1 },
        },
        Driver: {
          connect: { idUser: idUser },
        },
        ImplicateParties: {
          create: createReportDto.involvedPeople.map((person) => ({
            name: person.name,
            plates: person.plates,
            Brand: {
              connect: {
                idBrand: person.brandId,
              },
            },
            Color: {
              connect: {
                idColor: person.colorId,
              },
            },
          })),
        },
        Photographs: {
          create: photographsData,
        },
      },
      include: {
        ImplicateParties: true,
        Photographs: true,
        Vehicle: true,
      },
    });

    return report.reportNumber;
  }

  async findReportByReportNumber(reportNumber: string) {
    return this.prisma.report.findUnique({
      where: { reportNumber: reportNumber },
      select: {
        idReport: true,
        date: true,
        reportDecisionDate: true,
        reportNumber: true,
        Status: true,
        Vehicle: {
          select: {
            plates: true,
            Model: {
              select: {
                year: true,
                Brand: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            Policy: {
              where: {
                isCanceled: false,
              },
              orderBy: {
                startDate: "desc",
              },
              take: 1,
              select: {
                PolicyPlan: {
                  select: {
                    title: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async findReports(filters: any, skip: number, take: number) {
    return this.prisma.report.findMany({
      where: filters,
      select: {
        idReport: true,
        date: true,
        reportDecisionDate: true,
        reportNumber: true,
        Status: true,
        Vehicle: {
          select: {
            plates: true,
            Model: {
              select: {
                year: true,
                Brand: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            Policy: {
              where: {
                isCanceled: false,
              },
              orderBy: {
                startDate: "desc",
              },
              take: 1,
              select: {
                PolicyPlan: {
                  select: {
                    title: true,
                  },
                },
              },
            },
          },
        },
      },
      skip,
      take,
    });
  }

  async countReports(filters: any) {
    return this.prisma.report.count({
      where: filters,
    });
  }

  /*hasAccessToReport(userId: number, reportId: number): boolean {
    if ()
  }*/

  async findDetailedReportByReportNumber(reportNumber: string) {
    return this.prisma.report.findUnique({
      where: { reportNumber: reportNumber },
      select: {
        idReport: true,
        reportNumber: true,
        description: true,
        date: true,
        reportDecisionDate: true,
        latitude: true,
        longitude: true,
        Status: {
          select: {
            statusType: true,
          },
        },
        Photographs: {
          select: {
            name: true,
            url: true,
          },
        },
        ImplicateParties: {
          select: {
            name: true,
            plates: true,
            Brand: {
              select: {
                name: true,
              },
            },
            Color: {
              select: {
                vehicleColor: true,
              },
            },
          },
        },
        Driver: {
          select: {
            phone: true,
            licenseNumber: true,
            Account: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        Vehicle: {
          select: {
            plates: true,
            serialNumberVehicle: true,
            occupants: true,
            Color: {
              select: {
                vehicleColor: true,
              },
            },
            Model: {
              select: {
                year: true,
                Brand: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            Type: {
              select: {
                vehicleType: true,
              },
            },
            ServiceVehicle: {
              select: {
                name: true,
              },
            },
            Policy: {
              where: {
                isCanceled: false,
              },
              orderBy: {
                startDate: "desc",
              },
              take: 1,
              select: {
                serialNumber: true,
                startDate: true,
                PolicyPlan: {
                  select: {
                    title: true,
                    description: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async generateUniqueReportNumber(): Promise<string> {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let reportNumber = "";
    let isUnique = false;

    while (!isUnique) {
      reportNumber = "";
      for (let i = 0; i < 6; i++) {
        reportNumber += characters.charAt(
          Math.floor(Math.random() * characters.length),
        );
      }

      const existingReport = await this.prisma.report.findUnique({
        where: { reportNumber: reportNumber },
      });

      if (!existingReport) {
        isUnique = true;
      }
    }

    return reportNumber;
  }
}
