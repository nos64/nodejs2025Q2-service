import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { FavoritesService } from './favorites.service';
import { FavoritesResponse } from './entities/favorites-response.entity';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post('artist/:id')
  async addArtist(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<string> {
    return await this.favoritesService.addArtistToFav(id);
  }

  @Post('album/:id')
  async addAlbum(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<string> {
    return await this.favoritesService.addAlbumToFav(id);
  }

  @Post('track/:id')
  async addTrack(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<string> {
    return await this.favoritesService.addTrackToFav(id);
  }

  @Get()
  async findAll(): Promise<FavoritesResponse> {
    return await this.favoritesService.findAll();
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeArtist(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.favoritesService.removeArtist(id);
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeAlbum(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.favoritesService.removeAlbum(id);
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeTrack(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.favoritesService.removeTrack(id);
  }
}
