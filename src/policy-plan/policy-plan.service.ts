import { Injectable } from '@nestjs/common';
import { CreatePolicyPlanDto } from './dto/create-policy-plan.dto';
import { UpdatePolicyPlanDto } from './dto/update-policy-plan.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PolicyPlanService {
  constructor(private prisma: PrismaService) {}
  
  async create(createPolicyPlanDto: CreatePolicyPlanDto) {
    
    const newPolicyPlan = await this.prisma.policyPlan.create({
      data: {
        title: createPolicyPlanDto.title,
        description: createPolicyPlanDto.description,
        maxPeriod: createPolicyPlanDto.maxPeriod,
        basePrice: createPolicyPlanDto.basePrice,
        idPolicyPlanStatus: 1        
      },
    });
    return newPolicyPlan;
  }

  findAll() {
    return `This action returns all policyPlan`;
  }

  findOne(id: number) {
    return `This action returns a #${id} policyPlan`;
  }

  update(id: number, updatePolicyPlanDto: UpdatePolicyPlanDto) {
    return `This action updates a #${id} policyPlan`;
  }

  remove(id: number) {
    return `This action removes a #${id} policyPlan`;
  }
}
