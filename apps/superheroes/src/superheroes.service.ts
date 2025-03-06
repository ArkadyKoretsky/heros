import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { projection, Superhero } from './entities';
import { Model } from 'mongoose';

@Injectable()
export class SuperheroesService {
  private readonly logger: Logger;

  constructor(
    @InjectModel(Superhero.name)
    private readonly superHeroModel: Model<Superhero>,
  ) {
    this.logger = new Logger(SuperheroesService.name);
  }

  create(superHero: Superhero): Promise<Superhero> {
    this.logger.log(`Creating a new superhero ${superHero.alias}`, superHero);
    const createdSuperhero = new this.superHeroModel(superHero);
    return createdSuperhero.save();
  }

  async getById(id: string): Promise<Superhero> {
    try {
      const superhero = await this.superHeroModel
        .findById(id)
        .select(projection);
      if (!superhero) {
        const message = `Superhero with id ${id} not found in DB`;
        this.logger.error(message);
        throw new NotFoundException(message);
      }
      this.logger.log(`Found superhero with id ${id}`, superhero);
      return superhero;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      const message = `Error getting superhero with id ${id}`;
      this.logger.error(message, error);
      throw new InternalServerErrorException(message); // in case of some DB error
    }
  }
}
