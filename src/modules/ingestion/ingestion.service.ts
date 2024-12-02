import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { appConfig } from 'src/configs/config.constants';

@Injectable()
export class IngestionService {
  private client: ClientProxy;
  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [appConfig.RabbitMqUrl],
        queue: 'ingestion_queue',
        queueOptions: {
          durable: false,
        },
      },
    });
  }

  async triggerIngestion(documentId: string, action: string) {
    try{
     this.client.emit('ingestion_event', { documentId, action });
     return { message: 'Ingestion request sent' };
    }catch(err){
      return {
        statusCode: err?.status ? err.status : 500,
        message: [new InternalServerErrorException(err)['response']['message']],
        error: 'Bad Request',
      };
    }
  }

  async getIngestionStatus(ingestionId: string): Promise<any> {
    try{
      return firstValueFrom(this.client.send('get_ingestion_status', { ingestionId }));
    }catch(err){
      return {
        statusCode: err?.status ? err.status : 500,
        message: [new InternalServerErrorException(err)['response']['message']],
        error: 'Bad Request',
      };
    }
  }
}
