import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { PrismaService } from "src/prisma.service";
import { NotFoundException } from "@nestjs/common";

describe("UsersService", () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe("updateUserByEmail", () => {
    it("should update user and driver info by email", async () => {
      const mockUser = {
        idAccount: 1,
        idUser: 1,
        idEmployee: 1,
        name: "Test User",
        lastName: "Test LastName",
        datebirth: new Date("1990-01-01"),
        email: "testuser@example.com",
        password: "TestPassword123",
        registrationDate: new Date("2020-01-01"),
        postalCode: "12345",
        address: "Old Address",
        idMunicipality: 1,
        secretKey: "default_secret_key",
        twoFactorIsEnabled: false,
        Driver: {
          idUser: 1,
          rfc: "RFC123456789", // Propiedad 'rfc' agregada
          bankAccountNumber: "111111111111",
          expirationDateBankAccount: new Date("2025-01-01"),
          phone: "5551234567",
          licenseNumber: "OLDLICENSE123",
        },
      };

      const updateData = {
        address: "New Address",
        postalCode: "54321",
        bankAccountNumber: "222222222222",
        expirationDateBankAccount: "2026-01",
        phone: "5559876543",
        licenseNumber: "NEWLICENSE456",
        idMunicipality: 2,
      };

      jest.spyOn(prisma.account, "findFirst").mockResolvedValue(mockUser);
      jest.spyOn(prisma.account, "update").mockResolvedValue({
        ...mockUser,
        address: updateData.address,
        postalCode: updateData.postalCode,
      });
      jest.spyOn(prisma.driver, "update").mockResolvedValue({
        ...mockUser.Driver,
        bankAccountNumber: updateData.bankAccountNumber,
        expirationDateBankAccount: new Date(
          `${updateData.expirationDateBankAccount}-01T00:00:00.000Z`,
        ),
        phone: updateData.phone,
        licenseNumber: updateData.licenseNumber,
      });

      const result = await service.updateUserByEmail(
        "test@example.com",
        updateData,
      );

      expect(result.updatedUser.address).toBe(updateData.address);
      expect(result.updatedDriver.bankAccountNumber).toBe(
        updateData.bankAccountNumber,
      );
    });

    it("should throw NotFoundException if user is not found", async () => {
      jest.spyOn(prisma.account, "findFirst").mockResolvedValue(null);

      await expect(
        service.updateUserByEmail("nonexistent@example.com", {}),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("create", () => {
    it("should create a new user and driver", async () => {
      const createUserDto = {
        name: "Test",
        lastName: "User",
        datebirth: "2000-01-01",
        email: "testuser@example.com",
        password: "password",
        postalCode: "12345",
        address: "Test Address",
        idMunicipality: 1,
        rfc: "TESTRFC123",
        bankAccountNumber: "123456789012",
        expirationDateBankAccount: "2025-12",
        licenseNumber: "LICENSE123",
        phone: "5551234567",
      };

      const mockUser = {
        idAccount: 1,
        idUser: 1,
        idEmployee: 1,
        name: "Test User",
        lastName: "Test LastName",
        datebirth: new Date("1990-01-01"),
        email: "testuser@example.com",
        password: "TestPassword123",
        registrationDate: new Date("2020-01-01"),
        postalCode: "12345",
        address: "Old Address",
        idMunicipality: 1,
        secretKey: "default_secret_key",
        twoFactorIsEnabled: false,
        Driver: {
          idUser: 1,
          rfc: "RFC123456789", // Propiedad 'rfc' agregada
          bankAccountNumber: "111111111111",
          expirationDateBankAccount: new Date("2025-01-01"),
          phone: "5551234567",
          licenseNumber: "OLDLICENSE123",
        },
      };

      jest.spyOn(prisma.account, "findFirst").mockResolvedValue(null);
      jest.spyOn(prisma.driver, "findFirst").mockResolvedValue(null);

      jest.spyOn(prisma.account, "create").mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(result.email).toBe(createUserDto.email);
    });

    it("should throw error if email already exists", async () => {
      const createUserDto = {
        email: "existing@example.com",
        rfc: "NEWRFC123",
        name: "Test",
        lastName: "User",
        datebirth: "2000-01-01",
        password: "password",
        postalCode: "12345",
        address: "Test Address",
        idMunicipality: 1,
        bankAccountNumber: "123456789012",
        expirationDateBankAccount: "2025-12",
        licenseNumber: "LICENSE123",
        phone: "5551234567",
      };

      const mockUser = {
        idAccount: 1,
        idUser: 1,
        idEmployee: 1,
        name: "Test User",
        lastName: "Test LastName",
        datebirth: new Date("1990-01-01"),
        email: "testuser@example.com",
        password: "TestPassword123",
        registrationDate: new Date("2020-01-01"),
        postalCode: "12345",
        address: "Old Address",
        idMunicipality: 1,
        secretKey: "default_secret_key",
        twoFactorIsEnabled: false,
        Driver: {
          idUser: 1,
          rfc: "RFC123456789", // Propiedad 'rfc' agregada
          bankAccountNumber: "111111111111",
          expirationDateBankAccount: new Date("2025-01-01"),
          phone: "5551234567",
          licenseNumber: "OLDLICENSE123",
        },
      };

      jest.spyOn(prisma.account, "findFirst").mockResolvedValue(mockUser);

      await expect(service.create(createUserDto)).rejects.toThrow(
        `El correo electrónico ${createUserDto.email} ya está registrado.`,
      );
    });
  });

  describe("findOne", () => {
    it("should find user by id", async () => {
      const mockUser = {
        idAccount: 1,
        idUser: 1,
        idEmployee: 1,
        name: "Test User",
        lastName: "Test LastName",
        datebirth: new Date("1990-01-01"),
        email: "testuser@example.com",
        password: "TestPassword123",
        registrationDate: new Date("2020-01-01"),
        postalCode: "12345",
        address: "Old Address",
        idMunicipality: 1,
        secretKey: "default_secret_key",
        twoFactorIsEnabled: false,
        Driver: {
          idUser: 1,
          rfc: "RFC123456789", // Propiedad 'rfc' agregada
          bankAccountNumber: "111111111111",
          expirationDateBankAccount: new Date("2025-01-01"),
          phone: "5551234567",
          licenseNumber: "OLDLICENSE123",
        },
      };

      jest.spyOn(prisma.account, "findUnique").mockResolvedValue(mockUser);

      const result = await service.findOne(1);

      expect(result).toEqual(mockUser);
    });
  });
});
