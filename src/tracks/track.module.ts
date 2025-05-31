import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { DataBaseModule } from 'src/data-base/data-base.module';
import { FavoritesModule } from 'src/favorites/favorites.module';

@Module({
  imports: [DataBaseModule, FavoritesModule],
  controllers: [TrackController],
  providers: [TrackService],
  exports: [TrackService],
})
export class TrackModule {}
