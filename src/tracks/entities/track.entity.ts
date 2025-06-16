import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { IsUUIDorNull } from 'src/common/validators/decorators/is-uuid-or-null.decorator';

export class Track {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsUUIDorNull()
  artistId: string | null;

  @IsOptional()
  @IsNotEmpty()
  @IsUUIDorNull()
  albumId: string | null;

  @IsNotEmpty()
  @IsInt()
  duration: number;
}
