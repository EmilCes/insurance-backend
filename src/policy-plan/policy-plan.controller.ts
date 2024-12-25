import { Controller, Get, Post, Body, Patch, Param, Delete, ConflictException, BadRequestException, UseGuards } from '@nestjs/common';
import { PolicyPlanService } from './policy-plan.service';
import { CreatePolicyPlanDto } from './dto/create-policy-plan.dto';
import { UpdatePolicyPlanDto } from './dto/update-policy-plan.dto';
import { Public } from 'src/skipAuth.decorator';
import { PolicyPlanGuard } from './policy-plan.guard';

@Controller('policy-plan')
export class PolicyPlanController {
  constructor(private readonly policyPlanService: PolicyPlanService) {}
  
  @Public()
  @Post()
  @UseGuards(PolicyPlanGuard)
  async create(@Body() createPolicyPlanDto: CreatePolicyPlanDto) {
    try {
      const nuevaPlanPoliza = await this.policyPlanService.create(createPolicyPlanDto);
      return nuevaPlanPoliza;
    } catch (error) {
      //Mismo titulo, Poner mensajes de eeror especializados?
      throw new BadRequestException("Error Bad Request")
    }
  }

  @Public()
  @Get()
  findAll() {
    return this.policyPlanService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.policyPlanService.findOne(+id);
  }

  @Public()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePolicyPlanDto: UpdatePolicyPlanDto) {
    return this.policyPlanService.update(+id, updatePolicyPlanDto);
  }

  @Public()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.policyPlanService.remove(+id);
  }
}
