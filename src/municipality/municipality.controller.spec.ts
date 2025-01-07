import { Test, TestingModule } from '@nestjs/testing';
import { MunicipalityController } from './municipality.controller';
import { MunicipalityService } from './municipality.service';

describe('MunicipalityController', () => {
  let controller: MunicipalityController;
  let service: MunicipalityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MunicipalityController],
      providers: [
        {
          provide: MunicipalityService,
          useValue: {
            findAll: jest.fn(), 
          },
        },
      ],
    }).compile();

    controller = module.get<MunicipalityController>(MunicipalityController);
    service = module.get<MunicipalityService>(MunicipalityService);
  });

  describe('findAll', () => {
    it('should return a list of municipalities', async () => {
      const mockMunicipalities = [
        { idMunicipality: 1, municipalityName: 'Xalapa', idState: 1 },
        { idMunicipality: 2, municipalityName: 'Veracruz', idState: 1 },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(mockMunicipalities);

      const result = await controller.findAll();

      expect(result).toEqual(mockMunicipalities);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return an empty list if no municipalities exist', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });
});
