import * as dotenv from 'dotenv'
dotenv.config()
export const appConfig = {
    secret : process.env.SECRET || 'KevinJoseph',
    expiresIn : process.env.EXPIRESIN || '24h',
    RabbitMqUrl : process.env.RABBITMQURL  || 'amqp://localhost:5672'
}
export enum UserRole {
    Admin = "Admin",
    Editor = "Editor",
    Viewer = "Viewer"
}

