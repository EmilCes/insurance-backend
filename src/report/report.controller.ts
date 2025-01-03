import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, UnprocessableEntityException, UseInterceptors, UploadedFile, ValidationPipe, UploadedFiles, Request, BadRequestException, Put } from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Public } from 'src/skipAuth.decorator';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ValidationService } from './validation.service';
import { multerOptions } from './multer';
import { CreatePhotographDto } from './dto/photograph.dto';
import { UsersService } from 'src/users/users.service';
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
      //BUSCAR PLATES
      //BUSCAR ID USER del que hace la peticion
      //BUSCAR ID COLOR IMPLICATE
      //BUSCAR ID MODEL IMPLICATE
      //VALIDAR IMAGENES

      //PATCH QUE BUSCA Y HACE EL ID EMPLOYEE, ACUTALIZA DICTAMEN
      //GET 1 POR IDUSER COMPROBANDO QUE SEA
      //GET ALL DEL QUE ES USER

      //GET POR PAGINAS
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


  @Get()
  findAll() {
    return this.reportService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportService.findOne(+id);
  }

/*
  @Put(':idReport')
  @Public()
  @UseInterceptors(FilesInterceptor('photographs', 8, multerOptions))
  async update(@Request() req,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body(ValidationPipe) createReportDto: CreateReportDto,
  ) {
    try {
      //BUSCAR PLATES
      //BUSCAR ID USER del que hace la peticion
      //BUSCAR ID COLOR IMPLICATE
      //BUSCAR ID MODEL IMPLICATE
      //VALIDAR IMAGENES

      //PATCH QUE BUSCA Y HACE EL ID EMPLOYEE, ACUTALIZA DICTAMEN
      //GET 1 POR IDUSER COMPROBANDO QUE SEA
      //GET ALL DEL QUE ES USER

      //GET POR PAGINAS
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
  }*/

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
    return this.reportService.update(+id, updateReportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportService.remove(+id);
  }


  
}
