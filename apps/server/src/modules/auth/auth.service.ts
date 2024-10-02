import {
  ConflictException,
  Injectable,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import { standardResponse } from '../../common/utils/standard-response';
import { UserService } from '../user/user.service';
import { LoginDto, SignupDto } from './auth.dto';
import {
  ACCESS_TOKEN_COOKIE_MAX_AGE,
  ACCESS_TOKEN_KEY_NAME,
} from './constants';
import { AuthResponse } from './types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Registers a new user and returns a JWT token in the response.
   * @param {Response} response - The Express response object to set cookies.
   * @param {SignupDto} signupDto - Data Transfer Object containing email and password for signup.
   * @returns {Promise<AuthResponse>} - A standard response containing the JWT access token.
   * @throws {ConflictException} - Thrown if the email is already in use.
   */
  async signup(
    @Res({
      passthrough: true,
    })
    response: Response,
    { email, password }: SignupDto,
  ): AuthResponse {
    // Hash the password
    const hashedPassword = await this.generatePasswordHash(password);

    // Check if the email is already in use
    const existingUser = await this.userService.findOneByEmail(email);

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    // Create a new user
    const user = await this.userService.createOne({
      email,
      password: hashedPassword,
    });

    const accessToken = this._generateToken({
      id: user.id,
      email: user.email,
    });

    this.setAccessTokenInCookie(response, accessToken);

    return standardResponse({
      success: true,
      message: 'Account created successfully',
      data: { accessToken },
    });
  }

  /**
   * Logs in a user by validating their credentials and returns a JWT token in the response.
   * @param {Response} response - The Express response object to set cookies.
   * @param {LoginDto} loginDto - Data Transfer Object containing email and password for login.
   * @returns {Promise<AuthResponse>} - A standard response containing the JWT access token.
   * @throws {UnauthorizedException} - Thrown if the email does not exist or the password is incorrect.
   */
  async login(
    @Res({ passthrough: true }) response: Response,
    { email, password }: LoginDto,
  ): AuthResponse {
    // Check if the user exists
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException(
        `Account with the email ${email} does not exist`,
      );
    }

    // Compare provided password with the hashed password
    const isPasswordCorrect = await this.comparePassword(
      password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this._generateToken({
      id: user.id,
      email: user.email,
    });

    this.setAccessTokenInCookie(response, accessToken);

    return standardResponse({
      success: true,
      message: 'Access token generated successfully',
      data: { accessToken },
    });
  }

  /**
   * Generates a JWT token based on the user's ID and email.
   * @param {Object} payload - The payload containing user's ID and email.
   * @param {number} payload.id - The user's ID.
   * @param {string} payload.email - The user's email.
   * @returns {string} - A signed JWT token.
   */
  private _generateToken(payload: { id: number; email: string }): string {
    const accessToken = this.jwtService.sign(payload);
    return accessToken;
  }

  /**
   * Sets the provided JWT access token in the HTTP cookie.
   * @param {Response} response - The Express response object.
   * @param {string} accessToken - The JWT access token to be set in the cookie.
   */
  setAccessTokenInCookie(response: Response, accessToken: string) {
    response.cookie(ACCESS_TOKEN_KEY_NAME, accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: ACCESS_TOKEN_COOKIE_MAX_AGE,
    });
  }

  /**
   * Hashes the provided password using bcrypt.
   * @param {string} password - The password to hash.
   * @returns {Promise<string>} - The hashed password.
   */
  async generatePasswordHash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  }

  /**
   * Compares a plain password with a hashed password.
   * @param {string} password - The plain password to compare.
   * @param {string} passwordInDatabase - The hashed password from the database.
   * @returns {Promise<boolean>} - Returns true if the passwords match, otherwise false.
   */
  async comparePassword(
    password: string,
    passwordInDatabase: string,
  ): Promise<boolean> {
    const isPasswordCorrect = await bcrypt.compare(
      password,
      passwordInDatabase,
    );

    return isPasswordCorrect;
  }
}
