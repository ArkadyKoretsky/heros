import { Inject, Injectable } from '@nestjs/common';
import { MODULE_OPTIONS_TOKEN } from './service-info.module-definition';
import { ServiceInfo } from './service-info.dto';

@Injectable()
export class ServiceInfoService {
  constructor(@Inject(MODULE_OPTIONS_TOKEN) private serviceInfo: ServiceInfo) {}

  getServiceInfo(): ServiceInfo {
    return this.serviceInfo;
  }
}
