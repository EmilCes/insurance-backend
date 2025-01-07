import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

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

  async findAllVehicles(idUser: number) {
    const vehicles = await this.prisma.vehicle.findMany({
      select: {
        idModel: true, serialNumberVehicle: true, idColor: true, plates: true, idType: true, idService: true,
        occupants: true, Model: { select: { Brand: { select: { idBrand: true, name: true }}, year: true}},
        Color: { select: { vehicleColor: true }}, Type: { select: { vehicleType: true }},
        ServiceVehicle: { select: { name: true }}
      },
      where: { Policy: { some: { Driver: { idUser: idUser } } } }
    });
    return vehicles;
  }

  async validatePlates(plate: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { plates: plate }, select: { plates: true }
    });
    return vehicle;
  }
}
