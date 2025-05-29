import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuid, validate as validateId } from 'uuid';

import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { DataBaseService } from 'src/data-base/data-base.service';
import { Artist } from './entities/artist.entity';

@Injectable()
export class ArtistService {
  constructor(private databaseService: DataBaseService) {}

  async create(createArtistDto: CreateArtistDto) {
    const { name, grammy } = createArtistDto;

    if (!name || !grammy) {
      throw new HttpException(
        'Missing required fields',
        HttpStatus.BAD_REQUEST,
      );
    }

    const createdArtist = {
      id: uuid(),
      name,
      grammy,
    };

    await this.databaseService.createArtist(createdArtist);

    return createdArtist;
  }

  async findAll() {
    return await this.databaseService.getArtists();
  }

  async findOne(id: string) {
    if (!validateId(id)) {
      throw new HttpException('Invalid artist id', HttpStatus.BAD_REQUEST);
    }

    const artist = await this.databaseService.getArtistById(id);

    if (!artist) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }

    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    if (!validateId(id)) {
      throw new HttpException('Invalid artist id', HttpStatus.BAD_REQUEST);
    }

    const artist = await this.databaseService.getArtistById(id);

    if (!artist) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }

    const updatedArtist: Artist = {
      ...artist,
      name: updateArtistDto.name,
      grammy: updateArtistDto.grammy,
    };

    await this.databaseService.updateArtist(id, updatedArtist);

    return updatedArtist;
  }

  async remove(id: string) {
    if (!validateId(id)) {
      throw new HttpException('Invalid artist id', HttpStatus.BAD_REQUEST);
    }

    const artist = await this.databaseService.getArtistById(id);

    if (!artist) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }
    await this.databaseService.deleteArtist(id);

    const albums = await this.databaseService.getAlbums();
    albums.map(async (album) =>
      album.artistId === id
        ? await this.databaseService.updateAlbum(album.id, {
            ...album,
            artistId: null,
          })
        : album,
    );

    const tracks = await this.databaseService.getTracks();
    tracks.map(async (track) =>
      track.artistId === id
        ? await this.databaseService.updateTrack(track.id, {
            ...track,
            artistId: null,
          })
        : track,
    );

    const isArtistInFavs = await this.databaseService.isEntityInFavorites(
      id,
      'artists',
    );

    if (isArtistInFavs) {
      await this.databaseService.removeFromFavorites(id, 'artists');
    }
  }
}
