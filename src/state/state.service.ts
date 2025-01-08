import { Injectable} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';


@Injectable()
export class StateService {

  constructor(
    private prisma: PrismaService
  ) { }

  async findAll() {
    return await this.prisma.state.findMany({
      select: {
        idState: true,
        stateName: true,
      },
    });
  }

}
