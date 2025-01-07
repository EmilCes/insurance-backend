import { IsString, IsDate, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEmployeeDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  dateOfBirth: Date;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  postalCode: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  idMunicipality: number;

  @IsNotEmpty()
  employeeNumber: number;

  @IsNotEmpty()
  idEmployeeType: number;
}
