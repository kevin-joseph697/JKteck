import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class DocumentCreationDto{
    @IsNotEmpty()
    @IsString()
    title:string

    @IsNotEmpty()
    @IsString()
    description:string

    @IsNotEmpty()
    @IsString()
    userId:string
}

export class DocumentCreationDto1{
    @IsNotEmpty()
    @IsString()
    title:string

    @IsNotEmpty()
    @IsString()
    description:string

    @IsNotEmpty()
    @IsString()
    filePath:string

    @IsNotEmpty()
    @IsString()
    userId:string
}