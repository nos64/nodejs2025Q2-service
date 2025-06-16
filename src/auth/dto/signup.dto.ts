import { IsNotEmpty, IsString } from 'class-validator';

export class SignUpResponse {
  @IsNotEmpty()
  @IsString()
  accessToken: string;

  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
