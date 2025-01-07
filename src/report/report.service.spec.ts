// report.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ReportService } from './report.service';
import { PrismaService } from '../prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { AssignReportDto } from './dto/assign-report.dto';
import { UpdateReportDictumDto } from './dto/update-dictum.dto';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

describe('ReportService', () => {
  let service: ReportService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    const mockPrismaService = mockDeep<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ReportService>(ReportService);
    prisma = module.get(PrismaService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('debe crear un reporte', async () => {
      const createReportDto: CreateReportDto = {
        serialNumber: 'some-serial-number',
        location: { latitude: 40.7128, longitude: -74.0060 },
        involvedPeople: [
          {
            name: 'John Doe',
            brandId: 1,
            colorId: 1,
            plates: 'ABC123',
          },
        ],
      };
      const files = [
        {
          originalname: 'photo1.jpg',
          location: 'http://example.com/photo1.jpg',
        },
      ] as Express.MulterS3.File[];
      const idUser = 1;

      const policy = {
        serialNumber: 'some-serial-number',
        plates: 'XYZ987',
      };

      const vehicle = {
        plates: 'XYZ987',
      };

      const reportNumber = 'ABCDEF';
      const report = {
        reportNumber,
        ImplicateParties: [],
        Photographs: [],
        Vehicle: vehicle,
      };

      prisma.policy.findUnique.mockResolvedValue(policy as any);
      prisma.vehicle.findUnique.mockResolvedValue(vehicle as any);
      service.generateUniqueReportNumber = jest
        .fn()
        .mockResolvedValue(reportNumber);
      prisma.report.create.mockResolvedValue(report as any);

      const result = await service.create(createReportDto, files, idUser);

      expect(result).toBe(reportNumber);
      expect(prisma.policy.findUnique).toHaveBeenCalledWith({
        where: { serialNumber: createReportDto.serialNumber },
      });
      expect(prisma.vehicle.findUnique).toHaveBeenCalledWith({
        where: { plates: policy.plates },
      });
      expect(prisma.report.create).toHaveBeenCalled();
    });

    it('debe lanzar NotFoundException si el vehículo no se encuentra', async () => {
      const createReportDto: CreateReportDto = {
        serialNumber: 'some-serial-number',
        location: { latitude: 40.7128, longitude: -74.0060 },
        involvedPeople: [],
      };
      const files: Express.MulterS3.File[] = [];
      const idUser = 1;

      const policy = {
        serialNumber: 'some-serial-number',
        plates: 'XYZ987',
      };

      prisma.policy.findUnique.mockResolvedValue(policy as any);
      prisma.vehicle.findUnique.mockResolvedValue(null);

      await expect(
        service.create(createReportDto, files, idUser),
      ).rejects.toThrow(NotFoundException);

      expect(prisma.policy.findUnique).toHaveBeenCalledWith({
        where: { serialNumber: createReportDto.serialNumber },
      });
      expect(prisma.vehicle.findUnique).toHaveBeenCalledWith({
        where: { plates: policy.plates },
      });
    });
  });

  describe('findReportByFilters', () => {
    it('debe retornar un reporte por filtros', async () => {
      const filters = { reportNumber: 'ABCDEF' };
      const report = {
        idReport: 1,
      };

      prisma.report.findUnique.mockResolvedValue(report as any);

      const result = await service.findReportByFilters(filters);

      expect(result).toBe(report);
      expect(prisma.report.findUnique).toHaveBeenCalledWith({
        where: filters,
        select: expect.any(Object),
      });
    });
  });

  describe('findReports', () => {
    it('debe retornar los reportes', async () => {
      const filters = {};
      const skip = 0;
      const take = 10;
      const reports = [
        {
          idReport: 1,
        },
      ];

      prisma.report.findMany.mockResolvedValue(reports as any);

      const result = await service.findReports(filters, skip, take);

      expect(result).toBe(reports);
      expect(prisma.report.findMany).toHaveBeenCalledWith({
        where: filters,
        select: expect.any(Object),
        skip,
        take,
      });
    });
  });

  describe('countReports', () => {
    it('debe retornar el conteo de reportes', async () => {
      const filters = {};
      const count = 5;

      prisma.report.count.mockResolvedValue(count);

      const result = await service.countReports(filters);

      expect(result).toBe(count);
      expect(prisma.report.count).toHaveBeenCalledWith({
        where: filters,
      });
    });
  });

  describe('findDetailedReportByReportNumber', () => {
    it('debe retornar un reporte detallado por número de reporte', async () => {
      const filters = { reportNumber: 'ABCDEF' };
      const report = {
        idReport: 1,
      };

      prisma.report.findUnique.mockResolvedValue(report as any);

      const result = await service.findDetailedReportByReportNumber(filters);

      expect(result).toBe(report);
      expect(prisma.report.findUnique).toHaveBeenCalledWith({
        where: filters,
        select: expect.any(Object),
      });
    });
  });

  describe('generateUniqueReportNumber', () => {
    it('debe generar un número de reporte único', async () => {
      prisma.report.findUnique.mockResolvedValue(null);

      const result = await service.generateUniqueReportNumber();

      expect(result).toBeDefined();
      expect(prisma.report.findUnique).toHaveBeenCalled();
    });
  });

  describe('assignReport', () => {
    it('debe asignar un reporte a un empleado', async () => {
      const reportNumber = 'ABCDEF';
      const assignReportDto: AssignReportDto = {
        assignedEmployeeId: 1,
      };

      const report = {
        idReport: 1,
        reportNumber: reportNumber,
      };

      const employee = {
        idEmployee: 1,
        EmployeeType: {
          idEmployeeType: 3,
        },
      };

      prisma.report.findUnique.mockResolvedValue(report as any);
      prisma.employee.findUnique.mockResolvedValue(employee as any);
      prisma.report.update.mockResolvedValue(report as any);

      const result = await service.assignReport(reportNumber, assignReportDto);

      expect(result).toBe(report);
      expect(prisma.report.findUnique).toHaveBeenCalledWith({
        where: { reportNumber: reportNumber },
      });
      expect(prisma.employee.findUnique).toHaveBeenCalledWith({
        where: { idEmployee: assignReportDto.assignedEmployeeId },
        include: { EmployeeType: true },
      });
      expect(prisma.report.update).toHaveBeenCalledWith({
        where: { reportNumber: reportNumber },
        data: { assignedEmployeeId: assignReportDto.assignedEmployeeId },
      });
    });

    it('debe lanzar NotFoundException si el reporte no se encuentra', async () => {
      const reportNumber = 'ABCDEF';
      const assignReportDto: AssignReportDto = {
        assignedEmployeeId: 1,
      };

      prisma.report.findUnique.mockResolvedValue(null);

      await expect(
        service.assignReport(reportNumber, assignReportDto),
      ).rejects.toThrow(NotFoundException);

      expect(prisma.report.findUnique).toHaveBeenCalledWith({
        where: { reportNumber: reportNumber },
      });
    });

    it('debe lanzar NotFoundException si el empleado no se encuentra o no es ajustador', async () => {
      const reportNumber = 'ABCDEF';
      const assignReportDto: AssignReportDto = {
        assignedEmployeeId: 1,
      };

      const report = {
        idReport: 1,
        reportNumber: reportNumber,
      };

      const employee = {
        idEmployee: 1,
        EmployeeType: {
          idEmployeeType: 2,
        },
      };

      prisma.report.findUnique.mockResolvedValue(report as any);
      prisma.employee.findUnique.mockResolvedValue(employee as any);

      await expect(
        service.assignReport(reportNumber, assignReportDto),
      ).rejects.toThrow(NotFoundException);

      expect(prisma.employee.findUnique).toHaveBeenCalledWith({
        where: { idEmployee: assignReportDto.assignedEmployeeId },
        include: { EmployeeType: true },
      });
    });
  });

  describe('updateReportDictum', () => {
    it('debe actualizar el dictamen del reporte', async () => {
      const reportNumber = 'ABCDEF';
      const updateReportDictumDto: UpdateReportDictumDto = {
        result: 'Aprobado',
      };
      const idEmployee = 1;

      const report = {
        idReport: 1,
        reportNumber,
        assignedEmployeeId: idEmployee,
      };

      prisma.report.findUnique.mockResolvedValue(report as any);
      prisma.report.update.mockResolvedValue(report as any);

      await service.updateReportDictum(reportNumber, updateReportDictumDto, idEmployee);

      expect(prisma.report.findUnique).toHaveBeenCalledWith({
        where: { reportNumber: reportNumber },
      });
      expect(prisma.report.update).toHaveBeenCalledWith({
        where: { reportNumber: reportNumber },
        data: {
          result: updateReportDictumDto.result,
          Status: {
            connect: {
              idStatus: 2,
            },
          },
          reportDecisionDate: expect.any(Date),
        },
      });
    });

    it('debe lanzar NotFoundException si el reporte no se encuentra', async () => {
      const reportNumber = 'ABCDEF';
      const updateReportDictumDto: UpdateReportDictumDto = {
        result: 'Aprobado',
      };
      const idEmployee = 1;

      prisma.report.findUnique.mockResolvedValue(null);

      await expect(
        service.updateReportDictum(reportNumber, updateReportDictumDto, idEmployee),
      ).rejects.toThrow(NotFoundException);
    });

    it('debe lanzar ForbiddenException si el empleado no está asignado al reporte', async () => {
      const reportNumber = 'ABCDEF';
      const updateReportDictumDto: UpdateReportDictumDto = {
        result: 'Aprobado',
      };
      const idEmployee = 1;

      const report = {
        idReport: 1,
        reportNumber,
        assignedEmployeeId: 2,
      };

      prisma.report.findUnique.mockResolvedValue(report as any);

      await expect(
        service.updateReportDictum(reportNumber, updateReportDictumDto, idEmployee),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});