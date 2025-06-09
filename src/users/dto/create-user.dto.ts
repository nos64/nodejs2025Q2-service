import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'login can not be empty' })
  @IsString({ message: 'login must be a string' })
  login: string;

  @IsNotEmpty({ message: 'password can not be empty' })
  @IsString({ message: 'password must be a string' })
  password: string;
}
