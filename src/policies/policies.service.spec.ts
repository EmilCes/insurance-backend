import { Test, TestingModule } from '@nestjs/testing';
import { PoliciesService } from './policies.service';
import { PrismaService } from '../prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('PoliciesService', () => {
  let service: PoliciesService;
  let prisma: PrismaService;

  const mockPrismaService = {
    policy: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      groupBy: jest.fn()
    },
    policyPlan: {
      findUnique: jest.fn()
    },
    serviceVehicle: {
      findUnique: jest.fn()
    },
    type: {
      findUnique: jest.fn()
    },
    model: {
      findUnique: jest.fn()
    },
    vehicle: {
      findUnique: jest.fn()
    },
    $transaction: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PoliciesService, {
        provide: PrismaService,
        useValue: mockPrismaService
      }]
    }).compile();

    service = module.get<PoliciesService>(PoliciesService);
    prisma = module.get<PrismaService>(PrismaService);

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {

    it('should return policy created', async () => {
      const mockServiceData = { idService: 1 }
      const mockTypeData = { idType: 1 }
      const mockModelData = { idModel: 1 }
      const mockPolicyPlan = { idPolicyPlan: "7014710fidafr" }
      mockPrismaService.vehicle.findUnique.mockResolvedValue({plates: "AAA-13-13"});
      mockPrismaService.serviceVehicle.findUnique.mockResolvedValue(mockServiceData);
      mockPrismaService.type.findUnique.mockResolvedValue(mockTypeData);
      mockPrismaService.model.findUnique.mockResolvedValue(mockModelData);
      mockPrismaService.policyPlan.findUnique.mockResolvedValue(mockPolicyPlan);
      mockPrismaService.$transaction.mockResolvedValue(undefined);

      const createPolicyDto = {
        idBrand: 1, idModel: 1, series: "1637183",
        plates: "AAA-01-1", idColor: 1, idType: 1, occupants: 1, idService: 1, yearOfPolicy: 1, idPolicyPlan: "6319471jfnv", perMonthsPayment: 4
      };
      const result = await service.create(createPolicyDto, 1);
      expect(result).toEqual(null);
    })

    it('should return bad request exception service doesnt exists', async () => {
      const mockServiceData = null
      mockPrismaService.vehicle.findUnique.mockResolvedValue({plates: "AAA-13-13"});
      mockPrismaService.serviceVehicle.findUnique.mockResolvedValue(mockServiceData);

      const createPolicyDto = {
        idBrand: 1, idModel: 1, series: "1637183",
        plates: "AAA-01-1", idColor: 1, idType: 1, occupants: 1, idService: 1, yearOfPolicy: 1, idPolicyPlan: "6319471jfnv", perMonthsPayment: 4
      };
      await expect(service.create(createPolicyDto, 1)).rejects.toThrow(BadRequestException);
    })

    it('should return bad request exception type doesnt exists', async () => {
      const mockServiceData = { idService: 1 }
      const mockTypeData = null
      mockPrismaService.vehicle.findUnique.mockResolvedValue({plates: "AAA-13-13"});
      mockPrismaService.serviceVehicle.findUnique.mockResolvedValue(mockServiceData);
      mockPrismaService.type.findUnique.mockResolvedValue(mockTypeData);

      const createPolicyDto = {
        idBrand: 1, idModel: 1, series: "1637183",
        plates: "AAA-01-1", idColor: 1, idType: 1, occupants: 1, idService: 1, yearOfPolicy: 1, idPolicyPlan: "6319471jfnv", perMonthsPayment: 4
      };
      await expect(service.create(createPolicyDto, 1)).rejects.toThrow(BadRequestException);
    })

    it('should return bad request exception model doesnt exists', async () => {
      const mockServiceData = { idService: 1 }
      const mockTypeData = { idType: 1 }
      const mockModelData = null
      mockPrismaService.vehicle.findUnique.mockResolvedValue({plates: "AAA-13-13"});
      mockPrismaService.serviceVehicle.findUnique.mockResolvedValue(mockServiceData);
      mockPrismaService.type.findUnique.mockResolvedValue(mockTypeData);
      mockPrismaService.model.findUnique.mockResolvedValue(mockModelData);

      const createPolicyDto = {
        idBrand: 1, idModel: 1, series: "1637183",
        plates: "AAA-01-1", idColor: 1, idType: 1, occupants: 1, idService: 1, yearOfPolicy: 1, idPolicyPlan: "6319471jfnv", perMonthsPayment: 4
      };
      await expect(service.create(createPolicyDto, 1)).rejects.toThrow(BadRequestException);
    })

    it('should return bad request exception policy plan doesnt exists', async () => {
      const mockServiceData = { idService: 1 }
      const mockTypeData = { idType: 1 }
      const mockModelData = { idModel: 1 }
      const mockPolicyPlan = null
      mockPrismaService.vehicle.findUnique.mockResolvedValue({plates: "AAA-13-13"});
      mockPrismaService.serviceVehicle.findUnique.mockResolvedValue(mockServiceData);
      mockPrismaService.type.findUnique.mockResolvedValue(mockTypeData);
      mockPrismaService.model.findUnique.mockResolvedValue(mockModelData);
      mockPrismaService.policyPlan.findUnique.mockResolvedValue(mockPolicyPlan);

      const createPolicyDto = {
        idBrand: 1, idModel: 1, series: "1637183",
        plates: "AAA-01-1", idColor: 1, idType: 1, occupants: 1, idService: 1, yearOfPolicy: 1, idPolicyPlan: "6319471jfnv", perMonthsPayment: 4
      };
      await expect(service.create(createPolicyDto, 1)).rejects.toThrow(BadRequestException);
    })
  })


  describe('findAllFilter', () => {

    it('should return all policies without status specified', async () => {
      const mockPolicies = [
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
      mockPrismaService.policy.findMany.mockResolvedValue(mockPolicies);

      const response = await service.findAllFilter(1, "0", 0, "730183bjod", 1);
      expect(response).toEqual(mockPolicies);
    })

    it('should return all policies canceled status specified', async () => {
      const mockPolicies = [
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
      mockPrismaService.policy.findMany.mockResolvedValue(mockPolicies);

      const response = await service.findAllFilter(1, "0", 3, undefined, 1);
      expect(response).toEqual(mockPolicies);
    })
  })

  describe('findActiveInvalidPolicies', () => {
    it('should return all policies invalid status specified', async () => {
      const mockPolicies = [
        {
          "serialNumber": "0cafd594-2186-4f3a-851d-9ef334e3acaa",
          "planTitle": "Limitada",
          "startDate": "2010-12-12T00:00:00.000Z",
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
        }
      ]
      mockPrismaService.policy.findMany.mockResolvedValue(mockPolicies);

      const response = await service.findActiveInvalidPolicies(1, "0", 2, "730183bjod", 1);
      expect(response).toEqual(mockPolicies);
    })

    it('should return all policies valid status specified', async () => {
      const mockPolicies = [
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
        }
      ]
      mockPrismaService.policy.findMany.mockResolvedValue(mockPolicies);

      const response = await service.findActiveInvalidPolicies(1, "0", 1, undefined, 1);
      expect(response).toEqual(mockPolicies);
    })
  })


  describe('findAllTotal', () => {
    it('should return number of total with specifed parameters', async () => {
      const mockTotalPolicies = 3;
      mockPrismaService.policy.count.mockResolvedValue(mockTotalPolicies);

      const response = await service.findAllTotal("Plan", 3, "694729dfviou", 1);
      expect(response).toEqual(mockTotalPolicies);
    })

    it('should return number of total without specified parameters', async () => {
      const mockTotalPolicies = 3;
      mockPrismaService.policy.count.mockResolvedValue(mockTotalPolicies);

      const response = await service.findAllTotal("0", 0, undefined, 1);
      expect(response).toEqual(mockTotalPolicies);
    })
  })


  describe('findAllTotalStatus', () => {
    it('should return number of total with active policies', async () => {
      const mockPolicies = [
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
        }
      ]
      mockPrismaService.policy.findMany.mockResolvedValue(mockPolicies);

      const response = await service.findAllTotalStatus("Plan", 1, "694729dfviou", 1);
      expect(response).toEqual(1);
    })

    it('should return number of total with invalid policies', async () => {
      const mockPolicies = [
        {
          "serialNumber": "0cafd594-2186-4f3a-851d-9ef334e3acaa",
          "planTitle": "Limitada",
          "startDate": "2010-12-12T00:00:00.000Z",
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
        }
      ]
      mockPrismaService.policy.findMany.mockResolvedValue(mockPolicies);

      const response = await service.findAllTotalStatus("Plan", 2, "694729dfviou", 1);
      expect(response).toEqual(1);
    })
  })

  describe('findOne', () => {
    it('should return one policy', async () => {
      const mockPolicy = {
        "serialNumber": "1bf843ad-d7ac-4cd3-8d00-e329ac8ebd03", "monthsOfPayment": 3,
        "yearsPolicy": 1, "isCanceled": false, "coveredCost": "12558",
        "startDate": "2024-12-31T02:41:41.905Z", "planTitle": "Limitada",
        "planDescription": "Cubre la Responsabilidad Civil, Asistencia Legal, Gastos médicos a ocupantes y Robo Total",
        "idPolicyPlan": "97cdcf01-90f2-4301-9fdd-d9d0be9f2101",
        "plates": "AAA-01-125", "idUser": 1,
        "Driver": {
          "rfc": "12345678901234",
          "Account": {
            "name": "Jacob", "lastName": "Montiel", "postalCode": "91020", "address": "Calle 1234",
            "Municipality": {
              "municipalityName": "Xalapa",
              "State": {
                "stateName": "Veracruz"
              }
            }
          }
        },
        "Vehicle": {
          "plates": "AAA-01-125", "serialNumberVehicle": "1234556789",
          "occupants": 1, "ServiceVehicle": { "name": "Particular" },
          "Type": { "vehicleType": "Automoviles importados" },
          "Color": { "vehicleColor": "Rojo" },
          "Model": {
            "year": "2020", "Brand": { "name": "Saturn" }
          }
        }, "PolicyService": [{ "name": "Daños materiales", "isCovered": false, "coveredCost": "3000" }]
      };
      mockPrismaService.policy.findUnique.mockResolvedValue(mockPolicy);

      const response = await service.findOne("7429472fbdv", 1);
      expect(response).toEqual(mockPolicy)
    })

    it('should return empty', async () => {
      const mockPolicy = null
      mockPrismaService.policy.findUnique.mockResolvedValue(mockPolicy);

      const response = await service.findOne("7429472fbdv", 1);
      expect(response).toEqual(mockPolicy)
    })
  })

  describe('cancel', () =>  {
    it('should return serial number of policy after cancel', async () => {
      const mockPolicy = { serialNumber: "740740fhruo"}
      mockPrismaService.policy.findUnique.mockResolvedValue(mockPolicy);
      const mockPolicyResponse = { serialNumber: "740740fhruo"}
      mockPrismaService.policy.update.mockResolvedValue(mockPolicyResponse);
      
      const response = await service.cancel("47104828r", 1);
      expect(response).toEqual("740740fhruo");
    })

    it('should return null', async () => {
      const mockPolicy = null
      mockPrismaService.policy.findUnique.mockResolvedValue(mockPolicy);
      
      const response = await service.cancel("47104828r", 1);
      expect(response).toEqual(null);
    })
  })

  describe('findAllCurrentTitles', () =>  {
    it('should return all titles', async () => {
      const mockPolicyTypes = [{ "planTitle": "Amplia" }, { "planTitle": "Amplia Plus" }];
      mockPrismaService.policy.groupBy.mockResolvedValue(mockPolicyTypes);
      
      const response = await service.findAllCurrentTitles(1);
      expect(response).toEqual(mockPolicyTypes);
    })

    it('should return null', async () => {
      const mockPolicyTypes = null;
      mockPrismaService.policy.groupBy.mockResolvedValue(mockPolicyTypes);
      
      const response = await service.findAllCurrentTitles(1);
      expect(response).toEqual(mockPolicyTypes);
    })
  })

  describe('vehicleWithValidPolicies', () =>  {
    it('should return number vehicles with valid policies', async () => {
      const mockPolicyWithPlate =[ { startDate: "2024-12-12T00:00:00.000Z", yearsPolicy: 1, isCanceled: false}];
      mockPrismaService.policy.findMany.mockResolvedValue(mockPolicyWithPlate);
      
      const response = await service.vehicleWithValidPolicies("AAA-01-1");
      expect(response).toEqual(1);
    })

    it('should return number vehicles with valid policies', async () => {
      const mockPolicyWithPlate = [];
      mockPrismaService.policy.findMany.mockResolvedValue(mockPolicyWithPlate);
      
      const response = await service.vehicleWithValidPolicies("AAA-01-1");
      expect(response).toEqual(0);
    })
  })

});
