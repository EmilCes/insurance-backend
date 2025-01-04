import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsString, IsNumber, Length, Matches, IsArray, ValidateNested, Min, Max, IsInt, ArrayMinSize, IsDecimal, IsDate, IsNotEmpty, IsOptional } from 'class-validator';
import { ImplicatePartyDto } from './implicate-party.dto';
    //idReport           Int               @id @default(autoincrement())
//result             String?            @db.Text
    //reportDecisionDate DateTime?
    //idStatus           Int
// plates             String            @db.VarChar(15)
  
export class UpdateReportDto {
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

    @IsString()
    @IsNotEmpty()
    result: string;

    @Length(1, 9)
    @IsNotEmpty()
    plates: string;
    
    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => ImplicatePartyDto)
    implicatePartyDto?: ImplicatePartyDto[];

}

