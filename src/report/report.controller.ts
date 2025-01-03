import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, UnprocessableEntityException, UseInterceptors, UploadedFile, ValidationPipe, UploadedFiles, Request, BadRequestException, Put, ParseIntPipe, Query, NotFoundException } from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Public } from '../skipAuth.decorator';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ValidationService } from './validation.service';
import { multerOptions } from './multer';
import { CreatePhotographDto } from './dto/photograph.dto';
import { UsersService } from '../users/users.service';
import { ImplicatePartyDto } from './dto/implicate-party.dto';


@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService, private readonly validationService: ValidationService, private readonly usersService: UsersService) { }

  @Post()
  @Public()
  @UseInterceptors(FilesInterceptor('photographs', 8, multerOptions))
  async create(@Request() req,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body(ValidationPipe) createReportDto: CreateReportDto,
  ) {
    try {
      const body = req.body;
      if (body) {
        const implicateParties = this.validationService.parseImplicatePartyDto(body);
        createReportDto.implicatePartyDto = implicateParties;
      }
      this.validationService.validateReportData(createReportDto);
      const photographs: CreatePhotographDto[] = files.map((file) => ({
        name: file.originalname,
        url: `uploads/${file.filename}`,
      }));
      const newReport = await this.reportService.create(createReportDto, photographs, createReportDto.implicatePartyDto);
      return newReport;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error);
      throw new UnprocessableEntityException("Error creating policy plan");
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
    return this.reportService.update(+id, updateReportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportService.remove(+id);
  }

  @Get()
  @Public()
  async findFilter(@Request() req, @Query("page", ParseIntPipe) query: number, @Query("status", ParseIntPipe) status: number,
    @Query("idReport") idReport?: number, @Query("firstdate") firstdate?: string,  @Query("enddate") enddate?: string) {
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
        if (isNaN(firstparsedDate.getTime()) || isNaN(endparsedDate.getTime())) {
          throw new BadRequestException('Invalid date.');
        }
      }
      switch (status) {
        case 0:
        case 1:
        case 2:
          const reports = await this.reportService.findReportPage(query, status, idReport, firstdatetime, enddatetime);
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
