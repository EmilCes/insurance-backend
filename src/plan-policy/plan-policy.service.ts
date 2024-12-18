import { Injectable } from '@nestjs/common';
import { CreatePlanPolicyDto } from './dto/create-plan-policy.dto';
import { UpdatePlanPolicyDto } from './dto/update-plan-policy.dto';

@Injectable()
export class PlanPolicyService {
  create(createPlanPolicyDto: CreatePlanPolicyDto) {
    return 'This action adds a new planPolicy';
  }

  findAll() {
    return `This action returns all planPolicy`;
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
