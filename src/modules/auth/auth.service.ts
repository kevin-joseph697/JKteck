import { BadRequestException, ConflictException, Inject, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from 'src/repository/user.repository';
import { SignUpCreadentialsDto} from './dto/sign-up-user.dto';
import { SignInCreadentialsDto } from './dto/sign-in-user.dto';
import { RoleRepository } from 'src/repository/role.repository';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
       private userRepository : UserRepository,
       private roleRepsitory : RoleRepository,
       private readonly jwtService : JwtService
    ){}

    async register(signUpCreadentialsDto:SignUpCreadentialsDto){
        const {email,password,con_password,roleName} = signUpCreadentialsDto
        try{
            if(email && password && roleName){
                if(password === con_password){
                    const user  = await this.userRepository.findOneUser(email)
                    if(user){
                      throw new ConflictException('Email already exists')
                    }else{
                        const roleId = await this.roleRepsitory.findRoleIdByRoleName(roleName)
                        if(roleId){
                            const hashedPassword = await bcrypt.hash(signUpCreadentialsDto.password,10)
                            const created = await this.userRepository.registerUser(signUpCreadentialsDto.email,hashedPassword,roleId.id)
                            return{
                                statusCode:200,
                                message:['User created successfully']
                            }
                        }else{
                            throw new NotFoundException('Role not found');
                        }
                    }
                }else{
                    return {
                        statusCode: 400,
                        message: ['Your passwords does not match'],
                        error: 'Bad Request',
                    }
                }
            }else{
                throw new BadRequestException('Necessary details not found')
            }
        }catch(err){
            return {
                statusCode:err?.status ? err.status : 500,
                message: [new InternalServerErrorException(err)['response']['message']],
                error: 'Bad Request',
            }
        }
    }

    async login(signInCreadentialsDto:SignInCreadentialsDto){ 
        const{email,password} = signInCreadentialsDto
        try{
            if(email  && password){
                const user =  await this.userRepository.login(signInCreadentialsDto.email)
                if(!user){
                    throw new NotFoundException('User not found');
                }
                const isPasswordValid = await bcrypt.compare(password,user.password)
                if (!isPasswordValid) {
                    throw new UnauthorizedException('Invalid credentials');
                  }
                const roleName = await this.roleRepsitory.findRoleNameByRoleId(user.roleId)
                const token = this.jwtService.sign({
                    id: user.id,
                    email: user.email,
                    role: roleName.name,
                })
                return{
                    statusCode:200,
                    accessToken:token
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
