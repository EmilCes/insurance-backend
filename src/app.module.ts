import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PlanPolicyModule } from './plan-policy/plan-policy.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env'
  }), AuthModule, UsersModule, PlanPolicyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
