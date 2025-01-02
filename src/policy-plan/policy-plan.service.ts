import { UnprocessableEntityException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePolicyPlanDto } from './dto/create-policy-plan.dto';
import { UpdatePolicyPlanDto } from './dto/update-policy-plan.dto';
import { PrismaService } from 'src/prisma.service';
import { UpdatePolicyPlanStatusDto } from './dto/update-policy-plan-status.dto';

@Injectable()
export class PolicyPlanService {
  constructor(private prisma: PrismaService) { }

  async create(createPolicyPlanDto: CreatePolicyPlanDto) {
    const newPolicyPlan = await this.prisma.policyPlan.create({
      data: {
        title: createPolicyPlanDto.title,
        description: createPolicyPlanDto.description,
        maxPeriod: createPolicyPlanDto.maxPeriod,
        basePrice: createPolicyPlanDto.basePrice,
        idPolicyPlanStatus: 1,
        Service: {
          create: createPolicyPlanDto.service.map(service => ({
            name: service.name,
            isCovered: service.isCovered,
            coveredCost: service.coveredCost,
          })),
        },
      },
      include: { Service: true },
    });

    return newPolicyPlan;
  }

  async findAllCurrent() {
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

    return policies;
  }

  async findPlanPolicy(id: string) {
    const policyPlans = await this.prisma.policyPlan.findUnique({
      where: {
        idPolicyPlan: id
      },
      include: {
        Service: true
      }
    });
    return policyPlans;
  }

  async findPlanPolicyWithStatus(id: string) {
    const policyPlans = await this.prisma.policyPlan.findUnique({
      where: {
        idPolicyPlan: id
      },
      include: {
        Service: true,
        PolicyPlanStatus: true
      }
    });
    return policyPlans;
  }

  async update(id: string, updatePolicyPlanDto: UpdatePolicyPlanDto) {
    const recuperarPolicyPlan = await this.prisma.policyPlan.findFirst({ where: { idPolicyPlan: id } });
    if (!recuperarPolicyPlan) {
      throw new NotFoundException("Policy plan not found")
    }
    const updatePolicyPlan = await this.prisma.policyPlan.update({
      where: { idPolicyPlan: id },
      data: {
        title: updatePolicyPlanDto.title,
        description: updatePolicyPlanDto.description,
        maxPeriod: updatePolicyPlanDto.maxPeriod,
        basePrice: updatePolicyPlanDto.basePrice,
        idPolicyPlanStatus: 1,
        Service: {
          deleteMany: {},
          create: updatePolicyPlanDto.service.map(service => ({
            name: service.name,
            isCovered: service.isCovered,
            coveredCost: service.coveredCost,
          })),
        },
      },
      include: { Service: true },
    });
    return updatePolicyPlan;
  }

  async remove(id: string) {
    const policyPlan = await this.prisma.policyPlan.findFirst({ where: { idPolicyPlan: id } });
    if (!policyPlan) {
      throw new NotFoundException("Policy not found")
    }
    const [deleteService, deletePolicyPlan] = await this.prisma.$transaction([
      this.prisma.service.deleteMany({
        where: { idPolicyPlan: id },
      }),
      this.prisma.policyPlan.delete({
        where: { idPolicyPlan: id },
      }),
    ]);
    if (!deletePolicyPlan) {
      throw new UnprocessableEntityException("Error removing policy plan");
    }
    return deletePolicyPlan;
  }

  async updateStatus(id: string, updatePolicyPlanStatusDto: UpdatePolicyPlanStatusDto) {
    const recuperarPolicyPlan = await this.prisma.policyPlan.findFirst({ where: { idPolicyPlan: id } });
    if (!recuperarPolicyPlan) {
      throw new NotFoundException("Policy plan not found")
    }
    const updatePolicyPlanStatus = await this.prisma.policyPlan.update({
      where: { idPolicyPlan: id },
      data: {
        idPolicyPlanStatus: updatePolicyPlanStatusDto.idPolicyPlanStatus
      },
      include: { Service: true, PolicyPlanStatus: true },
    });
    return updatePolicyPlanStatus;
  }

  async findPlanPolicyPage(page: number, status: number, name: string) {
    const pageSize = 4;
    const skip = page * pageSize;
    let plans;
    if (status == 0) {
      plans = await this.prisma.policyPlan.findMany({
        where: {
          title: {
            contains: name,
            mode: 'insensitive',
          },
        },
        skip,
        take: pageSize
      });
    } else {
      plans = await this.prisma.policyPlan.findMany({
        where: {
          idPolicyPlanStatus: status,
          title: {
            contains: name,
            mode: 'insensitive',
          },
        },
        skip,
        take: pageSize
      });
    }
    return plans;
  }

}
