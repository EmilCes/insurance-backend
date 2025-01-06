import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class EmployeeService {
  constructor(
    private prisma: PrismaService,
  ) {}

  create(createEmployeeDto: CreateEmployeeDto) {
    return "This action adds a new employee";
  }

  findAll() {
    return `This action returns all employee`;
  }

  findOne(id: number) {
    return `This action returns a #${id} employee`;
  }

  update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    return `This action updates a #${id} employee`;
  }

  remove(id: number) {
    return `This action removes a #${id} employee`;
  }

  async getIdEmployeeFromEmail(email: string) {
    if (email == undefined) {
      return 0;
    }
    
    const employee = await this.prisma.account.findFirst({
      where: { email: { equals: email } },
      select: { idEmployee: true },
    });

    return employee?.idEmployee == undefined ? 0 : employee.idEmployee;
  }

  async getTypeEmployee(idEmployee: number) {
    const employeeType = await this.prisma.employee.findUnique({
      select: { EmployeeType: { select: { employeeType: true } } },
      where: { idEmployee: idEmployee },
    });

    if (!employeeType) {
      throw new NotFoundException(`Empleado no encontrado`);
    }

    return employeeType.EmployeeType.employeeType;
  }
}
