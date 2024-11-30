import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { UsersEntity } from "src/entities/user.entities";

@Injectable()
export class AuthRepository{
    constructor(
        @InjectModel(UsersEntity)
        private userModel : typeof UsersEntity
    ){}

    async registerUser(username:string,email:string,password:string):Promise<UsersEntity>{
        return this.userModel.create({username,email,password})
    }

    async login(email:string,password:string):Promise<UsersEntity>{
        return this.userModel.findOne({where:{email:email,password:password}})
    }
}