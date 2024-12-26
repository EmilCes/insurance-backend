import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';
import { VehiclesService } from 'src/vehicles/vehicles.service';

@Injectable()
export class PoliciesService {
  constructor(
    private prisma: PrismaService,
    private vehicleService: VehiclesService
  ) { }

  async create(createPolicyDto: CreatePolicyDto) {
    //Recuperar usuario
    
    const plates = await this.vehicleService.validatePlates(createPolicyDto.plates);
    if (plates) {
      throw new ConflictException("Plates found");
    }

    const serviceVehicle = await this.prisma.serviceVehicle.findUnique({ where: { idService: createPolicyDto.idService } })
    const typeVehicle = await this.prisma.type.findUnique({ where: { idType: createPolicyDto.idType } })
    const modelVehicle = await this.prisma.model.findUnique({ where: { idModel: createPolicyDto.idModel, idBrand: createPolicyDto.idBrand } })

    if (!serviceVehicle || !typeVehicle || !modelVehicle) {
      throw new BadRequestException("Vehicle data not correct");
    }

    const policyPlan = await this.prisma.policyPlan.findUnique({
      where: { idPolicyPlan: createPolicyDto.idPolicyPlan },
      include: { Service: true }
    });

    if (!policyPlan) {
      throw new BadRequestException("Policy plan doesnt exists");
    }

    let policyCreated = null;

    try {
      await this.prisma.$transaction(async (prisma) => {
        const policyVehicle = await this.prisma.vehicle.create({
          data: {
            plates: createPolicyDto.plates,
            serialNumberVehicle: createPolicyDto.series,
            occupants: createPolicyDto.occupants,
            idService: createPolicyDto.idService,
            idType: createPolicyDto.idType,
            idModel: createPolicyDto.idModel,
            idColor: createPolicyDto.idColor
          }
        });

        const policy = await this.prisma.policy.create({
          data: {
            monthsOfPayment: createPolicyDto.perMonthsPayment,
            yearsPolicy: createPolicyDto.yearOfPolicy,
            isCanceled: false,
            coveredCost: new Prisma.Decimal(+policyPlan.basePrice * createPolicyDto.yearOfPolicy),
            startDate: new Date(),
            planTitle: policyPlan.title,
            planDescription: policyPlan.description,
            idPolicyPlan: policyPlan.idPolicyPlan,
            plates: createPolicyDto.plates,
            idUser: 1
          },
        });

        for (let index = 0; index < policyPlan.Service.length; index++) {
          const service = policyPlan.Service[index];
          const policyService = await this.prisma.policyService.create({
            data: {
              name: service.name,
              isCovered: service.isCovered,
              coveredCost: service.coveredCost,
              serialNumber: policy.serialNumber
            },
          });
        }
        policyCreated = policy;
      })
    } catch (err) {
      throw new BadRequestException("Error creating the policy");
    }
    
    return policyCreated;
  }

  async findAll(page: number) {
    const numberPoliciesPerPage = 2;
    const policies = await this.prisma.policy.findMany({
      where: { idUser: 1},
      take: numberPoliciesPerPage,
      skip: ((page - 1) * numberPoliciesPerPage)
    });

    if(policies.length <= 0){
      return null;
    }
    return policies;
  }

  async findOne(id: string) {
    const policy = await this.prisma.policy.findUnique({
      where: { serialNumber: id}
    });
    return policy;
  }

}
