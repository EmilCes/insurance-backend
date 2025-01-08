import { Controller, Get, Post, Body, Patch, Param, Delete, UnprocessableEntityException } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { RoleAdmin } from '../roleAuth.decorator';
import { Request } from "@nestjs/common";
import { BadRequestException } from "@nestjs/common";
import { HttpException } from "@nestjs/common";



@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @RoleAdmin()
  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Get()
  findAll() {
    return this.employeeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeeService.update(+id, updateEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeService.remove(+id);
  }

  @Get("/account/info")
  async getEmployeeInfo(@Request() req) {
    try {
      const infoAccount = await this.employeeService.findEmployeeInfo(
        req.user.email // Cambia `username` por `email` si es necesario
      );
      if (infoAccount) {
        return infoAccount;
      }
      throw new BadRequestException("Error con los datos de la solicitud");
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new UnprocessableEntityException(
        "Error obteniendo información del empleado"
      );
    }
  }

}
