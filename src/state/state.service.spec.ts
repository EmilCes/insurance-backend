import { Test, TestingModule } from '@nestjs/testing';
import { StateService } from './state.service';
import { PrismaService } from 'src/prisma.service';

describe('StateService', () => {
  let service: StateService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StateService, PrismaService],
    }).compile();

    service = module.get<StateService>(StateService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('findAll', () => {
    it('should return a list of states', async () => {
      const mockStates = [
        { idState: 1, stateName: 'Veracruz' },
        { idState: 2, stateName: 'Jalisco' },
      ];

      jest.spyOn(prisma.state, 'findMany').mockResolvedValue(mockStates);

      const result = await service.findAll();

      expect(result).toEqual(mockStates);
      expect(prisma.state.findMany).toHaveBeenCalledTimes(1); 
      expect(prisma.state.findMany).toHaveBeenCalledWith({
        select: { idState: true, stateName: true },
      }); 
    });

    it('should return an empty list if no states exist', async () => {
      jest.spyOn(prisma.state, 'findMany').mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(prisma.state.findMany).toHaveBeenCalledTimes(1);
      expect(prisma.state.findMany).toHaveBeenCalledWith({
        select: { idState: true, stateName: true },
      });
    });
  });
});
