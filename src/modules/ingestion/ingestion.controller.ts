import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { IngestionService } from './ingestion.service';

@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post('trigger')
  async triggerIngestion(@Body() body: { documentId: string; action: string }) {
    return this.ingestionService.triggerIngestion(body.documentId, body.action);
  }

  @Get('status/:id')
  async getIngestionStatus(@Param('id') ingestionId: string) {
    const status = await this.ingestionService.getIngestionStatus(ingestionId);
    return { ingestionId, status };
  }
}
