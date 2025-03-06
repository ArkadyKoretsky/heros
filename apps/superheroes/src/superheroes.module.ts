import { Module } from '@nestjs/common';
import { SuperheroesController } from './superheroes.controller';
import { SuperheroesService } from './superheroes.service';
import { ServiceInfoModule } from '@shield/common';
import { superheroesServiceInfo } from './utils';
import { YamlConfigModule } from '@shield/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Superhero, SuperheroSchema } from './entities';
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
      { name: Superhero.name, schema: SuperheroSchema },
    ]),
    ServiceInfoModule.register(superheroesServiceInfo),
    YamlConfigModule,
    HealthModule,
  ],
  controllers: [SuperheroesController],
  providers: [SuperheroesService],
})
export class superheroesModule {}
