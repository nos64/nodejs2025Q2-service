import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { DataBaseService } from 'src/data-base/data-base.service';
import { FavoritesResponse } from './entities/favorites-response.entity';
import { type FavoriteEntryName, Favorites } from './entities/favorite.entity';

@Injectable()
export class FavoritesService {
  constructor(private databaseService: DataBaseService) {}
  private async addEntityToFav(
    id: string,
    entityFavType: keyof Favorites,
    entityString: FavoriteEntryName,
  ) {
    if (await this.databaseService.isEntityInFavorites(id, entityFavType)) {
      return `This ${entityString} has already been added to favorites before`;
    }

    const isExist = await this.databaseService.isEntityExists(
      id,
      entityFavType,
    );

    if (!isExist) {
      throw new UnprocessableEntityException(`${entityString} does not exist`);
    }

    await this.databaseService.addToFavorites(id, entityFavType);

    return `${entityString} successfully added to favorites`;
  }

  private async removeEntityFromFav(
    id: string,
    entityFavType: keyof Favorites,
    entityString: FavoriteEntryName,
  ) {
    const isEntityInFav = await this.databaseService.isEntityInFavorites(
      id,
      entityFavType,
    );

    if (!isEntityInFav) {
      throw new NotFoundException(`This ${entityString} is not favorite`);
    }

    await this.databaseService.removeFromFavorites(id, entityFavType);

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
    return await this.databaseService.getFullFavorites();
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
    return await this.databaseService.isEntityInFavorites(id, 'albums');
  }

  async isArtistInFavorites(id: string) {
    return await this.databaseService.isEntityInFavorites(id, 'artists');
  }

  async isTrackInFavorites(id: string) {
    return await this.databaseService.isEntityInFavorites(id, 'tracks');
  }
}
