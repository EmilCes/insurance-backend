import { Module } from '@nestjs/common';
import { PoliciesService } from './policies.service';
import { PoliciesController } from './policies.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [PoliciesController],
  providers: [PoliciesService, PrismaService],
})
export class PoliciesModule {}
