import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@Injectable()
export class ReportService {
  create(createReportDto: CreateReportDto, file: Express.Multer.File) {
    if (file) {
      console.log('Si hay imagen');
    } else {
      console.log('No hay imagen');
    }

    console.log('Datos del Reporte:');
    console.log('idReport:', createReportDto.idReport);
    console.log('description:', createReportDto.description);
    console.log('date:', createReportDto.date);
    console.log('latitude:', createReportDto.latitude);
    console.log('longitude:', createReportDto.longitude);
    console.log('result:', createReportDto.result);
    console.log('reportDecisionDate:', createReportDto.reportDecisionDate);
    console.log('plates:', createReportDto.plates);

    console.log('Photographs:');
    if (createReportDto.photographDto && createReportDto.photographDto.length > 0) {
      createReportDto.photographDto.forEach((photo, index) => {
        console.log(`Photograph ${index + 1}:`);
        console.log('  idPhotograph:', photo.idPhotograph);
        console.log('  name:', photo.name);
      });
    } else {
      console.log('No hay fotografías');
    }

    console.log('Implicate Parties:');
    if (createReportDto.implicatePartyDto && createReportDto.implicatePartyDto.length > 0) {
      createReportDto.implicatePartyDto.forEach((party, index) => {
        console.log(`Implicate Party ${index + 1}:`);
        console.log('  idImplicateParty:', party.idImplicateParty);
        console.log('  name:', party.name);
        console.log('  idModel:', party.idModel);
      });
    } else {
      console.log('No hay implicados');
    }
    return 'This action adds a new report';
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
