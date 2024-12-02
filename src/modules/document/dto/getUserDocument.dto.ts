import { IsNotEmpty, IsString } from "class-validator"
import { DocumentEntity } from "src/entities/document.entities"

export class getUserDocumentDto{
    @IsNotEmpty()
    @IsString()
    id:number

    @IsNotEmpty()
    @IsString()
    title:string

    @IsNotEmpty()
    @IsString()
    description:string

    @IsNotEmpty()
    @IsString()
    filePath:string
}