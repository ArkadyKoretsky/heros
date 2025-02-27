import { Injectable } from '@nestjs/common';

@Injectable()
export class SuperherosService {
  getHello(): string {
    return 'Hello World!';
  }
}
