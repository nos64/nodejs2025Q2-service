import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { DataBaseService } from 'src/data-base/data-base.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { FavoritesService } from 'src/favorites/favorites.service';

@Injectable()
export class TrackService {
  constructor(
    private databaseService: DataBaseService,
    private favoritesService: FavoritesService,
  ) {}

  async create(createTrackDto: CreateTrackDto) {
    const { name, duration } = createTrackDto;
    const createdTrack = {
      id: uuid(),
      name,
      artistId: createTrackDto.artistId ?? null,
      albumId: createTrackDto.albumId ?? null,
      duration,
    };

    await this.databaseService.createTrack(createdTrack);

    return createdTrack;
  }

  async findAll() {
    return await this.databaseService.getTracks();
  }

  async findOne(id: string) {
    const track = await this.databaseService.getTrackById(id);

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = await this.databaseService.getTrackById(id);

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    const updatedTrack: Track = {
      ...track,
      name: updateTrackDto.name || track.name,
      artistId: updateTrackDto?.artistId || null,
      albumId: updateTrackDto?.albumId ?? null,
      duration: updateTrackDto?.duration,
    };

    await this.databaseService.updateTrack(id, updatedTrack);

    return updatedTrack;
  }

  async remove(id: string) {
    const track = await this.databaseService.getTrackById(id);

    if (!track) {
      throw new NotFoundException('Track not found');
    }
    await this.databaseService.deleteTrack(id);

    const isArtistInFavs = await this.favoritesService.isTrackInFavorites(id);

    if (isArtistInFavs) {
      await this.favoritesService.removeTrack(id);
    }
  }
}
