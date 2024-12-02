import { Body, Controller, Get, Param, Post, Put, SetMetadata, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGaurd } from 'src/gaurds/jwt.gaurds';
import { RoleGaurds } from 'src/gaurds/roles.gaurds';
import { Roles } from 'src/decorators/roles.decorator';
import { CreateUserDto } from './dto/createuser.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/getAllUsers')
  @UseGuards(JwtAuthGaurd,RoleGaurds)
  @Roles('Admin')
  @ApiBearerAuth()
  getAllUsers(){
    return this.usersService.getAllUsers()
  }

  @Put('/updateRole/:id')
  @UseGuards(JwtAuthGaurd,RoleGaurds)
  @Roles('Admin')
  @ApiBearerAuth()
  @ApiBody({schema:{
    type:'object'
  }})
  updateUserRole(
    @Param('id') id:string,@Body() body:{role:string}
  ){
    return this.usersService.UpdateUserRole(id,body['role'])
  }
}
