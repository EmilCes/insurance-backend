import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';
import { UsersService } from '../users/users.service';
import { PoliciesService } from '../policies/policies.service';
import { BadRequestException, ConflictException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';

describe('VehiclesController', () => {
  let controller: VehiclesController;

  const mockVehiclesService = {
    validatePlates: jest.fn(),
    findColors: jest.fn(),
    findServices: jest.fn(),
    findTypes: jest.fn()
  }
  const mockUsersService = {
    getIdUserFromEmail: jest.fn()
  }
  const mockPoliciesService = {
    vehicleWithValidPolicies: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehiclesController],
      providers: [VehiclesService, UsersService, PoliciesService],
    }).overrideProvider(VehiclesService).useValue(mockVehiclesService)
      .overrideProvider(UsersService).useValue(mockUsersService)
      .overrideProvider(PoliciesService).useValue(mockPoliciesService)
      .compile();

    controller = module.get<VehiclesController>(VehiclesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findColors', () => {
    it('should return all colors', async () => {
      const mockColors = [{ idColor: 1, vehicleColor: "Azul" }]
      mockVehiclesService.findColors.mockResolvedValue(mockColors);

      const result = await controller.findColors();
      expect(result).toEqual(mockColors);
    })

    it('should return not found exception', async () => {
      const mockColors = []
      mockVehiclesService.findColors.mockResolvedValue(mockColors);

      await expect(controller.findColors()).rejects.toThrow(NotFoundException);
    })

    it('should return unprocessable entity exception', async () => {
      mockVehiclesService.findColors.mockRejectedValue(new Error);

      await expect(controller.findColors()).rejects.toThrow(UnprocessableEntityException);
    })
  })

  describe('findServices', () => {
    it('should return all services', async () => {
      const mockServices = [{ idService: 1, name: "Particular" }]
      mockVehiclesService.findServices.mockResolvedValue(mockServices);

      const result = await controller.findServiceVehicle();
      expect(result).toEqual(mockServices);
    })

    it('should return not found exception', async () => {
      const mockServices = []
      mockVehiclesService.findServices.mockResolvedValue(mockServices);

      await expect(controller.findServiceVehicle()).rejects.toThrow(NotFoundException);
    })

    it('should return unprocessable entity exception', async () => {
      mockVehiclesService.findServices.mockRejectedValue(new Error);

      await expect(controller.findServiceVehicle()).rejects.toThrow(UnprocessableEntityException);
    })
  })

  describe('findTypes', () => {
    it('should return all types', async () => {
      const mockTypes = [{ idType: 1, vehicleType: "Automoviles importados" }]
      mockVehiclesService.findTypes.mockResolvedValue(mockTypes);

      const result = await controller.findType();
      expect(result).toEqual(mockTypes);
    })

    it('should return not found exception', async () => {
      const mockTypes = []
      mockVehiclesService.findTypes.mockResolvedValue(mockTypes);

      await expect(controller.findType()).rejects.toThrow(NotFoundException);
    })

    it('should return unprocessable entity exception', async () => {
      mockVehiclesService.findTypes.mockRejectedValue(new Error);

      await expect(controller.findType()).rejects.toThrow(UnprocessableEntityException);
    })
  });

  describe('validatePlates', () => {
    const req = { user: { username: "jazmin@gmail.com" } };

    it('should return valid response', async () => {
      const mockUserIdUser = 1;
      mockUsersService.getIdUserFromEmail.mockResolvedValue(mockUserIdUser);
      const mockVehicle = { plates: "AAA-01-01" }
      mockVehiclesService.validatePlates.mockResolvedValue(mockVehicle);
      const mockNumberValidPolicies = 0
      mockPoliciesService.vehicleWithValidPolicies.mockResolvedValue(mockNumberValidPolicies);

      const response = await controller.validatePlates(req, "AAA-01-1");
      expect(response).toEqual(undefined);
    })

    it('should return bad request exception because user', async () => {
      const mockUserIdUser = 0;
      mockUsersService.getIdUserFromEmail.mockResolvedValue(mockUserIdUser);
      
      await expect(controller.validatePlates(req, "AAA-01-1")).rejects.toThrow(BadRequestException);
    })

    it('should return bad request exception because plates with valid policy', async () => {
      const mockUserIdUser = 1;
      mockUsersService.getIdUserFromEmail.mockResolvedValue(mockUserIdUser);
      const mockVehicle = { plates: "AAA-01-01" };
      mockVehiclesService.validatePlates.mockResolvedValue(mockVehicle);
      const mockNumberValidPolicies = 1;
      mockPoliciesService.vehicleWithValidPolicies.mockResolvedValue(mockNumberValidPolicies);
      
      await expect(controller.validatePlates(req, "AAA-01-1")).rejects.toThrow(ConflictException);
    })

    it('should return unprocessable entity exception', async () => {
      mockUsersService.getIdUserFromEmail.mockRejectedValue(new Error);
      
      await expect(controller.validatePlates(req, "AAA-01-1")).rejects.toThrow(UnprocessableEntityException);
    })

  })

});
