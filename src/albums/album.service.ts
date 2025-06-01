import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { DataBaseService } from 'src/data-base/data-base.service';
import { Album } from './entities/album.entity';
import { FavoritesService } from 'src/favorites/favorites.service';
import { ArtistService } from 'src/artists/artist.service';
import { TrackService } from 'src/tracks/track.service';

@Injectable()
export class AlbumService {
  constructor(
    private databaseService: DataBaseService,
    private favoritesService: FavoritesService,
    private trackService: TrackService,
    @Inject(forwardRef(() => ArtistService))
    private artistService: ArtistService,
  ) {}

  async create(createAlbumDto: CreateAlbumDto) {
    const { name, year } = createAlbumDto;
    const createdAlbum: Album = {
      id: uuid(),
      name,
      year,
      artistId: createAlbumDto.artistId ?? null,
    };

    await this.databaseService.createAlbum(createdAlbum);

    return createdAlbum;
  }

  async findAll() {
    return await this.databaseService.getAlbums();
  }

  async findOne(id: string) {
    const album = await this.databaseService.getAlbumById(id);

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const album = await this.databaseService.getAlbumById(id);

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    if ('artistId' in updateAlbumDto && updateAlbumDto.artistId !== null) {
      const artist = await this.artistService.findOne(updateAlbumDto.artistId);
      if (!artist) {
        throw new NotFoundException(
          `Artist with id - ${updateAlbumDto.artistId} not found`,
        );
      }
    }

    const updatedAlbum: Album = {
      ...album,
      name: updateAlbumDto?.name || album.name,
      year: updateAlbumDto?.year || album.year,
      artistId: updateAlbumDto?.artistId ?? null,
    };

    await this.databaseService.updateAlbum(id, updatedAlbum);

    return updatedAlbum;
  }

  async remove(id: string) {
    const album = await this.databaseService.getAlbumById(id);

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    await this.databaseService.deleteAlbum(id);

    const tracks = await this.trackService.findAll();
    tracks.map(async (track) =>
      track.albumId === id
        ? await this.trackService.update(track.id, {
            ...track,
            albumId: null,
          })
        : track,
    );

    const isAlbumInFavs = await this.favoritesService.isAlbumInFavorites(id);

    if (isAlbumInFavs) {
      await this.favoritesService.removeAlbum(id);
    }
  }
}
