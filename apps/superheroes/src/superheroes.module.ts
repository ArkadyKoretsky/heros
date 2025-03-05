import { Module } from '@nestjs/common';
import { SuperheroesController } from './superheroes.controller';
import { SuperheroesService } from './superheroes.service';
import { ServiceInfoModule } from '@shield/common';
import { superheroesServiceInfo } from './utils';
import { YamlConfigModule } from '@shield/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Superhero, superheroesSchema } from './entities';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('mongo.uri'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: Superhero.name, schema: superheroesSchema },
    ]),
    ServiceInfoModule.register(superheroesServiceInfo),
    YamlConfigModule,
    HealthModule,
  ],
  controllers: [SuperheroesController],
  providers: [SuperheroesService],
})
export class superheroesModule {}
