/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BrandsModule } from './brands/brands.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { PoliciesModule } from './policies/policies.module';
import { PolicyPlanModule } from './policy-plan/policy-plan.module';
import { ReportModule } from './report/report.module';
import { MunicipalityModule } from './municipality/municipality.module';
import { StateModule } from './state/state.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env'
  }), AuthModule, UsersModule, BrandsModule, VehiclesModule, PoliciesModule, PolicyPlanModule, ReportModule, MunicipalityModule, StateModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
