import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ValidationPipe,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { ArtistService } from './artist.service';

import type { CreateArtistDto } from './dto/create-artist.dto';
import type { UpdateArtistDto } from './dto/update-artist.dto';
import type { Artist } from './entities/artist.entity';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true }))
    createArtistDto: CreateArtistDto,
  ): Promise<Artist> {
    return await this.artistService.create(createArtistDto);
  }

  @Get()
  async findAll(): Promise<Artist[]> {
    return await this.artistService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<Artist> {
    return await this.artistService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ValidationPipe({ transform: true }))
    updateArtistDto: UpdateArtistDto,
  ): Promise<Artist> {
    return await this.artistService.update(id, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.artistService.remove(id);
  }
}
