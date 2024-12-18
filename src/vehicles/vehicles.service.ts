import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(
    private prisma: PrismaService
  ) { }


  findAll() {
    return `This action returns all vehicles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vehicle`;
  }

  findColors() {
    const colors = this.prisma.color.findMany();
    if (!colors) {
      throw new NotFoundException(`Colors not found`);
    }

    return colors;
  }

  findServices() {
    const serviceVehicle = this.prisma.serviceVehicle.findMany();
    if (!serviceVehicle) {
      throw new NotFoundException(`Service not found`);
    }

    return serviceVehicle;
  }

  findTypes() {
    const types = this.prisma.type.findMany();
    if (!types) {
      throw new NotFoundException(`Types not found`);
    }

    return types;
  }

}
