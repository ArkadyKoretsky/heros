import { Test, TestingModule } from '@nestjs/testing';
import { SuperheroesController } from './superheroes.controller';
import { SuperheroesService } from './superheroes.service';
import { ServiceInfoModule } from '@shield/common';
import { superheroesServiceInfo } from './utils';
import { Superhero } from './entities';
import { NotFoundException } from '@nestjs/common';

describe(SuperheroesController.name, () => {
  const superheroes: (Superhero & { _id: string })[] = [];
  const testSuperhero: Superhero = {
    fullName: 'Test',
    alias: 'Test',
    powers: ['test'],
  };
  let superheroesController: SuperheroesController;

  beforeEach(async () => {
    const superheroesServiceMock = {
      create: (superhero: Superhero): Superhero => {
        superheroes.push({ ...superhero, _id: '1234' });
        return superhero;
      },
      getById: (id: string): Superhero => {
        const superhero = superheroes.find((superhero) => superhero._id === id);
        if (!superhero) throw new NotFoundException('Superhero not found');
        return superhero;
      },
    };
    const app: TestingModule = await Test.createTestingModule({
      imports: [ServiceInfoModule.register(superheroesServiceInfo)],
      controllers: [SuperheroesController],
      providers: [
        { provide: SuperheroesService, useValue: superheroesServiceMock },
      ],
    }).compile();

    superheroesController = app.get<SuperheroesController>(
      SuperheroesController,
    );
  });

  describe('root', () => {
    it('should return superheroes service info', () => {
      expect(superheroesController.getSuperheroesServiceInfo()).toBe(
        superheroesServiceInfo,
      );
    });
  });

  describe('create superhero', () => {
    it('should add new superhero to superheroes array', async () => {
      await superheroesController.createSuperhero(testSuperhero);
      expect(superheroes).toEqual([{ _id: '1234', ...testSuperhero }]);
      expect(superheroes).toHaveLength(1);
    });
  });

  describe('find super hero by id', () => {
    it('should find super hero by id', async () => {
      const superhero = await superheroesController.getSuperheroById('1234');
      expect(superhero).toEqual({
        _id: '1234',
        ...testSuperhero,
      });
    });
  });

  describe('non existing super hero', () => {
    it('should throw not found exception', async () => {
      try {
        await superheroesController.getSuperheroById('555');
      } catch (error) {
        expect(error).toEqual(new NotFoundException('Superhero not found'));
      }
    });
  });
});
