import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { v4 as uuid, validate as validateId } from 'uuid';

import { excludePassword } from 'src/common/helpers/exclude-password.helper';

import type { DataBaseService } from 'src/data-base/data-base.service';
import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import type { UserResponse } from './entities/user-response.entry';
import type { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private databaseService: DataBaseService) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    const { login, password } = createUserDto;

    if (!login || !password) {
      throw new HttpException(
        'Missing required fields',
        HttpStatus.BAD_REQUEST,
      );
    }

    const createAtUTC = Date.now();

    const createdUser = {
      id: uuid(),
      login: login,
      password,
      version: 1,
      createdAt: createAtUTC,
      updatedAt: createAtUTC,
    };

    await this.databaseService.createUser(createdUser);

    return excludePassword(createdUser);
  }

  async findAll(): Promise<UserResponse[]> {
    return (await this.databaseService.getUsers()).map((user) =>
      excludePassword(user),
    );
  }

  async findOne(id: string): Promise<UserResponse> {
    if (!validateId(id)) {
      throw new HttpException('Invalid user id', HttpStatus.BAD_REQUEST);
    }

    const user = await this.databaseService.getUserById(id);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return excludePassword(user);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    if (!validateId(id)) {
      throw new HttpException('Invalid user id', HttpStatus.BAD_REQUEST);
    }

    const user = await this.databaseService.getUserById(id);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (user.password !== updateUserDto.oldPassword) {
      throw new HttpException(
        'Old password is incorrect',
        HttpStatus.FORBIDDEN,
      );
    }

    const updatedUser: User = {
      ...user,
      password: updateUserDto.newPassword,
      version: user.version + 1,
      updatedAt: Date.now(),
    };

    await this.databaseService.updateUser(id, updatedUser);

    return excludePassword(updatedUser);
  }

  async remove(id: string): Promise<void> {
    if (!validateId(id)) {
      throw new HttpException('Invalid user id', HttpStatus.BAD_REQUEST);
    }

    const user = await this.databaseService.getUserById(id);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    await this.databaseService.deleteUser(id);
  }
}
