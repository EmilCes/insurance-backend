import { Module } from '@nestjs/common';
import { PlanPolicyService } from './plan-policy.service';
import { PlanPolicyController } from './plan-policy.controller';

@Module({
  controllers: [PlanPolicyController],
  providers: [PlanPolicyService],
})
export class PlanPolicyModule {}
