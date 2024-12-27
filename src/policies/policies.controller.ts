import { Controller, Get, Post, Body, Patch, Param, Delete, Query, NotFoundException, ParseIntPipe, ValidationPipe, ParseUUIDPipe } from '@nestjs/common';
import { PoliciesService } from './policies.service';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { Public } from 'src/skipAuth.decorator';

@Controller('policies')
export class PoliciesController {
  constructor(private readonly policiesService: PoliciesService) { }

  @Public()
  @Post()
  async create(@Body(ValidationPipe) createPolicyDto: CreatePolicyDto) {
    return await this.policiesService.create(createPolicyDto);
  }

  @Public()
  @Get()
  async findAll(@Query("page", ParseIntPipe) query: number) {
    const policies = await this.policiesService.findAll(query);
    if (policies) {
      return policies;
    }
    throw new NotFoundException("Policies not found");
  }

  @Public()
  @Get("/total")
  async findAllTotal() {
    return await this.policiesService.findAllTotal();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const policy = await this.policiesService.findOne(id);
    if (policy) {
      return policy;
    }
    throw new NotFoundException("Policy not found");
  }

}
