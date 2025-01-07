import { Controller, Get, Post, Body, Param, Delete, Put, Request, BadRequestException, HttpException, UnprocessableEntityException, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RoleDriver } from 'src/roleAuth.decorator';
import { Public } from 'src/skipAuth.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @RoleDriver()
  @Get('/account')
  async findAccountInfo(@Request() req) {
    try {
      const infoAccount = await this.usersService.findAccountInfo(req.user.username);
      if (infoAccount != null) {
        return infoAccount;
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
  @Get('/account/info')
  async getAccountInfo(@Request() req) {
    try {
      const infoAccount = await this.usersService.findDriverInfo(req.user.username);
      if (infoAccount != null) {
        return infoAccount;
      }
      throw new BadRequestException("Error with the request data");
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new UnprocessableEntityException("Error creating the policy");
    }

  }

  @Public()
  @Get('/email-exists')
  async checkEmailExists(@Query('email') email: string) {
    try {
      if (!email) {
        throw new BadRequestException('Email is required');
      }

      const user = await this.usersService.getIdUserFromEmail(email);

      if (user) {
        return { exists: true };
      } else {
        return { exists: false };
      }

    } catch (err) {
      if (err instanceof BadRequestException || err instanceof UnprocessableEntityException) {
        throw err;
      }
      throw new UnprocessableEntityException('Error while checking the email');
    }
  }

  @Public()
  @Get('/rfc-exists')
  async checkRfcExists(@Query('rfc') rfc: string) {
    try {
      if (!rfc) {
        throw new BadRequestException('Rfc is required');
      }

      const user = await this.usersService.getIdUserFromRFC(rfc);

      if (user) {
        return { exists: true };
      } else {
        return { exists: false };
      }

    } catch (err) {
      if (err instanceof BadRequestException || err instanceof UnprocessableEntityException) {
        throw err;
      }
      throw new UnprocessableEntityException('Error while checking the email');
    }
  }

  @Public()
  @Get('/license-exists')
  async checkLicenseExists(@Query('licenseNumber') licenseNumber: string) {
    try {
      if (!licenseNumber) {
        throw new BadRequestException('License is required');
      }

      const user = await this.usersService.getIdUserFromLicenseNumber(licenseNumber);

      if (user) {
        return { exists: true };
      } else {
        return { exists: false };
      }

    } catch (err) {
      if (err instanceof BadRequestException || err instanceof UnprocessableEntityException) {
        throw err;
      }
      throw new UnprocessableEntityException('Error while checking the email');
    }
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @RoleDriver()
  @Put(':email')
  update(@Request() req, @Param('email') email: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUserByEmail(req.user.username, updateUserDto);
  }

}
