import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StateService } from './state.service';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { Public } from 'src/skipAuth.decorator';

@Controller('state')
export class StateController {
  constructor(private readonly stateService: StateService) {}

  @Public()
  @Get()
  findAll() {
    return this.stateService.findAll();
  }

}
