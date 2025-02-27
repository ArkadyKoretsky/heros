import { ConfigurableModuleBuilder } from '@nestjs/common';
import { ServiceInfo } from './service-info.dto';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<ServiceInfo>().build();
