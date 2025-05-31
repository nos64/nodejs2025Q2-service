import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { DataBaseService } from 'src/data-base/data-base.service';
import { Album } from './entities/album.entity';

@Injectable()
export class AlbumService {
  constructor(private databaseService: DataBaseService) {}

  async create(createAlbumDto: CreateAlbumDto) {
    const { name, year } = createAlbumDto;

    if (!name || typeof year !== 'number') {
      throw new BadRequestException('Missing required fields');
    }

    if ('artistId' in createAlbumDto && createAlbumDto.artistId !== null) {
      const artist = await this.databaseService.getArtistById(
        createAlbumDto.artistId,
      );

      if (!artist) {
        throw new NotFoundException(
          `Artist with id - ${createAlbumDto.artistId} not found`,
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
      const artist = await this.databaseService.getArtistById(
        updateAlbumDto.artistId,
      );
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

    const tracks = await this.databaseService.getTracks();
    for (const track of tracks) {
      if (track.albumId === id) {
        await this.databaseService.updateTrack(track.id, {
          ...track,
          albumId: null,
        });
      }
    }

    const isAlbumInFavs = await this.databaseService.isEntityInFavorites(
      id,
      'albums',
    );

    if (isAlbumInFavs) {
      await this.databaseService.removeFromFavorites(id, 'albums');
    }
  }
}
