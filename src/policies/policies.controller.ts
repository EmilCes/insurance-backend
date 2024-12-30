import { Controller, Get, Post, Body, Patch, Param, Delete, Query, NotFoundException, ParseIntPipe, ValidationPipe, ParseUUIDPipe, HttpCode, Put, BadRequestException, HttpException, UnprocessableEntityException, HttpStatus, Request } from '@nestjs/common';
import { PoliciesService } from './policies.service';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { Public } from 'src/skipAuth.decorator';
import { RoleAdjuster, RoleDriver } from 'src/roleAuth.decorator';
import { isUUID } from 'class-validator';
import { UsersService } from 'src/users/users.service';

@Controller('policies')
export class PoliciesController {
  constructor(private readonly policiesService: PoliciesService, private readonly usersService: UsersService) { }

  @RoleDriver()
  @Post()
  async create(@Request() req, @Body(ValidationPipe) createPolicyDto: CreatePolicyDto) {
    try {
      const idUser = await this.usersService.getIdUserFromEmail(req.user.username);
      if (idUser > 0) {
        const policyCreated = await this.policiesService.create(createPolicyDto, idUser);
        return policyCreated;
      }
      throw new BadRequestException("Error with the request data");
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new UnprocessableEntityException("Error creating the policy");
    }
  }

  @RoleDriver()
  @Put("/cancel/:id")
  @HttpCode(204)
  async cancelPolicy(@Request() req, @Param("id", ParseUUIDPipe) idPolicy: string) {
    try {
      const idUser = await this.usersService.getIdUserFromEmail(req.user.username);
      if(idUser <= 0){
        throw new BadRequestException("Error with the request data");
      }

      const response = await this.policiesService.cancel(idPolicy, idUser);
      if (response == null) {
        throw new BadRequestException("Policy doesn't exists");
      }
      return;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new UnprocessableEntityException("Error canceling the policy");
    }
  }

  @Get()
  async findFilter(@Request() req, @Query("page", ParseIntPipe) query: number, @Query("type") type: string,
    @Query("status", ParseIntPipe) status: number, @Query("idPolicy") idPolicy: string) {
    try {
      const idUser = await this.usersService.getIdUserFromEmail(req.user.username);
      if(idUser <= 0){
        throw new BadRequestException("Error with the request data");
      }

      const typePlan = isUUID(type) || type == "0" ? type : undefined;
      if (typePlan == undefined) {
        throw new BadRequestException("Invalid type");
      }

      switch (status) {
        case 1:
        case 2:
          const statusPolicies = await this.policiesService.findActiveInvalidPolicies(query, typePlan, status, idPolicy, idUser);
          if (statusPolicies.length > 0) {
            return statusPolicies;
          }
          break;
        case 0:
        case 3:
          const policies = await this.policiesService.findAllFilter(query, typePlan, status, idPolicy, idUser);
          if (policies.length > 0) {
            return policies;
          }
          break;
        default:
          throw new BadRequestException("Invalid status");
      }
      throw new NotFoundException("Policies not found");
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new UnprocessableEntityException("Error getting the policies");
    }
  }

  @RoleDriver()
  @Get("/total")
  async findAllTotal(@Request() req, @Query("type") type: string, @Query("status", ParseIntPipe) status: number, @Query("idPolicy") idPolicy: string) {
    try {
      const idUser = await this.usersService.getIdUserFromEmail(req.user.username);
      if(idUser <= 0){
        throw new BadRequestException("Error with the request data");
      }

      const typePlan = isUUID(type) || type == "0" ? type : undefined;
      if (typePlan == undefined) {
        throw new BadRequestException("Invalid type");
      }

      switch (status) {
        case 1:
        case 2:
          return await this.policiesService.findAllTotalStatus(type, status, idPolicy, idUser);
        case 0:
        case 3:
          return await this.policiesService.findAllTotal(type, status, idPolicy, idUser);
        default:
          throw new BadRequestException("Invalid status");
      }

    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new UnprocessableEntityException("Error getting the total policies");
    }
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id', ParseUUIDPipe) id: string) {
    try {
      const idUser = await this.usersService.getIdUserFromEmail(req.user.username);
      if(idUser <= 0){
        throw new BadRequestException("Error with the request data");
      }

      const policy = await this.policiesService.findOne(id, idUser);
      if (policy) {
        return policy;
      }
      throw new NotFoundException("Policy not found");
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new UnprocessableEntityException("Error finding one policy");
    }
  }

}
