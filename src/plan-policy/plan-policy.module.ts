import { Module } from '@nestjs/common';
import { PlanPolicyService } from './plan-policy.service';
import { PlanPolicyController } from './plan-policy.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [PlanPolicyController],
  providers: [PlanPolicyService, PrismaService],
})
export class PlanPolicyModule {}
