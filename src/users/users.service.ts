import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {

  constructor(
    private prisma: PrismaService
  ) { }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
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
