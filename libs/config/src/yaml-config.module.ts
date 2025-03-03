import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './configuration';

@Module({
  imports: [ConfigModule.forRoot({ load: [configuration] })],
  exports: [YamlConfigModule],
})
export class YamlConfigModule {}
