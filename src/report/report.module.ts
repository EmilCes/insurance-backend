import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { ValidationService } from './validation.service';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [ReportController],
  providers: [ReportService, PrismaService, ValidationService, UsersService],
})
export class ReportModule {}
