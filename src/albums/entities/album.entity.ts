import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { IsUUIDorNull } from 'src/common/validators/decorators/is-uuid-or-null.decorator';

export class Album {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  year: number;

  @IsNotEmpty()
  @IsOptional()
  @IsUUIDorNull()
  artistId: string | null;
}
