import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { RoleEntity } from "src/entities/role.entities";
import { UsersEntity } from "src/entities/user.entities";
import { GetAllUserDto, mapToGetAllUserDto } from "src/modules/users/dto/getAllUser.dto";

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

    async getAllUsers():Promise<GetAllUserDto[]>{
        const userResult = await this.userModel.findAll({
            attributes:['id', 'email', 'roleId']
        })
        const result :GetAllUserDto[] = userResult.map(mapToGetAllUserDto)
        return result
    }
    async updateUserRole(id:string,roleId:string):Promise<[number]>{
        return this.userModel.update({roleId:roleId},{where:{id:id}})
    }
    
}