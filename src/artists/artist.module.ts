import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { DataBaseModule } from 'src/data-base/data-base.module';

@Module({
  imports: [DataBaseModule],
  controllers: [ArtistController],
  providers: [ArtistService],
})
export class ArtistModule {}
