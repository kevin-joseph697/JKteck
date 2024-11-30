import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { RoleEntity } from "src/entities/role.entities";
import { UsersEntity } from "src/entities/user.entities";

@Injectable()
export class UserRepository{
    constructor(
        @InjectModel(UsersEntity)
        private userModel : typeof UsersEntity,
        @InjectModel(RoleEntity)
        private roleModel: typeof RoleEntity
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

    async getAllUsers():Promise<UsersEntity[]>{
        return this.userModel.findAll({
            attributes:['id', 'email', 'roleId', 'createdAt', 'updatedAt']
        })
    }
    async updateUserRole(id:string,roleId:string):Promise<[number]>{
        return this.userModel.update({roleId:roleId},{where:{id:id}})
    }
    
}