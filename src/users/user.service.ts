import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { v4 as uuid } from 'uuid';

import { excludePassword } from 'src/common/helpers/exclude-password.helper';

import { DataBaseService } from 'src/data-base/data-base.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponse } from './entities/user-response.entry';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private databaseService: DataBaseService) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    const { login, password } = createUserDto;
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
    const user = await this.databaseService.getUserById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return excludePassword(user);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    const user = await this.databaseService.getUserById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.password !== updateUserDto.oldPassword) {
      throw new ForbiddenException('Old password is incorrect');
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
    const user = await this.databaseService.getUserById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.databaseService.deleteUser(id);
  }
}
