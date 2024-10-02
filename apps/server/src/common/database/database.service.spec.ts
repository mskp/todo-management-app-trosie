import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { DatabaseService } from './database.service';

describe('DatabaseService', () => {
  let databaseService: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseService],
    }).compile();

    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  describe('onModuleInit', () => {
    it('should call $connect on PrismaClient', async () => {
      // Mock the $connect method
      const connectSpy = jest
        .spyOn(PrismaClient.prototype, '$connect')
        .mockResolvedValue();

      // Call the method and expect $connect to be called
      await databaseService.onModuleInit();
      expect(connectSpy).toHaveBeenCalled();
    });
  });

  describe('onModuleDestroy', () => {
    it('should call $disconnect on PrismaClient', async () => {
      // Mock the $disconnect method
      const disconnectSpy = jest
        .spyOn(PrismaClient.prototype, '$disconnect')
        .mockResolvedValue();

      // Call the method and expect $disconnect to be called
      await databaseService.onModuleDestroy();
      expect(disconnectSpy).toHaveBeenCalled();
    });
  });
});
