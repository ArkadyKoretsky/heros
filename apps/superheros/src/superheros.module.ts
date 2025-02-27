import { Module } from '@nestjs/common';
import { SuperherosController } from './superheros.controller';
import { SuperherosService } from './superheros.service';
import { ServiceInfoModule } from '@marvel/common';
import { superherosServiceInfo } from './utils';

@Module({
  imports: [ServiceInfoModule.register(superherosServiceInfo)],
  controllers: [SuperherosController],
  providers: [SuperherosService],
})
export class SuperherosModule {}
