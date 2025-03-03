import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SuperheroesService } from './superheroes.service';
import { ServiceInfo, ServiceInfoService } from '@shield/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Superhero } from './entities';

@Controller()
export class SuperheroesController {
  constructor(
    private readonly superheroesService: SuperheroesService,
    private readonly serviceInfoService: ServiceInfoService,
  ) {}

  @ApiOperation({ summary: 'Get superheroes service information' })
  @ApiOkResponse({
    description: 'Returns superheroes service info',
    type: ServiceInfo,
  })
  @Get()
  getsuperheroesServiceInfo(): ServiceInfo {
    return this.serviceInfoService.getServiceInfo();
  }

  @ApiOperation({ summary: 'Create new superhero in DB' })
  @ApiCreatedResponse({
    description: 'Returns superhero that was created',
    type: Superhero,
  })
  @ApiBadRequestResponse({ description: 'Invalid superhero data' })
  @Post('superheroes')
  createSuperhero(@Body() superhero: Superhero): Promise<Superhero> {
    return this.superheroesService.create(superhero);
  }

  @ApiOperation({ summary: 'Get superhero by id' })
  @ApiOkResponse({ description: 'Returns superhero by id', type: Superhero })
  @ApiNotFoundResponse({ description: 'No hero in DB with the given ID' })
  @Get('superheroes/:id')
  getSuperheroById(@Param('id') id: string): Promise<Superhero> {
    return this.superheroesService.getById(id);
  }
}
