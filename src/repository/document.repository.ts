import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { DocumentEntity } from "src/entities/document.entities";

@Injectable()
export class DocumentRepository{
    constructor(
        @InjectModel(DocumentEntity)
        private documentModel : typeof DocumentEntity 
    ){}

    async documentCreation(title:string,description:string,filePath:string,userId:string):Promise<DocumentEntity>{
        return this.documentModel.create({title,description,filePath,userId})
    }

    async getUserFiles(userId:string):Promise<DocumentEntity[]>{
        return this.documentModel.findAll({
            attributes:['id','title','description','filePath'],
            where:{userId:userId},
            limit:10,
            offset:0
        })
    }

    async updateUserFileDetails(id:string,title:string,description:string):Promise<[number]>{
        return this.documentModel.update({title:title,description:description},{where:{id:id}})
    }

    async deleteUserFile(id:string):Promise<number>{
        return this.documentModel.destroy({where:{id:id}})
    }
}