/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {

  constructor(
    private prisma: PrismaService
  ) { }

  async updateUserByEmail(email: string, updateData: Partial<UpdateUserDto>) {
    const user = await this.prisma.account.findFirst({
      where: { email: email },
      include: {
        Driver: true,  
      },
    });

    console.log("Email:" + email + " UpdateData: " +updateData + " user: " + user);

    if (!user) {
      throw new NotFoundException(`Usuario con el correo ${email} no encontrado`);
    }

    const updatedUser = await this.prisma.account.update({
      where: { idAccount: user.idAccount },
      data: {
        address: updateData.address || user.address,
        postalCode: updateData.postalCode || user.postalCode,
        Municipality: {
          connect: { idMunicipality: +updateData.idMunicipality },
        }
      },
    });

    const updatedDriver = await this.prisma.driver.update({
      where: { idUser: user.Driver.idUser }, 
      data: {
        bankAccountNumber: updateData.bankAccountNumber || user.Driver.bankAccountNumber,
        expirationDateBankAccount: new Date(`${updateData.expirationDateBankAccount}-01T00:00:00.000Z`) || user.Driver.expirationDateBankAccount,
        phone: updateData.phone || user.Driver.phone,
        licenseNumber: updateData.licenseNumber || user.Driver.licenseNumber
      },
    });

    return { updatedUser, updatedDriver };
  }


  async create(createUserDto: CreateUserDto) {
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

  findOne(userId: number) {
    const userFound = this.prisma.account.findUnique({ where: { idAccount: userId } });

    if (!userFound)
      throw new NotFoundException(`Usuario con ${userId} no encontrado`);

    return userFound;
  }

  async findAccountInfo(email: string) {
    const driverFound = await this.prisma.driver.findFirst({
      where: { Account: { email: { equals: email } } },
      select: { bankAccountNumber: true, expirationDateBankAccount: true }
    })
    return driverFound;
  }

  async findDriverInfo(email: string) {
    const driverFound = await this.prisma.driver.findFirst({
      where: {
        Account: { email: { equals: email } },
      },
      include: {
        Account: {
          include: {
            Municipality: {
              include: {
                State: true,
              },
            },
          },
        },
      },
    });
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
    const user = await this.prisma.driver.findFirst({ where: { licenseNumber: { equals: licenseNumber } }, select: { idUser: true } });
    return user?.idUser == undefined ? 0 : user.idUser;
  }

  async getIdUserFromRFC(rfc: string) {
    if (rfc == undefined) {
      return 0;
    }
    const user = await this.prisma.driver.findFirst({ where: { rfc: { equals: rfc } }, select: { idUser: true } });
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

  async setTwoFactorAuthenticationSecret(secret: string, email: string) {
    const userFound = await this.prisma.account.findFirst({ where: { email: email } });

    await this.prisma.account.update({
      where: {
        idAccount: userFound.idAccount
      },
      data: {
        secretKey: secret, 
      },
    });
  }

  async is2faEnabled(email: string){
      const userFound = await this.prisma.account.findFirst({ where: { email: email } });

      return userFound.twoFactorIsEnabled;
  }

  async turnOnTwoFactorAuthentication(email: string) {
    const userFound = await this.prisma.account.findFirst({ where: { email: email } });

    await this.prisma.account.update({
      where: {
        idAccount: userFound.idAccount, 
      },
      data: {
        twoFactorIsEnabled: true,
      },
    });
  }
}
