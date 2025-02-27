import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ServiceInfoService } from '../service-info';
import { INestApplication } from '@nestjs/common';

export const setupSwagger = (app: INestApplication): void => {
  const { service, description, version } = app
    .get(ServiceInfoService)
    .getServiceInfo();
  const config = new DocumentBuilder()
    .setTitle(`${service} API`)
    .setDescription(description)
    .setVersion(version)
    .addTag(service.toLowerCase())
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
};
