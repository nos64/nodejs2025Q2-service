import { Module, Global, forwardRef } from '@nestjs/common';

import { DataBaseService } from './data-base.service';
import { ArtistModule } from 'src/artists/artist.module';
import { TrackModule } from 'src/tracks/track.module';

@Global()
@Module({
  imports: [forwardRef(() => ArtistModule), forwardRef(() => TrackModule)],
  providers: [DataBaseService],
  exports: [DataBaseService],
})
export class DataBaseModule {}
