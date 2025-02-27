import { Injectable } from '@nestjs/common';

@Injectable()
export class TimersService {
  getHello(): string {
    return 'Hello World!';
  }
}
