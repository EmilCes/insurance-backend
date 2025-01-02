import { Module } from '@nestjs/common';
import { PolicyPlanService } from './policy-plan.service';
import { PolicyPlanController } from './policy-plan.controller';
import { PrismaService } from 'src/prisma.service';
import { ValidationService } from './validation.service';

@Module({
  controllers: [PolicyPlanController],
  providers: [PolicyPlanService,PrismaService, ValidationService],
})
export class PolicyPlanModule {}
