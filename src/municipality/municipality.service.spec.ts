import { Test, TestingModule } from '@nestjs/testing';
import { MunicipalityService } from './municipality.service';
import { PrismaService } from 'src/prisma.service';

describe('MunicipalityService', () => {
  let service: MunicipalityService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MunicipalityService,
        {
          provide: PrismaService,
          useValue: {
            municipality: {
              findMany: jest.fn(), 
            },
          },
        },
      ],
    }).compile();

    service = module.get<MunicipalityService>(MunicipalityService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('findAll', () => {
    it('should return a list of municipalities', async () => {
      const mockMunicipalities = [
        { idMunicipality: 1, municipalityName: 'Xalapa', idState: 1 },
        { idMunicipality: 2, municipalityName: 'Veracruz', idState: 1 },
      ];
      jest.spyOn(prisma.municipality, 'findMany').mockResolvedValue(mockMunicipalities);

      const result = await service.findAll();

      expect(result).toEqual(mockMunicipalities);
      expect(prisma.municipality.findMany).toHaveBeenCalledTimes(1);
      expect(prisma.municipality.findMany).toHaveBeenCalledWith({
        select: {
          idMunicipality: true,
          municipalityName: true,
          idState: true,
        },
      });
    });

    it('should return an empty list if no municipalities exist', async () => {
      jest.spyOn(prisma.municipality, 'findMany').mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(prisma.municipality.findMany).toHaveBeenCalledTimes(1);
    });
  });
});
