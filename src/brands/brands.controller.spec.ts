import { Test, TestingModule } from '@nestjs/testing';
import { BrandsController } from './brands.controller';
import { BrandsService } from './brands.service';
import { NotFoundException, UnprocessableEntityException } from '@nestjs/common';

describe('BrandsController', () => {
  let controller: BrandsController;

  const mockBrandsService = {
    findAll: jest.fn(),
    findModelBrand: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrandsController],
      providers: [BrandsService],
    }).overrideProvider(BrandsService).useValue(mockBrandsService).compile();

    controller = module.get<BrandsController>(BrandsController);
  });

  it('should be defined', async () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all brands', async () => {
      const mockBrands = [{ idBrand: 1, name: 'Spark', Model: [{ idModel: 1, year: "2020"}] }];
      mockBrandsService.findAll.mockResolvedValue(mockBrands);

      const result = await controller.findAll();
      expect(result).toEqual(mockBrands);
    });

    it('should throw NotFoundException if no brands are found', async () => {
      mockBrandsService.findAll.mockResolvedValue(null);

      await expect(controller.findAll()).rejects.toThrow(NotFoundException);
    });

    it('should throw UnprocessableEntityException if services throws exception', async () => {
      mockBrandsService.findAll.mockRejectedValue(new Error);

      await expect(controller.findAll()).rejects.toThrow(UnprocessableEntityException);
    });
  });


  describe('findModels', () => {
    it('should return brand-model', async () => {
      const mockBrands = { year: "2020", Brand: { idBrand: 1, name: "Spark"} };
      mockBrandsService.findModelBrand.mockResolvedValue(mockBrands);

      const result = await controller.findModels("1");
      expect(result).toEqual({ idBrand: 1, name: "Spark", year: "2020"});
    });

    it('should throw NotFoundException if no model-brand are found', async () => {
      mockBrandsService.findModelBrand.mockResolvedValue(null);

      await expect(controller.findModels("1")).rejects.toThrow(NotFoundException);
    });

    it('should throw UnprocessableEntityException if services throws exception', async () => {
      mockBrandsService.findModelBrand.mockRejectedValue(new Error);

      await expect(controller.findModels("1")).rejects.toThrow(UnprocessableEntityException);
    });
  })


});
