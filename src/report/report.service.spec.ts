import { Test, TestingModule } from '@nestjs/testing';
import { ReportService } from './report.service';
import { PrismaService } from '../prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('ReportService', () => {
  let service: ReportService;
  let prismaMock: any;

  beforeEach(async () => {
    prismaMock = {
      vehicle: { findFirst: jest.fn() },
      status: { findUnique: jest.fn() },
      model: { findUnique: jest.fn() },
      color: { findUnique: jest.fn() },
      driver: { findUnique: jest.fn() },
      report: { create: jest.fn(), findMany: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<ReportService>(ReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw NotFoundException if vehicle plates are invalid', async () => {
      prismaMock.vehicle.findFirst.mockResolvedValue(null);

      await expect(
        service.create(
          {
            plates: 'XYZ123', description: '', latitude: 0, longitude: 0,
            reportDecisionDate: undefined
          },
          [],
          [],
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if status is invalid', async () => {
      prismaMock.vehicle.findFirst.mockResolvedValue({ plates: 'XYZ123' });
      prismaMock.status.findUnique.mockResolvedValue(null);

      await expect(
        service.create(
          {
            plates: 'XYZ123', description: '', latitude: 0, longitude: 0,
            reportDecisionDate: undefined
          },
          [],
          [],
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should create a report successfully', async () => {
      prismaMock.vehicle.findFirst.mockResolvedValue({ plates: 'XYZ123' });
      prismaMock.status.findUnique.mockResolvedValue({ idStatus: 1 });
      prismaMock.driver.findUnique.mockResolvedValue({ idUser: 2 });
      prismaMock.report.create.mockResolvedValue({ idReport: 1 });

      const result = await service.create(
        {
          plates: 'XYZ123', description: '', latitude: 0, longitude: 0,
          reportDecisionDate: undefined
        },
        [],
        [],
      );

      expect(result).toEqual({ idReport: 1 });
      expect(prismaMock.report.create).toHaveBeenCalled();
    });
  });

  describe('findReportPage', () => {
    it('should return a list of reports', async () => {
      prismaMock.report.findMany.mockResolvedValue([
        { idReport: 1 },
        { idReport: 2 },
      ]);

      const result = await service.findReportPage(0, 0, null, null, null);

      expect(result).toEqual([{ idReport: 1 }, { idReport: 2 }]);
      expect(prismaMock.report.findMany).toHaveBeenCalledWith({
        where: expect.anything(),
        skip: 0,
        take: 3,
      });
    });

    it('should apply filters for status and date range', async () => {
      prismaMock.report.findMany.mockResolvedValue([{ idReport: 1 }]);

      const result = await service.findReportPage(
        0,
        1,
        null,
        '2023-01-01',
        '2023-12-31',
      );

      expect(result).toEqual([{ idReport: 1 }]);
      expect(prismaMock.report.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({
          idStatus: 1,
          date: {
            gte: new Date('2023-01-01'),
            lte: new Date('2023-12-31'),
          },
        }),
        skip: 0,
        take: 3,
      });
    });
  });
});
