import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsUUIDorNull } from 'src/common/validators/decorators/is-uuid-or-null.decorator';

export class CreateAlbumDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  year: number;

  @IsOptional()
  @IsUUIDorNull()
  artistId: string | null;
}
