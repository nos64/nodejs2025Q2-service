import { Injectable } from '@nestjs/common';

import type { Album } from 'src/albums/entities/album.entity';
import type { Artist } from 'src/artists/entities/artist.entity';
import type { Track } from 'src/tracks/entities/track.entity';
import type { User } from 'src/users/entities/user.entity';

@Injectable()
export class DataBaseService {
  private readonly users = new Map<string, User>();

  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUserById(id: string): Promise<User> {
    if (!this.users.has(id)) {
      throw new Error('User not found!');
    }
    return this.users.get(id);
  }

  async createUser(createdUser: User) {
    this.users.set(createdUser.id, createdUser);

    return createdUser;
  }

  async updateUser(id: string, updatedUser: User) {
    if (!this.users.has(id)) {
      throw new Error('User not found!');
    }
    this.users.set(id, updatedUser);

    return updatedUser;
  }

  async deleteUser(id: string) {
    if (!this.users.has(id)) {
      throw new Error('User not found!');
    }

    return this.users.delete(id);
  }

  private readonly artists = new Map<string, Artist>();

  async getArtists(): Promise<Artist[]> {
    return Array.from(this.artists.values());
  }

  async getArtistById(id: string): Promise<Artist> {
    if (!this.artists.has(id)) {
      throw new Error('Artist not found!');
    }
    return this.artists.get(id);
  }

  async createArtist(createdArtist: Artist) {
    this.artists.set(createdArtist.id, createdArtist);

    return createdArtist;
  }

  async updateArtist(id: string, updatedArtist: Artist) {
    if (!this.artists.has(id)) {
      throw new Error('Artist not found!');
    }
    this.artists.set(id, updatedArtist);

    return updatedArtist;
  }

  async deleteArtist(id: string) {
    if (!this.artists.has(id)) {
      throw new Error('Artist not found!');
    }

    return this.artists.delete(id);
  }

  private readonly tracks = new Map<string, Track>();

  async getTracks(): Promise<Track[]> {
    return Array.from(this.tracks.values());
  }

  async getTrackById(id: string): Promise<Track> {
    if (!this.tracks.has(id)) {
      throw new Error('Track not found!');
    }
    return this.tracks.get(id);
  }

  async createTrack(createdTrack: Track) {
    this.tracks.set(createdTrack.id, createdTrack);

    return createdTrack;
  }

  async updateTrack(id: string, updatedTrack: Track) {
    if (!this.tracks.has(id)) {
      throw new Error('Track not found!');
    }
    this.tracks.set(id, updatedTrack);

    return updatedTrack;
  }

  async deleteTrack(id: string) {
    if (!this.tracks.has(id)) {
      throw new Error('Track not found!');
    }

    return this.tracks.delete(id);
  }

  private readonly albums = new Map<string, Album>();

  async getAlbums(): Promise<Album[]> {
    return Array.from(this.albums.values());
  }

  async getAlbumById(id: string): Promise<Album> {
    if (!this.albums.has(id)) {
      throw new Error('Album not found!');
    }
    return this.albums.get(id);
  }

  async createAlbum(createdAlbum: Album) {
    this.albums.set(createdAlbum.id, createdAlbum);

    return createdAlbum;
  }

  async updateAlbum(id: string, updatedAlbum: Album) {
    if (!this.albums.has(id)) {
      throw new Error('Album not found!');
    }
    this.albums.set(id, updatedAlbum);

    return updatedAlbum;
  }

  async deleteAlbum(id: string) {
    if (!this.albums.has(id)) {
      throw new Error('Album not found!');
    }

    return this.albums.delete(id);
  }
}
