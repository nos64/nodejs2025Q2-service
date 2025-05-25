import type { Album, Artist, Track } from './entities.types';

export interface FavoritesResponse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
