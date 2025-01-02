import { IsInt, IsString, IsNotEmpty } from 'class-validator';

export class PhotographDto {
  @IsInt()
  idPhotograph: number;

  @IsString()
  @IsNotEmpty()
  name: string;
}