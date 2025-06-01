import { forwardRef, Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { DataBaseModule } from 'src/data-base/data-base.module';
import { TrackModule } from 'src/tracks/track.module';
import { AlbumModule } from 'src/albums/album.module';
import { FavoritesModule } from 'src/favorites/favorites.module';

@Module({
  imports: [
    DataBaseModule,
    FavoritesModule,
    TrackModule,
    forwardRef(() => AlbumModule),
  ],
  controllers: [ArtistController],
  providers: [ArtistService],
  exports: [ArtistService],
})
export class ArtistModule {}
