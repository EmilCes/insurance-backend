import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import { PoliciesService } from 'src/policies/policies.service';

@Module({
  controllers: [VehiclesController],
  providers: [VehiclesService, PrismaService, UsersService, PoliciesService],
})
export class VehiclesModule {}
