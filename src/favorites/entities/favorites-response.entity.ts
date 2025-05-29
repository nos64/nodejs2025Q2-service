import type { Album } from 'src/albums/entities/album.entity';
import type { Artist } from 'src/artists/entities/artist.entity';
import type { Track } from 'src/tracks/entities/track.entity';

export class FavoritesResponse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
