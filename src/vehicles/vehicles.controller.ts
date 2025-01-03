import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, ConflictException, HttpException, UnprocessableEntityException, UnauthorizedException, BadRequestException, Request } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { RoleDriver } from '../roleAuth.decorator';
import { UsersService } from '../users/users.service';
import { PoliciesService } from '../policies/policies.service';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService, private readonly usersService: UsersService, private readonly policiesService: PoliciesService) { }

  @Get('/colors')
  async findColors() {
    try {
      const colors = await this.vehiclesService.findColors();
      if (!colors || colors.length <= 0) {
        throw new NotFoundException(`Colors not found`);
      }
      return colors;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new UnprocessableEntityException("Error getting the colors");
    }

  }

  @Get('/services')
  async findServiceVehicle() {
    try {
      const serviceVehicle = await this.vehiclesService.findServices();
      if (!serviceVehicle || serviceVehicle.length <= 0) {
        throw new NotFoundException(`Service not found`);
      }
      return serviceVehicle;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new UnprocessableEntityException("Error getting the vehicle services");
    }

  }

  @Get('/types')
  async findType() {
    try {
      const types = await this.vehiclesService.findTypes();
      if (!types || types.length <= 0) {
        throw new NotFoundException(`Types not found`);
      }
      return types;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new UnprocessableEntityException("Error getting the vehicle types");
    }

  }

  @RoleDriver()
  @Get('/plates/:plates')
  async validatePlates(@Request() req, @Param('plates') plates: string) {
    try {
      const idUser = await this.usersService.getIdUserFromEmail(req.user.username);
      if (idUser <= 0) {
        throw new BadRequestException("Driver doesnt exists");
      }

      const vehicle = await this.vehiclesService.validatePlates(plates);
      if (vehicle) {
        const numberValidPoliciesWithPlates = await this.policiesService.vehicleWithValidPolicies(plates, idUser);
        if(numberValidPoliciesWithPlates > 0){
          throw new ConflictException("Plates found with a valid policy");
        }       
      }
      
      return;

    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new UnprocessableEntityException("Error validating the plates");
    }
  }

}
