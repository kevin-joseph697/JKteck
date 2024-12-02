import { Test, TestingModule } from '@nestjs/testing';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';

describe('IngestionController', () => {
  let controller: IngestionController;
  let service: IngestionService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestionController],
      providers: [{
        provide: IngestionService,
        useValue: {
          triggerIngestion: jest.fn(),
          getIngestionStatus: jest.fn(),
        },
      },],
    }).compile();

    controller = module.get<IngestionController>(IngestionController);
    service = module.get<IngestionService>(IngestionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should trigger ingestion and return success message', async () => {
    const documentId = '123';
    const action = 'process';
    jest.spyOn(service, 'triggerIngestion').mockResolvedValue({ message: 'Ingestion request sent' });

    const result = await controller.triggerIngestion({ documentId, action });

    expect(result).toEqual({ message: 'Ingestion request sent' });
    expect(service.triggerIngestion).toHaveBeenCalledWith(documentId, action);
  });

  it('should return ingestion status', async () => {
    const ingestionId = 'ingestion123';
    const expectedStatus = { status: 'in progress' };
    jest.spyOn(service, 'getIngestionStatus').mockResolvedValue(expectedStatus);

    const result = await controller.getIngestionStatus(ingestionId);

    expect(result).toEqual({ ingestionId, status: expectedStatus });
    expect(service.getIngestionStatus).toHaveBeenCalledWith(ingestionId);
  });


});
