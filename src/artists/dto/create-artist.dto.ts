import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class CreateArtistDto {
  @IsNotEmpty({ message: 'name can not be empty' })
  @IsString({ message: 'name must be a string' })
  name: string;

  @IsNotEmpty({ message: 'grammy can not be empty' })
  @IsBoolean({ message: 'grammy must be a boolean' })
  grammy: boolean;
}
