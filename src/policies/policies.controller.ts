import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpException,
  NotFoundException,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Request,
  UnprocessableEntityException,
  ValidationPipe,
} from "@nestjs/common";
import { PoliciesService } from "./policies.service";
import { CreatePolicyDto } from "./dto/create-policy.dto";
import { RoleDriver } from "src/roleAuth.decorator";
import { UsersService } from "src/users/users.service";
import { VehiclesService } from "src/vehicles/vehicles.service";

@Controller("policies")
export class PoliciesController {
  constructor(
    private readonly policiesService: PoliciesService,
    private readonly usersService: UsersService,
    private readonly vehiclesService: VehiclesService,
  ) {}

  @RoleDriver()
  @Post()
  async create(
    @Request() req,
    @Body(ValidationPipe) createPolicyDto: CreatePolicyDto,
  ) {
    try {
      const idUser = await this.usersService.getIdUserFromEmail(
        req.user.username,
      );
      if (idUser > 0) {
        const vehicle = await this.vehiclesService.validatePlates(
          createPolicyDto.plates,
        );
        if (vehicle) {
          const numberValidPoliciesWithPlates = await this.policiesService
            .vehicleWithValidPolicies(createPolicyDto.plates, idUser);
          if (numberValidPoliciesWithPlates > 0) {
            throw new ConflictException("Plates found with a valid policy");
          }
        }

        const accountData = await this.usersService.findAccountInfo(
          req.user.username,
        );
        if (accountData != null) {
          const expirationDate = new Date(
            accountData.expirationDateBankAccount,
          );
          if (new Date() < expirationDate) {
            const policyCreated = await this.policiesService.create(
              createPolicyDto,
              idUser,
            );
            return policyCreated;
          } else {
            throw new BadRequestException("Account expired");
          }
        }
      }
      throw new BadRequestException("Error with the request data");
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new UnprocessableEntityException("Error creating the policy");
    }
  }

  @RoleDriver()
  @Put("/cancel/:id")
  @HttpCode(204)
  async cancelPolicy(
    @Request() req,
    @Param("id", ParseUUIDPipe) idPolicy: string,
  ) {
    try {
      const idUser = await this.usersService.getIdUserFromEmail(
        req.user.username,
      );
      if (idUser <= 0) {
        throw new BadRequestException("Error with the request data");
      }

      const response = await this.policiesService.cancel(idPolicy, idUser);
      if (response == null) {
        throw new BadRequestException("Policy doesn't exists");
      }
      return;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new UnprocessableEntityException("Error canceling the policy");
    }
  }

  @Get()
  async findFilter(
    @Request() req,
    @Query("page", ParseIntPipe) query: number,
    @Query("type") type: string,
    @Query("status", ParseIntPipe) status: number,
    @Query("idPolicy") idPolicy: string,
  ) {
    try {
      const idUser = await this.usersService.getIdUserFromEmail(
        req.user.username,
      );

      if (idUser <= 0) {
        throw new BadRequestException("Error with the request data");
      }

      const typePlan = type.length > 0 || type == "0" ? type : undefined;
      if (typePlan == undefined) {
        throw new BadRequestException("Invalid type");
      }

      switch (status) {
        case 1:
        case 2:
          const statusPolicies = await this.policiesService
            .findActiveInvalidPolicies(
              query,
              typePlan,
              status,
              idPolicy,
              idUser,
            );
          if (statusPolicies.length > 0) {
            return statusPolicies;
          }
          break;
        case 0:
        case 3:
          const policies = await this.policiesService.findAllFilter(
            query,
            typePlan,
            status,
            idPolicy,
            idUser,
          );
          if (policies.length > 0) {
            return policies;
          }
          break;
        default:
          throw new BadRequestException("Invalid status");
      }
      throw new NotFoundException("Policies not found");
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new UnprocessableEntityException("Error getting the policies");
    }
  }

  @RoleDriver()
  @Get("/active")
  async findAllActivePolicies(@Request() req) {
    try {
      const idUser = await this.usersService.getIdUserFromEmail(
        req.user.username,
      );

      if (idUser <= 0) {
        throw new BadRequestException("Error with the request data");
      }

      const activePolicies = await this.policiesService
        .findAllActivePoliciesByUser(
          idUser,
        );

      if (activePolicies.length === 0) {
        throw new NotFoundException("No active policies found for the user");
      }

      return activePolicies;
    } catch (err) {
      console.log(err);
      if (err instanceof HttpException) {
        throw err;
      }
      throw new UnprocessableEntityException(
        "Error retrieving active policies",
      );
    }
  }

  @RoleDriver()
  @Get("/total")
  async findAllTotal(
    @Request() req,
    @Query("type") type: string,
    @Query("status", ParseIntPipe) status: number,
    @Query("idPolicy") idPolicy: string,
  ) {
    try {
      const idUser = await this.usersService.getIdUserFromEmail(
        req.user.username,
      );
      if (idUser <= 0) {
        throw new BadRequestException("Error with the request data");
      }

      const typePlan = type.length > 0 || type == "0" ? type : undefined;
      if (typePlan == undefined) {
        throw new BadRequestException("Invalid type");
      }

      switch (status) {
        case 1:
        case 2:
          return await this.policiesService.findAllTotalStatus(
            type,
            status,
            idPolicy,
            idUser,
          );
        case 0:
        case 3:
          return await this.policiesService.findAllTotal(
            type,
            status,
            idPolicy,
            idUser,
          );
        default:
          throw new BadRequestException("Invalid status");
      }
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new UnprocessableEntityException(
        "Error getting the total policies",
      );
    }
  }

  @RoleDriver()
  @Get("/current/types")
  async findAllTypes(@Request() req) {
    try {
      const idUser = await this.usersService.getIdUserFromEmail(
        req.user.username,
      );
      if (idUser <= 0) {
        throw new BadRequestException("Error with the request data");
      }

      const policyPlansTitle = await this.policiesService.findAllCurrentTitles(
        idUser,
      );
      if (!policyPlansTitle || policyPlansTitle.length <= 0) {
        throw new NotFoundException(`Policies plans not found`);
      }
      return policyPlansTitle;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new UnprocessableEntityException("Error getting the current plans");
    }
  }

  @Get(":id")
  async findOne(@Request() req, @Param("id", ParseUUIDPipe) id: string) {
    try {
      const idUser = await this.usersService.getIdUserFromEmail(
        req.user.username,
      );
      if (idUser <= 0) {
        throw new BadRequestException("Error with the request data");
      }

      const policy = await this.policiesService.findOne(id, idUser);
      if (policy) {
        return policy;
      }
      throw new NotFoundException("Policy not found");
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new UnprocessableEntityException("Error finding one policy");
    }
  }
}
