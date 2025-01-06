import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { PrismaService } from "src/prisma.service";
import * as bcrypt from 'bcrypt';

@Injectable()
export class EmployeeService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    // Validar que el municipio exista
    const municipality = await this.prisma.municipality.findUnique({
      where: { idMunicipality: createEmployeeDto.idMunicipality },
      include: { State: true }, // Incluir el estado relacionado
    });

    if (!municipality) {
      throw new NotFoundException(
        `Municipio con ID ${createEmployeeDto.idMunicipality} no encontrado`
      );
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(createEmployeeDto.password, 10);

    // Crear la cuenta
    const account = await this.prisma.account.create({
      data: {
        name: createEmployeeDto.name,
        lastName: createEmployeeDto.lastName,
        datebirth: createEmployeeDto.dateOfBirth,
        email: createEmployeeDto.email,
        password: hashedPassword,
        postalCode: createEmployeeDto.postalCode,
        address: createEmployeeDto.address,
        registrationDate: new Date(),
        Municipality: { connect: { idMunicipality: createEmployeeDto.idMunicipality } }, // Relación correcta
      },
    });
    // Crear el empleado
    const employee = await this.prisma.employee.create({
      data: {
        employeeNumber: createEmployeeDto.employeeNumber,
        EmployeeType: { connect: { idEmployeeType: createEmployeeDto.idEmployeeType } }, // Relación directa
        Account: { connect: { idAccount: account.idAccount } }, // Relación directa
      },
    });
     

    return {
      employee,
      account,
      municipality: {
        id: municipality.idMunicipality,
        name: municipality.municipalityName,
        state: municipality.State,
      },
    };
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
