import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { DatabaseService } from '../../common/database/database.service';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Finds a user by their ID.
   * @param {number} userId - The ID of the user to find.
   * @returns {Promise<User | null>} - The user object, or null if no user is found.
   */
  async findOne(userId: number): Promise<User | null> {
    const user = await this.databaseService.user.findUnique({
      where: {
        id: userId,
      },
    });

    return user;
  }

  /**
   * Finds a user by their email.
   * @param {string} email - The email of the user to find.
   * @returns {Promise<User | null>} - The user object, or null if no user is found.
   */
  async findOneByEmail(email: string): Promise<User | null> {
    const user = await this.databaseService.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }

  /**
   * Creates a new user with the given email and password.
   * @param {Pick<User, 'email' | 'password'>} userInfo - The user's email and hashed password.
   * @returns {Promise<User>} - The created user object.
   */
  async createOne(userInfo: Pick<User, 'email' | 'password'>): Promise<User> {
    const user = this.databaseService.user.create({
      data: userInfo,
    });

    return user;
  }
}
