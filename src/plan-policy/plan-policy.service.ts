import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlanPolicyDto } from './dto/create-plan-policy.dto';
import { UpdatePlanPolicyDto } from './dto/update-plan-policy.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PlanPolicyService {

  constructor(
    private prisma: PrismaService
  ) {}

  create(createPlanPolicyDto: CreatePlanPolicyDto) {
    return 'This action adds a new planPolicy';
  }

  findAll() {
    const policies = this.prisma.policyPlan.findMany();
    if (!policies)
      throw new NotFoundException(`Policies not found`);

    return policies;
  }

  findOne(id: number) {
    return `This action returns a #${id} planPolicy`;
  }

  update(id: number, updatePlanPolicyDto: UpdatePlanPolicyDto) {
    return `This action updates a #${id} planPolicy`;
  }

  remove(id: number) {
    return `This action removes a #${id} planPolicy`;
  }
}
