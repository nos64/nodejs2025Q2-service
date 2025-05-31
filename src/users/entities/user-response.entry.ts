import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class UserResponse {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsString()
  login: string;

  @IsNotEmpty()
  @IsNumber()
  version: number;

  @IsNotEmpty()
  @IsNumber()
  createdAt: number;

  @IsNotEmpty()
  @IsNumber()
  updatedAt: number;
}
