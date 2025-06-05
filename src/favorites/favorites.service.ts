import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { FavoritesResponse } from './entities/favorites-response.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { type FavoriteEntryName, Favorites } from './entities/favorite.entity';
@Injectable()
export class FavoritesService {
  constructor(private prismaService: PrismaService) {}
  private async isEntityInFavorites(
    id: string,
    entityFavType: keyof Favorites,
  ): Promise<boolean> {
    switch (entityFavType) {
      case 'artists':
        return !!(await this.prismaService.favoriteArtist.findUnique({
          where: { artistId: id },
        }));

      case 'albums':
        return !!(await this.prismaService.favoriteAlbum.findUnique({
          where: { albumId: id },
        }));
      case 'tracks':
        return !!(await this.prismaService.favoriteTrack.findUnique({
          where: { trackId: id },
        }));

      default:
        throw new UnprocessableEntityException(
          `Invalid entity type: ${entityFavType}`,
        );
    }
  }

  async isEntityExists(
    id: string,
    entityType: keyof Favorites,
  ): Promise<boolean> {
    const model = entityType.slice(0, -1);

    return !!(await this.prismaService[model].findUnique({
      where: { id },
    }));
  }

  private async addEntityToFav(
    id: string,
    entityFavType: keyof Favorites,
    entityString: FavoriteEntryName,
  ) {
    if (await this.isEntityInFavorites(id, entityFavType)) {
      throw new UnprocessableEntityException(
        `This ${entityString} has already been added to favorites before`,
      );
    }

    if (!(await this.isEntityExists(id, entityFavType))) {
      throw new UnprocessableEntityException(`${entityString} does not exist`);
    }

    switch (entityFavType) {
      case 'artists':
        await this.prismaService.favoriteArtist.create({
          data: {
            artistId: id,
          },
        });

        break;

      case 'albums':
        await this.prismaService.favoriteAlbum.create({
          data: {
            albumId: id,
          },
        });

        break;

      case 'tracks':
        await this.prismaService.favoriteTrack.create({
          data: {
            trackId: id,
          },
        });

        break;

      default:
        throw new UnprocessableEntityException(
          `Invalid entity type: ${entityFavType}`,
        );
    }

    return `${entityString} successfully added to favorites`;
  }

  private async removeEntityFromFav(
    id: string,
    entityFavType: keyof Favorites,
    entityString: FavoriteEntryName,
  ) {
    const isEntityInFav = await this.isEntityInFavorites(id, entityFavType);

    if (!isEntityInFav) {
      throw new NotFoundException(`This ${entityString} is not favorite`);
    }

    switch (entityFavType) {
      case 'artists':
        await this.prismaService.favoriteArtist.delete({
          where: {
            artistId: id,
          },
        });

        break;

      case 'albums':
        await this.prismaService.favoriteAlbum.delete({
          where: {
            albumId: id,
          },
        });

        break;

      case 'tracks':
        await this.prismaService.favoriteTrack.delete({
          where: {
            trackId: id,
          },
        });

        break;

      default:
        throw new UnprocessableEntityException(
          `Invalid entity type: ${entityFavType}`,
        );
    }

    return `${entityString} successfully removed from favorites`;
  }

  async addArtistToFav(id: string): Promise<string> {
    return this.addEntityToFav(id, 'artists', 'Artist');
  }

  async addAlbumToFav(id: string): Promise<string> {
    return this.addEntityToFav(id, 'albums', 'Album');
  }

  async addTrackToFav(id: string): Promise<string> {
    return this.addEntityToFav(id, 'tracks', 'Track');
  }

  async findAll(): Promise<FavoritesResponse> {
    const [artists, albums, tracks] = await Promise.all([
      this.prismaService.favoriteArtist.findMany({
        include: { artist: true },
      }),
      this.prismaService.favoriteAlbum.findMany({
        include: { album: true },
      }),
      this.prismaService.favoriteTrack.findMany({
        include: { track: true },
      }),
    ]);

    return {
      artists: artists.map((fav) => fav.artist),
      albums: albums.map((fav) => fav.album),
      tracks: tracks.map((fav) => fav.track),
    };
  }

  async removeArtist(id: string): Promise<string> {
    return this.removeEntityFromFav(id, 'artists', 'Artist');
  }

  async removeAlbum(id: string): Promise<string> {
    return this.removeEntityFromFav(id, 'albums', 'Album');
  }

  async removeTrack(id: string): Promise<string> {
    return this.removeEntityFromFav(id, 'tracks', 'Track');
  }

  async isAlbumInFavorites(id: string) {
    return await this.isEntityInFavorites(id, 'albums');
  }

  async isArtistInFavorites(id: string) {
    return await this.isEntityInFavorites(id, 'artists');
  }

  async isTrackInFavorites(id: string) {
    return await this.isEntityInFavorites(id, 'tracks');
  }
}
