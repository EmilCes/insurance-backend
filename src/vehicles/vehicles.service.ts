import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class VehiclesService {
  constructor(
    private prisma: PrismaService
  ) { }

  async findColors() {
    const colors = await this.prisma.color.findMany();
    return colors;
  }

  async findServices() {
    const serviceVehicle = await this.prisma.serviceVehicle.findMany();
    return serviceVehicle;
  }

  async findTypes() {
    const types = await this.prisma.type.findMany();
    return types;
  }

  async validatePlates(plate: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { plates: plate }
    });
    return vehicle;
  }
}
