import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { DatabaseService } from '../../common/database/database.service';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;
  let databaseService: DatabaseService;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword',
  };

  const mockDatabaseService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      mockDatabaseService.user.findUnique.mockResolvedValue(mockUser);

      const result = await userService.findOne(1);
      expect(result).toEqual(mockUser);
      expect(databaseService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return null if no user is found', async () => {
      mockDatabaseService.user.findUnique.mockResolvedValue(null);

      const result = await userService.findOne(1);
      expect(result).toBeNull();
    });
  });

  describe('findOneByEmail', () => {
    it('should return a user by email', async () => {
      mockDatabaseService.user.findUnique.mockResolvedValue(mockUser);

      const result = await userService.findOneByEmail('test@example.com');
      expect(result).toEqual(mockUser);
      expect(databaseService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should return null if no user is found by email', async () => {
      mockDatabaseService.user.findUnique.mockResolvedValue(null);

      const result = await userService.findOneByEmail(
        'nonexistent@example.com',
      );
      expect(result).toBeNull();
    });
  });

  describe('createOne', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        email: 'new@example.com',
        password: 'hashedPassword',
      };
      mockDatabaseService.user.create.mockResolvedValue({
        ...mockUser,
        ...createUserDto,
      });

      const result = await userService.createOne(createUserDto);
      expect(result).toEqual({ ...mockUser, ...createUserDto });
      expect(databaseService.user.create).toHaveBeenCalledWith({
        data: createUserDto,
      });
    });
  });
});
