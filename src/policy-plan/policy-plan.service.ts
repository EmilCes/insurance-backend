import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePolicyPlanDto } from './dto/create-policy-plan.dto';
import { UpdatePolicyPlanDto } from './dto/update-policy-plan.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PolicyPlanService {
  constructor(private prisma: PrismaService) { }

  async create(createPolicyPlanDto: CreatePolicyPlanDto) {
      const crearPolicyPlan = await this.prisma.policyPlan.create({
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

      return crearPolicyPlan;
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


  async update(id: string, updatePolicyPlanDto: UpdatePolicyPlanDto) {
      const recuperarPolicyPlan = await this.prisma.policyPlan.findFirst({ where: { idPolicyPlan: id } });
      if (!recuperarPolicyPlan) {
        throw new NotFoundException("Poliza no encontrada")
      }
      const actualizarPolicyPlan = await this.prisma.policyPlan.update({
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
      return actualizarPolicyPlan;
  }

  async remove(id: string) {
      const recuperarPolicyPlan = await this.prisma.policyPlan.findFirst({ where: { idPolicyPlan: id } });
      if (!recuperarPolicyPlan) {
        throw new NotFoundException("Poliza no encontrada")
      }
      const [eliminarService, eliminarPolicyPlan] = await this.prisma.$transaction([
        this.prisma.service.deleteMany({
          where: { idPolicyPlan: id },
        }),
        this.prisma.policyPlan.delete({
          where: { idPolicyPlan: id },
        }),
      ]);
      if (!eliminarPolicyPlan) {
        throw new BadRequestException("La poliza no se pudo eliminar");
      }
      return eliminarPolicyPlan;;
  }
}
