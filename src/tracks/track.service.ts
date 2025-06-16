import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { FavoritesService } from 'src/favorites/favorites.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Track } from '@prisma/client';

@Injectable()
export class TrackService {
  constructor(
    private prismaService: PrismaService,
    private favoritesService: FavoritesService,
  ) {}

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    const { name, duration } = createTrackDto;
    const createdTrack = await this.prismaService.track.create({
      data: {
        name,
        artistId: createTrackDto.artistId ?? null,
        albumId: createTrackDto.albumId ?? null,
        duration,
      },
    });

    return createdTrack;
  }

  async findAll(): Promise<Track[]> {
    return await this.prismaService.track.findMany();
  }

  async findOne(id: string): Promise<Track> {
    const track: Track = await this.prismaService.track.findUnique({
      where: {
        id,
      },
    });

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    const track = await this.prismaService.track.findUnique({
      where: {
        id,
      },
    });

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    const updatedTrack: Track = await this.prismaService.track.update({
      where: {
        id,
      },
      data: {
        ...track,
        name: updateTrackDto.name || track.name,
        artistId: updateTrackDto?.artistId || null,
        albumId: updateTrackDto?.albumId ?? null,
        duration: updateTrackDto?.duration,
      },
    });

    return updatedTrack;
  }

  async remove(id: string): Promise<void> {
    const isArtistInFavs = await this.favoritesService.isTrackInFavorites(id);

    if (isArtistInFavs) {
      await this.favoritesService.removeTrack(id);
    }

    const track: Track = await this.prismaService.track.findUnique({
      where: {
        id,
      },
    });

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    await this.prismaService.track.delete({
      where: {
        id,
      },
    });
  }
}
