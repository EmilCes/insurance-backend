// report-filter.dto.ts
import { IsOptional, IsInt, Min, IsIn, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ReportFilterDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  page?: number = 0;

  @IsOptional()
  @IsInt()
  @IsIn([0, 1, 2])
  @Type(() => Number)
  status?: number = 0;

  @IsOptional()
  @IsString()
  @Type(() => String)
  reportNumber?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  startYear?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  endYear?: number;
}