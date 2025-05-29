import { forwardRef, Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';

import { ArtistModule } from 'src/artists/artist.module';
import { TrackModule } from 'src/tracks/track.module';

@Module({
  imports: [forwardRef(() => ArtistModule), forwardRef(() => TrackModule)],
  controllers: [AlbumController],
  providers: [AlbumService],
})
export class AlbumModule {}
