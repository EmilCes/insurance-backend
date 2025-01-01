import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, UseGuards, NotFoundException, HttpException, UnprocessableEntityException, ValidationPipe, ParseUUIDPipe } from '@nestjs/common';
import { PolicyPlanService } from './policy-plan.service';
import { CreatePolicyPlanDto } from './dto/create-policy-plan.dto';
import { UpdatePolicyPlanDto } from './dto/update-policy-plan.dto';
import { Public } from 'src/skipAuth.decorator';
import { RoleDriver } from 'src/roleAuth.decorator';

@Controller('policy-plan')
export class PolicyPlanController {
  constructor(private readonly policyPlanService: PolicyPlanService) { }

  @Public()
  @Post()
  async create(@Body(ValidationPipe) createPolicyPlanDto: CreatePolicyPlanDto) {
    try {
      const nuevaPlanPoliza = await this.policyPlanService.create(createPolicyPlanDto);
      return nuevaPlanPoliza;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new UnprocessableEntityException("Error Inesperado");
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
      throw new UnprocessableEntityException("Error getting the policy plan");
    }
  }

  @Patch(':id')
  update(@Param("id", ParseUUIDPipe) id: string, @Body(ValidationPipe) updatePolicyPlanDto: UpdatePolicyPlanDto) {
    try {
      return this.policyPlanService.update(id, updatePolicyPlanDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new UnprocessableEntityException("Error Inesperado");
    }
  }

  @Delete(':id')
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    try {
      return this.policyPlanService.remove(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new UnprocessableEntityException("Error Inesperado");
    }
  }
}
