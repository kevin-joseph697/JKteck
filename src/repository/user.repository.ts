import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { UsersEntity } from "src/entities/user.entities";

@Injectable()
export class AuthRepository{
    constructor(
        @InjectModel(UsersEntity)
        private userModel : typeof UsersEntity
    ){}

    async registerUser(email:string,password:string,roleId:string):Promise<UsersEntity>{
        return this.userModel.create({email,password,roleId})
    }

    async login(email:string):Promise<UsersEntity>{
        return this.userModel.findOne({where:{email:email}})
    }

    async findOneUser(email:string):Promise<UsersEntity>{
        return this.userModel.findOne({where:{email:email}})
    }
    
}