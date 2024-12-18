import { Test, TestingModule } from '@nestjs/testing';
import { PlanPolicyController } from './plan-policy.controller';
import { PlanPolicyService } from './plan-policy.service';

describe('PlanPolicyController', () => {
  let controller: PlanPolicyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanPolicyController],
      providers: [PlanPolicyService],
    }).compile();

    controller = module.get<PlanPolicyController>(PlanPolicyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
