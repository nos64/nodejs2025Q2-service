import { IsNotEmpty, IsString } from 'class-validator';

export class TokenPayload {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  login: string;
}
