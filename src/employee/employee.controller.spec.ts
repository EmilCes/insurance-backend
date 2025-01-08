import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

describe('EmployeeController', () => {
  let controller: EmployeeController;
  let service: EmployeeService;

  const mockEmployeeService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeController],
      providers: [
        { provide: EmployeeService, useValue: mockEmployeeService },
      ],
    }).compile();

    controller = module.get<EmployeeController>(EmployeeController);
    service = module.get<EmployeeService>(EmployeeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call employeeService.create and return the result', async () => {
      const dto: CreateEmployeeDto = {
        name: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('1990-01-01'),
        email: 'john.doe@example.com',
        password: 'password123',
        postalCode: '12345',
        address: '123 Main St',
        idMunicipality: 1,
        employeeNumber: 101,
        idEmployeeType: 2,
      };
      const result = { id: 1, ...dto };

      mockEmployeeService.create.mockResolvedValue(result);

      expect(await controller.create(dto)).toEqual(result);
      expect(mockEmployeeService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should call employeeService.findAll and return the result', async () => {
      const result = [
        {
          id: 1,
          name: 'John',
          lastName: 'Doe',
          dateOfBirth: new Date('1990-01-01'),
          email: 'john.doe@example.com',
          postalCode: '12345',
          address: '123 Main St',
          idMunicipality: 1,
          employeeNumber: 101,
          idEmployeeType: 2,
        },
      ];

      mockEmployeeService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
      expect(mockEmployeeService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call employeeService.findOne with the correct id and return the result', async () => {
      const id = '1';
      const result = {
        id: 1,
        name: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('1990-01-01'),
        email: 'john.doe@example.com',
        postalCode: '12345',
        address: '123 Main St',
        idMunicipality: 1,
        employeeNumber: 101,
        idEmployeeType: 2,
      };

      mockEmployeeService.findOne.mockResolvedValue(result);

      expect(await controller.findOne(id)).toEqual(result);
      expect(mockEmployeeService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should call employeeService.update with the correct id and dto, and return the result', async () => {
      const id = '1';
      const dto: UpdateEmployeeDto = { address: '456 New Address' };
      const result = {
        id: 1,
        name: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('1990-01-01'),
        email: 'john.doe@example.com',
        postalCode: '12345',
        address: '456 New Address',
        idMunicipality: 1,
        employeeNumber: 101,
        idEmployeeType: 2,
      };

      mockEmployeeService.update.mockResolvedValue(result);

      expect(await controller.update(id, dto)).toEqual(result);
      expect(mockEmployeeService.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should call employeeService.remove with the correct id and return the result', async () => {
      const id = '1';
      const result = { success: true };

      mockEmployeeService.remove.mockResolvedValue(result);

      expect(await controller.remove(id)).toEqual(result);
      expect(mockEmployeeService.remove).toHaveBeenCalledWith(1);
    });
  });
});