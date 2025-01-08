import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { BadRequestException, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUserService = {
    create: jest.fn(),
    findAccountInfo: jest.fn(),
    findDriverInfo: jest.fn(),
    getIdUserFromEmail: jest.fn(),
    getIdUserFromRFC: jest.fn(),
    getIdUserFromLicenseNumber: jest.fn(),
    findOne: jest.fn(),
    updateUserByEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call usersService.create with correct data', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: '123456',
        name: 'John',
        lastName: 'Doe',
        rfc: 'DOEJ890101XYZ',
        bankAccountNumber: '123456789012',
        expirationDateBankAccount: '2025-12-31',
        licenseNumber: 'AB1234567',
        phone: '5551234567',
        postalCode: '12345',
        address: '123 Main St, Apt 4B',
        idMunicipality: 101,
        datebirth: '1990-01-01',
      };

      mockUserService.create.mockResolvedValue('User created');
      const result = await controller.create(createUserDto);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toBe('User created');
    });
  });

  describe('findAccountInfo', () => {
    it('should return account info if valid username is provided', async () => {
      const mockAccountInfo = { username: 'testuser', balance: 100 };
      mockUserService.findAccountInfo.mockResolvedValue(mockAccountInfo);
      const req = { user: { username: 'testuser' } };
      const result = await controller.findAccountInfo(req);
      expect(service.findAccountInfo).toHaveBeenCalledWith('testuser');
      expect(result).toBe(mockAccountInfo);
    });

    it('should throw BadRequestException if no account info found', async () => {
      mockUserService.findAccountInfo.mockResolvedValue(null);
      const req = { user: { username: 'testuser' } };
      await expect(controller.findAccountInfo(req)).rejects.toThrow(BadRequestException);
    });
  });

  describe('checkEmailExists', () => {
    it('should return { exists: true } if email exists', async () => {
      mockUserService.getIdUserFromEmail.mockResolvedValue({ id: 1 });
      const result = await controller.checkEmailExists('test@example.com');
      expect(service.getIdUserFromEmail).toHaveBeenCalledWith('test@example.com');
      expect(result).toEqual({ exists: true });
    });

    it('should return { exists: false } if email does not exist', async () => {
      mockUserService.getIdUserFromEmail.mockResolvedValue(null);
      const result = await controller.checkEmailExists('notfound@example.com');
      expect(result).toEqual({ exists: false });
    });

    it('should throw BadRequestException if email is not provided', async () => {
      await expect(controller.checkEmailExists('')).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update user info by email', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Mario',
        email: 'test@example.com',
        lastName: 'Mario',
        password: '12345',
        rfc: '123456123',
        bankAccountNumber: '123456789012',
        expirationDateBankAccount: '2025-12-31',
        licenseNumber: 'AB1234567',
        phone: '5551234567',
        postalCode: '12345',
        address: '123 Main St, Apt 4B',
        idMunicipality: 101,
        datebirth: '2025-12-31',
      };
      const req = { user: { username: 'test@example.com' } };
      mockUserService.updateUserByEmail.mockResolvedValue('User updated');
      const result = await controller.update(req, 'test@example.com', updateUserDto);
      expect(result).toBe('User updated');
    });
  });
});
