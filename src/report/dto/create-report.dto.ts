import { Type } from 'class-transformer';
import { IsString, IsNumber, Length, Matches, IsArray, ValidateNested, Min, Max, IsInt, ArrayMinSize, IsDecimal, IsDate } from 'class-validator';
import { PhotographDto } from './photograph.dto';
import { ImplicatePartyDto } from './implicate-party.dto';

export class CreateReportDto {
    @IsInt()
    idReport: number;

    @IsString()
    description: string;

    @IsDate()
    date: Date;

    @IsDecimal({ decimal_digits: '1,9' })
    latitude: number;

    @IsDecimal({ decimal_digits: '1,10' })
    longitude: number;

    @IsString()
    result: string;

    @IsDate()
    reportDecisionDate: Date;

    @Length(1, 9)
    plates: string;

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true }) 
    @Type(() => PhotographDto)  
    photographDto: PhotographDto[];

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true }) 
    @Type(() => ImplicatePartyDto)  
    implicatePartyDto: ImplicatePartyDto[];
    
}
