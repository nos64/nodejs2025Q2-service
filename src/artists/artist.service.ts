import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Artist } from '@prisma/client';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { AlbumService } from 'src/albums/album.service';
import { FavoritesService } from 'src/favorites/favorites.service';
import { TrackService } from 'src/tracks/track.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ArtistService {
  constructor(
    private prismaService: PrismaService,
    private favoritesService: FavoritesService,
    private trackService: TrackService,
    @Inject(forwardRef(() => AlbumService))
    private albumService: AlbumService,
  ) {}

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const createdArtist = await this.prismaService.artist.create({
      data: {
        name: createArtistDto.name,
        grammy: createArtistDto.grammy,
      },
    });

    return createdArtist;
  }

  async findAll(): Promise<Artist[]> {
    return await this.prismaService.artist.findMany();
  }

  async findOne(id: string): Promise<Artist> {
    const artist: Artist = await this.prismaService.artist.findUnique({
      where: {
        id,
      },
    });

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    const artist = await this.prismaService.artist.findUnique({
      where: {
        id,
      },
    });

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    const updatedArtist: Artist = await this.prismaService.artist.update({
      where: {
        id,
      },
      data: {
        ...artist,
        name: updateArtistDto.name,
        grammy: updateArtistDto.grammy,
      },
    });

    return updatedArtist;
  }

  async remove(id: string): Promise<void> {
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

    const artist: Artist = await this.prismaService.artist.findUnique({
      where: {
        id,
      },
    });

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    await this.prismaService.artist.delete({
      where: {
        id,
      },
    });
  }
}
