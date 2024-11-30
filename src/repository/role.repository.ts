import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { RoleEntity } from "src/entities/role.entities";

@Injectable()
export class RoleRepository{
    constructor(
        @InjectModel(RoleEntity)
        private roleModel : typeof RoleEntity
    ){}

    async findRoleIdByRoleName(roleName:string):Promise<RoleEntity>{
        return this.roleModel.findOne({attributes:['id'],where:{name:roleName}})
    }
    async findRoleNameByRoleId(roleId:string):Promise<RoleEntity>{
        return this.roleModel.findOne({attributes:['name'],where:{id:roleId}})
    }
}