import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Album } from '@prisma/client';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { FavoritesService } from 'src/favorites/favorites.service';
import { ArtistService } from 'src/artists/artist.service';
import { TrackService } from 'src/tracks/track.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlbumService {
  constructor(
    private prismaService: PrismaService,
    private favoritesService: FavoritesService,
    private trackService: TrackService,
    @Inject(forwardRef(() => ArtistService))
    private artistService: ArtistService,
  ) {}

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const { name, year } = createAlbumDto;
    const createdAlbum = await this.prismaService.album.create({
      data: {
        name,
        year,
        artistId: createAlbumDto.artistId ?? null,
      },
    });

    return createdAlbum;
  }

  async findAll(): Promise<Album[]> {
    return await this.prismaService.album.findMany();
  }

  async findOne(id: string): Promise<Album> {
    const album: Album = await this.prismaService.album.findUnique({
      where: {
        id,
      },
    });

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    const album = await this.prismaService.album.findUnique({
      where: {
        id,
      },
    });

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

    const updatedAlbum: Album = await this.prismaService.album.update({
      where: {
        id,
      },
      data: {
        ...album,
        name: updateAlbumDto?.name || album.name,
        year: updateAlbumDto?.year || album.year,
        artistId: updateAlbumDto?.artistId ?? null,
      },
    });

    return updatedAlbum;
  }

  async remove(id: string): Promise<void> {
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

    const album: Album = await this.prismaService.album.findUnique({
      where: {
        id,
      },
    });

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    await this.prismaService.album.delete({
      where: {
        id,
      },
    });
  }
}
