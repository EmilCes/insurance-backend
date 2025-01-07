import { Module } from '@nestjs/common';
import { MunicipalityService } from './municipality.service';
import { MunicipalityController } from './municipality.controller';
import { PrismaService } from 'src/prisma.service';


@Module({
  controllers: [MunicipalityController],
  providers: [MunicipalityService, PrismaService],
})
export class MunicipalityModule {}
