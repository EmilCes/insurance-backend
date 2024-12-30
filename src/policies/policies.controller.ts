import { Controller, Get, Post, Body, Patch, Param, Delete, Query, NotFoundException, ParseIntPipe, ValidationPipe, ParseUUIDPipe, HttpCode, Put, BadRequestException, HttpException, UnprocessableEntityException, HttpStatus } from '@nestjs/common';
import { PoliciesService } from './policies.service';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { Public } from 'src/skipAuth.decorator';
import { RoleAdjuster, RoleDriver } from 'src/roleAuth.decorator';
import { isUUID } from 'class-validator';

@Controller('policies')
export class PoliciesController {
  constructor(private readonly policiesService: PoliciesService) { }

  @RoleDriver()
  @Post()
  async create(@Body(ValidationPipe) createPolicyDto: CreatePolicyDto) {
    try {
      const policyCreated = await this.policiesService.create(createPolicyDto);
      return policyCreated;
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
  async cancelPolicy(@Param("id", ParseUUIDPipe) idPolicy: string) {
    try {
      const response = await this.policiesService.cancel(idPolicy);
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
  async findFilter(@Query("page", ParseIntPipe) query: number, @Query("type") type: string, @Query("status", ParseIntPipe) status: number, @Query("idPolicy") idPolicy: string) {
    try {
      const typePlan = isUUID(type) || type == "0" ? type : undefined;
      if (typePlan == undefined) {
        throw new BadRequestException("Invalid type");
      }

      switch (status) {
        case 1:
        case 2:
          const statusPolicies = await this.policiesService.findActiveInvalidPolicies(query, typePlan, status, idPolicy);
          if (statusPolicies.length > 0) {
            return statusPolicies;
          }
          break;
        case 0:
        case 3:
          const policies = await this.policiesService.findAllFilter(query, typePlan, status, idPolicy);
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
  @Get("/total")
  async findAllTotal(@Query("type") type: string, @Query("status", ParseIntPipe) status: number, @Query("idPolicy") idPolicy: string) {
    try {
      const typePlan = isUUID(type) || type == "0" ? type : undefined;
      if (typePlan == undefined) {
        throw new BadRequestException("Invalid type");
      }

      switch (status) {
        case 1:
        case 2:
          return await this.policiesService.findAllTotalStatus(type, status, idPolicy);
        case 0:
        case 3:
          return await this.policiesService.findAllTotal(type, status, idPolicy);
        default:
          throw new BadRequestException("Invalid status");
      }

    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new UnprocessableEntityException("Error getting the total policies");
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const policy = await this.policiesService.findOne(id);
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
