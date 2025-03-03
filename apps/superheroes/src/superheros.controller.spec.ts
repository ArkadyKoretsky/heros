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
    const superheroesMock = {
      create: (superhero: Superhero) => {
        superheroes.push({ ...superhero, _id: '1234' });
        return superhero;
      },
      getById: (id: string) =>
        superheroes.find((superhero) => superhero._id === id) ??
        new NotFoundException('Superhero not found'),
    };
    const app: TestingModule = await Test.createTestingModule({
      imports: [ServiceInfoModule.register(superheroesServiceInfo)],
      controllers: [SuperheroesController],
      providers: [{ provide: SuperheroesService, useValue: superheroesMock }],
    }).compile();

    superheroesController = app.get<SuperheroesController>(
      SuperheroesController,
    );
  });

  describe('root', () => {
    it('should return superheroes service info', () => {
      expect(superheroesController.getsuperheroesServiceInfo()).toBe(
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
      expect(await superheroesController.getSuperheroById('555')).toEqual(
        new NotFoundException('Superhero not found'),
      );
    });
  });
});
