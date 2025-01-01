import { Module } from '@nestjs/common';
import { PolicyPlanService } from './policy-plan.service';
import { PolicyPlanController } from './policy-plan.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [PolicyPlanController],
  providers: [PolicyPlanService,PrismaService],
})
export class PolicyPlanModule {}
