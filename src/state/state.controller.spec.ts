import { Test, TestingModule } from '@nestjs/testing';
import { StateController } from './state.controller';
import { StateService } from './state.service';

describe('StateController', () => {
  let controller: StateController;
  let service: StateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StateController],
      providers: [
        {
          provide: StateService,
          useValue: {
            findAll: jest.fn(), 
          },
        },
      ],
    }).compile();

    controller = module.get<StateController>(StateController);
    service = module.get<StateService>(StateService);
  });

  describe('findAll', () => {
    it('should return a list of states', async () => {
      const mockStates = [
        { idState: 1, stateName: 'Veracruz' },
        { idState: 2, stateName: 'Jalisco' },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(mockStates);

      const result = await controller.findAll();

      expect(result).toEqual(mockStates);
      expect(service.findAll).toHaveBeenCalledTimes(1); 
    });

    it('should return an empty list if no states exist', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });
});
