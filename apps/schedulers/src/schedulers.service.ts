import { Injectable } from '@nestjs/common';

@Injectable()
export class SchedulersService {
  getHello(): string {
    return 'Hello World!';
  }
}
