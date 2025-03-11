import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class SchedulersService {
  constructor(@InjectQueue('timers') private readonly timersQueue: Queue) {}
  getHello(): string {
    return 'Hello World!';
  }
}
