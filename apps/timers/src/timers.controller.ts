import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TimersService } from './timers.service';
import { ServiceInfo, ServiceInfoService } from '@shield/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CreateTimer, ResponseTimer } from './entities';

@Controller()
export class TimersController {
  constructor(
    private readonly timersService: TimersService,
    private readonly serviceInfoService: ServiceInfoService,
  ) {}

  @ApiOperation({ summary: 'Get timers service information' })
  @ApiOkResponse({
    description: 'Returns timers service info',
    type: ServiceInfo,
  })
  @Get()
  getTimersServiceInfo(): ServiceInfo {
    return this.serviceInfoService.getServiceInfo();
  }

  @ApiOperation({ summary: 'Create new timer task in DB' })
  @ApiCreatedResponse({
    description: 'Returns timer id and total seconds till execution',
    type: ResponseTimer,
  })
  @ApiNotFoundResponse({ description: 'Superhero with the given ID not found' })
  @ApiBadRequestResponse({ description: 'Invalid request' })
  @Post('timers')
  createTimer(@Body() createTimer: CreateTimer): Promise<ResponseTimer> {
    return this.timersService.create(createTimer);
  }

  @ApiOperation({ summary: 'Get timer by id' })
  @ApiOkResponse({ description: 'Returns timer by id', type: ResponseTimer })
  @Get('timers/:id')
  getTimerById(@Param('id') id: string): Promise<ResponseTimer> {
    return this.timersService.getById(id);
  }
}
