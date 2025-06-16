import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { excludePassword } from 'src/common/helpers/exclude-password.helper';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponse } from './entities/user-response.entry';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    const createAt = new Date();

    const createdUser = await this.prismaService.user.create({
      data: {
        login: createUserDto.login,
        password: createUserDto.password,
        version: 1,
        createdAt: createAt,
        updatedAt: createAt,
        refreshToken: '',
      },
    });

    return excludePassword(createdUser);
  }

  async findAll(): Promise<UserResponse[]> {
    return (await this.prismaService.user.findMany()).map((user: User) =>
      excludePassword(user),
    );
  }

  async findOne(id: string): Promise<UserResponse> {
    const user: User = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return excludePassword(user);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.password !== updateUserDto.oldPassword) {
      throw new ForbiddenException('Old password is incorrect');
    }

    const updatedUser: User = await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        ...user,
        password: updateUserDto.newPassword,
        version: user.version + 1,
        updatedAt: new Date(),
      },
    });
    return excludePassword(updatedUser);
  }

  async remove(id: string): Promise<void> {
    const user: User = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.prismaService.user.delete({
      where: {
        id,
      },
    });
  }

  async findOneById(id: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  }

  async findOneByLogin(login: string): Promise<User> {
    return await this.prismaService.user.findFirst({
      where: {
        login: {
          equals: login,
          mode: 'insensitive',
        },
      },
    });
  }

  async updateJwtToken(id: string, refreshToken: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    const updatedUser = await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        ...user,
        refreshToken,
      },
    });

    return updatedUser;
  }
}
