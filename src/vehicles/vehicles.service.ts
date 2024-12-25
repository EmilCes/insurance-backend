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

  findOne(id: string) {
    return `This action returns a #${id} vehicle`;
  }

  async findColors() {
    const colors = await this.prisma.color.findMany();
    if (!colors) {
      throw new NotFoundException(`Colors not found`);
    }

    return colors;
  }

  async findServices() {
    const serviceVehicle = await this.prisma.serviceVehicle.findMany();
    if (!serviceVehicle) {
      throw new NotFoundException(`Service not found`);
    }

    return serviceVehicle;
  }

  async findTypes() {
    const types = await this.prisma.type.findMany();
    if (!types) {
      throw new NotFoundException(`Types not found`);
    }

    return types;
  }

  async validatePlates(plate: string){
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { plates: plate}
    });

    if (!vehicle) {
      return null;
    }

    return vehicle;
  }
}
