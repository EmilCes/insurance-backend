import { Controller, Get, Post, Body, Patch, Param, Delete, Query, NotFoundException, ParseIntPipe, ValidationPipe, ParseUUIDPipe, HttpCode, Put, BadRequestException, HttpException, UnprocessableEntityException, HttpStatus } from '@nestjs/common';
import { PoliciesService } from './policies.service';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { Public } from 'src/skipAuth.decorator';
import { RoleAdjuster, RoleDriver } from 'src/roleAuth.decorator';

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
        throw new HttpException(err.message, err.getStatus());
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
        throw new HttpException(err.message, err.getStatus());
      }
      throw new UnprocessableEntityException("Error canceling the policy");
    }

  }

  @Get()
  async findAll(@Query("page", ParseIntPipe) query: number) {
    try {
      const policies = await this.policiesService.findAll(query);
      if (policies) {
        return policies;
      }
      throw new NotFoundException("Policies not found");
    } catch (err) {
      if (err instanceof HttpException) {
        throw new HttpException(err.message, err.getStatus());
      }
      throw new UnprocessableEntityException("Error getting the policies");
    }

  }

  @RoleDriver()
  @Get("/total")
  async findAllTotal() {
    try {
      return await this.policiesService.findAllTotal();
    } catch (err) {
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
        throw new HttpException(err.message, err.getStatus());
      }
      throw new UnprocessableEntityException("Error finding one policy");
    }
  }

}
