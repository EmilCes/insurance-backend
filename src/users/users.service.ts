/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { equals } from 'class-validator';

@Injectable()
export class UsersService {

  constructor(
    private prisma: PrismaService
  ) { }

  // src/users/users.service.ts

async create(createUserDto: CreateUserDto) {
  // Verificar si ya existe un usuario con el mismo correo electrónico o RFC
  const existingEmail = await this.prisma.account.findFirst({
    where: { email: createUserDto.email },
  });

  const existingRfc = await this.prisma.driver.findFirst({
    where: { rfc: createUserDto.rfc },
  });

  if (existingEmail) {
    throw new Error(`El correo electrónico ${createUserDto.email} ya está registrado.`);
  }

  if (existingRfc) {
    throw new Error(`El RFC ${createUserDto.rfc} ya está registrado.`);
  }

  const user = await this.prisma.account.create({
    data: {
      name: createUserDto.name,
      lastName: createUserDto.lastName,
      datebirth: new Date(createUserDto.datebirth),
      email: createUserDto.email,
      password: createUserDto.password,
      postalCode: createUserDto.postalCode,
      address: createUserDto.address,
      registrationDate: new Date(),
      secretKey: createUserDto.secretKey || 'default_secret_key',
      Municipality: {  
        connect: { idMunicipality: +createUserDto.idMunicipality }, 
      },
      Driver: {
        create: {
          rfc: createUserDto.rfc,
          bankAccountNumber: createUserDto.bankAccountNumber,
          expirationDateBankAccount: new Date(`${createUserDto.expirationDateBankAccount}-01T00:00:00.000Z`),
          licenseNumber: createUserDto.licenseNumber,
          phone: createUserDto.phone,
        },
      },
    },
  });

  return user; 
}


  findAll() {
    return `This action returns all users`;
  }

  findOne(userId: number) {
    const userFound = this.prisma.account.findUnique({ where: { idAccount: userId } });

    if (!userFound)
      throw new NotFoundException(`Usuario con ${userId} no encontrado`);

    return userFound;
  }

  async findAccountInfo(email: string) {
    const driverFound = await this.prisma.driver.findFirst({
      where: { Account: { email: { equals: email }} },
      select: { bankAccountNumber: true, expirationDateBankAccount: true }
    })
    return driverFound;
  }

  async signIn(email: string) {
    const userFound = await this.prisma.account.findFirst({ where: { email: email } });
    if (!userFound)
      throw new NotFoundException(`Usuario no encontrado`);

    return userFound;
  }

  async getIdUserFromEmail(email: string) {
    if (email == undefined) {
      return 0;
    }
    const user = await this.prisma.account.findFirst({ where: { email: { equals: email } }, select: { idUser: true } });
    return user?.idUser == undefined ? 0 : user.idUser;
  }

  async getIdUserFromLicenseNumber(licenseNumber: string) {
    if (licenseNumber == undefined) {
      return 0;
    }
    const user = await this.prisma.driver.findFirst({where: {licenseNumber: {equals: licenseNumber}}, select: { idUser: true}});
    return user?.idUser == undefined ? 0 : user.idUser;
  }

  async getIdUserFromRFC(rfc: string) {
    if (rfc == undefined) {
      return 0;
    }
    const user = await this.prisma.driver.findFirst({where: {rfc: {equals: rfc}}, select: { idUser: true}});
    return user?.idUser == undefined ? 0 : user.idUser;
  }

  async getTypeEmployee(idEmployee: number) {
    const employeeType = await this.prisma.employee.findUnique({
      select: { EmployeeType: { select: { employeeType: true } } },
      where: { idEmployee: idEmployee }
    });
    if (!employeeType)
      throw new NotFoundException(`Empleado no encontrado`);

    return employeeType.EmployeeType.employeeType;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
