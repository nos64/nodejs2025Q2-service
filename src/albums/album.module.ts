import { forwardRef, Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { FavoritesModule } from 'src/favorites/favorites.module';
import { DataBaseModule } from 'src/data-base/data-base.module';
import { ArtistModule } from 'src/artists/artist.module';
import { TrackModule } from 'src/tracks/track.module';

@Module({
  imports: [
    DataBaseModule,
    FavoritesModule,
    TrackModule,
    forwardRef(() => ArtistModule),
  ],
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService],
})
export class AlbumModule {}
