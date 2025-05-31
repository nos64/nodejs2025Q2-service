import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { DataBaseService } from 'src/data-base/data-base.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';

@Injectable()
export class TrackService {
  constructor(private databaseService: DataBaseService) {}

  async create(createTrackDto: CreateTrackDto) {
    const { name, duration } = createTrackDto;

    if (!name || !duration) {
      throw new HttpException(
        'Missing required fields',
        HttpStatus.BAD_REQUEST,
      );
    }

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
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }

    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = await this.databaseService.getTrackById(id);

    if (!track) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
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
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }
    await this.databaseService.deleteTrack(id);

    const isArtistInFavs = await this.databaseService.isEntityInFavorites(
      id,
      'tracks',
    );

    if (isArtistInFavs) {
      await this.databaseService.removeFromFavorites(id, 'tracks');
    }
  }
}
