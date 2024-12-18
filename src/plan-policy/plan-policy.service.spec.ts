import { Test, TestingModule } from '@nestjs/testing';
import { PlanPolicyService } from './plan-policy.service';

describe('PlanPolicyService', () => {
  let service: PlanPolicyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlanPolicyService],
    }).compile();

    service = module.get<PlanPolicyService>(PlanPolicyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
