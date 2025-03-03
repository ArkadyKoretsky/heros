import { Controller, Get } from '@nestjs/common';
import { SchedulersService } from './schedulers.service';
import { ServiceInfo, ServiceInfoService } from '@shield/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

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
}
