import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { ValidationService } from './validation.service';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import { AwsConfigService } from 'src/AWS/aws-config.service';
import { AwsConfigModule } from 'src/AWS/aws-config.module';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  controllers: [ReportController],
  providers: [ReportService, PrismaService, ValidationService, UsersService, AwsConfigService],
  exports : [ValidationService],
  imports: [
    AwsConfigModule,
    NestjsFormDataModule
  ]
})
export class ReportModule {}
