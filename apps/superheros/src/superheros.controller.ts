import { Controller, Get } from '@nestjs/common';
import { SuperherosService } from './superheros.service';
import { ServiceInfo, ServiceInfoService } from '@shield/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller()
export class SuperherosController {
  constructor(
    private readonly superherosService: SuperherosService,
    private readonly serviceInfoService: ServiceInfoService,
  ) {}

  @ApiOperation({ summary: 'Get superheros service information' })
  @ApiOkResponse({
    description: 'Returns superheros service info',
    type: ServiceInfo,
  })
  @Get()
  getSuperherosServiceInfo(): ServiceInfo {
    return this.serviceInfoService.getServiceInfo();
  }
}
