import { Module } from '@nestjs/common';
import { PoliciesService } from './policies.service';
import { PoliciesController } from './policies.controller';
import { PrismaService } from 'src/prisma.service';
import { VehiclesService } from 'src/vehicles/vehicles.service';

@Module({
  controllers: [PoliciesController],
  providers: [PoliciesService, PrismaService, VehiclesService],
})
export class PoliciesModule {}
