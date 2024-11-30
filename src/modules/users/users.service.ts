import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UsersEntity } from 'src/entities/user.entities';
import { UserRepository } from 'src/repository/user.repository';
import { CreateUserDto } from './dto/createuser.dto';
import { RoleRepository } from 'src/repository/role.repository';
@Injectable()
export class UsersService {
    constructor(
      private userRepository : UserRepository,
      private roleRepository : RoleRepository
    ){}
   
    async getAllUsers():Promise<UsersEntity[]>{
        return await this.userRepository.getAllUsers()
    }

    async UpdateUserRole(id:string, role:string){
       try{
            if(id && role){
                const roleId = await this.roleRepository.findRoleIdByRoleName(role)
                if(roleId){
                    const update = await this.userRepository.updateUserRole(id,roleId.id)
                    return{
                        statusCode:200,
                        message:['User role updated successfully']
                    }
                }else{
                    throw new NotFoundException('Role not found');
                }
            }else{
                return{
                    statusCode:400,
                    message:'Details were not provided'
                }
            }
       }catch(err){
        return {
            statusCode:err?.status ? err.status : 500,
            message: [new InternalServerErrorException(err)['response']['message']],
            error: 'Bad Request',
        }
       } 
    }
    
}
