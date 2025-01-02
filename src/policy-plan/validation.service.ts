import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreatePolicyPlanDto } from './dto/create-policy-plan.dto';

@Injectable()
export class ValidationService {
  validateCoveredCost(createPolicyPlanDto: CreatePolicyPlanDto): void {
    createPolicyPlanDto.service.forEach(service => {
      if (service.isCovered && service.coveredCost !== 0) {
        throw new UnprocessableEntityException('coveredCost must be 0 when isCovered is true');
      }
      if (!service.isCovered && service.coveredCost === 0) {
        throw new UnprocessableEntityException('coveredCost cannot be 0 when isCovered is false');
      }
    });
  }
}
