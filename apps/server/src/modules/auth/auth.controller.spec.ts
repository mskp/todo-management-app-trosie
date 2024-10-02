import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto } from './auth.dto';
import { Response } from 'express';
import { standardResponse } from '../../common/utils/standard-response';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

const mockAuthService = {
  signup: jest.fn(),
  login: jest.fn(),
};

const mockResponse = () => ({
  cookie: jest.fn(),
});

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('signup', () => {
    it('should successfully sign up a new user', async () => {
      const response = mockResponse();
      const signupDto: SignupDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const accessToken = 'jwtToken';

      mockAuthService.signup.mockResolvedValueOnce(
        standardResponse({
          success: true,
          message: 'Account created successfully',
          data: { accessToken },
        }),
      );

      const result = await authController.signup(
        response as unknown as Response,
        signupDto,
      );

      expect(result).toEqual(
        standardResponse({
          success: true,
          message: 'Account created successfully',
          data: { accessToken },
        }),
      );
      expect(mockAuthService.signup).toHaveBeenCalledWith(response, signupDto);
    });

    it('should handle ConflictException from signup', async () => {
      const response = mockResponse();
      const signupDto: SignupDto = {
        email: 'test@example.com',
        password: 'password',
      };

      mockAuthService.signup.mockRejectedValueOnce(
        new ConflictException('Email already in use'),
      );

      await expect(
        authController.signup(response as unknown as Response, signupDto),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should successfully log in a user', async () => {
      const response = mockResponse();
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const accessToken = 'jwtToken';

      mockAuthService.login.mockResolvedValueOnce(
        standardResponse({
          success: true,
          message: 'Access token generated successfully',
          data: { accessToken },
        }),
      );

      const result = await authController.login(
        response as unknown as Response,
        loginDto,
      );

      expect(result).toEqual(
        standardResponse({
          success: true,
          message: 'Access token generated successfully',
          data: { accessToken },
        }),
      );
      expect(mockAuthService.login).toHaveBeenCalledWith(response, loginDto);
    });

    it('should handle UnauthorizedException from login', async () => {
      const response = mockResponse();
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };

      mockAuthService.login.mockRejectedValueOnce(
        new UnauthorizedException('Invalid credentials'),
      );

      await expect(
        authController.login(response as unknown as Response, loginDto),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify the access token', async () => {
      const result = await authController.verifyAccessToken();

      expect(result).toEqual(
        standardResponse({
          message: 'Access token is valid',
        }),
      );
    });
  });
});
