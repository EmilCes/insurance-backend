import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { PrismaService } from "../prisma.service";

@Injectable()
export class EmployeeService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    // Verificar si ya existe un empleado con el mismo correo electrónico
    const existingEmail = await this.prisma.account.findFirst({
      where: { email: createEmployeeDto.email }, // Esto funcionará si `email` es único en el esquema
    });

    if (existingEmail) {
      throw new ConflictException(
        `El correo electrónico ${createEmployeeDto.email} ya está registrado.`,
      );
    }

    // Validar si el tipo de empleado existe
    const employeeType = await this.prisma.employeeType.findUnique({
      where: { idEmployeeType: createEmployeeDto.idEmployeeType },
    });

    if (!employeeType) {
      throw new NotFoundException(
        `El tipo de empleado con ID ${createEmployeeDto.idEmployeeType} no existe.`,
      );
    }

    // Validar que el municipio exista
    const municipality = await this.prisma.municipality.findUnique({
      where: { idMunicipality: createEmployeeDto.idMunicipality },
    });

    if (!municipality) {
      throw new NotFoundException(
        `El municipio con ID ${createEmployeeDto.idMunicipality} no existe.`,
      );
    }

    // Crear la cuenta asociada al empleado (sin `idEmployee` por ahora)
    const account = await this.prisma.account.create({
      data: {
        name: createEmployeeDto.name,
        lastName: createEmployeeDto.lastName,
        datebirth: new Date(createEmployeeDto.dateOfBirth),
        email: createEmployeeDto.email,
        password: createEmployeeDto.password,
        postalCode: createEmployeeDto.postalCode,
        address: createEmployeeDto.address,
        registrationDate: new Date(),
        Municipality: {
          connect: { idMunicipality: createEmployeeDto.idMunicipality }, // Relación con el municipio
        },
      },
    });

    // Crear el empleado con la relación a la cuenta
    const employee = await this.prisma.employee.create({
      data: {
        employeeNumber: createEmployeeDto.employeeNumber,
        EmployeeType: {
          connect: { idEmployeeType: createEmployeeDto.idEmployeeType }, // Relación con tipo de empleado
        },
        Account: {
          connect: { idAccount: account.idAccount }, // Relación con cuenta creada
        },
      },
    });

    // Actualizar la cuenta con el `idEmployee` del empleado recién creado
    await this.prisma.account.update({
      where: { idAccount: account.idAccount },
      data: { idEmployee: employee.idEmployee },
    });

    return {
      message: "Empleado creado con éxito",
      employee,
      account,
    };
  }

  findAll() {
    return this.prisma.employee.findMany({
      include: {
        Account: true,
        EmployeeType: true,
      },
    });
  }

  async findOne(idEmployee: number) {
    const employee = await this.prisma.employee.findUnique({
      where: { idEmployee },
      include: {
        Account: true,
        EmployeeType: true,
      },
    });

    if (!employee) {
      throw new NotFoundException(
        `Empleado con ID ${idEmployee} no encontrado`,
      );
    }

    return employee;
  }

  
async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
  // Verificar si el empleado existe
  const existingEmployee = await this.prisma.employee.findUnique({
    where: { idEmployee: id },
    include: { Account: true }, // Incluir datos relacionados de la cuenta
  });

  if (!existingEmployee) {
    throw new NotFoundException(`Empleado con ID ${id} no encontrado.`);
  }

  // Actualizar los datos de la cuenta del empleado
  const { password, ...accountData } = updateEmployeeDto;

  await this.prisma.account.update({
    where: { idAccount: existingEmployee.Account.idAccount },
    data: {
      name: accountData.name,
      lastName: accountData.lastName,
      datebirth: accountData.dateOfBirth ? new Date(accountData.dateOfBirth) : undefined,
      email: accountData.email,
      password: password, // Actualizar solo si existe una nueva contraseña
      postalCode: accountData.postalCode,
      address: accountData.address,
      Municipality: accountData.idMunicipality
        ? { connect: { idMunicipality: accountData.idMunicipality } }
        : undefined,
    },
  });

  return {
    message: 'Empleado actualizado con éxito',
  };
}

async findEmployeeInfo(email: string) {
  const employee = await this.prisma.employee.findFirst({
    where: { Account: { email } }, // Usar la relación con Account para encontrar el empleado
    include: {
      Account: true, // Incluir la información de la cuenta
      EmployeeType: true, // Incluir el tipo de empleado
    },
  });

  if (!employee) {
    throw new NotFoundException("Empleado no encontrado");
  }

  // Formatear la respuesta con la información relevante
  return {
    idEmployee: employee.idEmployee,
    name: employee.Account.name,
    lastName: employee.Account.lastName,
    email: employee.Account.email,
    address: employee.Account.address,
    postalCode: employee.Account.postalCode,
    dateOfBirth: employee.Account.datebirth,
    employeeType: employee.EmployeeType.employeeType,
    employeeNumber: employee.employeeNumber,
    municipality: employee.Account.idMunicipality, // Si quieres incluir el nombre del municipio
  };
}


  async remove(id: number) {
    const employee = await this.prisma.employee.findUnique({
      where: { idEmployee: id },
    });

    if (!employee) {
      throw new NotFoundException(`Empleado con ID ${id} no encontrado`);
    }

    return this.prisma.employee.delete({
      where: { idEmployee: id },
    });
  }

  async getIdEmployeeFromEmail(email: string) {
    if (!email) {
      return 0;
    }

    const employee = await this.prisma.account.findFirst({
      where: { email },
      select: { idEmployee: true },
    });

    return employee?.idEmployee ?? 0;
  }

  async getTypeEmployee(idEmployee: number) {
    const employeeType = await this.prisma.employee.findUnique({
      select: { EmployeeType: { select: { employeeType: true } } },
      where: { idEmployee },
    });

    if (!employeeType) {
      throw new NotFoundException(`Empleado no encontrado`);
    }

    return employeeType.EmployeeType.employeeType;
  }
}
