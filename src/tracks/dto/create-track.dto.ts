import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsUUIDorNull } from 'src/common/validators/decorators/is-uuid-or-null.decorator';

export class CreateTrackDto {
  @IsNotEmpty({ message: 'name can not be empty' })
  @IsString({ message: 'name must be a string' })
  name: string;

  @IsOptional()
  @IsUUIDorNull({ message: 'artistId must be a valid UUID, or null' })
  artistId: string | null;

  @IsOptional()
  @IsUUIDorNull({ message: 'albumId must be a valid UUID, or null' })
  albumId: string | null;

  @IsNotEmpty({ message: 'duration can not be empty' })
  @IsInt({ message: 'duration must be a number' })
  duration: number;
}
