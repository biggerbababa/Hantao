import { Controller, Get, Param } from '@nestjs/common';
import { SummaryService } from './summary.service';

@Controller('summary')
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  @Get(':roomId')
  getSummary(@Param('roomId') roomId: string) {
    return this.summaryService.getSummary(roomId);
  }
}
