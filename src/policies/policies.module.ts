import { Module } from "@nestjs/common";
import { PoliciesService } from "./policies.service";
import { PoliciesController } from "./policies.controller";
import { PrismaService } from "../prisma.service";
import { VehiclesService } from "src/vehicles/vehicles.service";
import { UsersService } from "src/users/users.service";

@Module({
  controllers: [PoliciesController],
  providers: [PoliciesService, PrismaService, VehiclesService, UsersService],
})
export class PoliciesModule {}
