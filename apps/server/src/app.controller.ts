import { Controller, Get } from '@nestjs/common';
import { Public } from './decorators/public/public.decorator';

@Controller()
@Public()
export class AppController {
  @Get('healthcheck')
  getHealthStatus() {
    return {
      success: true,
      message: 'Server is up and running',
    };
  }
}
