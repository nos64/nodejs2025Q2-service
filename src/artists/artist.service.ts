import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { DataBaseService } from 'src/data-base/data-base.service';
import { Artist } from './entities/artist.entity';
import { AlbumService } from 'src/albums/album.service';
import { FavoritesService } from 'src/favorites/favorites.service';
import { TrackService } from 'src/tracks/track.service';

@Injectable()
export class ArtistService {
  constructor(
    private databaseService: DataBaseService,
    private favoritesService: FavoritesService,
    private trackService: TrackService,
    @Inject(forwardRef(() => AlbumService))
    private albumService: AlbumService,
  ) {}

  async create(createArtistDto: CreateArtistDto) {
    const { name, grammy } = createArtistDto;
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
    const artist = await this.databaseService.getArtistById(id);

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = await this.databaseService.getArtistById(id);

    if (!artist) {
      throw new NotFoundException('Artist not found');
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
    const artist = await this.databaseService.getArtistById(id);

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    await this.databaseService.deleteArtist(id);

    const albums = await this.albumService.findAll();
    albums.map(async (album) =>
      album.artistId === id
        ? await this.albumService.update(album.id, {
            ...album,
            artistId: null,
          })
        : album,
    );

    const tracks = await this.trackService.findAll();
    tracks.map(async (track) =>
      track.artistId === id
        ? await this.trackService.update(track.id, {
            ...track,
            artistId: null,
          })
        : track,
    );

    const isArtistInFavs = await this.favoritesService.isArtistInFavorites(id);

    if (isArtistInFavs) {
      await this.favoritesService.removeArtist(id);
    }
  }
}
