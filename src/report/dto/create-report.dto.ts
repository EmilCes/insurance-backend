import { Type } from 'class-transformer';
import { IsString, IsNumber, Length, Matches, IsArray, ValidateNested, Min, Max, IsInt, ArrayMinSize, IsDecimal, IsDate, IsNotEmpty, IsOptional } from 'class-validator';
import { CreatePhotographDto } from './photograph.dto';
import { ImplicatePartyDto } from './implicate-party.dto';

export class CreateReportDto {
    @IsString()
    description: string;

    @Type(() => Number)
    @IsNumber({}, { message: 'latitude must be a number' })
    @IsNotEmpty()
    @Min(-90)
    @Max(90)
    latitude: number;

    @Type(() => Number)
    @IsNumber({}, { message: 'latitude must be a number' })
    @IsNotEmpty()
    @Min(-180)
    @Max(180)
    longitude: number;

    @Type(() => Date)
    @IsDate()
    @IsOptional()
    reportDecisionDate: Date;
    
    @Length(1, 9)
    @IsNotEmpty()
    plates: string;
    
    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => ImplicatePartyDto)
    implicatePartyDto?: ImplicatePartyDto[];

}
