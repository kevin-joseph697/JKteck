import * as dotenv from 'dotenv'
dotenv.config()
export const appConfig = {
    secret : process.env.SECRET || 'KevinJoseph',
    expiresIn : process.env.EXPIRESIN || '24h'
}
export enum UserRole {
    Admin = "Admin",
    Editor = "Editor",
    Viewer = "Viewer"
}

