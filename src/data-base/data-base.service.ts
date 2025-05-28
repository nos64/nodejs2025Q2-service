import { Injectable } from '@nestjs/common';

import type { Artist } from 'src/artists/entities/artist.entity';
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
}
