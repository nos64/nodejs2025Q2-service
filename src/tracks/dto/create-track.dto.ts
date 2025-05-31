import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsUUIDorNull } from 'src/common/validators/decorators/is-uuid-or-null.decorator';

export class CreateTrackDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsUUIDorNull()
  artistId: string | null;

  @IsOptional()
  @IsUUIDorNull()
  albumId: string | null;

  @IsNotEmpty()
  @IsInt()
  duration: number;
}
