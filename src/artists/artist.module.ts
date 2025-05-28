import { forwardRef, Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';

import { TrackModule } from 'src/tracks/track.module';

@Module({
  imports: [forwardRef(() => TrackModule)],
  controllers: [ArtistController],
  providers: [ArtistService],
})
export class ArtistModule {}
