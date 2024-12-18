import { PartialType } from '@nestjs/mapped-types';
import { CreatePlanPolicyDto } from './create-plan-policy.dto';

export class UpdatePlanPolicyDto extends PartialType(CreatePlanPolicyDto) {}
