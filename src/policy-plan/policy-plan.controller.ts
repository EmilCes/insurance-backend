import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, ParseUUIDPipe, UnprocessableEntityException, HttpException } from '@nestjs/common';
import { PolicyPlanService } from './policy-plan.service';
import { CreatePolicyPlanDto } from './dto/create-policy-plan.dto';
import { UpdatePolicyPlanDto } from './dto/update-policy-plan.dto';
import { Public } from 'src/skipAuth.decorator';

@Controller('policy-plan')
export class PolicyPlanController {
  constructor(private readonly policyPlanService: PolicyPlanService) { }

  @Public()
  @Post()
  async create(@Body(ValidationPipe) createPolicyPlanDto: CreatePolicyPlanDto) {
    try {
      const newPolicyPlan = await this.policyPlanService.create(createPolicyPlanDto);
      return newPolicyPlan;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new UnprocessableEntityException("Error creating policy plan");
    }
  }

  @Public()
  @Get("/current")
  async findAllCurrent() {
    return await this.policyPlanService.findAllCurrent();
  }


  @Public()
  @Get()
  async findAll() {
    try {
      return await this.policyPlanService.findAll();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new UnprocessableEntityException("Error Inesperado");
    }
  }

  @Public()
  @Get(':id')
  findOnePlanPolicy(@Param("id", ParseUUIDPipe) id: string) {
    try {
      return this.policyPlanService.findPlanPolicy(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new UnprocessableEntityException("Error getting policy plan");
    }
  }

  @Public()
  @Patch(':id')
  update(@Param("id", ParseUUIDPipe) id: string, @Body(ValidationPipe) updatePolicyPlanDto: UpdatePolicyPlanDto) {
    try {
      return this.policyPlanService.update(id, updatePolicyPlanDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new UnprocessableEntityException("Error updating policy plan");
    }
  }

  @Public()
  @Delete(':id')
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
}
