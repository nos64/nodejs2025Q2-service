import { Injectable } from '@nestjs/common';

import type { User } from 'src/users/entities/user.entity';

@Injectable()
export class DataBaseService {
  private readonly users = new Map<string, User>();

  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUserById(id: string): Promise<User> {
    if (!this.users.has(id)) {
      throw new Error('User not found!');
    }
    return this.users.get(id);
  }

  async createUser(createdUser: User) {
    this.users.set(createdUser.id, createdUser);

    return createdUser;
  }

  async updateUser(id: string, updatedUser: User) {
    if (!this.users.has(id)) {
      throw new Error('User not found!');
    }
    this.users.set(id, updatedUser);

    return updatedUser;
  }

  async deleteUser(id: string) {
    if (!this.users.has(id)) {
      throw new Error('User not found!');
    }

    return this.users.delete(id);
  }
}
