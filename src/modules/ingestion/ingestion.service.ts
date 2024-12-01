import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { appConfig } from 'src/configs/config.constants';

@Injectable()
export class IngestionService {
  private client: ClientProxy;
  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [appConfig.pythonAPI],
        queue: 'ingestion_queue',
        queueOptions: {
          durable: false,
        },
      },
    });
  }

  async triggerIngestion(documentId: string, action: string) {
     this.client.emit('ingestion_event', { documentId, action });
     return { message: 'Ingestion request sent' };
  }
}
