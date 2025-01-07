/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException} from '@nestjs/common';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { PrismaService } from 'src/prisma.service';
import { equals } from 'class-validator';


@Injectable()
export class StateService {

  constructor(
    private prisma: PrismaService
  ) { }

  create(createStateDto: CreateStateDto) {
    return 'This action adds a new state';
  }

  async findAll() {
    return await this.prisma.state.findMany({
      select: {
        idState: true,
        stateName: true,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} state`;
  }

  update(id: number, updateStateDto: UpdateStateDto) {
    return `This action updates a #${id} state`;
  }

  remove(id: number) {
    return `This action removes a #${id} state`;
  }
}
