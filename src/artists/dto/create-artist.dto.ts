import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateArtistDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsBoolean()
  grammy: boolean;
}
