import { Injectable } from '@nestjs/common';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PoliciesService {
  constructor(
    private prisma: PrismaService
  ) { }

  async create(createPolicyDto: CreatePolicyDto) {
    /*const policy = await this.prisma.policy.create({
      data: {
        period: createPolicyDto.period,
        isCanceled: false,
        planType: "",
        planDescription: "",
        idUser: "",
        idPolicyPlan: "",
        plates: ""
      }
    })*/




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
