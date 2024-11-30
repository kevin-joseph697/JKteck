import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DocumentRepository } from 'src/repository/document.repository';
import { DocumentCreationDto1 } from './dto/documentCreation.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DocumentService {
  private readonly uploadDir = path.resolve('./');

  constructor(private documentRepository: DocumentRepository) {}

  async createDocument(creationData: DocumentCreationDto1) {
    try {
      const { filePath, description, title, userId } = creationData;
      if (filePath && description && title && userId) {
        await this.documentRepository.documentCreation(
          title,
          description,
          filePath,
          userId,
        );
        return {
          statusCode: 200,
          message: ['Document uploaded successfully'],
        };
      } else {
        throw new BadRequestException('Necessary details not found');
      }
    } catch (err) {
      return {
        statusCode: err?.status ? err.status : 500,
        message: [new InternalServerErrorException(err)['response']['message']],
        error: 'Bad Request',
      };
    }
  }

  async getUserFiles(userId: string) {
    try {
      const userFiles = await this.documentRepository.getUserFiles(userId);
      if (!userFiles) {
        throw new NotFoundException('Files not found for the provided user id');
      }
      const fileContents = [];
      for (const file of userFiles) {
        const filePath = path.join(this.uploadDir, file.filePath);

        if (fs.existsSync(filePath)) {
          const fileBuffer = await fs.promises.readFile(filePath);
          const base64Content = fileBuffer.toString('base64');
          fileContents.push({
            id: file.id,
            title: file.title,
            description: file.description,
            filePath: file.filePath,
            fileName: path.basename(file.filePath),
            content: base64Content,
          });
        }
      }
      return {
        statusCode: 200,
        files: fileContents,
      };
    } catch (err) {
      return {
        statusCode: err?.status ? err.status : 500,
        message: [new InternalServerErrorException(err)['response']['message']],
        error: 'Bad Request',
      };
    }
  }

  async updateUserFile(file: Express.Multer.File,updateData:DocumentCreationDto1,id:string) {
    try {
      const fullFilePath = path.join(this.uploadDir, updateData.filePath);
      if (!fs.existsSync(fullFilePath)) {
        throw new NotFoundException(`File not found at path: ${updateData.filePath}`);
      }
      await fs.promises.writeFile(fullFilePath, file.buffer);
      await this.documentRepository.updateUserFileDetails(id,updateData.title,updateData.description)
      return{
        statusCode:200,
        message:['File Updated successfully']
      }
    } catch (err) {
      return {
        statusCode: err?.status ? err.status : 500,
        message: [new InternalServerErrorException(err)['response']['message']],
        error: 'Bad Request',
      };
    }
  }

  async deleteUserFile(id: string, filePath: string) {
    try {
      if (!id) {
        throw new BadRequestException('Id is not provided');
      }
      await this.documentRepository.deleteUserFile(id);
      const filePath1 = path.join(this.uploadDir, filePath);

      if (!fs.existsSync(filePath1)) {
        throw new NotFoundException('File not found');
      }
      await fs.promises.unlink(filePath);
      return {
        statusCode: 200,
        message: ['File deleted successfuly'],
      };
    } catch (err) {
      return {
        statusCode: err?.status ? err.status : 500,
        message: [new InternalServerErrorException(err)['response']['message']],
        error: 'Bad Request',
      };
    }
  }
}
