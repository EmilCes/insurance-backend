import { Test, TestingModule } from '@nestjs/testing';
import { BrandsService } from './brands.service';
import { PrismaService } from '../prisma.service';

describe('BrandsService', () => {
  let service: BrandsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    brand: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
    model: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BrandsService, {
        provide: PrismaService,
        useValue: mockPrismaService
      }]
    }).compile();

    service = module.get<BrandsService>(BrandsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  describe("findAll", () => {
    it('should return brands', async () => {
      const mockBrands = [{ idBrand: 1, name: 'Brand1', Model: [] }];
      mockPrismaService.brand.findMany.mockResolvedValue(mockBrands);

      const result = await service.findAll();
      expect(result).toEqual(mockBrands);
    });

    it('should return empty', async () => {
      const mockBrands = [];
      mockPrismaService.brand.findMany.mockResolvedValue(mockBrands);

      const result = await service.findAll();
      expect(result).toEqual(mockBrands);
    });

    it('should return error', async () => {
      mockPrismaService.brand.findMany.mockRejectedValue(new Error);

      await expect(service.findAll()).rejects.toThrow(Error);
    });
  })

  describe("findModelBrand", () => {
    it('should return model-brand', async () => {
      const mockBrands = { year: "2020", Brand: { idBrand: 1, name: "Spark"} };
      mockPrismaService.model.findUnique.mockResolvedValue(mockBrands);

      const result = await service.findModelBrand(1);
      expect(result).toEqual(mockBrands);
    });

    it('should return empty', async () => {
      const mockBrands = null;
      mockPrismaService.model.findUnique.mockResolvedValue(mockBrands);

      const result = await service.findModelBrand(1);
      expect(result).toEqual(mockBrands);
    });

    it('should return error', async () => {
      mockPrismaService.model.findUnique.mockRejectedValue(new Error);

      await expect(service.findModelBrand(1)).rejects.toThrow(Error);
    });
  })

});
