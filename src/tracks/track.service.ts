import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuid, validate as validateId } from 'uuid';

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

    // if ('artistId' in createTrackDto && createTrackDto.artistId !== null) {
    //   console.log('artistId in createTrackDto: ', 'artistId' in createTrackDto);
    //   const artist = await this.databaseService.getArtistById(
    //     createTrackDto.artistId,
    //   );
    //   if (!artist) {
    //     throw new HttpException(
    //       `Artist with id - ${createTrackDto.artistId} not found`,
    //       HttpStatus.NOT_FOUND,
    //     );
    //   }
    // }

    // if ('albumId' in createTrackDto && createTrackDto.albumId !== null) {
    //   console.log('albumId in createTrackDto: ', 'albumId' in createTrackDto);
    //   const album = await this.databaseService.getArtistById(
    //     createTrackDto.artistId,
    //   );
    //   if (!album) {
    //     throw new HttpException(
    //       `Album with id - ${createTrackDto.artistId} not found`,
    //       HttpStatus.NOT_FOUND,
    //     );
    //   }
    // }

    const createdTrack = {
      id: uuid(),
      name,
      artistId: createTrackDto.artistId,
      albumId: createTrackDto.albumId,
      duration,
    };

    await this.databaseService.createTrack(createdTrack);

    return createdTrack;
  }

  async findAll() {
    return await this.databaseService.getTracks();
  }

  async findOne(id: string) {
    if (!validateId(id)) {
      throw new HttpException('Invalid track id', HttpStatus.BAD_REQUEST);
    }

    const track = await this.databaseService.getTrackById(id);

    if (!track) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }

    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    if (!validateId(id)) {
      throw new HttpException('Invalid track id', HttpStatus.BAD_REQUEST);
    }

    const track = await this.databaseService.getTrackById(id);

    if (!track) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }

    // if ('artistId' in updateTrackDto && updateTrackDto.albumId !== null) {
    //   const artist = await this.databaseService.getArtistById(
    //     updateTrackDto.artistId,
    //   );
    //   if (!artist) {
    //     throw new HttpException(
    //       `Artist with id - ${updateTrackDto.artistId} not found`,
    //       HttpStatus.NOT_FOUND,
    //     );
    //   }
    // }

    // if ('albumId' in updateTrackDto && updateTrackDto.albumId !== null) {
    //   const album = await this.databaseService.getArtistById(
    //     updateTrackDto.artistId,
    //   );
    //   if (!album) {
    //     throw new HttpException(
    //       `Album with id - ${updateTrackDto.artistId} not found`,
    //       HttpStatus.NOT_FOUND,
    //     );
    //   }
    // }

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
    if (!validateId(id)) {
      throw new HttpException('Invalid track id', HttpStatus.BAD_REQUEST);
    }

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
