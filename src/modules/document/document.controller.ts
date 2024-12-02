import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { DocumentService } from './document.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'
import { DocumentCreationDto, DocumentCreationDto1 } from './dto/documentCreation.dto';
import { JwtAuthGaurd } from 'src/gaurds/jwt.gaurds';
import { RoleGaurds } from 'src/gaurds/roles.gaurds';
import { Roles } from 'src/decorators/roles.decorator';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('/UploadDocument')
  @UseGuards(JwtAuthGaurd,RoleGaurds)
  @Roles('Admin','Editor')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor('file',{
      storage:diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          callback(null, `${uniqueSuffix}-${file.originalname}`);
        },
      })
    })
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        userId:{type:'string'},
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async createDocument(
    @UploadedFile()file: Express.Multer.File,
    @Body() documentCreationDto:DocumentCreationDto
  ){ 
    const data = {
      title: documentCreationDto.title,
      description: documentCreationDto.description,
      filePath: file.path, 
      userId:documentCreationDto.userId
    };
    return this.documentService.createDocument(data)
  }

  @Get('/getUserFiles/:userId')
  @UseGuards(JwtAuthGaurd,RoleGaurds)
  @Roles('Admin','Editor','Viewer')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  getUserFile(
    @Param('userId') userId:string
  ){
    return this.documentService.getUserFiles(userId)
  }

  
  @Put('/updateDocument/:id')
  @UseGuards(JwtAuthGaurd,RoleGaurds)
  @Roles('Admin','Editor')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        userId:{type:'string'},
        filePath: {type:'string'},
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async updateUserFile(
    @Param('id') id:string,@Body()updateData:DocumentCreationDto1,@UploadedFile()file: Express.Multer.File,
  ){
    return this.documentService.updateUserFile(file,updateData,id)
  }

  @Delete('/deleteFile/:id')
  @UseGuards(JwtAuthGaurd,RoleGaurds)
  @Roles('Admin','Editor')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async deleteFile(
    @Param('id') id:string,@Body() filePath:string
  ){
   return this.documentService.deleteUserFile(id,filePath['filePath'])  
  }
}
