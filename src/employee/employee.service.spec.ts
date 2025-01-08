import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeService } from './employee.service';
import { PrismaService } from '../prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let prisma: PrismaService;

  const mockPrismaService = {
    account: {
      findFirst: jest.fn(), // Mock del método findFirst
    },
    employee: {
      findUnique: jest.fn(), // Mock del método findUnique
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<EmployeeService>(EmployeeService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getIdEmployeeFromEmail', () => {
    it('should return idEmployee when email exists', async () => {
      const mockEmployee = { idEmployee: 1 };
      mockPrismaService.account.findFirst.mockResolvedValue(mockEmployee); // Uso de mockResolvedValue correctamente

      const result = await service.getIdEmployeeFromEmail('test@example.com');
      expect(result).toBe(1);
      expect(prisma.account.findFirst).toHaveBeenCalledWith({
        where: { email: 'test@example.com' }, // Corregido para que coincida con el servicio
        select: { idEmployee: true },
      });
    });

    it('should return 0 when email does not exist', async () => {
      mockPrismaService.account.findFirst.mockResolvedValue(null);

      const result = await service.getIdEmployeeFromEmail('nonexistent@example.com');
      expect(result).toBe(0);
    });

    it('should return 0 when email is undefined', async () => {
      const result = await service.getIdEmployeeFromEmail(undefined);
      expect(result).toBe(0);
    });
  });

  describe('getTypeEmployee', () => {
    it('should return employee type when idEmployee exists', async () => {
      const mockEmployeeType = {
        EmployeeType: { employeeType: 'Manager' },
      };
      mockPrismaService.employee.findUnique.mockResolvedValue(mockEmployeeType); // Uso de mockResolvedValue correctamente

      const result = await service.getTypeEmployee(1);
      expect(result).toBe('Manager');
      expect(prisma.employee.findUnique).toHaveBeenCalledWith({
        select: { EmployeeType: { select: { employeeType: true } } },
        where: { idEmployee: 1 },
      });
    });

    it('should throw NotFoundException when idEmployee does not exist', async () => {
      mockPrismaService.employee.findUnique.mockResolvedValue(null);

      await expect(service.getTypeEmployee(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});