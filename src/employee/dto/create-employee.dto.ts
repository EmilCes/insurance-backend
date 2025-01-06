import { IsNotEmpty, IsNumber, IsPositive, IsString, IsEmail, Length, Matches, IsDateString } from "class-validator";

export class CreateEmployeeDto {
  // RFC del empleado
  @IsNotEmpty()
  @IsString()
  @Length(12, 13) // El RFC tiene entre 12 y 13 caracteres
  rfc: string;

  // Nombre del empleado
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  name: string;

  // Apellidos del empleado
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  lastName: string;

  // Fecha de nacimiento
  @IsNotEmpty()
  @IsDateString() // Validación para fechas en formato ISO (YYYY-MM-DD)
  dateOfBirth: string;

  // Teléfono del empleado
  @IsNotEmpty()
  @IsString()
  @Length(10, 10) // Número de teléfono con 10 dígitos
  @Matches(/^\d+$/, { message: "El teléfono debe contener solo números" })
  phone: string;

  // Correo electrónico
  @IsNotEmpty()
  @IsEmail()
  email: string;

  // Contraseña
  @IsNotEmpty()
  @IsString()
  @Length(8, 64) // La contraseña debe tener entre 8 y 64 caracteres
  password: string;

  // Código postal
  @IsNotEmpty()
  @IsString()
  @Length(5, 5)
  @Matches(/^\d+$/, { message: "El código postal debe contener solo números" })
  postalCode: string;

  // Dirección completa
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  address: string;

  // Municipio
  @IsNumber()
  @IsPositive()
  idMunicipality: number;

  // Número de empleado (opcional)
  @IsNumber()
  @IsPositive()
  employeeNumber?: number;

  // Tipo de empleado
  @IsNumber()
  @IsPositive()
  idEmployeeType: number;
}
