import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MunicipalityService } from './municipality.service';
import { CreateMunicipalityDto } from './dto/create-municipality.dto';
import { UpdateMunicipalityDto } from './dto/update-municipality.dto';
import { Public } from 'src/skipAuth.decorator';

@Controller('municipality')
export class MunicipalityController {
  constructor(private readonly municipalityService: MunicipalityService) {}

  @Public()
  @Get()
  findAll() {
    return this.municipalityService.findAll();
  }
}
