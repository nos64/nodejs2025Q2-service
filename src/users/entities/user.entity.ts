import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class User {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsString()
  login: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsNumber()
  version: number;
  createdAt: number;

  @IsNotEmpty()
  @IsNumber()
  updatedAt: number;
}
