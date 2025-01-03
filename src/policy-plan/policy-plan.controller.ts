import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, UseGuards, NotFoundException, HttpException, UnprocessableEntityException, ValidationPipe, ParseUUIDPipe, Query, ParseIntPipe, Request } from '@nestjs/common';
import { PolicyPlanService } from './policy-plan.service';
import { CreatePolicyPlanDto } from './dto/create-policy-plan.dto';
import { UpdatePolicyPlanDto } from './dto/update-policy-plan.dto';
import { UpdatePolicyPlanStatusDto } from './dto/update-policy-plan-status.dto';
import { Public } from '../skipAuth.decorator';
import { RoleDriver } from '../roleAuth.decorator';
import { ValidationService } from './validation.service';

@Controller('policy-plan')
export class PolicyPlanController {
  constructor(private readonly policyPlanService: PolicyPlanService, private readonly validationService: ValidationService) { }

  @Public()
  @Post()
  async create(@Body(ValidationPipe) createPolicyPlanDto: CreatePolicyPlanDto) {
    try {
      this.validationService.validateCoveredCost(createPolicyPlanDto);
      const newPolicyPlan = await this.policyPlanService.create(createPolicyPlanDto);
      return newPolicyPlan;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new UnprocessableEntityException("Error creating policy plan");
    }
  }

  @RoleDriver()
  @Get("/current")
  async findCurrentPlanPolicies() {
    try {
      const policyPlans = await this.policyPlanService.findAllCurrent();
      if (!policyPlans || policyPlans.length <= 0)
        throw new NotFoundException(`Policies plans not found`);
      return policyPlans;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new UnprocessableEntityException("Error getting the current plans");
    }
  }

  @Get(':id')
  @Public()
  async findOnePlanPolicy(@Param('id') id: string) {
    try {
      const policyPlans = await this.policyPlanService.findPlanPolicy(id);
      if (!policyPlans)
        throw new NotFoundException(`Policy plan not found`);

      return policyPlans;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new UnprocessableEntityException("Error getting policy plan");
    }
  }

  @Get('/status/:id')
  @Public()
  async findOnePlanPolicyWithStatus(@Param('id') id: string) {
    try {
      const policyPlans = await this.policyPlanService.findPlanPolicyWithStatus(id);
      if (!policyPlans)
        throw new NotFoundException(`Policy plan not found`);

      return policyPlans;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new UnprocessableEntityException("Error getting policy plan");
    }
  }

  @Patch(':id')
  @Public()
  async update(@Param("id", ParseUUIDPipe) id: string, @Body(ValidationPipe) updatePolicyPlanDto: UpdatePolicyPlanDto) {
    try {
      return this.policyPlanService.update(id, updatePolicyPlanDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new UnprocessableEntityException("Error updating policy plan");
    }
  }

  @Patch('/status/:id')
  @Public()
  async updateStatus(@Param("id", ParseUUIDPipe) id: string, @Body(ValidationPipe) updatePolicyPlanStatusDto: UpdatePolicyPlanStatusDto) {
    try {
      return this.policyPlanService.updateStatus(id, updatePolicyPlanStatusDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new UnprocessableEntityException("Error updating status of policy plan");
    }
  }

  @Delete(':id')
  @Public()
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    try {
      return this.policyPlanService.remove(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new UnprocessableEntityException("Error removing policy plan");
    }
  }

  @Get()
  @Public()
  async findFilter(@Request() req, @Query("page", ParseIntPipe) query: number, @Query("status", ParseIntPipe) status: number,
    @Query("name") name: string) {
    try {
      if (query < 0) {
        throw new BadRequestException("Invalid page");
      }
      switch (status) {
        case 0:
        case 1:
        case 2:
          const statusPolicies = await this.policyPlanService.findPlanPolicyPage(query, status, name);
          if (statusPolicies.length > 0) {
            return statusPolicies;
          }
          break;
        default:
          throw new BadRequestException("Invalid status");
      }
      throw new NotFoundException("Plans Policy not found");
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new UnprocessableEntityException("Error getting the plans policy");
    }
  }
}
