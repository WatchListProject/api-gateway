import { Module } from '@nestjs/common';
import { MovieService } from './media.service';

@Module({
  providers: [MovieService]
})
export class MovieModule {}
