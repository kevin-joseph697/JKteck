import { Test, TestingModule } from '@nestjs/testing';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { DocumentCreationDto1 } from './dto/documentCreation.dto';

describe('DocumentController', () => {
  let controller: DocumentController;
  let service:DocumentService
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentController],
      providers: [{
        provide:DocumentService,useValue:{
          createDocument:jest.fn(),
          getUserFiles:jest.fn(),
          updateUserFile: jest.fn(),
          deleteUserFile: jest.fn(),
        }
      }],
    }).compile();

    controller = module.get<DocumentController>(DocumentController);
    service = module.get<DocumentService>(DocumentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Should call createDocument and retun success response', async () => {
    const mockFile =  { path: '/path/to/file' } as Express.Multer.File;
    const mockBody = {
      title: 'test title',
      description: 'test description',
      userId: 'user123',
    };
    jest.spyOn(service, 'createDocument').mockResolvedValue({
      statusCode: 200,
      message: ['Document uploaded successfully'],
    });
    const result = await controller.createDocument(mockFile, mockBody);

    expect(result).toEqual({
      statusCode: 200,
      message: ['Document uploaded successfully'],
    });
    expect(service.createDocument).toHaveBeenCalledWith({
      title: mockBody.title,
      description: mockBody.description,
      filePath: mockFile.path,
      userId: mockBody.userId,
    });
  })

  it('should return files for a user', async () => {
    const mockFiles :any = [
      { id: '1', title: 'Test File', description: 'A test file', content: 'base64content' },
    ];
    jest.spyOn(service, 'getUserFiles').mockResolvedValue({ statusCode: 200, files: mockFiles });

    const result = await controller.getUserFile('user123');
    expect(result).toEqual({ statusCode: 200, files: mockFiles });
  });

  it('should update the file and metadata successfully', async () => {
    const mockFile = { buffer: Buffer.from('new-content') } as Express.Multer.File;
    const mockUpdateData : DocumentCreationDto1 = { title: 'Updated Title', description: 'Updated Description', filePath: 'path/to/file',userId:'123' };
    jest.spyOn(service, 'updateUserFile').mockResolvedValue({
      statusCode: 200,
      message: ['File Updated successfully'],
    });

    const result = await controller.updateUserFile('file123', mockUpdateData, mockFile);
    expect(result).toEqual({
      statusCode: 200,
      message: ['File Updated successfully'],
    });
  });
});
