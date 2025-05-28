import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTrackDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  artistId: string | null = null;

  @IsOptional()
  albumId: string | null = null;

  @IsNotEmpty()
  @IsInt()
  duration: number;
}
