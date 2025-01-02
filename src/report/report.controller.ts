import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, UnprocessableEntityException, UseInterceptors, UploadedFile, ValidationPipe } from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Public } from 'src/skipAuth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  //@Post()
  @Public()
  @UseInterceptors(FileInterceptor('file'))
  async create2( @UploadedFile() file: Express.Multer.File, @Body() createReportDto: CreateReportDto) {
    try {
      const newPolicyPlan = this.reportService.create(createReportDto,file);
      return newPolicyPlan;
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new UnprocessableEntityException("Error creating policy plan");
    }
  }

  @Post()
  @Public()
  async create(@Body(ValidationPipe) createReportDto: CreateReportDto) {
    try {
      console.log(createReportDto);
      const newPolicyPlan = this.reportService.create(createReportDto,undefined);
      return newPolicyPlan;
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      }
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
    return this.reportService.update(+id, updateReportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportService.remove(+id);
  }
}
