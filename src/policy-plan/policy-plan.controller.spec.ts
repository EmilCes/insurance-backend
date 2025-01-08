import { Test, TestingModule } from '@nestjs/testing';
import { PolicyPlanController } from './policy-plan.controller';
import { PolicyPlanService } from './policy-plan.service';
import { ValidationService } from './validation.service';
import { CreatePolicyPlanDto } from './dto/create-policy-plan.dto';
import { UpdatePolicyPlanDto } from './dto/update-policy-plan.dto';
import { UnprocessableEntityException, NotFoundException } from '@nestjs/common';

describe('PolicyPlanController', () => {
  let controller: PolicyPlanController;
  let service: PolicyPlanService;

  const mockPolicyPlanService = {
    create: jest.fn(),
    findAllCurrent: jest.fn(),
    findPlanPolicy: jest.fn(),
    findPlanPolicyWithStatus: jest.fn(),
    update: jest.fn(),
    updateStatus: jest.fn(),
    remove: jest.fn(),
    findPlanPolicyPage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PolicyPlanController],
      providers: [
        {
          provide: PolicyPlanService,
          useValue: mockPolicyPlanService,
        },
        ValidationService,
      ],
    }).compile();

    controller = module.get<PolicyPlanController>(PolicyPlanController);
    service = module.get<PolicyPlanService>(PolicyPlanService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new policy plan', async () => {
      const dto: CreatePolicyPlanDto = {
        title: 'Test Plan',
        description: 'Test Description',
        maxPeriod: 12,
        basePrice: 100,
        service: [
          { name: 'Test Service', isCovered: true, coveredCost: 0 },
        ],
      };
      const result = { id: '1', ...dto };
      mockPolicyPlanService.create.mockResolvedValue(result);

      expect(await controller.create(dto)).toEqual(result);
      expect(mockPolicyPlanService.create).toHaveBeenCalledWith(dto);
    });

    it('should throw an error if validation fails', async () => {
      const dto: CreatePolicyPlanDto = {
        title: 'Test Plan',
        description: 'Test Description',
        maxPeriod: 12,
        basePrice: 100,
        service: [
          { name: 'Test Service', isCovered: true, coveredCost: 50 },
        ],
      };

      await expect(controller.create(dto)).rejects.toThrow(UnprocessableEntityException);
    });
  });

  describe('findCurrentPlanPolicies', () => {
    it('should return current policy plans', async () => {
      const result = [{ id: '1', title: 'Test Plan' }];
      mockPolicyPlanService.findAllCurrent.mockResolvedValue(result);

      expect(await controller.findCurrentPlanPolicies()).toEqual(result);
    });

    it('should throw a NotFoundException if no plans found', async () => {
      mockPolicyPlanService.findAllCurrent.mockResolvedValue([]);
      await expect(controller.findCurrentPlanPolicies()).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOnePlanPolicy', () => {
    it('should return a specific policy plan by ID', async () => {
      const result = { id: '1', title: 'Test Plan' };
      mockPolicyPlanService.findPlanPolicy.mockResolvedValue(result);

      expect(await controller.findOnePlanPolicy('1')).toEqual(result);
    });

    it('should throw a NotFoundException if policy plan not found', async () => {
      mockPolicyPlanService.findPlanPolicy.mockResolvedValue(null);
      await expect(controller.findOnePlanPolicy('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a policy plan', async () => {
      const dto: UpdatePolicyPlanDto = {
        title: 'Updated Title',
        description: 'Updated Description',
        maxPeriod: 10,
        basePrice: 150,
        service: [
          { name: 'Updated Service', isCovered: true, coveredCost: 0 },
        ],
      };
      const result = { id: '1', ...dto };
      mockPolicyPlanService.update.mockResolvedValue(result);

      expect(await controller.update('1', dto)).toEqual(result);
      expect(mockPolicyPlanService.update).toHaveBeenCalledWith('1', dto);
    });

    it('should throw an UnprocessableEntityException if update fails', async () => {
      mockPolicyPlanService.update.mockRejectedValue(new UnprocessableEntityException());

      await expect(controller.update('1', {} as UpdatePolicyPlanDto)).rejects.toThrow(UnprocessableEntityException);
    });
  });

  describe('remove', () => {
    it('should delete a policy plan', async () => {
      const result = { id: '1' };
      mockPolicyPlanService.remove.mockResolvedValue(result);

      expect(await controller.remove('1')).toEqual(result);
    });

    it('should throw a NotFoundException if policy plan not found', async () => {
      mockPolicyPlanService.remove.mockRejectedValue(new NotFoundException());
      await expect(controller.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
