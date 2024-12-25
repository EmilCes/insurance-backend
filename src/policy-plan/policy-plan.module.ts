import { Module } from '@nestjs/common';
import { PolicyPlanService } from './policy-plan.service';
import { PolicyPlanController } from './policy-plan.controller';
import { PrismaService } from 'src/prisma.service';
import { PolicyPlanGuard } from './policy-plan.guard';

@Module({
  controllers: [PolicyPlanController],
  providers: [PolicyPlanService,PrismaService, PolicyPlanGuard],
})
export class PolicyPlanModule {}
