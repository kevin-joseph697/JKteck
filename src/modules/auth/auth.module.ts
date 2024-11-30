import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthRepository } from 'src/repository/user.repository';
import { UsersEntity } from 'src/entities/user.entities';
import { RoleRepository } from 'src/repository/role.repository';
import { RoleEntity } from 'src/entities/role.entities';
import { JwtModule } from '@nestjs/jwt';
import { appConfig } from 'src/configs/config.constants';

@Module({
  imports: [
    SequelizeModule.forFeature(
      [
      UsersEntity,
      RoleEntity
    ]
    ),
    JwtModule.register({
      secret:appConfig.secret,
      signOptions:{
        expiresIn:appConfig.expiresIn
      }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService,AuthRepository,RoleRepository],
})
export class AuthModule {}
