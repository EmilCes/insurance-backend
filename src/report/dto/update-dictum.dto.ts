import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateReportDictumDto {
  @IsNotEmpty()
  @IsString()
  result: string;
}