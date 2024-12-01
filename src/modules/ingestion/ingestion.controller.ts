import { Body, Controller, Post } from '@nestjs/common';
import { IngestionService } from './ingestion.service';

@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post('ingestion/trigger')
  async triggerIngestion(@Body() body: { documentId: string; action: string }) {
    return this.ingestionService.triggerIngestion(body.documentId, body.action);
}
}
