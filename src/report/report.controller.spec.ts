import { Test, TestingModule } from '@nestjs/testing';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { UsersService } from '../users/users.service';
import { EmployeeService } from '../employee/employee.service';
import { CreateReportDto } from './dto/create-report.dto';
import { AssignReportDto } from './dto/assign-report.dto';
import { UpdateReportDictumDto } from './dto/update-dictum.dto';
import { ForbiddenException, UnprocessableEntityException } from '@nestjs/common';
import { ReportFilterDto } from './dto/filter.dto';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

describe('ReportController', () => {
  let controller: ReportController;
  let reportService: DeepMockProxy<ReportService>;
  let usersService: DeepMockProxy<UsersService>;
  let employeeService: DeepMockProxy<EmployeeService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportController],
      providers: [
        {
          provide: ReportService,
          useValue: mockDeep<ReportService>(),
        },
        {
          provide: UsersService,
          useValue: mockDeep<UsersService>(),
        },
        {
          provide: EmployeeService,
          useValue: mockDeep<EmployeeService>(),
        },
      ],
    }).compile();

    controller = module.get<ReportController>(ReportController);
    reportService = module.get(ReportService);
    usersService = module.get(UsersService);
    employeeService = module.get(EmployeeService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('debe crear un reporte correctamente', async () => {
      // Preparar
      const req = {
        user: {
          username: 'user@example.com',
        },
      } as any;

      const files = [
        {
          originalname: 'photo1.jpg',
          location: 'http://example.com/photo1.jpg',
        },
      ] as Express.MulterS3.File[];

      const createReportDto: CreateReportDto = {
        serialNumber: 'serial-number',
        location: {
          latitude: 40.7128,
          longitude: -74.0060,
        },
        involvedPeople: [
          {
            name: 'John Doe',
            brandId: 1,
            colorId: 1,
            plates: 'ABC123',
          },
        ],
      };

      const idUser = 1;
      const reportNumber = 'REPORT123';

      usersService.getIdUserFromEmail.mockResolvedValue(idUser);
      reportService.create.mockResolvedValue(reportNumber);

      // Actuar
      const result = await controller.create(req, files, createReportDto);

      // Afirmar
      expect(usersService.getIdUserFromEmail).toHaveBeenCalledWith(req.user.username);
      expect(reportService.create).toHaveBeenCalledWith(createReportDto, files, idUser);
      expect(result).toEqual({ reportNumber });
    });

    it('debe lanzar BadRequestException si el idUser es inválido', async () => {
      // Preparar
      const req = {
        user: {
          username: 'user@example.com',
        },
      } as any;

      const files: Express.MulterS3.File[] = [];
      const createReportDto: CreateReportDto = {
        serialNumber: 'serial-number',
        location: {
          latitude: 40.7128,
          longitude: -74.0060,
        },
        involvedPeople: [],
      };

      usersService.getIdUserFromEmail.mockResolvedValue(0);

      // Actuar y Afirmar
      await expect(controller.create(req, files, createReportDto)).rejects.toThrow(
        UnprocessableEntityException,
      );

      expect(usersService.getIdUserFromEmail).toHaveBeenCalledWith(req.user.username);
      expect(reportService.create).not.toHaveBeenCalled();
    });

    it('debe lanzar UnprocessableEntityException si ocurre un error al crear el reporte', async () => {
      // Preparar
      const req = {
        user: {
          username: 'user@example.com',
        },
      } as any;

      const files: Express.MulterS3.File[] = [];
      const createReportDto: CreateReportDto = {
        serialNumber: 'serial-number',
        location: {
          latitude: 40.7128,
          longitude: -74.0060,
        },
        involvedPeople: [],
      };

      const idUser = 1;

      usersService.getIdUserFromEmail.mockResolvedValue(idUser);
      reportService.create.mockRejectedValue(new Error('Some error'));

      // Actuar y Afirmar
      await expect(controller.create(req, files, createReportDto)).rejects.toThrow(
        UnprocessableEntityException,
      );

      expect(usersService.getIdUserFromEmail).toHaveBeenCalledWith(req.user.username);
      expect(reportService.create).toHaveBeenCalledWith(createReportDto, files, idUser);
    });
  });

  describe('getReports', () => {
    it('debe obtener reportes correctamente para un conductor', async () => {
      // Preparar
      const req = {
        user: {
          username: 'driver@example.com',
          role: 'Conductor',
        },
      } as any;

      const query: ReportFilterDto = {
        page: 0,
        status: 1,
        reportNumber: undefined,
        startYear: undefined,
        endYear: undefined,
      };

      const idUser = 1;
      const reports = [
        {
          reportNumber: 'REPORT123',
          date: new Date(),
          reportDecisionDate: null,
          Status: { statusType: 'Pendiente' },
          Vehicle: {
            plates: 'ABC123',
            Model: { year: '2020', Brand: { name: 'Toyota' } },
            Policy: [{ PolicyPlan: { title: 'Plan Básico' } }],
          },
        },
      ];

      usersService.getIdUserFromEmail.mockResolvedValue(idUser);
      reportService.countReports.mockResolvedValue(1);
      reportService.findReports.mockResolvedValue(reports as any);

      // Actuar
      const result = await controller.getReports(req, query);

      // Afirmar
      expect(usersService.getIdUserFromEmail).toHaveBeenCalledWith(req.user.username);
      expect(reportService.countReports).toHaveBeenCalled();
      expect(reportService.findReports).toHaveBeenCalled();
      expect(result.data.length).toBeGreaterThan(0);
    });

    // Puedes agregar más pruebas para ajustadores, ejecutivos y casos de error
  });

  describe('getReportDetail', () => {
    it('debe obtener el detalle de un reporte para un conductor', async () => {
      // Preparar
      const req = {
        user: {
          username: 'driver@example.com',
          role: 'Conductor',
        },
      } as any;

      const reportNumber = 'REPORT123';
      const idUser = 1;

      const report = {
        reportNumber: 'REPORT123',
        description: 'Descripción del reporte',
        date: new Date(),
        reportDecisionDate: null,
        result: null,
        latitude: 40.7128,
        longitude: -74.0060,
        Status: { statusType: 'Pendiente' },
        Photographs: [],
        ImplicateParties: [],
        Driver: {
          phone: '1234567890',
          licenseNumber: 'LIC123',
          Account: {
            name: 'John Doe',
            email: 'john@example.com',
          },
        },
        Vehicle: {
          plates: 'ABC123',
          serialNumberVehicle: 'SN123',
          occupants: 4,
          Color: { vehicleColor: 'Rojo' },
          Model: { year: '2020', Brand: { name: 'Toyota' } },
          Type: { vehicleType: 'Sedán' },
          ServiceVehicle: { name: 'Particular' },
          Policy: [
            {
              serialNumber: 'POL123',
              startDate: new Date(),
              PolicyPlan: { title: 'Plan Básico', description: 'Cobertura básica' },
            },
          ],
        },
      };

      usersService.getIdUserFromEmail.mockResolvedValue(idUser);
      reportService.findDetailedReportByReportNumber.mockResolvedValue(report as any);

      // Actuar
      const result = await controller.getReportDetail(req, reportNumber);

      // Afirmar
      expect(usersService.getIdUserFromEmail).toHaveBeenCalledWith(req.user.username);
      expect(reportService.findDetailedReportByReportNumber).toHaveBeenCalled();
      expect(result.data.reportNumber).toBe(reportNumber);
    });

    // Agrega más pruebas para otros roles y casos de error
  });

  describe('assignReport', () => {
    it('debe asignar un reporte correctamente', async () => {
      // Preparar
      const reportNumber = 'REPORT123';
      const assignReportDto: AssignReportDto = {
        assignedEmployeeId: 1,
      };
  
      const updatedReport = {
        idReport: 1,
        reportNumber: reportNumber,
        description: 'Descripción del reporte',
        date: new Date(),
        reportDecisionDate: null,
        latitude: 40.7128,
        longitude: -74.0060,
        result: null,
        idStatus: 1,
        driverId: 1,
        assignedEmployeeId: assignReportDto.assignedEmployeeId,
        plates: 'ABC123',
        // Puedes incluir otras propiedades si es necesario
      };
  
      reportService.assignReport.mockResolvedValue(updatedReport as any);
  
      // Actuar
      const result = await controller.assignReport(reportNumber, assignReportDto);
  
      // Afirmar
      expect(reportService.assignReport).toHaveBeenCalledWith(reportNumber, assignReportDto);
      expect(result).toEqual(updatedReport);
    });
  
  });

  describe('updateDictum', () => {
    it('debe actualizar el dictamen del reporte', async () => {
      // Preparar
      const req = {
        user: {
          username: 'adjuster@example.com',
          role: 'Ajustador',
        },
      } as any;

      const reportNumber = 'REPORT123';
      const updateReportDictumDto: UpdateReportDictumDto = {
        result: 'Aprobado',
      };
      const idEmployee = 1;

      employeeService.getIdEmployeeFromEmail.mockResolvedValue(idEmployee);
      reportService.updateReportDictum.mockResolvedValue(undefined);

      // Actuar
      const result = await controller.updateDictum(req, reportNumber, updateReportDictumDto);

      // Afirmar
      expect(employeeService.getIdEmployeeFromEmail).toHaveBeenCalledWith(req.user.username);
      expect(reportService.updateReportDictum).toHaveBeenCalledWith(
        reportNumber,
        updateReportDictumDto,
        idEmployee,
      );
      expect(result).toEqual({ message: 'Dictamen actualizado correctamente' });
    });

    it('debe lanzar ForbiddenException si el rol no es Ajustador', async () => {
      // Preparar
      const req = {
        user: {
          username: 'driver@example.com',
          role: 'Conductor',
        },
      } as any;

      const reportNumber = 'REPORT123';
      const updateReportDictumDto: UpdateReportDictumDto = {
        result: 'Aprobado',
      };

      // Actuar y
      await expect(
        controller.updateDictum(req, reportNumber, updateReportDictumDto),
      ).rejects.toThrow(ForbiddenException);

      expect(employeeService.getIdEmployeeFromEmail).not.toHaveBeenCalled();
      expect(reportService.updateReportDictum).not.toHaveBeenCalled();
    });

  });
});