import { Body, Controller, Get, Post } from '@nestjs/common';
import { SchedulersService } from './schedulers.service';
import { ServiceInfo, ServiceInfoService } from '@shield/common';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ExecuteSuperheroTask, SuperheroTask } from './entities';

@Controller()
export class SchedulersController {
  constructor(
    private readonly schedulersService: SchedulersService,
    private readonly serviceInfoService: ServiceInfoService,
  ) {}

  @ApiOperation({ summary: 'Get schedulers service information' })
  @ApiOkResponse({ type: ServiceInfo })
  @Get()
  getSchedulersServiceInfo(): ServiceInfo {
    return this.serviceInfoService.getServiceInfo();
  }

  @ApiOperation({ summary: 'Add new super hero task to queue' })
  @ApiCreatedResponse({
    description: 'Returns the task that was added to the queue',
    type: ExecuteSuperheroTask,
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to add task to queue',
  })
  @Post('schedulers')
  addSuperheroTask(
    @Body() superheroTask: SuperheroTask,
  ): Promise<ExecuteSuperheroTask> {
    return this.schedulersService.addSuperheroTask(superheroTask);
  }
}
