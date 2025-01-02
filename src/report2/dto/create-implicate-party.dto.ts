import { IsString, IsNumber, Length, Matches, IsBoolean, Min, Max} from 'class-validator';
export class Service {
    @IsString()
    @Length(1, 15)  
    name: string;

    @IsBoolean()
    isCovered: boolean;

    @IsNumber()
    @Min(0)
    coveredCost: number;
}