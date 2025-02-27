import { Controller, Get } from '@nestjs/common';
import { TimersService } from './timers.service';
import { ServiceInfo, ServiceInfoService } from '@marvel/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

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
}
