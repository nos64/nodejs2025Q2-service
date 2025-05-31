import { IsNotEmpty, IsUUID, IsString, IsBoolean } from 'class-validator';

export class Artist {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsBoolean()
  grammy: boolean;
}
