import { IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID, Length, Matches } from "class-validator";

export class CreatePolicyDto {
    @IsNumber()
    @IsPositive()
    idBrand: number;

    @IsNumber()
    @IsPositive()
    idModel: number;

    @IsNotEmpty()
    @IsString()
    @Length(1, 15)
    series: string;

    @IsNotEmpty()
    @IsString()
    @Length(7, 15)
    @Matches("^(?=(?:.*[A-Z0-9]){7})(?=(?:.*-){2})[A-Z0-9-]{9}$")
    plates: string;

    @IsNumber()
    @IsPositive()
    idColor: number;

    @IsNumber()
    @IsPositive()
    idType: number;

    @IsNumber()
    @IsPositive()
    occupants: number;

    @IsNumber()
    @IsPositive()
    idService: number;

    @IsNumber()
    @IsPositive()
    yearOfPolicy: number;

    @IsNotEmpty()
    @IsUUID()
    idPolicyPlan: string;

    @IsNumber()
    @IsPositive()
    perMonthsPayment: number;
}
