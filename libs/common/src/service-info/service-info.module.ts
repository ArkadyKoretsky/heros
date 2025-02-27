import { Module } from '@nestjs/common';
import { ConfigurableModuleClass } from './service-info.module-definition';
import { ServiceInfoService } from './service-info.service';

@Module({
  providers: [ServiceInfoService],
  exports: [ServiceInfoService],
})
export class ServiceInfoModule extends ConfigurableModuleClass {}
