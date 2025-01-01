import { IsString, IsNumber, Length, Matches, IsArray, ValidateNested, Min, Max, IsInt, ArrayMinSize} from 'class-validator';
import { Type } from 'class-transformer';
import { Service } from './create-service.dto'; 
export class CreatePolicyPlanDto {
    @IsString()
    @Length(1, 30) 
    title: string;

    @IsString()
    @Length(1, 255)  
    description: string;

    @Min(0)  
    @IsInt()
    maxPeriod: number;

    @IsNumber()
    @Min(0)  
    basePrice: number;

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true }) 
    @Type(() => Service)  
    service: Service[];
}