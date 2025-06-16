import { forwardRef, Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { FavoritesModule } from 'src/favorites/favorites.module';
import { ArtistModule } from 'src/artists/artist.module';
import { TrackModule } from 'src/tracks/track.module';

@Module({
  imports: [FavoritesModule, TrackModule, forwardRef(() => ArtistModule)],
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService],
})
export class AlbumModule {}
