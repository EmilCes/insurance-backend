import { Test, TestingModule } from '@nestjs/testing';
import { PoliciesController } from './policies.controller';
import { PoliciesService } from './policies.service';
import { UsersService } from '../users/users.service';
import { VehiclesService } from '../vehicles/vehicles.service';
import { BadRequestException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';

describe('PoliciesController', () => {
  let controller: PoliciesController;

  const mockPoliciesService = {
    findOne: jest.fn(),
    findAllCurrentTitles: jest.fn(),
    findAllTotalStatus: jest.fn(),
    findAllTotal: jest.fn(),
    findActiveInvalidPolicies: jest.fn(),
    findAllFilter: jest.fn()
  };
  const mockVehiclesService = {
  };
  const mockUsersService = {
    getIdUserFromEmail: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PoliciesController],
      providers: [PoliciesService, UsersService, VehiclesService],
    }).overrideProvider(PoliciesService).useValue(mockPoliciesService)
      .overrideProvider(UsersService).useValue(mockUsersService)
      .overrideProvider(VehiclesService).useValue(mockVehiclesService)
      .compile();

    controller = module.get<PoliciesController>(PoliciesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });


  describe('findFilter', () => {
    const req = { user: { username: "jazmin@gmail.com" } };

    it('should return policies without status specified', async () => {
      const mockUserIdUser = 1;
      mockUsersService.getIdUserFromEmail.mockResolvedValue(mockUserIdUser);
      const mockFilterPolicies = [
        {
          "serialNumber": "0cafd594-2186-4f3a-851d-9ef334e3acaa",
          "planTitle": "Limitada",
          "startDate": "2024-12-12T00:00:00.000Z",
          "yearsPolicy": 3,
          "isCanceled": false,
          "idPolicyPlan": "a09be575-f839-4ba1-bfd9-e64c3f59e1b8",
          "Vehicle": {
            "Model": {
              "year": "2020",
              "Brand": {
                "name": "BMW"
              }
            }
          }
        },
        {
          "serialNumber": "11664013-ab0a-4c0a-a467-09f09c02e407",
          "planTitle": "Amplia Plus",
          "startDate": "2024-12-31T02:53:45.715Z",
          "yearsPolicy": 2,
          "isCanceled": true,
          "idPolicyPlan": "a09be575-f839-4ba1-bfd9-e64c3f59e1b8",
          "Vehicle": {
            "Model": {
              "year": "2020",
              "Brand": {
                "name": "Suzuki"
              }
            }
          }
        }
      ]
      mockPoliciesService.findAllFilter.mockResolvedValue(mockFilterPolicies);
      
      const response = await controller.findFilter(req, 1, "0", 0, undefined);
      expect(response).toEqual(mockFilterPolicies);
    })
  })

  describe('findAllTotal', () => {
    const req = { user: { username: "jazmin@gmail.com" } };

    it('should return total number policies without status specified', async () => {
      const mockUserIdUser = 1;
      mockUsersService.getIdUserFromEmail.mockResolvedValue(mockUserIdUser);
      const mockTotalPolicies = 8;
      mockPoliciesService.findAllTotal.mockResolvedValue(mockTotalPolicies);

      const response = await controller.findAllTotal(req, "0", 0, undefined);
      expect(response).toEqual(mockTotalPolicies);
    })

    it('should return total number policies with status specified', async () => {
      const mockUserIdUser = 1;
      mockUsersService.getIdUserFromEmail.mockResolvedValue(mockUserIdUser);
      const mockTotalPolicies = 8;
      mockPoliciesService.findAllTotalStatus.mockResolvedValue(mockTotalPolicies);

      const response = await controller.findAllTotal(req, "0", 1, undefined);
      expect(response).toEqual(mockTotalPolicies);
    })

    it('should return bad request exception because user', async () => {
      const mockUserIdUser = 0;
      mockUsersService.getIdUserFromEmail.mockResolvedValue(mockUserIdUser);

      await expect(controller.findAllTotal(req, "0", 0, undefined)).rejects.toThrow(BadRequestException)
    })


    it('should return bad request exception because type', async () => {
      const mockUserIdUser = 1;
      mockUsersService.getIdUserFromEmail.mockResolvedValue(mockUserIdUser);

      await expect(controller.findAllTotal(req, "", 0, undefined)).rejects.toThrow(BadRequestException)
    })

    it('should return bad request exception because status', async () => {
      const mockUserIdUser = 1;
      mockUsersService.getIdUserFromEmail.mockResolvedValue(mockUserIdUser);

      await expect(controller.findAllTotal(req, "0", 4, undefined)).rejects.toThrow(BadRequestException)
    })

    it('should return unproccesable entity exception', async () => {
      mockUsersService.getIdUserFromEmail.mockRejectedValue(new Error);

      await expect(controller.findAllTotal(req, "0", 1, undefined)).rejects.toThrow(UnprocessableEntityException)
    })

  })

  describe('findAllTypes', () => {
    const req = { user: { username: "jazmin@gmail.com" } };

    it('should return current types', async () => {
      const mockUserIdUser = 1;
      mockUsersService.getIdUserFromEmail.mockResolvedValue(mockUserIdUser);
      const mockPolicyTypes = [{ "planTitle": "Amplia" }, { "planTitle": "Amplia Plus" }];
      mockPoliciesService.findAllCurrentTitles.mockResolvedValue(mockPolicyTypes);

      const response = await controller.findAllTypes(req);
      await expect(response).toEqual(mockPolicyTypes);
    })

    it('should return not found exception', async () => {
      const mockUserIdUser = 1;
      mockUsersService.getIdUserFromEmail.mockResolvedValue(mockUserIdUser);
      const mockPolicyTypes = null;
      mockPoliciesService.findAllCurrentTitles.mockResolvedValue(mockPolicyTypes);

      await expect(controller.findAllTypes(req)).rejects.toThrow(NotFoundException)
    })

    it('should return bad request exception', async () => {
      const mockUserIdUser = 0;
      mockUsersService.getIdUserFromEmail.mockResolvedValue(mockUserIdUser);

      expect(controller.findAllTypes(req)).rejects.toThrow(BadRequestException)
    })

    it('should return unproccesable entity exception', async () => {
      mockUsersService.getIdUserFromEmail.mockRejectedValue(new Error);

      await expect(controller.findAllTypes(req)).rejects.toThrow(UnprocessableEntityException)
    })

  })

  describe('findOne', () => {
    const req = { user: { username: "jazmin@gmail.com" } };

    it('should return one policy', async () => {
      const mockUserIdUser = 1;
      mockUsersService.getIdUserFromEmail.mockResolvedValue(mockUserIdUser);
      const mockPolicy = {
        "serialNumber": "1bf843ad-d7ac-4cd3-8d00-e329ac8ebd03",
        "monthsOfPayment": 3,
        "yearsPolicy": 1,
        "isCanceled": false,
        "coveredCost": "12558",
        "startDate": "2024-12-31T02:41:41.905Z",
        "planTitle": "Limitada",
        "planDescription": "Cubre la Responsabilidad Civil, Asistencia Legal, Gastos médicos a ocupantes y Robo Total",
        "idPolicyPlan": "97cdcf01-90f2-4301-9fdd-d9d0be9f2101",
        "plates": "AAA-01-125",
        "idUser": 1,
        "Driver": {
          "rfc": "12345678901234",
          "Account": {
            "name": "Jacob",
            "lastName": "Montiel",
            "postalCode": "91020",
            "address": "Calle 1234",
            "Municipality": {
              "municipalityName": "Xalapa",
              "State": {
                "stateName": "Veracruz"
              }
            }
          }
        },
        "Vehicle": {
          "plates": "AAA-01-125",
          "serialNumberVehicle": "1234556789",
          "occupants": 1,
          "ServiceVehicle": {
            "name": "Particular"
          },
          "Type": {
            "vehicleType": "Automoviles importados"
          },
          "Color": {
            "vehicleColor": "Rojo"
          },
          "Model": {
            "year": "2020",
            "Brand": {
              "name": "Saturn"
            }
          }
        },
        "PolicyService": [
          {
            "name": "Daños materiales",
            "isCovered": false,
            "coveredCost": "3000"
          }
        ]
      };
      mockPoliciesService.findOne.mockResolvedValue(mockPolicy);

      const result = await controller.findOne(req, "1bf843ad-d7ac-4cd3-8d00-e329ac8ebd03");
      expect(result).toEqual(mockPolicy)
    })

    it('should return not found exception', async () => {
      const mockUserIdUser = 1;
      mockUsersService.getIdUserFromEmail.mockResolvedValue(mockUserIdUser);
      const mockPolicy = null;
      mockPoliciesService.findOne.mockResolvedValue(mockPolicy);

      await expect(controller.findOne(req, "1bf843ad-d7ac-4cd3-8d00-e329ac8ebd03")).rejects.toThrow(NotFoundException)
    })

    it('should return bad request exception', async () => {
      const mockUserIdUser = 0;
      mockUsersService.getIdUserFromEmail.mockResolvedValue(mockUserIdUser);

      await expect(controller.findOne(req, "1bf843ad-d7ac-4cd3-8d00-e329ac8ebd03")).rejects.toThrow(BadRequestException)
    })

    it('should return unproccesable entity exception', async () => {
      mockUsersService.getIdUserFromEmail.mockRejectedValue(new Error);

      await expect(controller.findOne(req, "1bf843ad-d7ac-4cd3-8d00-e329ac8ebd03")).rejects.toThrow(UnprocessableEntityException)
    })
  })
});
