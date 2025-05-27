import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  ValidationPipe,
  ParseUUIDPipe,
  HttpStatus,
} from '@nestjs/common';

import { UserService } from './user.service';

import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import type { UserResponse } from './entities/user-response.entry';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true })) createUserDto: CreateUserDto,
  ): Promise<UserResponse> {
    return await this.userService.create(createUserDto);
  }

  @Get()
  async findAll(): Promise<UserResponse[]> {
    return await this.userService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<UserResponse> {
    return await this.userService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ValidationPipe({ transform: true })) updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userService.remove(id);
  }
}
