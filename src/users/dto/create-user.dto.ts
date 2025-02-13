import { IsString, IsEmail, IsOptional, IsInt, IsDate } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    name: string;

    @IsString()
    lastName: string;

    @IsString()
    password: string;

    @IsString()
    rfc: string;

    @IsString()
    bankAccountNumber: string;

    @IsString()
    expirationDateBankAccount: string;

    @IsString()
    licenseNumber: string;

    @IsString()
    phone: string;

    @IsString()
    postalCode: string;

    @IsString()
    address: string;

    @IsInt()
    idMunicipality: number;

    @IsOptional()
    @IsString()
    secretKey?: string;

    @IsString()
    datebirth: string;
}
