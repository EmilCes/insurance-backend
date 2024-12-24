import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PolicyPlanService } from './policy-plan.service';
import { CreatePolicyPlanDto } from './dto/create-policy-plan.dto';
import { UpdatePolicyPlanDto } from './dto/update-policy-plan.dto';
import { Public } from 'src/skipAuth.decorator';

@Controller('policy-plan')
export class PolicyPlanController {
  constructor(private readonly policyPlanService: PolicyPlanService) {}
  
  @Public()
  @Post()
  create(@Body() createPolicyPlanDto: CreatePolicyPlanDto) {
    return this.policyPlanService.create(createPolicyPlanDto);
  }
/*
  @Post()
  async create(@Body() createPolicyPlanDto: CreatePolicyPlanDto, @Res() res: Response,) {
    const newPolicyPlan = await this.policyPlanService.create(createPolicyPlanDto);
    return res.status(HttpStatus.CREATED).json({
      message: 'Plan de poliza creada',
      data: newPolicyPlan
    });
  }
*/
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
