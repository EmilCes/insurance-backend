import { Optional } from '@nestjs/common';
import { IsInt, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class ImplicatePartyDto {
  @IsString()
  @Length(1, 50)
  @IsOptional()
  name: string;

  @IsInt()
  @IsOptional()
  idModel: number;

  @IsInt()
  @IsOptional()
  idReport: number;

  @IsInt()
  @IsOptional()
  idColor:number
}
