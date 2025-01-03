import { Test, TestingModule } from '@nestjs/testing';
import { PoliciesService } from './policies.service';
import { PrismaService } from '../prisma.service';
import { policyServices } from 'prisma/modelsSeed';
import { BadRequestException } from '@nestjs/common';

describe('PoliciesService', () => {
  let service: PoliciesService;
  let prisma: PrismaService;

  const mockPrismaService = {
    policy: {
      findMany: jest.fn()
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
      mockPrismaService.serviceVehicle.findUnique.mockReturnValue(mockServiceData);
      mockPrismaService.type.findUnique.mockReturnValue(mockTypeData);
      mockPrismaService.model.findUnique.mockReturnValue(mockModelData);
      mockPrismaService.policyPlan.findUnique.mockReturnValue(mockPolicyPlan);
      mockPrismaService.$transaction.mockReturnValue(undefined);

      const createPolicyDto = {
        idBrand: 1, idModel: 1, series: "1637183",
        plates: "AAA-01-1", idColor: 1, idType: 1, occupants: 1, idService: 1, yearOfPolicy: 1, idPolicyPlan: "6319471jfnv", perMonthsPayment: 4
      };
      const result = await service.create(createPolicyDto, 1);
      expect(result).toEqual(null);
    })

    it('should return bad request exception service doesnt exists', async () => {
      const mockServiceData = null
      mockPrismaService.serviceVehicle.findUnique.mockReturnValue(mockServiceData);

      const createPolicyDto = {
        idBrand: 1, idModel: 1, series: "1637183",
        plates: "AAA-01-1", idColor: 1, idType: 1, occupants: 1, idService: 1, yearOfPolicy: 1, idPolicyPlan: "6319471jfnv", perMonthsPayment: 4
      };
      await expect(service.create(createPolicyDto, 1)).rejects.toThrow(BadRequestException);
    })

    it('should return bad request exception type doesnt exists', async () => {
      const mockServiceData = { idService: 1 }
      const mockTypeData = null
      mockPrismaService.serviceVehicle.findUnique.mockReturnValue(mockServiceData);
      mockPrismaService.type.findUnique.mockReturnValue(mockTypeData);

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
      mockPrismaService.serviceVehicle.findUnique.mockReturnValue(mockServiceData);
      mockPrismaService.type.findUnique.mockReturnValue(mockTypeData);
      mockPrismaService.model.findUnique.mockReturnValue(mockModelData);

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
      mockPrismaService.serviceVehicle.findUnique.mockReturnValue(mockServiceData);
      mockPrismaService.type.findUnique.mockReturnValue(mockTypeData);
      mockPrismaService.model.findUnique.mockReturnValue(mockModelData);
      mockPrismaService.policyPlan.findUnique.mockReturnValue(mockPolicyPlan);

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
      mockPrismaService.policy.findMany.mockReturnValue(mockPolicies);

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
      mockPrismaService.policy.findMany.mockReturnValue(mockPolicies);

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
      mockPrismaService.policy.findMany.mockReturnValue(mockPolicies);

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
      mockPrismaService.policy.findMany.mockReturnValue(mockPolicies);

      const response = await service.findActiveInvalidPolicies(1, "0", 1, undefined, 1);
      expect(response).toEqual(mockPolicies);
    })
  })

});
