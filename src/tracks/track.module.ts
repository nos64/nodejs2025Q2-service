import { forwardRef, Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';

import { ArtistModule } from 'src/artists/artist.module';
import { AlbumModule } from 'src/albums/album.module';

@Module({
  imports: [forwardRef(() => ArtistModule), forwardRef(() => AlbumModule)],
  controllers: [TrackController],
  providers: [TrackService],
})
export class TrackModule {}
