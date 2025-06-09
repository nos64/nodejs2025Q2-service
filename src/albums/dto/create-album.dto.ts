import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsUUIDorNull } from 'src/common/validators/decorators/is-uuid-or-null.decorator';

export class CreateAlbumDto {
  @IsNotEmpty({ message: 'name can not be empty' })
  @IsString({ message: 'name must be a string' })
  name: string;

  @IsNotEmpty({ message: 'year can not be empty' })
  @IsInt({ message: 'year must be an integer' })
  year: number;

  @IsOptional()
  @IsUUIDorNull({ message: 'artistId must be a valid UUID, or null' })
  artistId: string | null;
}
