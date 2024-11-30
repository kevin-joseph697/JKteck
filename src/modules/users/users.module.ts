import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersEntity } from 'src/entities/user.entities';
import { UserRepository } from 'src/repository/user.repository';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { RoleRepository } from 'src/repository/role.repository';
import { RoleEntity } from 'src/entities/role.entities';

@Module({
  imports: [SequelizeModule.forFeature([UsersEntity, RoleEntity])],
  controllers: [UsersController],
  providers: [UsersService, UserRepository, JwtStrategy, RoleRepository],
})
export class UsersModule {}
