import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, ConflictException } from '@nestjs/common';
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
  async findColors() {
    return await this.vehiclesService.findColors();
  }

  @Public()
  @Get('/services')
  async findServiceVehicle() {
    return await this.vehiclesService.findServices();
  }

  @Public()
  @Get('/types')
  async findType() {
    return await this.vehiclesService.findTypes();
  }

  @Public()
  @Get('/plates/:plates')
  async validatePlates(@Param('plates') id: string) {
    const plates = await this.vehiclesService.validatePlates(id);
    if(plates){
      throw new ConflictException("Plates found");
    }
    return; 
  }

  @Public()
  @Get(':plates')
  findOne(@Param('plates') id: string) {
    return this.vehiclesService.findOne(id);
  }

  

}
