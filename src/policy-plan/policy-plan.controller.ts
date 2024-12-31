import { Controller, Get, Post, Body, Patch, Param, Delete, ConflictException, BadRequestException, UseGuards, NotFoundException, HttpException, UnprocessableEntityException } from '@nestjs/common';
import { PolicyPlanService } from './policy-plan.service';
import { CreatePolicyPlanDto } from './dto/create-policy-plan.dto';
import { UpdatePolicyPlanDto } from './dto/update-policy-plan.dto';
import { Public } from 'src/skipAuth.decorator';
import { PolicyPlanGuard } from './policy-plan.guard';
import { RoleDriver } from 'src/roleAuth.decorator';

@Controller('policy-plan')
export class PolicyPlanController {
  constructor(private readonly policyPlanService: PolicyPlanService) { }

  @Public()
  @Post()
  //@UseGuards(PolicyPlanGuard)
  async create(@Body() createPolicyPlanDto: CreatePolicyPlanDto) {
    try {
      const nuevaPlanPoliza = await this.policyPlanService.create(createPolicyPlanDto);
      return nuevaPlanPoliza;
    } catch (error) {
      //Mismo titulo, Poner mensajes de eeror especializados?
      throw new BadRequestException("Error Bad Request")
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
  
  @RoleDriver()
  @Get("/current/types")
  async findAll() {
    try {
      const policyPlansTitle = await this.policyPlanService.findAllCurrentTitles();
      if (!policyPlansTitle || policyPlansTitle.length <= 0)
        throw new NotFoundException(`Policies plans not found`);
      return policyPlansTitle;
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
  update(@Param('id') id: string, @Body() updatePolicyPlanDto: UpdatePolicyPlanDto) {
    return this.policyPlanService.update(+id, updatePolicyPlanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.policyPlanService.remove(+id);
  }
}
