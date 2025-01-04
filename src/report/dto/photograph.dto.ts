import { IsInt, IsString, IsNotEmpty } from 'class-validator';

export class CreatePhotographDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  url: string;
}