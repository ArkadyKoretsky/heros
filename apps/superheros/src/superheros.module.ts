import { Module } from '@nestjs/common';
import { SuperherosController } from './superheros.controller';
import { SuperherosService } from './superheros.service';
import { ServiceInfoModule } from '@shield/common';
import { superherosServiceInfo } from './utils';
import { YamlConfigModule } from '@shield/config';

@Module({
  imports: [
    ServiceInfoModule.register(superherosServiceInfo),
    YamlConfigModule,
  ],
  controllers: [SuperherosController],
  providers: [SuperherosService],
})
export class SuperherosModule {}
