import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {

  constructor(
    private prisma: PrismaService
  ) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(userId: string) {
    const userFound = this.prisma.user.findUnique({ where: { id: userId } });

    if (!userFound)
      throw new NotFoundException(`Usuario con ${userId} no encontrado`);

    return userFound;
  }

  signIn(email: string) {
    const userFound = this.prisma.user.findUnique({ where: { email: email } });

    if (!userFound)
      throw new NotFoundException(`Usuario no encontrado`);

    return userFound;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
