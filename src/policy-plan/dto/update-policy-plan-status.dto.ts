import { IsInt, IsPositive } from 'class-validator';

export class UpdatePolicyPlanStatusDto {
    @IsInt()
    @IsPositive()
    idPolicyPlanStatus: number
}
