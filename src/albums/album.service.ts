import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuid, validate as validateId } from 'uuid';

import type { CreateAlbumDto } from './dto/create-album.dto';
import type { UpdateAlbumDto } from './dto/update-album.dto';
import type { DataBaseService } from 'src/data-base/data-base.service';
import type { ArtistService } from 'src/artists/artist.service';
import type { Album } from './entities/album.entity';

@Injectable()
export class AlbumService {
  constructor(
    private databaseService: DataBaseService,
    private artistService: ArtistService,
  ) {}

  async create(createAlbumDto: CreateAlbumDto) {
    const { name, year } = createAlbumDto;

    if (!name || !year) {
      throw new HttpException(
        'Missing required fields',
        HttpStatus.BAD_REQUEST,
      );
    }

    if ('artistId' in createAlbumDto) {
      const artist = await this.artistService.findOne(createAlbumDto.artistId);

      if (!artist) {
        throw new HttpException(
          `Artist with id - ${createAlbumDto.artistId} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
    }

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
    if (!validateId(id)) {
      throw new HttpException('Invalid track id', HttpStatus.BAD_REQUEST);
    }

    const album = await this.databaseService.getAlbumById(id);

    if (!album) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }

    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    if (!validateId(id)) {
      throw new HttpException('Invalid track id', HttpStatus.BAD_REQUEST);
    }

    const album = await this.databaseService.getTrackById(id);

    if (!album) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }

    if ('artistId' in updateAlbumDto) {
      const artist = await this.artistService.findOne(updateAlbumDto.artistId);

      if (!artist) {
        throw new HttpException(
          `Artist with id - ${updateAlbumDto.artistId} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
    }

    const updatedAlbum: Album = {
      ...album,
      name: updateAlbumDto?.name,
      year: updateAlbumDto?.year,
      artistId: updateAlbumDto.artistId ?? null,
    };

    await this.databaseService.updateAlbum(id, updatedAlbum);

    return updatedAlbum;
  }

  async remove(id: string) {
    if (!validateId(id)) {
      throw new HttpException('Invalid track id', HttpStatus.BAD_REQUEST);
    }

    const album = await this.databaseService.getAlbumById(id);

    if (!album) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }

    await this.databaseService.deleteAlbum(id);

    const tracks = await this.databaseService.getTracks();
    tracks.map(async (track) =>
      track.albumId === id
        ? await this.databaseService.updateTrack(track.id, {
            ...track,
            albumId: null,
          })
        : track,
    );

    const isArtistInFavs = await this.databaseService.isEntityInFavorites(
      id,
      'albums',
    );

    if (isArtistInFavs) {
      await this.databaseService.removeFromFavorites(id, 'albums');
    }
  }
}
