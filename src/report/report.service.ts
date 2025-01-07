import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CreateReportDto } from "./dto/create-report.dto";
import { AssignReportDto } from "./dto/assign-report.dto";
import { UpdateReportDictumDto } from "./dto/update-dictum.dto";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class ReportService {
  constructor(private prisma: PrismaService) {}

  async create(
    createReportDto: CreateReportDto,
    files: Express.MulterS3.File[],
    idUser: number,
  ) {

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

  async findReportsForSupportExecutive(filters: any, skip: number, take: number) {
    return this.prisma.report.findMany({
      where: filters,
      select: {
        reportNumber: true,
        description: true,
        date: true,
        latitude: true,
        longitude: true,
        Driver: {
          select: {
            phone: true,
            Account: {
              select: {
                name: true,
              },
            },
          },
        },
        Vehicle: {
          select: {
            plates: true,
          },
        },
      },
      skip,
      take,
    });
  }

  
  async findReportByFilters(filters: any) {
    return this.prisma.report.findUnique({
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
        AssignedEmployee: true
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
        AssignedEmployee: true,
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

  async findDetailedReportByReportNumber(filters: any) {
    return this.prisma.report.findUnique({
      where: filters,
      select: {
        idReport: true,
        reportNumber: true,
        description: true,
        date: true,
        reportDecisionDate: true,
        latitude: true,
        longitude: true,
        result: true,
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
  async getAvailableAdjusters() {
    try {
      // Recuperar empleados del tipo "Ajustador" que no tengan reportes pendientes
      const availableAdjusters = await this.prisma.employee.findMany({
        where: {
          idEmployeeType: 3, // Solo ajustadores
          assignedReports: {
            none: {
              idStatus: { not: 3 }, // Excluir ajustadores con reportes que no están en estado "resuelto"
            },
          },
        },
        include: {
          Account: {
            select: {
              name: true,
              lastName: true,
              email: true,
            },
          },
        },
      });
  
      // Formatear los datos
      return availableAdjusters.map((adjuster) => ({
        id: adjuster.idEmployee,
        name: `${adjuster.Account?.name} ${adjuster.Account?.lastName}`,
        email: adjuster.Account?.email,
      }));
    } catch (error) {
      console.error("Error al obtener ajustadores disponibles:", error);
      throw new InternalServerErrorException("Error al obtener ajustadores disponibles");
    }
  }
  

  async assignReport(reportNumber: string, assignReportDto: AssignReportDto) {
    const { assignedEmployeeId } = assignReportDto;

    const report = await this.prisma.report.findUnique({
      where: { reportNumber: reportNumber }
    });

    if (!report) {
      throw new NotFoundException('Reporte no encontrado');
    }

    const employee = await this.prisma.employee.findUnique({
      where: { idEmployee: assignedEmployeeId },
      include: { EmployeeType: true }
    });

    if (!employee || employee.EmployeeType.idEmployeeType !== 3) {
      throw new NotFoundException('Ajustador no encontrado o no es del tipo ajustador');
    }

    return this.prisma.report.update({
      where: { reportNumber: reportNumber },
      data: { assignedEmployeeId }
    })
  }

  async updateReportDictum(
    reportNumber: string,
    updateReportDictumDto: UpdateReportDictumDto,
    idEmployee: number
  ) {
    const report = await this.prisma.report.findUnique({
      where: { reportNumber: reportNumber }
    });

    if (!report) {
      throw new NotFoundException( `No se encontró el reporte con número de folio ${reportNumber}`);
    }

    if (report.assignedEmployeeId !== idEmployee) {
      throw new ForbiddenException('No tienes acceso para modificar este reporte');
    }

    await this.prisma.report.update({
      where: {
        reportNumber: reportNumber
      },
      data: {
        result: updateReportDictumDto.result,
        Status: {
          connect: {
            idStatus: 2
          }
        },
        reportDecisionDate: new Date()
      }
    });

    return;

  }
}
