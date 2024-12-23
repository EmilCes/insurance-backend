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

  async findAll() {
    const policies = await this.prisma.policyPlan.findMany({ 
      where: {
        PolicyPlanStatus: {
          policyPlanStatusType: 'Vigente'
        }
      },
      include: {
        PolicyPlanStatus: true
      }
    });
    if (!policies)
      throw new NotFoundException(`Policies not found`);

    return policies;
  }

  async findPolicy(id: string) {
    const services = await this.prisma.policyPlan.findUnique({ 
      where: {
        idPolicyPlan: id
      },
      include: {
        Service: true
      }
    });
    if (!services)
      throw new NotFoundException(`Policy plan not found`);

    return services;
  }


  update(id: number, updatePlanPolicyDto: UpdatePlanPolicyDto) {
    return `This action updates a #${id} planPolicy`;
  }

  remove(id: number) {
    return `This action removes a #${id} planPolicy`;
  }
}
