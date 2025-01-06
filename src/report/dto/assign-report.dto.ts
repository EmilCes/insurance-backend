import { IsInt, IsNotEmpty } from "class-validator";

export class AssignReportDto {
    @IsInt()
    @IsNotEmpty()
    assignedEmployeeId: number;
}
