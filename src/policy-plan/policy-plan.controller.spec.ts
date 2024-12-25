import { Test, TestingModule } from '@nestjs/testing';
import { PolicyPlanController } from './policy-plan.controller';
import { PolicyPlanService } from './policy-plan.service';

describe('PolicyPlanController', () => {
  let controller: PolicyPlanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PolicyPlanController],
      providers: [PolicyPlanService],
    }).compile();

    controller = module.get<PolicyPlanController>(PolicyPlanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
