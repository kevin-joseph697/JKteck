import { SequelizeModuleOptions } from '@nestjs/sequelize';
import * as dotenv from 'dotenv';
dotenv.config()
export const databaseConfig: SequelizeModuleOptions = {
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'jkteck',
    autoLoadModels: true, 
    synchronize: true, 
    models: [__dirname + '../../entities{.ts,.js}'],
  };