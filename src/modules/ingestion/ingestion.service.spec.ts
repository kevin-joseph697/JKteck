import { Test, TestingModule } from '@nestjs/testing';
import { IngestionService } from './ingestion.service';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

jest.mock('rxjs', () => ({
  ...jest.requireActual('rxjs'),
  firstValueFrom: jest.fn(),  // Mock firstValueFrom
}));
describe('IngestionService', () => {
  let service: IngestionService;
  let clientProxyMock: ClientProxy;
  beforeEach(async () => {
    clientProxyMock = { 
      emit: jest.fn(), 
      send: jest.fn() 
    } as any;
    const module: TestingModule = await Test.createTestingModule({
      providers: [IngestionService],
    }).compile();

    service = new IngestionService();
    service['client'] = clientProxyMock
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should trigger ingestion successfully', async () => {
    const documentId = '123';
    const action = 'process';
    const result = await service.triggerIngestion(documentId, action);
    expect(result).toEqual({ message: 'Ingestion request sent' });
    expect(clientProxyMock.emit).toHaveBeenCalledWith('ingestion_event', { documentId, action });
  });

  it('should get ingestion status successfully', async () => {
    // Arrange
    const ingestionId = 'ingestion123';
    const expectedStatus = { status: 'in progress' };
    (firstValueFrom as jest.Mock).mockResolvedValue(expectedStatus);
    // Act
    const result = await service.getIngestionStatus(ingestionId);
  
    // Assert
    expect(result).toEqual(expectedStatus);
    expect(clientProxyMock.send).toHaveBeenCalledWith('get_ingestion_status', { ingestionId });
  });
});
