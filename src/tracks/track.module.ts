import { forwardRef, Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';

import { ArtistModule } from 'src/artists/artist.module';

@Module({
  imports: [forwardRef(() => ArtistModule)],
  controllers: [TrackController],
  providers: [TrackService],
})
export class TrackModule {}
