import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Request,
  UnprocessableEntityException,
  UploadedFiles,
  UseInterceptors,
  ValidationPipe,
} from "@nestjs/common";
import { ReportService } from "./report.service";
import { CreateReportDto } from "./dto/create-report.dto";
import { FilesInterceptor } from "@nestjs/platform-express";
import { UsersService } from "../users/users.service";

import {
  RoleAdjuster,
  RoleDriver,
  RoleSupportExecutive,
} from "src/roleAuth.decorator";
import { ReportFilterDto } from "./dto/filter.dto";
import { EmployeeService } from "src/employee/employee.service";
import { AssignReportDto } from "./dto/assign-report.dto";
import { UpdateReportDictumDto } from "./dto/update-dictum.dto";

@Controller("reports")
export class ReportController {
  constructor(
    private readonly reportService: ReportService,
    private readonly usersService: UsersService,
    private readonly employeeService: EmployeeService,
  ) {}

  @Post()
  @RoleDriver()
  @UseInterceptors(FilesInterceptor("images", 8))
  async create(
    @Request() req,
    @UploadedFiles() files: Array<Express.MulterS3.File>,
    @Body(ValidationPipe) createReportDto: CreateReportDto,
  ) {
    try {
      const idUser = await this.usersService.getIdUserFromEmail(
        req.user.username,
      );

      if (idUser <= 0) {
        throw new BadRequestException("Error with the request data");
      }

      const reportNumber = await this.reportService.create(
        createReportDto,
        files,
        idUser,
      );

      return { reportNumber: reportNumber };
    } catch (error) {
      throw new UnprocessableEntityException("Error creating report");
    }
  }

  

  @Get()
  @RoleDriver()
  @RoleAdjuster()
  @RoleSupportExecutive()
  async getReports(@Request() req, @Query() query: ReportFilterDto) {
    const { page = 0, status, reportNumber, startYear, endYear } = query;

    let idUser = 0;
    let idEmployee = 0;
    const role = req.user.role;

    if (role === "Conductor") {
      idUser = await this.usersService.getIdUserFromEmail(req.user.username);
    } else if (role === "Ajustador" || role === "Ejecutivo de asistencia") {
      idEmployee = await this.employeeService.getIdEmployeeFromEmail(
        req.user.username,
      );
    }

    if (idUser <= 0 && idEmployee <= 0) {
      throw new BadRequestException("Error with the request data");
    }

    try {
      const pageSize = 3;

      // Filtrar por número de reporte específico
      if (reportNumber !== undefined) {
        const filters: any = { reportNumber };

        if (role === "Conductor") {
          filters.driverId = idUser;
        } else if (role === "Ajustador" || role === "Ejecutivo de asistencia") {
          filters.Employee = {
            some: {
              idEmployee: idEmployee,
            },
          };
        }

        const report = await this.reportService.findReportByFilters(filters);


        if (!report) {
          return {
            data: [],
            pageInfo: {
              totalItems: 0,
              totalPages: 0,
              currentPage: page,
              itemsPerPage: pageSize,
            },
          };
        }

        const formattedReport = this.formatReport(report);

        return {
          data: [formattedReport],
          pageInfo: {
            totalItems: 1,
            totalPages: 1,
            currentPage: 0,
            itemsPerPage: pageSize,
          },
        };
      }

      const filters: any = {};

      // Filtrar por estado (status)
      if (status && status !== 0) {
        filters.idStatus = status;
      }

      // Filtrar por rango de fechas
      if ((startYear && !endYear) || (!startYear && endYear)) {
        throw new BadRequestException(
          "Debes proporcionar el año de inicio y fin",
        );
      }

      if (startYear && endYear) {
        if (startYear > endYear) {
          throw new BadRequestException(
            "El año de inicio no puede ser mayor al año de fin",
          );
        }

        const startDate = new Date(`${startYear}-01-01T00:00:00.000Z`);
        const endDate = new Date(`${endYear}-12-31T23:59:59.999Z`);

        filters.date = { gte: startDate, lte: endDate };
      }

      // Lógica para cada rol
      if (role === "Conductor") {
        filters.driverId = idUser;
      } else if (role === "Ajustador") {
        // Ajustador: reportes asignados a sí mismo o no asignados
        filters.OR = [
          { AssignedEmployee: { is: { idEmployee: idEmployee } } },
          { AssignedEmployee: null }, // Reportes no asignados
        ];
      } else if (role === "Ejecutivo de asistencia") {
        // Ejecutivo de asistencia: solo reportes no asignados y campos específicos
        filters.AssignedEmployee = null;

        const reports = await this.reportService.findReportsForSupportExecutive(
          filters,
          page * pageSize,
          pageSize,
        );

        const totalCount = await this.reportService.countReports(filters);
        const totalPages = Math.ceil(totalCount / pageSize);

        return {
          data: reports,
          pageInfo: {
            totalItems: totalCount,
            totalPages: totalPages,
            currentPage: page,
            itemsPerPage: pageSize,
          },
        };
      }

      const skip = page * pageSize;

      const totalCount = await this.reportService.countReports(filters);
      const totalPages = Math.ceil(totalCount / pageSize);

      const reports = await this.reportService.findReports(filters, skip, pageSize);

      if (!reports || reports.length === 0) {
        return {
          data: [],
          pageInfo: {
            totalItems: 0,
            totalPages: 0,
            currentPage: page,
            itemsPerPage: pageSize,
          },
        };
      }

      const formattedReports = reports.map((report) =>
        this.formatReport(report),
      );

      return {
        data: formattedReports,
        pageInfo: {
          totalItems: totalCount,
          totalPages: totalPages,
          currentPage: page,
          itemsPerPage: pageSize,
        },
      };
    } catch (error) {
      console.log(error);
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }

      throw new InternalServerErrorException("Error al obtener reportes");
    }
  }

  @Get("detail/:reportNumber")
  @RoleAdjuster()
  @RoleDriver()
  async getReportDetail(
    @Request() req,
    @Param("reportNumber") reportNumber: string,
  ) {
    try {
      const role = req.user.role;
      const username = req.user.username;
      let idUser = 0;
      let idEmployee = 0;

      if (role === "Conductor") {
        idUser = await this.usersService.getIdUserFromEmail(username);
      } else if (role === "Ajustador") {
        idEmployee = await this.employeeService.getIdEmployeeFromEmail(
          username,
        );
      }

      if (idUser <= 0 && idEmployee <= 0) {
        console.log(0);
        throw new BadRequestException("Error with the request data");
      }

      const filters: any = {};

      if (role === "Conductor") {
        filters.driverId = idUser;
      } else if (role === "Ajustador") {
        filters.AssignedEmployee = {
          is: {
            idEmployee: idEmployee,
          },
        };
      }

      filters.reportNumber = reportNumber;

      const report = await this.reportService.findDetailedReportByReportNumber(
        filters,
      );

      if (!report) {
        throw new NotFoundException(
          `No se encontró el reporte con número de folio ${reportNumber}`,
        );
      }

      const formattedReport = this.formatDetailedReport(report);

      return {
        data: formattedReport,
      };
    } catch (error) {
      console.log(error);
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException("Error al obtener el reporte");
    }
  }

  @Put(":reportNumber/assign")
  @RoleSupportExecutive()
  async assignReport(
    @Param("reportNumber") reportNumber: string,
    @Body() assignReportDto: AssignReportDto,
  ) {
    return this.reportService.assignReport(reportNumber, assignReportDto);
  }

  @Get('available-adjusters')
  @RoleSupportExecutive() // Si aplica alguna validación de rol
  async getAvailableAdjusters() {
    return this.reportService.getAvailableAdjusters();
  }
  


  @Put(":reportNumber/dictum")
  @RoleAdjuster()
  async updateDictum(
    @Request() req,
    @Param("reportNumber") reportNumber: string,
    @Body(ValidationPipe) updateReportDictumDto: UpdateReportDictumDto,
  ) {
    try {
      const role = req.user.role;
      const username = req.user.username;

      if (role !== "Ajustador") {
        throw new ForbiddenException(
          "Solo los austadores pueden actualizar el dictamen.",
        );
      }

      const idEmployee = await this.employeeService.getIdEmployeeFromEmail(
        username,
      );

      if (!idEmployee || idEmployee <= 0) {
        throw new BadRequestException("Error con los datos del usuario");
      }

      await this.reportService.updateReportDictum(
        reportNumber,
        updateReportDictumDto,
        idEmployee,
      );

      return { message: "Dictamen actualizado correctamente" };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        "Error al actualizar el dictamen",
      );
    }
  }

  private formatReport(report: any) {
    return {
      reportNumber: report.reportNumber,
      creationDate: report.date,
      decisionDate: report.reportDecisionDate,
      status: report.Status.statusType,
      vehicle: {
        plates: report.Vehicle.plates,
        modelYear: report.Vehicle.Model.year,
        brand: report.Vehicle.Model.Brand.name,
      },
      policyPlan: report.Vehicle.Policy && report.Vehicle.Policy[0]
        ? report.Vehicle.Policy[0].PolicyPlan.title
        : null,
    };
  }

  private formatDetailedReport(report: any) {
    return {
      reportNumber: report.reportNumber,
      description: report.description,
      date: report.date,
      decisionDate: report.reportDecisionDate,
      dictumResult: report.result,
      latitude: report.latitude,
      longitude: report.longitude,
      status: report.Status.statusType,
      photographs: report.Photographs.map((photo) => ({
        name: photo.name,
        url: photo.url,
      })),
      implicateParties: report.ImplicateParties.map((party) => ({
        name: party.name,
        plates: party.plates,
        brand: party.Brand ? party.Brand.name : null,
        color: party.Color ? party.Color.vehicleColor : null,
      })),
      driver: report.Driver
        ? {
          phone: report.Driver.phone,
          licenseNumber: report.Driver.licenseNumber,
          name: report.Driver.Account.name,
          email: report.Driver.Account.email,
        }
        : null,
      vehicle: {
        plates: report.Vehicle.plates,
        serialNumberVehicle: report.Vehicle.serialNumberVehicle,
        occupants: report.Vehicle.occupants,
        color: report.Vehicle.Color.vehicleColor,
        modelYear: report.Vehicle.Model.year,
        brand: report.Vehicle.Model.Brand.name,
        type: report.Vehicle.Type.vehicleType,
        serviceVehicle: report.Vehicle.ServiceVehicle.name,
      },
      policy: report.Vehicle.Policy.length > 0
        ? {
          serialNumber: report.Vehicle.Policy[0].serialNumber,
          startDate: report.Vehicle.Policy[0].startDate,
          policyPlan: {
            title: report.Vehicle.Policy[0].PolicyPlan.title,
            description: report.Vehicle.Policy[0].PolicyPlan.description,
          },
        }
        : null,
    };
  }


}
