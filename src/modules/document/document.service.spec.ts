import { Test, TestingModule } from '@nestjs/testing';
import { DocumentService } from './document.service';
import { DocumentRepository } from 'src/repository/document.repository';
import { NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import { DocumentEntity } from 'src/entities/document.entities';
import { getUserDocumentDto } from './dto/getUserDocument.dto';
import { DocumentCreationDto1 } from './dto/documentCreation.dto';
jest.mock('fs', () => ({
  promises: {
    access: jest.fn(),
    readFile: jest.fn(),
    writeFile:jest.fn(),
    unlink:jest.fn()
  },
  existsSync:jest.fn()
}));
describe('DocumentService', () => {
  let service: DocumentService;
  let documentRepository: DocumentRepository;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ DocumentService,
        {
          provide: DocumentRepository,
          useValue: {
            documentCreation: jest.fn(),
            getUserFiles:jest.fn(),
            updateUserFileDetails:jest.fn(),
            deleteUserFile:jest.fn()
          },
        },],
    }).compile();

    service = module.get<DocumentService>(DocumentService);
    documentRepository = module.get<DocumentRepository>(DocumentRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Creating a document',()=>{
    it('should create a document successfully', async () => {
      const creationData = {
        title: 'Sample Document',
        description: 'Test Description',
        filePath: '/path/to/file',
        userId: 'user123',
      };
  
      jest.spyOn(documentRepository, 'documentCreation').mockResolvedValue(undefined);
  
      const result = await service.createDocument(creationData);
  
      expect(result).toEqual({
        statusCode: 200,
        message: ['Document uploaded successfully'],
      });
  
      expect(documentRepository.documentCreation).toHaveBeenCalledWith(
        creationData.title,
        creationData.description,
        creationData.filePath,
        creationData.userId,
      );
    });
    it('should throw BadRequestException if any required field is missing', async () => {
      const creationData = {
        title: '',
        description: 'Test Description',
        filePath: '/path/to/file',
        userId: 'user123',
      };
  
      const result = await service.createDocument(creationData);
  
      expect(result).toEqual({
        statusCode: 400,
        message: ['Necessary details not found'],
        error: 'Bad Request',
      });
  
      expect(documentRepository.documentCreation).not.toHaveBeenCalled();
    });
    it('should handle repository errors gracefully', async () => {
      const creationData = {
        title: 'Sample Document',
        description: 'Test Description',
        filePath: '/path/to/file',
        userId: 'user123',
      };
  
      jest.spyOn(documentRepository, 'documentCreation').mockRejectedValue(new Error('Database error'));
  
      const result = await service.createDocument(creationData);
  
      expect(result).toEqual({
        statusCode: 500,
        message: ['Database error'],
        error: 'Bad Request',
      });
    });
  })

  describe('getUserFiles', () => {
    it('should return files successfully', async () => {
      const mockFiles :any = [
        { id: '1', filePath: 'test.pdf', title: 'Test File', description: 'A test file' },
      ];
      jest.spyOn(documentRepository, 'getUserFiles').mockResolvedValue(mockFiles);
      jest.spyOn(fs.promises, 'readFile').mockResolvedValue(Buffer.from('test-content'));
      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      const result = await service.getUserFiles('user123');
      expect(result).toEqual({
        statusCode: 200,
        files: [
          expect.objectContaining({
            filePath: 'test.pdf',
            content: expect.any(String),
          }),
        ],
      });
    });

    it('should throw NotFoundException if no files are found', async () => {
      jest.spyOn(documentRepository, 'getUserFiles').mockResolvedValue(undefined);
      const result = await service.getUserFiles('user123')
      expect(result).toEqual({
        statusCode:404,
        message:['Files not found for the provided user id'],
        error:'Bad Request'
      })
    });
  });

  describe('update user file', ()=>{
    it('should update the file successfully', async () => {
      const mockFile = { buffer: Buffer.from('new-content') } as Express.Multer.File;
      const mockUpdateData : any = { filePath: 'test.pdf', title: 'Updated Title', description: 'Updated Description' };
      jest.spyOn(fs.promises, 'writeFile').mockResolvedValue(undefined);
      jest.spyOn(documentRepository, 'updateUserFileDetails').mockResolvedValue(undefined);
      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      const result = await service.updateUserFile(mockFile, mockUpdateData, 'doc123');
      expect(result).toEqual({
        statusCode: 200,
        message: ['File Updated successfully'],
      });
    });
    it('should throw NotFoundException if file is not found', async () => {
      jest.spyOn(fs.promises, 'writeFile').mockRejectedValue(new Error('ENOENT: no such file or directory'));

      const mockFile = { buffer: Buffer.from('new-content') } as Express.Multer.File;
      const mockUpdateData :any = { filePath: 'invalid.pdf', title: '', description: '' };
      const result = await service.updateUserFile(mockFile,mockUpdateData,'doc123')
      expect(result).toEqual({
        statusCode:500,
        message : ['ENOENT: no such file or directory'],
        error:'Bad Request'
      })
    });
  })

  describe('deleteUserFile', () => {
    it('should delete the file and record successfully', async () => {
      jest.spyOn(fs.promises, 'unlink').mockResolvedValue(undefined);
      jest.spyOn(documentRepository, 'deleteUserFile').mockResolvedValue(undefined);

      const result = await service.deleteUserFile('doc123', 'test.pdf');
      expect(result).toEqual({
        statusCode: 200,
        message: ['File deleted successfuly'],
      });
    });

    it('should throw NotFoundException if the file does not exist', async () => {
      jest.spyOn(fs.promises, 'unlink').mockRejectedValue(new Error('ENOENT: no such file or directory'));
      const result =  await  service.deleteUserFile('doc123', 'invalid.pdf')
      expect(result).toEqual({
        statusCode:500,
        message:['ENOENT: no such file or directory'],
        error:'Bad Request'
      });
    });
  });
});
