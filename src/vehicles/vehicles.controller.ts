import { Controller, Get, Param, NotFoundException, ConflictException, HttpException, UnprocessableEntityException, BadRequestException, Request } from '@nestjs/common';
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

  @Get('/currentAll')
  @RoleDriver()
  async findCurrentAllVehicles(@Request() req) {
    try {
      const idUser = await this.usersService.getIdUserFromEmail(req.user.username);
      if (idUser <= 0) {
        throw new BadRequestException("Driver doesnt exists");
      }

      const vehicles = await this.vehiclesService.findAllVehicles(idUser);
      if (!vehicles || vehicles.length <= 0) {
        throw new NotFoundException(`Vehicles not found`);
      }

      return vehicles.map((vehicle) => ({
        idBrand: vehicle.Model.Brand.idBrand,
        idModel: vehicle.idModel,
        serialNumber: vehicle.serialNumberVehicle,
        idColor: vehicle.idColor,
        plates: vehicle.plates,
        idType: vehicle.idType,
        idService: vehicle.idService,
        occupants: vehicle.occupants,
        brandName: vehicle.Model.Brand.name,
        modelName: vehicle.Model.year,
        colorName: vehicle.Color.vehicleColor,
        typeName: vehicle.Type.vehicleType,
        serviceName: vehicle.ServiceVehicle.name
      }));
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new UnprocessableEntityException("Error getting the vehicles");
    }

  }

  @RoleDriver()
  @Get('/plates/:plates')
  async validatePlates(@Param('plates') plates: string) {
    try {
      const vehicle = await this.vehiclesService.validatePlates(plates);
      if (vehicle) {
        const numberValidPoliciesWithPlates = await this.policiesService.vehicleWithValidPolicies(plates);
        if (numberValidPoliciesWithPlates > 0) {
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
