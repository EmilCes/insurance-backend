import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UnprocessableEntityException,
  UploadedFiles,
  UseInterceptors,
  ValidationPipe,
} from "@nestjs/common";
import { ReportService } from "./report.service";
import { CreateReportDto } from "./dto/create-report.dto";
import { UpdateReportDto } from "./dto/update-report.dto";
import { Public } from "../skipAuth.decorator";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ValidationService } from "./validation.service";
import { UsersService } from "../users/users.service";

import { AwsConfigService } from "src/AWS/aws-config.service";
import { RoleDriver } from "src/roleAuth.decorator";
import { FormDataRequest } from "nestjs-form-data";

@Controller("reports")
export class ReportController {
  constructor(
    private readonly reportService: ReportService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  //@FormDataRequest()
  @RoleDriver()
  @UseInterceptors(FilesInterceptor("images", 8))
  async create(
    @Request() req,
    @UploadedFiles() files: Array<Express.MulterS3.File>,
    @Body(ValidationPipe) createReportDto: CreateReportDto,
  ) {
    console.log("Archivos subidos:", files);

    try {
      const idUser = await this.usersService.getIdUserFromEmail(
        req.user.username,
      );

      if (idUser <= 0) {
        throw new BadRequestException("Error with the request data");
      }

      const report = await this.reportService.create(
        createReportDto,
        files,
        idUser,
      );

      return report;

    } catch (error) {
      console.log(error);
      throw new UnprocessableEntityException("Error creating report");
    }
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateReportDto: UpdateReportDto) {
    return this.reportService.update(+id, updateReportDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.reportService.remove(+id);
  }

  @Get()
  @Public()
  async findFilter(
    @Request() req,
    @Query("page", ParseIntPipe) query: number,
    @Query("status", ParseIntPipe) status: number,
    @Query("idReport") idReport?: number,
    @Query("firstdate") firstdate?: string,
    @Query("enddate") enddate?: string,
  ) {
    try {
      if (query < 0) {
        throw new BadRequestException("Invalid page");
      }
      let firstdatetime;
      let enddatetime;
      let firstparsedDate: Date | undefined;
      let endparsedDate: Date | undefined;
      if (firstdate && enddate) {
        firstdatetime = new Date(firstdate).toISOString();
        enddatetime = new Date(enddate).toISOString();
        firstparsedDate = new Date(firstdatetime);
        endparsedDate = new Date(enddatetime);
        if (
          isNaN(firstparsedDate.getTime()) || isNaN(endparsedDate.getTime())
        ) {
          throw new BadRequestException("Invalid date.");
        }
      }
      switch (status) {
        case 0:
        case 1:
        case 2:
          const reports = await this.reportService.findReportPage(
            query,
            status,
            idReport,
            firstdatetime,
            enddatetime,
          );
          if (reports.length > 0) {
            return reports;
          }
          break;
        default:
          throw new BadRequestException("Invalid status");
      }
      throw new NotFoundException("Report not found");
    } catch (err) {
      console.log(err);
      if (err instanceof HttpException) {
        throw err;
      }
      throw new UnprocessableEntityException("Error getting the reports");
    }
  }
}
