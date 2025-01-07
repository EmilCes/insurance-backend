import { Test, TestingModule } from '@nestjs/testing';
import { PolicyPlanService } from './policy-plan.service';
import { PrismaService } from '../prisma.service';

describe('PolicyPlanService', () => {
  let service: PolicyPlanService;
  let prismaMock: {
    policyPlan: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
    service: {
      deleteMany: jest.Mock;
    };
    $transaction: jest.Mock;
  };

  beforeEach(async () => {
    prismaMock = {
      policyPlan: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      service: {
        deleteMany: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PolicyPlanService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<PolicyPlanService>(PolicyPlanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new policy plan', async () => {
      const dto = {
        title: 'Test Plan',
        description: 'Test Description',
        maxPeriod: 12,
        basePrice: 1000,
        service: [
          { name: 'Service A', isCovered: true, coveredCost: 500 },
        ],
      };

      const mockResponse = { idPolicyPlan: '1', ...dto };
      prismaMock.policyPlan.create.mockResolvedValue(mockResponse);

      const result = await service.create(dto);
      expect(result).toEqual(mockResponse);
      expect(prismaMock.policyPlan.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ title: 'Test Plan' }),
        include: { Service: true },
      });
    });
  });

  describe('findPlanPolicy', () => {
    it('should return a specific policy plan', async () => {
      const mockPolicy = { idPolicyPlan: '1', title: 'Plan A' };
      prismaMock.policyPlan.findUnique.mockResolvedValue(mockPolicy);
  
      const result = await service.findPlanPolicy('1');
      expect(result).toEqual(mockPolicy);
      expect(prismaMock.policyPlan.findUnique).toHaveBeenCalledWith({
        where: { idPolicyPlan: '1' },
        include: { Service: true },
      });
    });
  
    it('should return null if policy plan is not found', async () => {
      prismaMock.policyPlan.findUnique.mockResolvedValue(null);
  
      const result = await service.findPlanPolicy('1');
      expect(result).toBeNull();
      expect(prismaMock.policyPlan.findUnique).toHaveBeenCalledWith({
        where: { idPolicyPlan: '1' },
        include: { Service: true },
      });
    });
  });
  
});
