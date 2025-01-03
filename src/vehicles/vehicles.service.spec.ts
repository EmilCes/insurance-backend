import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesService } from './vehicles.service';
import { PrismaService } from '../prisma.service';

describe('VehiclesService', () => {
  let service: VehiclesService;
  let prisma: PrismaService;

  const mockPrismaService = {
    vehicle: {
      findUnique: jest.fn()
    },
    color: {
      findMany: jest.fn()
    },
    serviceVehicle: {
      findMany: jest.fn()
    },
    type: {
      findMany: jest.fn()
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VehiclesService, {
        provide: PrismaService,
        useValue: mockPrismaService
      }],
    }).compile();

    service = module.get<VehiclesService>(VehiclesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findColors', () => {
    it('should return colors', async () => {
      const mockColors = [{ idColor: 1, vehicleColor: "Azul" }]
      mockPrismaService.color.findMany.mockResolvedValue(mockColors);

      const result = await service.findColors();
      expect(result).toEqual(mockColors);
    });

    it('should return empty', async () => {
      const mockColors = []
      mockPrismaService.color.findMany.mockResolvedValue(mockColors);

      const result = await service.findColors();
      expect(result).toEqual(mockColors);
    });
  })


  describe('findServices', () => {
    it('should return services', async () => {
      const mockServices = [{ idService: 1, name: "Particular" }]
      mockPrismaService.serviceVehicle.findMany.mockResolvedValue(mockServices)

      const result = await service.findServices();
      expect(result).toEqual(mockServices);
    });

    it('should return empty', async () => {
      const mockServices = []
      mockPrismaService.serviceVehicle.findMany.mockResolvedValue(mockServices);

      const result = await service.findServices();
      expect(result).toEqual(mockServices);
    });
  })


  describe('findTypes', () => {
    it('should return types', async () => {
      const mockTypes = [{ idType: 1, vehicleType: "Automoviles importados" }]
      mockPrismaService.type.findMany.mockResolvedValue(mockTypes)

      const result = await service.findTypes();
      expect(result).toEqual(mockTypes);
    });

    it('should return empty', async () => {
      const mockTypes = []
      mockPrismaService.type.findMany.mockResolvedValue(mockTypes);

      const result = await service.findTypes();
      expect(result).toEqual(mockTypes);
    });
  })


  describe('validatePlates', () => {
    it('should return plates', async () => {
      const mockPlates = { plates: "AAA-01-1"}
      mockPrismaService.vehicle.findUnique.mockResolvedValue(mockPlates)

      const result = await service.validatePlates("AAA-01-1");
      expect(result).toEqual(mockPlates);
    });

    it('should return empty', async () => {
      const mockPlates = null;
      mockPrismaService.vehicle.findUnique.mockResolvedValue(mockPlates)

      const result = await service.validatePlates("AAA-01-1");
      expect(result).toEqual(mockPlates);
    });
  })


});
