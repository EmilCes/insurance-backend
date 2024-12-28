import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, ConflictException, HttpException, UnprocessableEntityException } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { Public } from 'src/skipAuth.decorator';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) { }

  @Get('/colors')
  async findColors() {
    try {
      const colors = await this.vehiclesService.findColors();
      if (!colors) {
        throw new NotFoundException(`Colors not found`);
      }
      return colors;
    } catch (err) {
      if (err instanceof HttpException) {
        throw new HttpException(err.message, err.getStatus());
      }
      throw new UnprocessableEntityException("Error getting the colors");
    }

  }

  @Get('/services')
  async findServiceVehicle() {
    try {
      const serviceVehicle = await this.vehiclesService.findServices();
      if (!serviceVehicle) {
        throw new NotFoundException(`Service not found`);
      }
      return serviceVehicle;
    } catch (err) {
      if (err instanceof HttpException) {
        throw new HttpException(err.message, err.getStatus());
      }
      throw new UnprocessableEntityException("Error getting the vehicle services");
    }

  }

  @Get('/types')
  async findType() {
    try {
      const types = await this.vehiclesService.findTypes();
      if (!types) {
        throw new NotFoundException(`Types not found`);
      }
      return types;
    } catch (err) {
      if (err instanceof HttpException) {
        throw new HttpException(err.message, err.getStatus());
      }
      throw new UnprocessableEntityException("Error getting the vehicle types");
    }

  }

  @Get('/plates/:plates')
  async validatePlates(@Param('plates') id: string) {
    try {
      const vehicle = await this.vehiclesService.validatePlates(id);
      if (vehicle) {
        throw new ConflictException("Plates found");
      }
      return;
    } catch (err) {
      if (err instanceof HttpException) {
        throw new HttpException(err.message, err.getStatus());
      }
      throw new UnprocessableEntityException("Error validating the plates");
    }
  }

}
