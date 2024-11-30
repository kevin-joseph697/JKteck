import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { DocumentEntity } from 'src/entities/document.entities';
import { DocumentRepository } from 'src/repository/document.repository';

@Module({
  imports:[
    SequelizeModule.forFeature([
      DocumentEntity
    ])
  ],
  controllers: [DocumentController],
  providers: [DocumentService,DocumentRepository],
})
export class DocumentModule {}
