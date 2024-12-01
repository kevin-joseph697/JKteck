import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { DocumentModule } from './modules/document/document.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { databaseConfig } from './configs/database/database.provider';
import { UsersEntity } from './entities/user.entities';
import { Sequelize } from 'sequelize-typescript';
import { RoleEntity } from './entities/role.entities';
import { IngestionModule } from './modules/ingestion/ingestion.module';
@Module({
  imports: [UsersModule,
            AuthModule,
            DocumentModule,
            SequelizeModule.forRoot(databaseConfig),
            SequelizeModule.forFeature([UsersEntity,RoleEntity]),
            IngestionModule
          ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule  implements OnModuleInit {

  constructor(private sequelize: Sequelize) {}

  async onModuleInit() {
    try {
      await this.sequelize.authenticate();
      console.log('Database connection established successfully!');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      process.exit(1);
    }
  }
}
