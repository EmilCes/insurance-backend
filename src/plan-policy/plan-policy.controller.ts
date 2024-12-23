import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlanPolicyService } from './plan-policy.service';
import { CreatePlanPolicyDto } from './dto/create-plan-policy.dto';
import { UpdatePlanPolicyDto } from './dto/update-plan-policy.dto';
import { Public } from 'src/skipAuth.decorator';

@Controller('plan-policy')
export class PlanPolicyController {
  constructor(private readonly planPolicyService: PlanPolicyService) {}

  @Post()
  create(@Body() createPlanPolicyDto: CreatePlanPolicyDto) {
    return this.planPolicyService.create(createPlanPolicyDto);
  }

  @Public()
  @Get()
  async findAll() {
    return await this.planPolicyService.findAll();
  }

  @Public()
  @Get("/:id")
  async findPolicy(@Param('id') id: string) {
    return await this.planPolicyService.findPolicy(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlanPolicyDto: UpdatePlanPolicyDto) {
    return this.planPolicyService.update(+id, updatePlanPolicyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.planPolicyService.remove(+id);
  }
}
