import { Test, TestingModule } from '@nestjs/testing';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { ValidationService } from './validation.service';
import { BadRequestException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

describe('ReportController', () => {
  let controller: ReportController;
  let service: ReportService;

  beforeEach(async () => {
    const mockReportService = {
      findReportPage: jest.fn(),
    };

    const mockValidationService = {
      validateDates: jest.fn(), 
    };

    const mockUsersService = {
      
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportController],
      providers: [
        { provide: ReportService, useValue: mockReportService },
        { provide: ValidationService, useValue: mockValidationService },
        { provide: UsersService, useValue: mockUsersService }, 
      ],
    }).compile();

    controller = module.get<ReportController>(ReportController);
    service = module.get<ReportService>(ReportService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // describe('findFilter', () => {
  //   it('should return reports for valid parameters', async () => {
  //     const mockReports = [{ idReport: 1, status: 0 }, { idReport: 2, status: 1 }];
  //     jest.spyOn(service, 'findReportPage').mockResolvedValue(mockReports);

  //     const result = await controller.findFilter(
  //       {},
  //       0, // page
  //       0, // status
  //       undefined, // idReport
  //       undefined, // firstdate
  //       undefined, // enddate
  //     );

  //     expect(result).toEqual(mockReports);
  //     expect(service.findReportPage).toHaveBeenCalledWith(0, 0, undefined, undefined, undefined);
  //   });

  //   it('should throw BadRequestException for invalid page parameter', async () => {
  //     await expect(controller.findFilter({}, -1, 0)).rejects.toThrow(BadRequestException);
  //   });

  //   it('should throw BadRequestException for invalid status', async () => {
  //     await expect(controller.findFilter({}, 0, 99)).rejects.toThrow(BadRequestException);
  //   });

  //   it('should throw BadRequestException for invalid date range', async () => {
  //     await expect(controller.findFilter({}, 0, 0, undefined, 'invalid-date', 'another-invalid-date')).rejects.toThrow(
  //       UnprocessableEntityException,
  //     );
  //   });

  //   it('should throw NotFoundException when no reports are found', async () => {
  //     jest.spyOn(service, 'findReportPage').mockResolvedValue([]);
  //     await expect(controller.findFilter({}, 0, 0)).rejects.toThrow(NotFoundException);
  //   });

  //   it('should throw UnprocessableEntityException on service error', async () => {
  //     jest.spyOn(service, 'findReportPage').mockRejectedValue(new Error('Unexpected error'));
  //     await expect(controller.findFilter({}, 0, 0)).rejects.toThrow(UnprocessableEntityException);
  //   });
  // });
});
