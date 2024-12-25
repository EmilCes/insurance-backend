import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PoliciesService } from './policies.service';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { Public } from 'src/skipAuth.decorator';

@Controller('policies')
export class PoliciesController {
  constructor(private readonly policiesService: PoliciesService) {}

  @Public()
  @Post()
  async create(@Body() createPolicyDto: CreatePolicyDto) {
    return await this.policiesService.create(createPolicyDto);
  }

  @Get()
  findAll() {
    return this.policiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.policiesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePolicyDto: UpdatePolicyDto) {
    return this.policiesService.update(+id, updatePolicyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.policiesService.remove(+id);
  }
}
