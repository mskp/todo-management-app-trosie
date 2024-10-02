import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { SignupDto, LoginDto } from './auth.dto';
import { standardResponse } from '../../common/utils/standard-response';
import { ACCESS_TOKEN_KEY_NAME } from './constants';

const mockUserService = {
  findOneByEmail: jest.fn(),
  createOne: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

const mockResponse = () => ({
  cookie: jest.fn(),
});

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signup', () => {
    it('should create a new user and return access token', async () => {
      const response = mockResponse();
      const signupDto: SignupDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      const accessToken = 'jwtToken';

      jest.spyOn(mockUserService, 'findOneByEmail').mockResolvedValueOnce(null);
      jest.spyOn(mockUserService, 'createOne').mockResolvedValueOnce(user);
      jest.spyOn(jwtService, 'sign').mockReturnValueOnce(accessToken);

      const result = await authService.signup(
        response as unknown as Response,
        signupDto,
      );

      expect(mockUserService.findOneByEmail).toHaveBeenCalledWith(
        signupDto.email,
      );
      expect(mockUserService.createOne).toHaveBeenCalledWith({
        email: signupDto.email,
        password: expect.any(String), // Check if a hashed password is provided
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        id: user.id,
        email: user.email,
      });
      expect(response.cookie).toHaveBeenCalledWith(
        ACCESS_TOKEN_KEY_NAME,
        accessToken,
        expect.any(Object),
      );
      expect(result).toEqual(
        standardResponse({
          success: true,
          message: 'Account created successfully',
          data: { accessToken },
        }),
      );
    });

    it('should throw ConflictException if email is already in use', async () => {
      const response = mockResponse();
      const signupDto: SignupDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const existingUser = { id: 1, email: 'test@example.com' };

      jest
        .spyOn(mockUserService, 'findOneByEmail')
        .mockResolvedValueOnce(existingUser);

      await expect(
        authService.signup(response as unknown as Response, signupDto),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should log in user and return access token', async () => {
      const response = mockResponse();
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      const accessToken = 'jwtToken';

      jest.spyOn(mockUserService, 'findOneByEmail').mockResolvedValueOnce(user);
      jest.spyOn(authService, 'comparePassword').mockResolvedValueOnce(true);
      jest.spyOn(jwtService, 'sign').mockReturnValueOnce(accessToken);

      const result = await authService.login(
        response as unknown as Response,
        loginDto,
      );

      expect(mockUserService.findOneByEmail).toHaveBeenCalledWith(
        loginDto.email,
      );
      expect(authService.comparePassword).toHaveBeenCalledWith(
        loginDto.password,
        user.password,
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        id: user.id,
        email: user.email,
      });
      expect(response.cookie).toHaveBeenCalledWith(
        ACCESS_TOKEN_KEY_NAME,
        accessToken,
        expect.any(Object),
      );
      expect(result).toEqual(
        standardResponse({
          success: true,
          message: 'Access token generated successfully',
          data: { accessToken },
        }),
      );
    });

    it('should throw UnauthorizedException if user does not exist', async () => {
      const response = mockResponse();
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };

      jest.spyOn(mockUserService, 'findOneByEmail').mockResolvedValueOnce(null);

      await expect(
        authService.login(response as unknown as Response, loginDto),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const response = mockResponse();
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongPassword',
      };
      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
      };

      jest.spyOn(mockUserService, 'findOneByEmail').mockResolvedValueOnce(user);
      jest.spyOn(authService, 'comparePassword').mockResolvedValueOnce(false);

      await expect(
        authService.login(response as unknown as Response, loginDto),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
