import { IsString, IsNumber, Length, Matches, IsArray, ValidateNested, Min, Max, IsInt, ArrayMinSize, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { Service } from './create-service.dto';
export class UpdatePolicyPlanStatusDto {
    @IsInt()
    @IsPositive()
    idPolicyPlanStatus: number
}
