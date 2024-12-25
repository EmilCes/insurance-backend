import { Test, TestingModule } from '@nestjs/testing';
import { PolicyPlanService } from './policy-plan.service';

describe('PolicyPlanService', () => {
  let service: PolicyPlanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PolicyPlanService],
    }).compile();

    service = module.get<PolicyPlanService>(PolicyPlanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
