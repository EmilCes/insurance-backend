import { Injectable } from '@nestjs/common';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PoliciesService {
  constructor(
    private prisma: PrismaService
  ) { }

  async create(createPolicyDto: CreatePolicyDto) {
    //Recuperar usuario
    //primero crear el coche


    //verificar si es vigente
    const policyPlan = await this.prisma.policyPlan.findUnique({ where: { idPolicyPlan : createPolicyDto.idPolicyPlan }});
    if(!policyPlan){
      return null;
    }
    
    const policy = await this.prisma.policy.create({
      data: {
        period: createPolicyDto.perMonthsPayment, 
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
    



    return 'This action adds a new policy';
  }

  findAll() {
    return `This action returns all policies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} policy`;
  }

  update(id: number, updatePolicyDto: UpdatePolicyDto) {
    return `This action updates a #${id} policy`;
  }

  remove(id: number) {
    return `This action removes a #${id} policy`;
  }
}
