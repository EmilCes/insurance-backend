import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import { VehiclesService } from '../vehicles/vehicles.service';
import { equals } from 'class-validator';

const numberPoliciesPerPage = 4;

@Injectable()
export class PoliciesService {
  constructor(
    private prisma: PrismaService
  ) { }

  async create(createPolicyDto: CreatePolicyDto, idUser: number) {
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
          idUser: idUser
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
      policyCreated = {
        serialNumber: policy.serialNumber, planTitle: policy.planTitle,
        planDescription: policy.planDescription
      };
    })

    return policyCreated;
  }

  async findAll(page: number) {
    const policies = await this.prisma.policy.findMany({
      where: { idUser: 1 },
      select: {
        serialNumber: true, planTitle: true, startDate: true, yearsPolicy: true, isCanceled: true,
        Vehicle: {
          select: {
            Model: {
              select: {
                year: true,
                Brand: { select: { name: true } }
              }
            }
          }
        }
      },
      take: numberPoliciesPerPage,
      skip: ((page - 1) * numberPoliciesPerPage)
    });

    if (policies.length <= 0) {
      return null;
    }
    return policies;
  }

  async findAllFilter(page: number, type: string, status: number, idPolicy: string, idUser: number) {
    const planTitle = (type == "0") ? {} : { equals: type };
    const statusCanceled = (status == 3) ? true : {};
    const serialNumber = (idPolicy == undefined) ? {} : { contains: idPolicy }

    const policies = await this.prisma.policy.findMany({
      where: {
        idUser: idUser, isCanceled: statusCanceled, planTitle, serialNumber
      },
      select: {
        serialNumber: true, planTitle: true, startDate: true, yearsPolicy: true, isCanceled: true, idPolicyPlan: true,
        Vehicle: { select: { Model: { select: { year: true, Brand: { select: { name: true } } } } } }
      },
      take: numberPoliciesPerPage,
      skip: ((page - 1) * numberPoliciesPerPage)
    });

    return policies;
  }

  async findActiveInvalidPolicies(page: number, type: string, status: number, idPolicy: string, idUser: number) {
    const currentDate = new Date();
    const planTitle = (type == "0") ? {} : { equals: type };
    const serialNumber = (idPolicy == undefined) ? {} : { contains: idPolicy }

    const policies = await this.prisma.policy.findMany({
      where: {
        idUser: idUser, planTitle, serialNumber, isCanceled: false
      },
      select: {
        serialNumber: true, planTitle: true, startDate: true, yearsPolicy: true, isCanceled: true, idPolicyPlan: true,
        Vehicle: { select: { Model: { select: { year: true, Brand: { select: { name: true } } } } } }
      }
    });

    if (status == 1) {
      const activePolicies = policies.filter((policy) => {
        const start = new Date(policy.startDate)
        const endDate = new Date(start.getFullYear() + policy.yearsPolicy, start.getMonth(), start.getDate());
        return endDate >= currentDate;
      });
      return activePolicies.slice((page - 1) * numberPoliciesPerPage, numberPoliciesPerPage * page);
    }

    const notValidPolicies = policies.filter((policy) => {
      const start = new Date(policy.startDate)
      const endDate = new Date(start.getFullYear() + policy.yearsPolicy, start.getMonth(), start.getDate());
      return endDate < currentDate;
    });
    return notValidPolicies.slice((page - 1) * numberPoliciesPerPage, numberPoliciesPerPage * page);
  }

  async findAllTotal(type: string, status: number, idPolicy: string, idUser: number) {
    const planTitle = (type == "0") ? {} : { equals: type };
    const statusCanceled = (status == 3) ? true : {};
    const serialNumber = (idPolicy == undefined) ? {} : { contains: idPolicy }

    const policies = await this.prisma.policy.count({ where: { idUser: idUser, planTitle, isCanceled: statusCanceled, serialNumber } });
    return policies;
  }

  async findAllTotalStatus(type: string, status: number, idPolicy: string, idUser: number) {
    const planTitle = (type == "0") ? {} : { equals: type };
    const serialNumber = (idPolicy == undefined) ? {} : { contains: idPolicy }
    const currentDate = new Date();

    const policies = await this.prisma.policy.findMany({
      where: {
        idUser: idUser, planTitle, serialNumber, isCanceled: false
      },
      select: {
        startDate: true, yearsPolicy: true
      }
    });

    if (status == 1) {
      const activePolicies = policies.filter((policy) => {
        const start = new Date(policy.startDate)
        const endDate = new Date(start.getFullYear() + policy.yearsPolicy, start.getMonth(), start.getDate());
        return endDate >= currentDate;
      });
      return activePolicies.length;
    }

    const notValidPolicies = policies.filter((policy) => {
      const start = new Date(policy.startDate)
      const endDate = new Date(start.getFullYear() + policy.yearsPolicy, start.getMonth(), start.getDate());
      return endDate < currentDate;
    });
    return notValidPolicies.length;
  }

  async findOne(id: string, idUser: number) {
    const policy = await this.prisma.policy.findUnique({
      where: { serialNumber: id, idUser: idUser },
      include: {
        Driver: {
          select: {
            rfc: true,
            Account: {
              select: {
                name: true, lastName: true, postalCode: true, address: true,
                Municipality: {
                  select: {
                    municipalityName: true,
                    State: { select: { stateName: true } }
                  }
                }
              }
            }
          }
        },
        Vehicle: {
          select: {
            plates: true, serialNumberVehicle: true, occupants: true,
            ServiceVehicle: { select: { name: true } },
            Type: { select: { vehicleType: true } },
            Color: { select: { vehicleColor: true } },
            Model: { select: { year: true, Brand: { select: { name: true } } } }
          }
        },
        PolicyService: { select: { name: true, isCovered: true, coveredCost: true } }
      }
    });
    return policy;
  }

  async cancel(idPolicy: string, idUser: number) {
    const policy = await this.prisma.policy.findUnique({ where: { serialNumber: idPolicy, idUser: idUser } });
    if (policy) {
      const cancelPolicy = await this.prisma.policy.update({
        where: { serialNumber: idPolicy },
        data: { isCanceled: true }
      });
      return cancelPolicy.serialNumber;
    }
    return null;
  }

  async findAllCurrentTitles(idUser: number) {
    const policies = await this.prisma.policy.groupBy({
      by: ['planTitle'],
      where: {
        Driver: {
          idUser: idUser
        }
      }
    });

    return policies;
  }


  async vehicleWithValidPolicies(plates: string, idUser: number) {
    const policiesWithPlate = await this.prisma.policy.findMany({
      where: { plates: { equals: plates }, idUser: idUser },
      select: { startDate: true, yearsPolicy: true, isCanceled: true }
    });

    if (policiesWithPlate != null && policiesWithPlate.length > 0) {
      const currentDate = new Date();

      const activePolicies = policiesWithPlate.filter((policy) => {
        const start = new Date(policy.startDate)
        const endDate = new Date(start.getFullYear() + policy.yearsPolicy, start.getMonth(), start.getDate());
        const oneMonthAfterToday = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate());

        return endDate >= oneMonthAfterToday && !policy.isCanceled;
      });
      return activePolicies.length;
    }
    return 0;
  }

}


