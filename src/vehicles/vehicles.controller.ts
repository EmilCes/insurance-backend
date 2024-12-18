import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Public } from 'src/skipAuth.decorator';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}


  @Get()
  findAll() {
    return this.vehiclesService.findAll();
  }

  @Public()
  @Get('/colors')
  findColors() {
    return this.vehiclesService.findColors();
  }

  @Public()
  @Get('/services')
  findServiceVehicle() {
    return this.vehiclesService.findServices();
  }

  @Public()
  @Get('/types')
  findType() {
    return this.vehiclesService.findTypes();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehiclesService.findOne(+id);
  }

}
